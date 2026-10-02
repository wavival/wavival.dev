# Blog W: stack

Fuente: repositorio `lumina-w/blog-w` (rama `dev`), leído el 2026-10-02.

## Confirmado en el código

- Next.js 15 (App Router), React 19 y TypeScript. Estilos con Tailwind CSS 4.
- Base de datos: PostgreSQL en Supabase, con Prisma.
- Autenticación: NextAuth con correo y clave, Google, GitHub y LinkedIn.
- Contenido: artículos en Markdown en el repositorio (importados al desplegar) y artículos escritos por cuentas dentro de la aplicación, con aprobación de la administradora.
- Español e inglés, con rutas traducidas.
- Correo y newsletter: Brevo.
- Traducción automática de artículos publicados: API de Claude.
- Analítica: GA4 con consentimiento de cookies. Vercel Analytics opcional.
- Imágenes: Supabase Storage, convertidas a WebP con sharp.
- Despliegue: Vercel. URL pública: <https://blog.luminaw.co>.
- Reemplazó a un sitio anterior en Astro con Decap CMS.

## No está en el código

- PWA: no hay manifest, service worker, instalación ni uso sin conexión. El caso de estudio ya no lo afirma.

## Pendiente de decidir

- Si el blog debe volverse PWA, o si se deja de presentarlo así en el resto de los textos.
