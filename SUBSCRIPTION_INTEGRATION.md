# Integración de Validación de Suscripciones

## Resumen

Este documento guía la integración del sistema de validación de suscripciones en endpoints protegidos existentes. El modelo permite:
- **Setup + 12 meses gratis** al crear ClientSite
- **Renovación manual** (mensual, anual 10%, anual 15%)
- **Expiración automática** diaria a las 2:00 UTC (cron en vercel.json)
- **Validación de acceso** a nivel de endpoint

---

## Arquitectura

```
POST /api/admin/subscriptions        # Crear nuevo ClientSite (auto-activado 12mo)
GET  /api/admin/subscriptions        # Listar todos con historial
GET  /api/admin/subscriptions/[id]   # Ver detalles + renovaciones
PATCH /api/admin/subscriptions/[id]  # Actualizar o action="activate_setup"/"check_access"
POST /api/admin/subscriptions/[id]/renew  # Renovar con plan específico
POST /api/admin/subscriptions/expire # Expirar vencidas (CRON)

UI:
GET /admin/subscriptions             # Página listado (next.js client component)
GET /admin/subscriptions/[id]        # Página detalle con acciones
```

---

## Cron de Expiración

**Configuración**: `vercel.json`
```json
{
  "crons": [
    {
      "path": "/api/admin/subscriptions/expire",
      "schedule": "0 2 * * *"
    }
  ]
}
```

**Qué hace**: Todos los días a las 2:00 UTC, Vercel ejecuta POST a `/api/admin/subscriptions/expire` sin autenticación JWT (confía en Vercel, no en clientes públicos).

**Resultado**: Cualquier ClientSite con `subscriptionEndsAt < now()` se marca INACTIVE con `deactivationReason: 'Subscription expired'`.

---

## Guía: Integrar Validación en Endpoint Existente

### Opción 1: Guard Simple (Recomendado)

En cualquier ruta de API protegida, importa y usa:

```typescript
// src/app/api/admin/portfolio/route.ts (ejemplo)
import { ensureActiveSubscription } from '@/lib/subscription';

export async function POST(req: Request) {
  // 1. Extraer clientSiteId del body, headers o sesión
  const clientSiteId = req.headers.get('x-client-site-id');
  if (!clientSiteId) {
    return NextResponse.json({ error: 'Missing clientSiteId' }, { status: 400 });
  }

  // 2. Validar que la suscripción está ACTIVA
  try {
    await ensureActiveSubscription(clientSiteId);
  } catch (err) {
    // Lanza error si status !== ACTIVE o subscriptionEndsAt < now
    return NextResponse.json({ error: (err as Error).message }, { status: 403 });
  }

  // 3. Proceder con lógica normal
  // ... resto del handler
}
```

### Opción 2: Check Manual (Para Lógica Condicional)

```typescript
import { refreshSubscriptionStatus } from '@/lib/subscription';
import { db } from '@/lib/db';

export async function GET(req: Request) {
  const clientSiteId = req.headers.get('x-client-site-id');
  
  // 1. Refrescar estado (auto-heal si vencida pero activa = inconsistencia)
  await refreshSubscriptionStatus(clientSiteId);

  // 2. Consultar estado actual
  const site = await db.clientSite.findUnique({
    where: { id: clientSiteId },
  });

  if (site?.status !== 'ACTIVE') {
    return NextResponse.json({ error: 'Subscription inactive' }, { status: 403 });
  }

  // 3. Lógica adicional basada en plan o fechas
  if (site.subscriptionEndsAt && (site.subscriptionEndsAt.getTime() - Date.now()) < 7 * 24 * 60 * 60 * 1000) {
    // Advertencia: vence en menos de 7 días
    console.warn(`Subscription ${clientSiteId} expires in less than 7 days`);
  }

  // ... continuar
}
```

---

## Recomendaciones de Integración

### Rutas Candidatas para Validación

1. **Alto Prioridad** (datos críticos de cliente):
   - `POST /api/admin/portfolio` (crear proyecto)
   - `PATCH /api/admin/portfolio/[id]` (editar proyecto)
   - `DELETE /api/admin/portfolio/[id]` (eliminar proyecto)
   - `POST /api/admin/offers` (crear oferta)
   - `PATCH /api/admin/offers/[id]` (editar oferta)

2. **Mediana Prioridad** (datos de gestión):
   - `POST /api/admin/media` (subir archivo)
   - `POST /api/admin/services` (crear servicio)
   - `PATCH /api/admin/settings` (actualizar configuración)

3. **Baja Prioridad** (solo lectura):
   - `GET /api/admin/*` (consultas no modifican datos)
   - `GET /api/contact` (público, sin ClientSite)

### Paso a Paso para Integración

1. **Identificar endpoint** que necesita validación
2. **Extraer clientSiteId** de:
   - Header: `x-client-site-id`
   - Body: `{ clientSiteId, ... }`
   - Cookie: si aplica
   - O desde contexto de sesión admin
3. **Agregar guard** al inicio del handler:
   ```typescript
   await ensureActiveSubscription(clientSiteId);
   ```
4. **Manejar 403** en frontend (mostrar mensaje: "Suscripción expirada, por favor renueva")
5. **Test**:
   - Crear ClientSite: `curl -X POST /api/admin/subscriptions -d '{"businessName":"Test","slug":"test"}'`
   - Esperar expiración manual: `curl -X POST /api/admin/subscriptions/[id]/renew -d '{"plan":"MONTHLY"}'` luego cambiar fecha manualmente en DB
   - Verificar 403: `curl -X POST /api/admin/portfolio -H "x-client-site-id: [id]"` debe devolver 403

---

## Flujo Operativo Ejemplo

### Cliente Nuevo
1. Admin crea desde `/admin/subscriptions` (o API): `POST /api/admin/subscriptions` con `businessName`, `slug`
2. Respuesta: `{ id, status: ACTIVE, subscriptionEndsAt: "2026-09-XX", ... }`
3. ClientSite está **automáticamente activo por 12 meses** desde ahora

### Renovación Mensual (30 días)
1. Admin en `/admin/subscriptions/[id]` hace clic **"Renovar mensual"**
2. POST `/api/admin/subscriptions/[id]/renew` con `plan: MONTHLY`
3. Endpoint:
   - Crea `SubscriptionRenewal` registro
   - Suma 1 mes a `subscriptionEndsAt`
   - Setea `lastRenewalPlan: MONTHLY`
4. ClientSite continúa ACTIVE por 30 días más

### Renovación Anual con Descuento (365 días - 10%)
1. Admin hace clic **"Anual (10%)"** con monto opcional, ej. S/. 1350
2. POST `/api/admin/subscriptions/[id]/renew` con `plan: ANNUAL_10, amount: 1350`
3. Endpoint:
   - Crea `SubscriptionRenewal` con `discountPercent: 10`
   - Suma 1 año a `subscriptionEndsAt`
   - Registra monto para facturación
4. ClientSite activo 365 días + descuento visible en historial

### Expiración Automática
1. **Cada día a las 2:00 UTC**, Vercel ejecuta cron → POST `/api/admin/subscriptions/expire`
2. Cualquier ClientSite con `subscriptionEndsAt < now()` → `status: INACTIVE`
3. Admin ve en `/admin/subscriptions`: badge rojo "INACTIVA"
4. Intentos de acceso a rutas protegidas → 403 "Subscription inactive"

### Re-activación Manual
1. Si cliente reclama (error, confusión), admin en `/admin/subscriptions/[id]` hace clic **"Re-activar setup"**
2. PATCH `/api/admin/subscriptions/[id]` con `action: activate_setup`
3. Endpoint: setea `status: ACTIVE, subscriptionStartsAt: now(), subscriptionEndsAt: now() + 12 meses`
4. Vuelve a 12 meses desde hoy

---

## Testing Local

### 1. Crear ClientSite
```bash
curl -X POST http://localhost:3000/api/admin/subscriptions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <admin_token>" \
  -d '{"businessName":"Test Inc","slug":"test-inc"}'
```

### 2. Listar
```bash
curl http://localhost:3000/api/admin/subscriptions \
  -H "Authorization: Bearer <admin_token>"
```

### 3. Ver detalle
```bash
curl http://localhost:3000/api/admin/subscriptions/<ID> \
  -H "Authorization: Bearer <admin_token>"
```

### 4. Renovar
```bash
curl -X POST http://localhost:3000/api/admin/subscriptions/<ID>/renew \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <admin_token>" \
  -d '{"plan":"ANNUAL_10","amount":1350}'
```

### 5. Expirar (cron manual)
```bash
curl -X POST http://localhost:3000/api/admin/subscriptions/expire \
  -H "Authorization: Bearer <admin_token>"
```

---

## Nota sobre Seguridad

- **Cron en Vercel**: No requiere JWT porque es llamada **interna desde Vercel**, no desde cliente público.
- **Endpoints protegidos**: Todos hereda protección JWT del middleware `proxy.ts` (`/api/admin/*` requiere auth).
- **ClientSiteId**: Se debe pasar como header o validar que pertenece al admin autenticado (si multi-tenant en futuro).
- **No exponer detalles**: El frontend nunca debe confiar en campos de suscripción; **siempre validar en backend**.

---

## Próximos Pasos

1. ✅ **Cron automático** → Ya en vercel.json, ejecuta diariamente
2. ✅ **Admin UI** → Listado y detalle implementados
3. ⏳ **Integrar guards** en endpoints críticos (portfolio, offers, settings)
4. ⏳ **Test E2E** completo
5. ⏳ **Documentación para soporte** (cómo renovar, cómo resolver disputas)
