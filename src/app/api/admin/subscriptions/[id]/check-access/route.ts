/**
 * EJEMPLO DE INTEGRACIÓN: Endpoint protegido por suscripción activa
 * 
 * Este es un patrón de referencia para integrar validación de suscripciones
 * en otros endpoints. Reemplaza "resource" con el recurso real (portfolio, offer, etc).
 * 
 * Uso:
 *   POST /api/admin/subscriptions/[id]/check-access
 *   Content-Type: application/json
 *   { "resource": "portfolio" }
 * 
 * Respuesta:
 *   { "ok": true, "status": "ACTIVE", "subscriptionEndsAt": "2025-09-10", ... }
 *   O: { "ok": false, "status": "INACTIVE", "error": "Subscription expired" } (403)
 */

import { NextResponse, type NextRequest } from 'next/server';
import { db } from '@/lib/db';
import { ensureActiveSubscription } from '@/lib/subscription';

export const dynamic = 'force-dynamic';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const clientSiteId = id;
    const body = await request.json();
    const resource = body.resource || 'default'; // portfolio, offer, media, etc

    // Step 1: Validate that subscription is ACTIVE
    // This will throw if status !== ACTIVE or subscriptionEndsAt < now()
    try {
      await ensureActiveSubscription(clientSiteId);
    } catch (err) {
      return NextResponse.json(
        { ok: false, error: (err as Error).message, status: 'INACTIVE' },
        { status: 403 }
      );
    }

    // Step 2: If here, subscription is valid. You can:
    // - Log access
    // - Record usage/metrics
    // - Apply rate limits
    // - Return detailed subscription info for frontend optimization

    const site = await db.clientSite.findUnique({
      where: { id: clientSiteId },
      select: {
        id: true,
        slug: true,
        businessName: true,
        status: true,
        subscriptionEndsAt: true,
        lastRenewalPlan: true,
        graceIncludedMonths: true,
      },
    });

    if (!site) {
      return NextResponse.json(
        { error: 'ClientSite not found' },
        { status: 404 }
      );
    }

    const daysUntilExpiry = site.subscriptionEndsAt
      ? Math.ceil((new Date(site.subscriptionEndsAt).getTime() - Date.now()) / (24 * 60 * 60 * 1000))
      : null;

    return NextResponse.json({
      ok: true,
      resource,
      status: site.status,
      subscriptionEndsAt: site.subscriptionEndsAt,
      lastRenewalPlan: site.lastRenewalPlan,
      daysUntilExpiry,
      isExpiringSoon: daysUntilExpiry !== null && daysUntilExpiry < 30,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * PATTERN FOR OTHER WRITE ENDPOINTS:
 * 
 * export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
 *   try {
 *     const { id } = await params;
 *     const clientSiteId = id;
 *     
 *     // 1. ALWAYS validate subscription first
 *     await ensureActiveSubscription(clientSiteId);
 *     
 *     // 2. Then proceed with normal logic
 *     const body = await request.json();
 *     const result = await db.portfolio.create({
 *       data: { clientSiteId, ...body }  // Important: include clientSiteId to associate
 *     });
 *     
 *     return NextResponse.json(result, { status: 201 });
 *   } catch (err) {
 *     if (err instanceof Error && err.message.includes('active')) {
 *       return NextResponse.json({ error: err.message }, { status: 403 });
 *     }
 *     return NextResponse.json({ error: 'Failed' }, { status: 500 });
 *   }
 * }
 */
