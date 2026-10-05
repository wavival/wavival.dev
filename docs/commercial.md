# Comercial de la marca personal wavival

> Last updated: 2026-10-05

Documento vivo. Verificado contra el código del repositorio en la fecha indicada arriba. Toda afirmación se apoya en un archivo del repositorio (campo "Fuente") o en una decisión registrada en la sección 10. Lo que no se pueda verificar queda como [PENDIENTE].

Un [PENDIENTE] es bloqueante solo para la pieza concreta que lo necesita. Nunca es un bloqueo global: si algo no está confirmado, se omite de la pieza y se publica el resto.

Regla de estilo del repositorio: sin rayas largas (em dash), sin rayas medias (en dash), sin emojis, sin flechas decorativas.

Documento hermano: [brand.md](./brand.md).

---

## 1. Objetivo comercial de la marca personal

- wavival es la marca personal y el canal de confianza y descubrimiento.
- Los servicios publicados en `wavival.dev` son de wavival. Lúmina W es la empresa de software de Valentina, con servicios, precios y productos propios publicados en `luminaw.co`.
- Objetivo: que personas interesadas en desarrollo de producto y potenciales clientes lleguen a los servicios de wavival, o a Lúmina W y a sus productos (TerraCore, OKroot), a través del contenido de wavival.
- Canales V1: Instagram y LinkedIn, en español.

Metas numéricas y cadencia: no se definen aquí. La cadencia la decide el sistema editorial.

Fuente: decisiones de la sección 10; `src/components/organisms/ContactBand.astro`, `src/pages/contacto.astro`.

---

## 2. Oferta documentada

Servicios publicados en `/servicios` (ofrecidos por wavival):

1. Aplicaciones web a medida (8 a 14 semanas): Django + DRF o Next.js con Supabase, React + TypeScript, despliegue.
2. APIs REST y backend (3 a 6 semanas): APIs autenticadas y documentadas, modelado relacional, roles, multitenancy.
3. Seguridad y AppSec (1 a 2 semanas): revisión con criterio OWASP Top 10, autenticación, manejo de secretos, validación.
4. Integraciones de IA (2 a 4 semanas): OpenAI, OpenClaw, Claude API, flujos con LLM y n8n donde aportan valor.

Modalidades: desarrollo completo o refuerzo backend, API o seguridad en un equipo existente. Diseño UX/UI incluido cuando el proyecto lo requiere. Las duraciones son estimadas.

Precio publicado en el sitio: proyectos desde USD 250 / COP 1.000.000 según alcance (MVP de 3 a 6 semanas). Disponibilidad limitada. Respuesta en 24 horas. Este precio es de wavival; Lúmina W tiene sus propios precios, que viven en `luminaw.co` y no se publican en este sitio.

Proceso publicado: conversación, propuesta, build iterativo, entrega documentada y mantenible.

Producto disponible hoy:

- TerraCore, plan Semilla: 1 sede y 5 usuarios (parte `landing` del proyecto `terracore` en `src/data/projects.ts`). Es el único plan que se trata como disponible. Profesional (hasta 5 sedes y 10 usuarios) y Enterprise (sedes y usuarios ilimitados) aparecen en la landing pero no se mencionan como disponibles. Los precios de productos no se publican en `wavival.dev`: no se citan.
- OKroot: funcional en early access. No se afirma modelo de acceso; los precios de productos no se publican en `wavival.dev`.

Omitido en V1 (sin fuente): mantenimiento como servicio, modelo de contratación, oferta paga de NullBreach.

Fuente: `src/pages/servicios.astro`, `src/data/projects.ts` (proyecto `terracore`, parte `landing`), `src/components/organisms/ContactBand.astro`.

Titular de la home: "Full Stack Developer, backend e IA." Datos publicados en la home: "3 apps en producción", "Lúmina W fundadora", "24h tiempo de respuesta" (`src/components/organisms/Hero.astro`). Las 3 apps son TerraCore, OKroot y NullBreach (decisión de la dueña, 2026-10-04); el sitio no las enumera.

---

## 3. Cliente ideal

- Fundadores con producto real que necesitan velocidad.
- Equipos que necesitan API y frontend bajo un solo contrato.
- Startups que valoran seguridad por diseño.
- Equipos existentes que necesitan refuerzo de backend, API o seguridad.
- Para TerraCore: fincas medianas en Colombia.
- Para OKroot: personas con celiaquía, diabetes o intolerancia a la lactosa (early access).

No es para ella si:

- El proyecto es solo diseño o maquetado estático.
- Se necesita alguien en oficina 9 a 5.
- Se busca el precio más bajo, no el mejor resultado.

Punto de partida esperado: tener claro el problema y a quién va dirigido.

---

## 4. Problemas que puede resolver

Todos salen de casos ya publicados:

- Operación repartida entre cuadernos, hojas de cálculo y mensajes: una plataforma multiusuario con roles (TerraCore).
- Software que funciona sin conexión y sincroniza después (TerraCore, OKroot).
- Aislamiento de datos entre organizaciones sobre una sola instancia (TerraCore).
- Leer etiquetas de alimentos cruzando varias restricciones a la vez (OKroot).
- Análisis de código orientado a OWASP con historial por usuario (NullBreach).
- Autenticación con sesiones e historial separado por cuenta (NullBreach).
- Landing que comunica una propuesta a un público no técnico (landings de TerraCore, OKroot y Lúmina W).

Fuente: `src/data/projects.ts`.

---

## 5. Capacidades demostrables

- Backend con Django, DRF, PostgreSQL y JWT: TerraCore, OKroot.
- Frontend con React y TypeScript: TerraCore, OKroot.
- Full stack con Next.js, NextAuth y Prisma Postgres: NullBreach (código abierto).
- PWA offline-first con Service Worker: TerraCore, OKroot.
- Multitenancy y roles: TerraCore.
- IA aplicada: Claude API en OKroot, OpenAI en NullBreach. Solo se cita con su proyecto y fuente.
- Seguridad ofensiva en laboratorio: writeup Forgotten Portal (PTES, CWE, MITRE ATT&CK).
- Landings con Astro, Tailwind, SEO técnico, accesibilidad y rendimiento: `luminaw.co`, landings de producto, este portafolio.
- Calidad de ingeniería en repositorio público: Playwright, Lighthouse CI, comprobación de enlaces, CSP con hashes, análisis de secretos, flujo `dev`, `stg`, `main`.
- Publicación técnica: Blog W.

No se afirma sin evidencia: clientes de pago, escala de usuarios, disponibilidad, certificaciones.

---

## 6. Conversión

Ruta de descubrimiento V1:

1. Contenido en Instagram y LinkedIn.
2. Perfil de wavival y portafolio (`wavival.dev`): proyectos, servicios, herramientas.
3. Lúmina W (`luminaw.co`) para sus propios servicios y para los productos.
4. Contacto: correo `wavival.dev@luminaw.co` (respuesta en 24 horas), WhatsApp (`wa.me/573016560222`) o llamada de descubrimiento de 30 minutos por Calendly (`calendly.com/wavival/descubrimiento-servicios-wavival`), todo en la página `/contacto`. Formulario de cotización en `/cotizar`, con respuesta en un máximo de 24 horas.
5. Producto: TerraCore (landing y app), OKroot (landing y app en early access).

Regla: el CTA de una pieza sobre los servicios de wavival dirige a `/servicios` o `/contacto`; el CTA de una pieza sobre Lúmina W o sus productos dirige a `luminaw.co` o al producto; el CTA de una pieza de confianza puede dirigir al portafolio.

Medición ya instalada en el portafolio: eventos de Umami para `cta-quiero-producto`, `cv-descarga-es` y `cv-descarga-en`, `contacto-email`, `contacto-whatsapp`, `contacto-calendly`, `ver-app-terracore`, `ver-docs-terracore`, `ver-app-root`, `ver-docs-okroot` y `ver-app-nullbreach`.

Fuente: `src/pages/contacto.astro`, `src/components/organisms/NavBar.astro`, `src/components/organisms/Footer.astro`, `AGENTS.md`.

---

## 7. CTAs permitidos

Textos ya usados en el sitio:

- "Quiero mi producto"
- "Contáctame"
- "Ver servicios"
- "Descubre Lúmina W"
- "Ver app", "Ver repositorio", "Ver sitio"
- "Escríbeme", "Chatear", "Agendar"
- "Descargar CV", "Cotizar este servicio"

Reglas:

- Un CTA por pieza.
- Sin flechas ni iconos decorativos añadidos.
- Sin urgencia inventada: "disponibilidad limitada" solo mientras el sitio lo diga.
- CTA nuevo con seguimiento: atributo de evento de Umami, sin scripts en línea.
- OKroot se invita a probar como early access, no como producto en madurez comercial.

---

## 8. Claims permitidos

### Se pueden afirmar como están publicados

- Desarrolladora Full Stack con enfoque en backend e IA (Django, React, Next.js) y fundadora de Lúmina W, empresa de software.
- Estudia Análisis y Desarrollo de Software (SENA) y Lengua Inglesa (Universidad de San Buenaventura); aprende en Platzi.
- TerraCore: PWA multitenancy para fincas medianas en Colombia, con roles, funcionamiento sin conexión y exportación CSV. En producción y en validación con clientes en Antioquia, Colombia. Plan Semilla disponible.
- OKroot: PWA con escáner de etiquetas por IA (Claude API), en early access.
- NullBreach: app Next.js que analiza código con criterio OWASP mediante OpenAI, con historial por usuario, código abierto.
- Forgotten Portal: ejercicio de pentesting en laboratorio (DockerLabs) con PTES y MITRE ATT&CK.
- Proyectos desde USD 250 / COP 1.000.000 según alcance; respuesta en 24 horas; disponibilidad limitada. Duraciones como estimadas.

### Se pueden afirmar con cuidado

- Cifras de TerraCore: ninguna cifra de resultados. El sitio ya no publica la reducción de tiempo administrativo. La reducción de tiempo administrativo no se usa (decisión 10).
- Resultados de NullBreach: siempre como "asistencia de análisis, no una verificación determinista".
- Cumplimiento de la Ley 1581 en TerraCore: no amplificar como certificación; solo si una pieza tiene texto validado: [PENDIENTE] para esa pieza.
- OKroot: no sustituye asesoría médica; si una pieza toca salud, incluir descargo: [PENDIENTE] texto.
- Claims con IA: solo con proyecto y fuente que los demuestren.

### No se afirman

- Número de clientes, ventas, ingresos, usuarios activos, conversión.
- Testimonios o referencias: no hay en el repositorio.
- Certificaciones de seguridad, cumplimiento o auditoría.
- Que NullBreach detecta todas las vulnerabilidades o reemplaza un pentest.
- Nombres o experiencias de terceros del CV.
- Los planes Profesional y Enterprise de TerraCore como disponibles.
- Años de experiencia.
- Relación comercial de NullBreach con Lúmina W.
- Cualquier experiencia, resultado o habilidad que no esté en el repositorio.

---

## 9. Riesgos del contenido comercial

- Presentar OKroot como más maduro que early access.
- Presentar planes de TerraCore no disponibles.
- Publicar la cifra del 42% o cualquier dato que identifique fincas o productores.
- Presentar plazos como compromiso.
- Mostrar análisis de seguridad de sistemas reales.

---

## 10. Decisiones registradas

- Todo lo que vive en `wavival.dev` es de wavival y todo lo que vive en `luminaw.co` es de Lúmina W. Los servicios y el precio de `/servicios` son de wavival.
- Lúmina W: empresa de software. TerraCore y OKroot: sus productos.
- TerraCore: en producción, en venta activa y en validación con clientes en Antioquia, Colombia; solo Semilla disponible. OKroot: funcional en early access.
- Los precios de productos no se publican en `wavival.dev`. Las 3 apps del home son TerraCore, OKroot y NullBreach.
- No usar públicamente la cifra del 42%.
- Canales V1: Instagram y LinkedIn; español.
- Audiencia prioritaria: personas interesadas en producto y software, y potenciales clientes de wavival y de Lúmina W.
- Sin nombres ni experiencias de terceros del CV.
- NullBreach sin relación comercial definida en V1.
- Cadencia: la define el sistema editorial.

---

## 11. Pendientes por pieza

Ninguno bloquea el arranque de V1. Cada uno bloquea solo la pieza indicada.

- Pieza que cite un precio de Lúmina W: no usar el de wavival (desde USD 250 / COP 1.000.000); [PENDIENTE] precios propios de Lúmina W.
- Pieza sobre OKroot con modelo de acceso: [PENDIENTE].
- Pieza sobre cumplimiento legal de TerraCore: [PENDIENTE] texto validado.
- Pieza de OKroot sobre salud: [PENDIENTE] texto de descargo.
- Pieza sobre mantenimiento o soporte como servicio: [PENDIENTE].
- Pieza sobre un módulo concreto de TerraCore: verificar disponibilidad del módulo.
