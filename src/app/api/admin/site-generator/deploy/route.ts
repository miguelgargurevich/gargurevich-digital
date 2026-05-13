import { NextResponse } from 'next/server';
import { getAdminSession } from '@/lib/auth';

type DeployRequestBody = {
  spec?: {
    projectName?: string;
    industry?: string;
    audience?: string;
    tone?: string;
    primaryCTA?: string;
    sections?: string[];
    colorDirection?: string;
    constraints?: {
      language?: 'es' | 'en';
      maxWordsPerSection?: number;
    };
  };
};

const DEFAULT_DEPLOY_API_URL = 'http://127.0.0.1:8787';

function resolveDeployApiUrl(): string {
  return (process.env.SITE_GENERATOR_API_URL || DEFAULT_DEPLOY_API_URL).replace(/\/$/, '');
}

function resolveDeployPublicBaseUrl(): string | null {
  const value = (process.env.SITE_GENERATOR_PUBLIC_BASE_URL || '').trim();
  return value ? value.replace(/\/$/, '') : null;
}

export async function POST(request: Request) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = (await request.json()) as DeployRequestBody;
    const spec = body.spec;

    if (!spec?.projectName || !spec?.industry || !spec?.primaryCTA) {
      return NextResponse.json(
        { error: 'Faltan campos requeridos para deploy: projectName, industry, primaryCTA.' },
        { status: 400 }
      );
    }

    const deployApiUrl = resolveDeployApiUrl();
    const upstreamResponse = await fetch(`${deployApiUrl}/api/generate-site`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        brief: {
          projectName: spec.projectName,
          industry: spec.industry,
          audience: spec.audience,
          tone: spec.tone,
          primaryCTA: spec.primaryCTA,
          sections: spec.sections,
          colorDirection: spec.colorDirection,
          constraints: spec.constraints,
        },
      }),
    });

    const data = (await upstreamResponse.json().catch(() => null)) as Record<string, unknown> | null;

    if (!upstreamResponse.ok) {
      return NextResponse.json(
        {
          error:
            (typeof data?.error === 'string' && data.error) ||
            `Deploy API respondio con status ${upstreamResponse.status}`,
          deployApiUrl,
        },
        { status: upstreamResponse.status }
      );
    }

    const publicBaseUrl = resolveDeployPublicBaseUrl();
    const deployment = { ...(data || {}) };
    if (publicBaseUrl && typeof deployment.slug === 'string') {
      deployment.publicURL = `${publicBaseUrl}/${deployment.slug}/`;
    }

    return NextResponse.json({
      ok: true,
      deployApiUrl,
      publicBaseUrl,
      deployment,
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'No se pudo publicar el sitio',
        deployApiUrl: resolveDeployApiUrl(),
        publicBaseUrl: resolveDeployPublicBaseUrl(),
      },
      { status: 500 }
    );
  }
}