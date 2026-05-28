# ✈ AeroCat — Catálogo de Aeronaves

Aplicación web para explorar, registrar y gestionar un catálogo personal de aeronaves. Desarrollada como proyecto final de la materia Desarrollo Web.

## 🚀 Deploy

[Ver aplicación en producción](https://aerocat.vercel.app) ← reemplazar con la URL real de Vercel

## 🛠 Stack tecnológico

| Tecnología | Uso | Justificación |
|---|---|---|
| **React + Vite** | Frontend SPA | Ecosistema amplio, hot reload, build rápido |
| **Supabase** | Auth + Base de datos + Storage | Backend as a Service, fácil integración, PostgreSQL real |
| **Vercel** | Deploy | CI/CD automático desde GitHub, CDN global |
| **React Router v6** | Navegación | Estándar para SPAs con React |

## 📋 Funcionalidades

- ✅ Registro, inicio y cierre de sesión (Supabase Auth)
- ✅ Catálogo compartido de aeronaves
- ✅ Crear, visualizar y editar aeronaves
- ✅ Eliminar aeronaves propias
- ✅ Sistema de favoritos por usuario
- ✅ Búsqueda y filtro por categoría
- ✅ Subida de imágenes a CDN (Supabase Storage)
- ✅ Edición de contraseña desde el perfil
- ✅ Diseño responsive

## 🗂 Estructura del repositorio

```
aerocat/
├── src/
│   ├── components/
│   │   ├── Navbar.jsx          # Barra de navegación
│   │   ├── AircraftCard.jsx    # Tarjeta de aeronave
│   │   └── AircraftModal.jsx   # Modal crear/editar
│   ├── pages/
│   │   ├── Home.jsx            # Landing page
│   │   ├── Login.jsx           # Inicio de sesión
│   │   ├── Register.jsx        # Registro
│   │   ├── Catalog.jsx         # Catálogo principal
│   │   ├── AircraftDetail.jsx  # Detalle de aeronave
│   │   ├── Favorites.jsx       # Favoritos del usuario
│   │   └── Profile.jsx         # Perfil y configuración
│   ├── hooks/
│   │   └── useAuth.jsx         # Context + hook de autenticación
│   ├── lib/
│   │   └── supabase.js         # Cliente de Supabase
│   ├── App.jsx                 # Rutas y providers
│   ├── main.jsx                # Entry point
│   └── index.css               # Estilos globales
├── supabase-schema.sql         # Schema de base de datos
├── .env.example                # Variables de entorno de ejemplo
└── README.md
```

## 🌿 Ramas

```
main        ← producción, siempre funcional
develop     ← integración
alumno-1    ← Frontend / UI
alumno-2    ← Backend / Datos
```

## 🏗 Configuración local

### 1. Clonar el repositorio

```bash
git clone https://github.com/tu-usuario/aerocat.git
cd aerocat
npm install
```

### 2. Configurar Supabase

1. Crear proyecto en [supabase.com](https://supabase.com)
2. Ir a **SQL Editor** y ejecutar `supabase-schema.sql`
3. Ir a **Storage** y crear un bucket llamado `aircraft-images` (public: true)

### 3. Variables de entorno

Crear `.env` en la raíz:

```env
VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
VITE_SUPABASE_ANON_KEY=tu-anon-key
```

Las claves se encuentran en Supabase → Settings → API.

### 4. Correr en desarrollo

```bash
npm run dev
```

## 🚢 Deploy en Vercel

1. Importar el repositorio en [vercel.com](https://vercel.com)
2. Agregar las variables de entorno (`VITE_SUPABASE_URL` y `VITE_SUPABASE_ANON_KEY`)
3. Vercel detecta automáticamente Vite y hace el build

Cada push a `main` dispara un nuevo deploy automáticamente.

## 🗄 Base de datos

### Tabla `aircraft`

| Campo | Tipo | Descripción |
|---|---|---|
| id | UUID | Clave primaria |
| user_id | UUID | FK a auth.users (dueño) |
| model | TEXT | Modelo del avión |
| manufacturer | TEXT | Fabricante |
| category | TEXT | Comercial, Militar, etc. |
| airline | TEXT | Aerolínea operadora |
| first_flight | INTEGER | Año del primer vuelo |
| description | TEXT | Descripción libre |
| image_url | TEXT | URL de imagen (Storage o externa) |
| created_at | TIMESTAMPTZ | Fecha de creación |

### Tabla `favorites`

| Campo | Tipo | Descripción |
|---|---|---|
| id | UUID | Clave primaria |
| user_id | UUID | FK a auth.users |
| aircraft_id | UUID | FK a aircraft |
| created_at | TIMESTAMPTZ | Fecha de creación |

### Row Level Security

- Cualquier usuario autenticado puede **leer** todas las aeronaves.
- Solo el **dueño** puede editar o eliminar sus aeronaves.
- Cada usuario gestiona únicamente **sus propios favoritos**.

## 👥 División de trabajo

| Alumno | Rama | Responsabilidades |
|---|---|---|
| Alumno 1 | `alumno-1` | Layout, componentes visuales, páginas de UI |
| Alumno 2 | `alumno-2` | Supabase setup, auth, lógica CRUD, storage |

## 📌 Decisiones técnicas

**¿Por qué React y no Astro?** React permite un ciclo de vida de componentes más sencillo para manejar estado de autenticación y datos en tiempo real. Para una SPA con auth y CRUD, es la opción más directa.

**¿Por qué Supabase?** Ofrece autenticación, base de datos PostgreSQL y storage en un mismo servicio, con SDK para JavaScript. Elimina la necesidad de un backend propio.

**¿Por qué Vercel?** Integración nativa con repositorios de GitHub y deploy automático en cada push. La capa gratuita es suficiente para el proyecto.
