# raffles_dentix_frontend

## Descripcion
Frontend del sistema de rifas para Dentix. Proyecto Vue 3 con Vite.

## Stack
- **Framework:** Vue 3 (Options/Composition API)
- **Build:** Vite
- **UI:** PrimeVue 4, Bootstrap 4, AdminLTE 3, Tailwind CSS
- **Estado:** Pinia
- **Router:** Vue Router
- **HTTP:** Axios
- **Imagenes:** Cloudinary (vue + url-gen)
- **Alertas:** SweetAlert2
- **PDF/Excel:** jsPDF, jspdf-autotable, xlsx, file-saver
- **Test:** Vitest + @vue/test-utils

## Estructura src/
- `views/` - Paginas/vistas principales
- `components/` - Componentes reutilizables
- `router.js` / `routes/` - Configuracion de rutas
- `stores/` - Stores de Pinia
- `services/` - Llamadas a la API (axios)
- `helpers/` - Utilidades generales
- `plugins/` - Configuracion de plugins (PrimeVue, etc.)
- `enviroments/` - Variables de entorno
- `data/` - Datos estaticos
- `styles/` - Estilos globales

## Comandos
```bash
npm run dev       # Servidor de desarrollo
npm run build     # Build produccion
npm run preview   # Preview del build
npm run test:unit # Correr tests con vitest
npm run deploy    # Deploy a GitHub Pages (rama: dist)
```

## Deploy
- GitHub Pages via `gh-pages`
- Tambien tiene `vercel.json` para deploy en Vercel

## Notas
- Usa JS (no TypeScript)
- Configuracion de Tailwind en `tailwind.config.js`
- jsconfig.json para path aliases
