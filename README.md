# AG3D Web

> Merchandising personalizado con impresión 3D — E-commerce con flujo de cotización por WhatsApp.

## Stack

- **Frontend:** Astro 6 + Tailwind CSS 3
- **Backend/Database:** Supabase (PostgreSQL, Auth, RLS)
- **Hosting:** Vercel (SSR con @astrojs/vercel)
- **Integraciones:** WhatsApp Web, Google Sheets API (Edge Functions)

## Funcionalidades

### Público
- Landing con hero carrusel, logos clientes, FAQ
- Catálogo de productos con búsqueda y filtros
- Registro e inicio de sesión
- Recuperación de contraseña

### Cliente (logueado)
- Dashboard con tabs: Mis Cotizaciones, Mis Datos, Mi Carrito
- Carrito con persistencia localStorage + sync a Supabase
- Solicitud de cotización con confirmación vía WhatsApp
- Reenvío de WhatsApp desde cotizaciones existentes
- Edición de datos opcionales (empresa, Instagram)

### Admin
- Panel con sidebar responsive
- Gestión de cotizaciones (cambio de estado, tracking, filtro por fechas, descarga CSV)
- CRUD de productos (variables, fotos, cantidades mínimas)
- Gestión de usuarios registrados
- Notificaciones en tiempo real de nuevas cotizaciones (polling 30s)
- Sincronización automática con Google Sheets

## Estados de cotización

| Estado | Descripción |
|---|---|
| `no confirmado` | Creada por el cliente, sin contacto aún |
| `En preparación` | Default en DB (respaldo) |
| `pendiente` | Pendiente de revisión |
| `Recibido` | Admin confirmó recepción |
| `en diseño` | En proceso de diseño |
| `en producción` | En producción |
| `en preparación para envío` | Preparando envío |
| `enviado` | Ya fue enviado |
| `cancelado` | Cancelado |

## Arquitectura

### Carrito
Arquitectura híbrida: **localStorage** como capa principal de interacción, tabla `carrito` en Supabase como backup para sincronización entre sesiones/login. La cotización se genera leyendo desde localStorage; al crearse el pedido, se limpian ambas capas.

### Google Sheets
Las cotizaciones se sincronizan automáticamente a un Google Sheet via Edge Function de Supabase, invocada desde el frontend después de crear cada pedido (fire-and-forget).

## Estructura del proyecto

```
/
├── public/                    # Assets estáticos (logos, hero images)
├── src/
│   ├── components/
│   │   ├── admin/             # Componentes del panel admin
│   │   ├── Header.astro
│   │   ├── Footer.astro
│   │   └── Welcome.astro
│   ├── layouts/
│   │   └── Layout.astro       # Layout global + botón WhatsApp flotante
│   ├── lib/
│   │   ├── supabase.js        # Cliente Supabase
│   │   ├── auth.js            # Cache de rol (admin/cliente)
│   │   └── cart.js            # Lógica del carrito + cotización
│   ├── pages/
│   │   ├── index.astro        # Landing
│   │   ├── catalogo.astro     # Catálogo (client-side fetch)
│   │   ├── login.astro        # Inicio de sesión
│   │   ├── registro.astro     # Registro
│   │   ├── recuperar.astro    # Recuperar contraseña
│   │   ├── cambiar-password.astro
│   │   ├── dashboard.astro    # Panel cliente
│   │   ├── admin.astro        # Panel administrador
│   │   ├── carrito.astro      # Redirige a dashboard
│   │   └── producto/[id].astro # Detalle de producto (server-rendered)
│   ├── scripts/
│   │   └── admin/             # Lógica JS del panel admin
│   └── styles/
│       └── global.css
├── supabase/
│   ├── functions/
│   │   └── sync-to-sheets/    # Edge Function para Google Sheets
│   └── sql/                   # Schemas y migraciones
├── astro.config.mjs
├── tailwind.config.mjs
└── package.json
```

## Comandos

| Comando | Acción |
|---|---|
| `npm run dev` | Servidor local en `localhost:4321` |
| `npm run build` | Build de producción para Vercel |
| `npx supabase functions deploy sync-to-sheets --no-verify-jwt` | Deploy Edge Function |
| `npx supabase secrets set NOMBRE="valor"` | Setear secrets en Supabase |

## Variables de entorno

```
PUBLIC_SUPABASE_URL=           # URL del proyecto Supabase
PUBLIC_SUPABASE_ANON_KEY=      # Anon key (rol anon)
```

## Secrets de Supabase (Edge Function)

```
GOOGLE_SERVICE_ACCOUNT_EMAIL
GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY
GOOGLE_SHEETS_SPREADSHEET_ID
GOOGLE_SHEETS_SHEET_NAME
```

## Licencia

© 2026 AG3D — Todos los derechos reservados.
