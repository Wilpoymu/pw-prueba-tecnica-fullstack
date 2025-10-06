# 💰 Flowly - Sistema de Gestión Financiera

Sistema completo de gestión de ingresos y egresos con control de usuarios basado en roles (RBAC), reportes financieros interactivos y documentación OpenAPI.

## 🚀 Demo en Vivo

**URL de Producción:** [https://tu-app.vercel.app](https://tu-app.vercel.app) _(Actualizar después del deployment)_

**Documentación API:** [https://tu-app.vercel.app/docs](https://tu-app.vercel.app/docs)

---

## 📋 Tabla de Contenidos

- [Características](#-características)
- [Stack Tecnológico](#-stack-tecnológico)
- [Requisitos Previos](#-requisitos-previos)
- [Instalación Local](#-instalación-local)
- [Configuración de Variables de Entorno](#-configuración-de-variables-de-entorno)
- [Ejecución del Proyecto](#-ejecución-del-proyecto)
- [Deployment en Vercel](#-deployment-en-vercel)
- [Estructura del Proyecto](#-estructura-del-proyecto)
- [Pruebas](#-pruebas)
- [Documentación API](#-documentación-api)
- [Roles y Permisos](#-roles-y-permisos)

---

## ✨ Características

### Funcionalidades Principales

- ✅ **Autenticación OAuth:** Login con GitHub mediante Better Auth
- ✅ **Sistema de Roles (RBAC):** Usuario y Administrador con permisos granulares
- ✅ **Gestión de Movimientos:** CRUD completo de ingresos y egresos
- ✅ **Gestión de Usuarios:** Administración de usuarios con edición de roles (solo admins)
- ✅ **Reportes Financieros:** 
  - Gráficos interactivos con TradingView Lightweight Charts
  - Métricas en tiempo real (saldo, ingresos, egresos, tasa de ahorro)
  - Filtros por fecha y agrupación (día/semana/mes/año)
  - Exportación a CSV
- ✅ **Dashboard Analytics:** Vista general con estadísticas del mes
- ✅ **Documentación OpenAPI:** Swagger UI completo con todos los endpoints
- ✅ **Tema Dark/Light:** Toggle de tema con persistencia

### Características Técnicas

- ✅ **71 Pruebas Unitarias** (Jest + Zod validation)
- ✅ **TypeScript 100%** tipado
- ✅ **API REST** documentada con OpenAPI 3.0
- ✅ **Validación de datos** con Zod en frontend y backend
- ✅ **Protección RBAC** en todos los endpoints
- ✅ **Filtrado de datos** por rol (users ven solo sus datos, admins ven todo)
- ✅ **UI Moderna** con Tailwind CSS, Shadcn UI y Glassmorphism
- ✅ **Tipografía Poppins** de Google Fonts

---

## 🛠️ Stack Tecnológico

### Frontend
- **Framework:** Next.js 15.1.3 (Pages Router)
- **Lenguaje:** TypeScript 5.7.2
- **Estilos:** Tailwind CSS 3.4.17
- **Componentes UI:** Shadcn UI + Radix UI
- **Gráficos:** TradingView Lightweight Charts 5.0.9
- **Iconos:** Lucide React 0.468.0
- **Fechas:** date-fns 4.1.0

### Backend
- **API:** Next.js API Routes
- **Base de Datos:** PostgreSQL (Supabase/Prisma Postgres)
- **ORM:** Prisma 6.2.1
- **Autenticación:** Better Auth 1.1.1 con GitHub OAuth
- **Validación:** Zod 4.1.11
- **Documentación:** OpenAPI 3.0 + Swagger UI

### DevOps & Testing
- **Testing:** Jest 30.2.0
- **Linting:** ESLint 9.17.0
- **Formatting:** Prettier 3.6.2
- **Deployment:** Vercel
- **Package Manager:** pnpm 10.x

---

## 📦 Requisitos Previos

Antes de comenzar, asegúrate de tener instalado:

- **Node.js:** v18.x o superior ([Descargar](https://nodejs.org/))
- **pnpm:** v9.x o superior ([Instalar](https://pnpm.io/installation))
  ```bash
  npm install -g pnpm
  ```
- **Git:** Para clonar el repositorio
- **Cuenta de GitHub:** Para la autenticación OAuth
- **Base de datos PostgreSQL:** Supabase, Prisma Postgres, o local

---

## 🚀 Instalación Local

### 1. Clonar el repositorio

```bash
git clone https://github.com/Wilpoymu/pw-prueba-tecnica-fullstack.git
cd pw-prueba-tecnica-fullstack
```

### 2. Instalar dependencias

```bash
pnpm install
```

Este comando instalará todas las dependencias y ejecutará automáticamente `prisma generate` para generar el Prisma Client.

---

## 🔐 Configuración de Variables de Entorno

### 1. Crear archivo `.env.local`

Copia el archivo de ejemplo y configúralo:

```bash
cp .env.example .env.local
```

### 2. Configurar GitHub OAuth

Crea una aplicación OAuth en GitHub:

1. Ve a [GitHub Developer Settings](https://github.com/settings/developers)
2. Click en "New OAuth App"
3. Configura:
   - **Application name:** Flowly (o el nombre que prefieras)
   - **Homepage URL:** `http://localhost:3000`
   - **Authorization callback URL:** `http://localhost:3000/api/auth/callback/github`
4. Guarda el `Client ID` y genera un `Client Secret`

### 3. Configurar Base de Datos PostgreSQL

#### Opción A: Prisma Postgres (Recomendado)

```bash
# Instalar Prisma CLI globalmente
npm install -g prisma

# Login en Prisma
npx prisma login

# Crear base de datos
npx prisma postgres create
```

Copia la `DATABASE_URL` que te proporcione.

#### Opción B: Supabase

1. Crea un proyecto en [Supabase](https://supabase.com/)
2. Ve a Settings → Database
3. Copia el `Connection String` en modo `Transaction` (puerto 5432)

#### Opción C: PostgreSQL Local

```bash
# Ejemplo de DATABASE_URL local
postgresql://usuario:contraseña@localhost:5432/flowly
```

### 4. Completar `.env.local`

```env
# Database
DATABASE_URL="postgresql://user:password@host:5432/database?connection_limit=3&pool_timeout=20"
DIRECT_URL="postgresql://user:password@host:5432/database"

# Better Auth
BETTER_AUTH_SECRET="tu-secret-key-super-segura-aqui"
BETTER_AUTH_URL="http://localhost:3000"

# GitHub OAuth
GITHUB_CLIENT_ID="tu_github_client_id"
GITHUB_CLIENT_SECRET="tu_github_client_secret"

# Next.js
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

**Notas importantes:**
- `BETTER_AUTH_SECRET`: Genera uno random con `openssl rand -base64 32`
- `DATABASE_URL`: Incluye `connection_limit=3&pool_timeout=20` para evitar errores de conexión
- `DIRECT_URL`: Igual que DATABASE_URL pero sin parámetros (para migraciones)

### 5. Ejecutar migraciones de Prisma

```bash
pnpm prisma migrate deploy
```

O si es la primera vez:

```bash
pnpm prisma migrate dev
```

---

## 🏃 Ejecución del Proyecto

### Modo Desarrollo

```bash
pnpm dev
```

La aplicación estará disponible en: **http://localhost:3000**

### Modo Producción

```bash
# Build
pnpm build

# Start
pnpm start
```

### Ejecutar Pruebas

```bash
# Todas las pruebas
pnpm test

# Watch mode
pnpm test:watch

# Coverage
pnpm test:coverage
```

---

## ☁️ Deployment en Vercel

### Opción 1: Deploy desde GitHub (Recomendado)

1. **Subir código a GitHub** (ya hecho)

2. **Importar proyecto en Vercel:**
   - Ve a [vercel.com](https://vercel.com)
   - Click en "Add New" → "Project"
   - Importa el repositorio `pw-prueba-tecnica-fullstack`

3. **Configurar Variables de Entorno:**
   - En Vercel Dashboard → Project Settings → Environment Variables
   - Agrega las siguientes variables:

   ```
   DATABASE_URL
   DIRECT_URL
   BETTER_AUTH_SECRET
   BETTER_AUTH_URL (https://tu-app.vercel.app)
   GITHUB_CLIENT_ID
   GITHUB_CLIENT_SECRET
   NEXT_PUBLIC_APP_URL (https://tu-app.vercel.app)
   ```

4. **Actualizar GitHub OAuth:**
   - Ve a tu GitHub OAuth App
   - Actualiza:
     - **Homepage URL:** `https://tu-app.vercel.app`
     - **Callback URL:** `https://tu-app.vercel.app/api/auth/callback/github`

5. **Deploy:**
   - Click en "Deploy"
   - Espera a que termine el build (2-3 minutos)

### Opción 2: Deploy desde CLI

```bash
# Instalar Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel --prod
```

### Verificar Deployment

1. **Probar la aplicación:** Abre la URL de Vercel
2. **Login con GitHub:** Verifica que funcione
3. **Crear movimientos:** Prueba el CRUD
4. **Ver reportes:** Prueba los gráficos y CSV
5. **Documentación API:** Visita `/docs`

---

## 📁 Estructura del Proyecto

```
prueba-tecnica-fullstack/
├── __tests__/                    # Pruebas unitarias (71 tests)
│   ├── lib/                      # Tests de helpers
│   └── validations/              # Tests de schemas Zod
├── components/                   # Componentes React
│   ├── auth/                     # ProtectedContent
│   ├── layout/                   # DashboardLayout, Sidebar
│   ├── theme-provider.tsx        # Provider de tema dark/light
│   └── ui/                       # Componentes Shadcn UI
├── lib/                          # Utilidades y configuración
│   ├── api/                      # Helpers para API routes
│   ├── auth/                     # Configuración Better Auth
│   ├── rbac/                     # Sistema de permisos RBAC
│   ├── validations/              # Schemas Zod
│   ├── prisma.ts                 # Cliente Prisma singleton
│   └── utils.ts                  # Utilidades generales
├── pages/                        # Páginas Next.js (Pages Router)
│   ├── api/                      # API Routes
│   │   ├── auth/                 # Endpoints Better Auth
│   │   ├── movements/            # CRUD movimientos
│   │   ├── reports/              # Summary y CSV
│   │   ├── users/                # CRUD usuarios
│   │   └── docs.ts               # Redirect a /docs
│   ├── auth/                     # Páginas de autenticación
│   ├── dashboard/                # Dashboard principal
│   ├── movements/                # Gestión de movimientos
│   ├── reports/                  # Reportes financieros
│   ├── users/                    # Gestión de usuarios
│   ├── welcome/                  # Página de bienvenida
│   ├── docs.tsx                  # Swagger UI
│   ├── index.tsx                 # Landing page
│   ├── _app.tsx                  # App wrapper
│   └── _document.tsx             # Document HTML
├── prisma/                       # Configuración Prisma
│   ├── schema.prisma             # Esquema de base de datos
│   └── migrations/               # Migraciones SQL
├── public/                       # Archivos estáticos
│   └── docs/                     # OpenAPI YAML files
├── styles/                       # Estilos globales
│   └── globals.css               # Tailwind + tema custom
├── .env.example                  # Template de variables
├── .eslintrc.json                # Configuración ESLint
├── components.json               # Config Shadcn UI
├── jest.config.js                # Config Jest
├── next.config.mjs               # Config Next.js
├── package.json                  # Dependencies
├── pnpm-lock.yaml                # Lockfile
├── postcss.config.mjs            # Config PostCSS
├── prettier.config.js            # Config Prettier
├── tailwind.config.ts            # Config Tailwind
├── tsconfig.json                 # Config TypeScript
└── README.md                     # Este archivo
```

---

## 🧪 Pruebas

El proyecto incluye **71 pruebas unitarias** organizadas en 4 suites:

### Ejecutar pruebas

```bash
# Todas las pruebas
pnpm test

# En modo watch
pnpm test:watch

# Con coverage
pnpm test:coverage
```

### Cobertura de Pruebas

| Suite | Tests | Descripción |
|-------|-------|-------------|
| **movement.test.ts** | 24 | Validación de schemas de movimientos |
| **user.test.ts** | 25 | Validación de schemas de usuarios |
| **report.test.ts** | 22 | Validación de schemas de reportes |
| **api-helpers.test.ts** | — | Helpers de API routes |
| **TOTAL** | **71** | ✅ Todas pasando |

---

## 📚 Documentación API

### Acceso a la Documentación

- **Local:** [http://localhost:3000/docs](http://localhost:3000/docs)
- **Producción:** [https://tu-app.vercel.app/docs](https://tu-app.vercel.app/docs)

### Endpoints Disponibles

#### 🔐 Autenticación (Better Auth)
- `POST /api/auth/sign-in` - Iniciar sesión
- `POST /api/auth/sign-out` - Cerrar sesión
- `GET /api/auth/session` - Obtener sesión actual
- `GET /api/auth/callback/github` - Callback OAuth GitHub

#### 💰 Movimientos
- `GET /api/movements` - Listar movimientos (con filtros)
- `POST /api/movements` - Crear movimiento (admin only)
- `GET /api/movements/[id]` - Obtener movimiento por ID
- `PUT /api/movements/[id]` - Actualizar movimiento (admin only)
- `DELETE /api/movements/[id]` - Eliminar movimiento (admin only)

#### 👥 Usuarios
- `GET /api/users` - Listar usuarios (admin only)
- `GET /api/users/[id]` - Obtener usuario por ID (admin only)
- `PUT /api/users/[id]` - Actualizar usuario (admin only)

#### 📊 Reportes
- `GET /api/reports/summary` - Resumen financiero (admin only)
- `GET /api/reports/csv` - Exportar CSV (admin only)

### Ejemplo de Request

```bash
# Obtener movimientos del mes actual
curl -X GET 'http://localhost:3000/api/movements?type=INCOME&startDate=2025-01-01' \
  -H 'Cookie: better-auth.session_token=YOUR_TOKEN'
```

---

## 🔒 Roles y Permisos

### Roles Disponibles

| Rol | Descripción |
|-----|-------------|
| **USER** | Usuario estándar con acceso limitado |
| **ADMIN** | Administrador con acceso completo |

**Nota:** Todos los usuarios nuevos se registran automáticamente como **ADMIN** para facilitar las pruebas.

### Matriz de Permisos

| Funcionalidad | USER | ADMIN |
|---------------|------|-------|
| Ver Dashboard | ✅ | ✅ |
| Ver Movimientos Propios | ✅ | ✅ |
| Ver Todos los Movimientos | ❌ | ✅ |
| Crear Movimientos | ❌ | ✅ |
| Editar Movimientos | ❌ | ✅ |
| Eliminar Movimientos | ❌ | ✅ |
| Ver Usuarios | ❌ | ✅ |
| Editar Usuarios | ❌ | ✅ |
| Ver Reportes | ❌ | ✅ |
| Exportar CSV | ❌ | ✅ |

### Implementación RBAC

El sistema de permisos está implementado en 3 capas:

1. **Frontend:** Hook `usePermissions()` y componente `<ProtectedContent>`
2. **Backend:** Middleware `withPermission()` y `withAuth()`
3. **Base de Datos:** Filtros basados en rol del usuario

---

## 🎨 Diseño y UX

### Tema Visual
- **Glassmorphism:** Efectos de vidrio esmerilado
- **Gradientes:** Purple-blue como color principal
- **Dark/Light Mode:** Toggle persistente
- **Tipografía:** Poppins (Google Fonts)
- **Animaciones:** Transiciones suaves y efectos hover

### Componentes Principales
- Dashboard con analytics en tiempo real
- Tablas con filtros, búsqueda y paginación
- Modals para crear/editar registros
- Gráficos interactivos con TradingView
- Loading states y empty states

---

## 🐛 Troubleshooting

### Error: "Too many database connections"

**Solución:** Asegúrate de que tu `DATABASE_URL` incluya:
```
?connection_limit=3&pool_timeout=20&connect_timeout=10
```

### Error: "Module '@prisma/client' has no exported member"

**Solución:** Regenera Prisma Client:
```bash
pnpm prisma generate
```

### Error: GitHub OAuth redirect_uri_mismatch

**Solución:** Verifica que la URL de callback en GitHub coincida:
- Local: `http://localhost:3000/api/auth/callback/github`
- Prod: `https://tu-app.vercel.app/api/auth/callback/github`

### Build falla en Vercel

**Solución:** Verifica que todas las variables de entorno estén configuradas en Vercel Dashboard.

---

## 📄 Licencia

Este proyecto fue desarrollado como prueba técnica para PrevalentWare.

---

## 👨‍💻 Autor

**Wilmar Poyato**
- GitHub: [@Wilpoymu](https://github.com/Wilpoymu)
- Email: wilmar@example.com _(actualizar con tu email)_

---

## 🙏 Agradecimientos

- **PrevalentWare** por la oportunidad de desarrollar este proyecto
- **Vercel** por el hosting gratuito
- **Better Auth** por la solución de autenticación
- **Shadcn UI** por los componentes React

---

**¿Preguntas o problemas?** Abre un issue en GitHub o contacta al autor directamente.