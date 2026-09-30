# Marca personal wavival

Documento vivo. Sin fecha. Toda afirmación se apoya en un archivo del repositorio (campo "Fuente") o en una decisión registrada en la sección 10. Lo que no se pueda verificar queda como [PENDIENTE].

Un [PENDIENTE] es bloqueante solo para la pieza concreta que lo necesita. Nunca es un bloqueo global: si algo no está confirmado, se omite de la pieza y se publica el resto.

Regla de estilo del repositorio: sin rayas largas (em dash), sin rayas medias (en dash), sin emojis, sin flechas decorativas. Aplica a este documento y a todo contenido derivado.

Documento hermano: [commercial.md](./commercial.md).

---

## 1. Quién es

- Nombre: Valentina Ramírez. Marca y handle: wavival (`@wavival`). Dominio: wavival.dev.
- Rol público: desarrolladora Full Stack (Django, React, Next.js) y fundadora de Lúmina W.
- Ubicación pública: Colombia. Coordinación en horario COT (UTC-5). No se publica más detalle de residencia.
- Trabaja sola en sus productos.
- Idiomas: español (por defecto) e inglés.
- Formación pública:
  - SENA: Tecnología en Análisis y Desarrollo de Software (en curso).
  - Universidad de San Buenaventura: Lengua Inglesa (en curso).
  - Platzi: desarrollo web, inteligencia artificial y seguridad informática (en curso).
- Intereses declarados fuera del código: fotografía, batería, cocina, música, lectura.
- Autodefinición en el sitio: desarrolladora autodidacta "por convicción", que necesita entender por qué funciona algo antes de darlo por bueno.

Fuente: `src/pages/sobre-mi.astro`, `src/components/sections/About.astro`, `CLAUDE.md`.

Fuera de contenido V1: experiencias laborales del CV y cualquier nombre o experiencia de terceros que aparezca allí. El CV se usa solo como contexto interno.

---

## 2. Audiencia

Audiencia prioritaria V1:

- Personas interesadas en desarrollo de producto y de software.
- Potenciales clientes que descubren Lúmina W y sus productos a través de wavival.

Audiencias secundarias que el sitio ya atiende: equipos que buscan refuerzo backend, API o seguridad; personas técnicas y reclutadoras que revisan el portafolio; comunidad técnica hispanohablante (Django, Next.js, AppSec, IA aplicada).

Canales V1:

- Instagram: más personal, visual y cercano.
- LinkedIn: más técnico y profesional.
- Ambos con la misma identidad, voz base y reglas de esta guía. Cambia el registro, no la persona.
- Otros canales del sitio (GitHub, X `@wavival0`, Blog W, Platzi) quedan fuera de la prioridad V1.

Idioma inicial: español. El contenido en inglés no es parte de V1.

Cadencia y calendario: los define después el sistema editorial. Este documento no los fija.

---

## 3. Posicionamiento

Posicionamiento V1: desarrolladora Full Stack y fundadora de Lúmina W, con contenido sobre:

- Construcción de productos.
- Backend.
- Seguridad por diseño.
- Aplicación útil de IA, solo cuando exista evidencia documental para el claim concreto.

Frase base publicada en el sitio: "Full Stack Developer. Seguridad integrada. IA aplicada. Productos que escalan."

Afirmaciones que el sitio ya sostiene:

- Toma un problema de negocio y lo entrega como software real en producción.
- Mentalidad ofensiva para escribir código defensivo ("El código que firmo también lo rompo.").
- Producto real, no demos: multiusuario, lógica de negocio compleja, APIs propias.
- Decide arquitectura pensando en el segundo año, no solo en el MVP.
- "La IA acelera; no reemplaza el criterio de ingeniería."

Regla de IA: cualquier pieza que diga que una solución usa, resuelve o mejora algo con IA cita el proyecto y la fuente que lo demuestra (por ejemplo OKroot con Claude API, NullBreach con OpenAI). Sin fuente, la pieza no hace ese claim.

Relación con Lúmina W: wavival es la marca personal y el canal de confianza y descubrimiento. Lúmina W es la empresa que ofrece los servicios y los productos.

Fuente: `src/components/sections/Hero.astro`, `src/data/stack.ts`, `src/data/projects.ts`, `src/i18n/ui.ts`.

---

## 4. Voz y tono

Derivado del copy publicado; no existe una guía escrita previa en el repositorio.

Base común (Instagram y LinkedIn):

- Primera persona, directa, sin adornos.
- Concreta: nombra el problema y la herramienta.
- Explica el porqué de cada decisión con su compromiso (contexto, trade-off, decisión).
- Honesta sobre límites y estado real de lo que cuenta.
- Sin superlativos ni promesas vacías.
- Cercana pero profesional; tuteo al lector.

Registro por canal:

- Instagram: más personal, visual y cercano. Proceso, detrás de cámaras, aprendizajes, herramientas, lo que se aprendió al construir. Frases cortas, imagen o pieza visual como protagonista.
- LinkedIn: más técnico y profesional. Decisiones de arquitectura, seguridad, backend, casos de estudio, resultados verificables. Estructura contexto, decisión, aprendizaje.

Reglas de redacción:

- Español.
- Sin rayas largas ni medias, emojis o flechas decorativas.
- No inventar historia personal, clientes ni resultados.
- Términos técnicos se mantienen (PWA, API, offline-first); el resto en español.

---

## 5. Pilares de contenido

Todo contenido V1 sale de fuentes verificables del repositorio. Sin fuente, no se publica.

1. Construcción de productos
   - TerraCore, OKroot, NullBreach, Lúmina W, Blog W: problema, solución, módulos, aprendizajes.
   - Fuente: casos de estudio en `src/data/projects.ts`.
2. Decisiones técnicas
   - Contexto, trade-off, decisión (multitenancy, offline-first, Next.js App Router, NextAuth, Prisma Postgres, estado persistente del perfil en OKroot).
   - Fuente: `decisions` y `learnings` de cada caso.
3. Backend y seguridad por diseño
   - OWASP, PTES, MITRE ATT&CK, criterio de pentester al diseñar.
   - Fuente: `stack.ts`, NullBreach, writeup Forgotten Portal (laboratorio DockerLabs, ya publicado).
4. IA con evidencia
   - Solo con el proyecto y la fuente que demuestran el claim (ver sección 3).
5. Bugs y aprendizajes
   - Bugs propios ya corregidos, contados por causa y aprendizaje, sin paso a paso reproducible. Fuente: historial y `CHANGELOG.md`.
6. Ingeniería del propio portafolio (build in public)
   - Accesibilidad, rendimiento, SEO técnico, CSP con hashes, CI, flujo `dev`, `stg`, `main`. Fuente: `CLAUDE.md`, `README.md`, `DESIGN.md`, `CHANGELOG.md`.
7. Herramientas
   - Una herramienta se menciona solo cuando la fuente concreta confirma su uso (ver sección 7).
8. Formación
   - SENA, Universidad de San Buenaventura, Platzi y lo que cada proyecto enseñó.

Adaptación: Instagram prioriza los pilares 1, 5, 6, 7 y 8 con enfoque visual y cercano. LinkedIn prioriza 1, 2, 3, 4 y 6 con enfoque técnico.

---

## 6. Temas permitidos y restringidos

### Permitidos

- Formación, proyectos públicos, decisiones técnicas, bugs, aprendizajes, herramientas y build in public, siempre verificables en el repositorio.
- Lo que ya es público en el sitio y en `github.com/wavival`.
- Nuevas funcionalidades ya desplegadas.
- Estado real de cada producto (ver sección 9).

### Restringidos (no se publican)

- Secretos, tokens, claves, credenciales y sus nombres internos.
- Datos de clientes, usuarios, fincas piloto o productores identificables; datos personales.
- Nombres o experiencias de terceros del CV.
- Vulnerabilidades explotables de sistemas propios o ajenos que sigan abiertas. Solo se cuentan corregidas y sin paso a paso reproducible. El writeup de laboratorio (DockerLabs) ya es público.
- Detalles sensibles de infraestructura: hosts internos, rutas de proxy, configuración de despliegue o red más allá de lo ya expuesto, cuentas, planes contratados.
- Métricas de negocio (usuarios, ingresos, conversión, clientes) sin fuente verificable.
- La cifra de reducción de tiempo administrativo de TerraCore (ver sección 9).
- Planes de TerraCore distintos de Semilla como si estuvieran disponibles.
- Documentación interna de agentes y checkpoints (`.claude/`, `.codex/`, `AGENTS.md`): sirven de contexto, no de contenido.

Ante duda sobre si algo es sensible: no se publica y se pregunta.

### Límites del build in public

- Se comparte proceso y el porqué de las decisiones, no datos operativos ni de terceros.
- Se dice el estado real: laboratorio, early access, disponible. Nunca más maduro de lo que se pueda afirmar.
- Un producto no filtra información de otro.
- Lo que no esté confirmado se omite de la pieza; no se especula.

---

## 7. Vocabulario

Términos del sitio y su sentido:

- "Producto", "producto a medida": software completo en producción, no demo.
- "Seguridad por diseño": entra desde el primer endpoint, no al final.
- "IA aplicada": IA donde aporta valor y hay evidencia.
- "Offline-first": funciona sin conexión y sincroniza después.
- "Multitenancy": cada organización con su espacio de datos aislado sobre una sola instancia.
- "Del backend a la interfaz", "entender el porqué".
- "Empresa de software" para Lúmina W. No usar "startup" ni "agencia".

A evitar: "experto", "el mejor", "garantizado", "100% seguro", "certificado", "clientes" (no hay clientes nombrados en el repositorio), lenguaje ofensivo sin contexto defensivo.

Herramientas: se nombra una herramienta o sistema (por ejemplo un sistema operativo, editor o terminal) solo si una fuente concreta de la pieza confirma su uso. No se afirma una máquina de trabajo única.

Nombres exactos: TerraCore, OKroot, NullBreach, Lúmina W, Blog W, Forgotten Portal.

---

## 8. Identidad visual

Fuente única: `src/styles/tokens.css`, `DESIGN.md`, `public/brand/`.

- Logo: `public/brand/logo-w.webp`.
- Foto de perfil: `public/images/profile.webp`, retrato con desvanecido al fondo y marco fino en degradado azul.
- Color:
  - Azul de marca `#407bff`: rellenos, bordes y texto grande.
  - Azul interactivo `#1565c0` (claro) y `#5b8cff` (oscuro): texto pequeño, enlaces, botones.
  - Fondo `#f0f4ff` (claro) y `#0f1117` (oscuro).
  - Texto `#1a1a2e` (claro) y `#e8eaf6` (oscuro).
- Tipografía: Raleway para títulos y etiquetas; Poppins para lectura.
- Tarjetas OG 1200x630 en WebP por proyecto.
- Iconografía: SVG decorativos, sin emojis ni flechas decorativas.
- Accesibilidad como norma: contraste WCAG AA, foco visible, texto alternativo real en imágenes de contenido.

Para Instagram y LinkedIn, la misma paleta, tipografía y logo. Plantillas por formato (carrusel, portada, miniatura): las define el sistema editorial; no bloquean, solo se usan los tokens de esta sección mientras tanto.

Uso por terceros de logo, foto y marca: el repositorio licencia el código (MIT) pero no el contenido, la marca ni las imágenes.

---

## 9. Relación con Lúmina W y sus productos

### Lúmina W

- Empresa de software fundada por Valentina. Diseña, construye y mantiene productos y software a medida.
- Dos frentes: desarrollo a medida y productos propios (TerraCore, OKroot).
- Presencia: `luminaw.co` (landing) y Blog W en `blog.luminaw.co` (Next.js, PWA).
- Los servicios comerciales se dirigen prioritariamente a Lúmina W. wavival trae confianza y descubrimiento.

### TerraCore (producto de Lúmina W)

- Producto funcional y comercial: SaaS multitenancy para fincas medianas en Colombia (PWA offline-first). Django, DRF, PostgreSQL, React, TypeScript.
- Landing `terracoreapp.co`; app `app.terracoreapp.co`.
- Solo el plan Semilla se trata como disponible actualmente. Los planes Profesional y Enterprise que muestra la landing no se mencionan como disponibles.
- No se usa públicamente la cifra de reducción de tiempo administrativo (42%), aunque el sitio actual todavía la publique. No se copia a contenido.
- No se identifica a fincas ni productores.

### OKroot (producto de Lúmina W)

- Producto funcional en early access: PWA offline-first con escáner de etiquetas por IA (Claude API) para celiaquía, diabetes e intolerancia a la lactosa.
- Landing `okroot.co`; app `app.okroot.co`.
- Se comunica como early access, no como producto en madurez comercial. Modelo de acceso o precio: no se afirma nada.

### NullBreach

- App de seguridad con Next.js: análisis de código alineado con OWASP y chat con OpenAI. Código abierto en `github.com/wavival/nullbreach`.
- Para V1 se trata como proyecto público y de código abierto. No se define ni se inventa relación comercial con Lúmina W.

### Blog W

- Blog de Lúmina W (Next.js, PWA). Solo se afirma Next.js y PWA; el resto del stack no se menciona (`docs/blog-w-stack-pendiente.md`).

### Regla de marca

- wavival habla como persona: decisiones, aprendizajes, criterio técnico.
- Lúmina W habla como empresa: oferta y productos.
- Cada producto habla con su propia landing.
- Una pieza puede mencionar a los tres respetando la sección 6.

---

## 10. Decisiones registradas

- Canales V1: Instagram y LinkedIn. Idioma: español.
- Audiencia prioritaria: personas interesadas en producto y software, y potenciales clientes que descubren Lúmina W y sus productos a través de wavival.
- Lúmina W es una empresa de software. TerraCore y OKroot son sus productos.
- TerraCore: funcional y comercial; solo Semilla disponible. OKroot: funcional en early access.
- No usar públicamente la cifra del 42%.
- Servicios dirigen prioritariamente a Lúmina W.
- No usar nombres ni experiencias de terceros del CV en V1.
- No fijar una única máquina de trabajo; mencionar herramientas solo con fuente.
- Cadencia: la define el sistema editorial.
- NullBreach sin relación comercial definida en V1.

---

## 11. Pendientes por pieza

Ninguno de estos bloquea el arranque de V1. Cada uno bloquea únicamente la pieza indicada; en las demás se omite el dato.

- Publicar la cifra de reducción de administración de TerraCore: no permitido; sin pendiente.
- Pieza sobre el detalle de un módulo concreto de TerraCore: verificar que el módulo esté disponible (el CV interno lo describe como "en desarrollo", el caso de estudio como integrado).
- Pieza que cite un modelo de acceso o precio de OKroot: [PENDIENTE], no existe en el repositorio.
- Pieza sobre la relación comercial de NullBreach con Lúmina W: no se hace en V1.
- Pieza sobre el stack de Blog W más allá de Next.js y PWA: [PENDIENTE].
- Pieza sobre legislación o cumplimiento (Ley 1581): [PENDIENTE] texto validado.
- Pieza que cite el plan Semilla con precio: confirmar vigencia del precio publicado en la landing.
- Pieza que cite experiencia o trayectoria en años: no se usa; el sitio no la respalda.
