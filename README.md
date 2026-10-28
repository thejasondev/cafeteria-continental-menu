# Cafetería Continental — Menú Digital

Sitio web estático y gratuito (Astro + Tailwind CSS) con el menú de **Cafetería Continental**
(C. El Bernegal 1, El Matorral, Puerto del Rosario, Fuerteventura).

**Estado actual:** versión pública SIN precios, a la espera de la luz verde de los dueños.

## Características

- 100% estático y ultrarrápido (cero JavaScript en el cliente salvo el scrollspy).
- Menú sin precios por decisión de los dueños; soporte de precios ya integrado y desactivado.
- **Información de alérgenos**: 6 alérgenos (gluten, huevo, lácteos, pescado, moluscos, crustáceos)
  mostrados por producto, con leyenda.
- Hero con imagen optimizada en WebP.
- Mapa integrado (embed de Google Maps con carga perezosa) + enlaces "Cómo llegar" que abren Google Maps nativo.
- Página imprimible `/qr` con el código QR para mesas (SVG vectorial generado en cada build).
- SEO local: Open Graph + datos estructurados JSON-LD (Restaurant + Menu).
- Accesible (HTML semántico, skip-link, contraste AA, `prefers-reduced-motion`) y responsive.
- Hoja de estilos de impresión (el menú se puede imprimir desde el navegador).

## Stack

| Capa | Tecnología |
| --- | --- |
| Framework | Astro 5 (Static-First) |
| Estilos | Tailwind CSS 3 |
| Tipografía | Playfair Display + Inter (autohospedadas vía Fontsource) |
| Imágenes | Sharp (WebP + srcset responsive) |
| Despliegue | Vercel (plan gratuito) |

## Estructura

```text
├── public/            # favicon, og-image, robots.txt
├── scripts/
│   └── validate-menu.mjs   # Valida menu.json en cada build (fail-fast)
├── src/
│   ├── assets/hero.webp    # Imagen del hero optimizada
│   ├── components/         # Header, Hero, CategoryNav, MenuSection, MenuItem, LocationSection, Footer
│   ├── data/menu.json      # ← ÚNICA fuente de verdad del menú
│   ├── layouts/            # BaseLayout (SEO, JSON-LD, accesibilidad)
│   ├── pages/index.astro   # Página única (one-page menu)
│   ├── styles/global.css   # Sistema de diseño + print + a11y
│   └── utils/              # Tipos TS + lógica de precios + URLs de mapas
├── docs/GUIA-DUENOS.md     # Guía en español para los dueños
├── astro.config.mjs
└── tailwind.config.mjs
```

## Comandos

```bash
npm install          # Instalar dependencias
npm run dev          # Desarrollo (valida el menú antes de arrancar)
npm run build        # Build de producción (valida el menú)
npm run preview      # Previsualizar el build local
npm run typecheck    # Chequeo de tipos TypeScript
```

## Cómo gestionar los precios (variante futura)

El sistema ya está preparado para precios. Hay dos formas:

1. **Manual:** rellena `"precio"` en `src/data/menu.json` (por ejemplo `"precio": 3.5`) y activa
   `PUBLIC_SHOW_PRICES=true`.
2. **Autogestionada por los dueños (recomendada):** Google Sheets + Apps Script + Deploy Hook de
   Vercel. Los dueños editan solo la columna *Precio* y la web se actualiza sola, sin tocar código.
   Guía: [`docs/GESTION-PRECIOS.md`](docs/GESTION-PRECIOS.md) · Script:
   [`docs/apps-script-precios.gs`](docs/apps-script-precios.gs).

Mientras `PUBLIC_SHOW_PRICES` no sea `true`, **ningún precio se renderiza** aunque existan.

### Fuente de precios en build

- `scripts/fetch-prices.mjs` se ejecuta antes de `dev`, `build` y `typecheck`.
- Si `PRICES_SOURCE_URL` está definida, descarga los precios de la hoja
  (`{ precios: [{ categoria, producto, precio }] }`) y genera `src/data/precios.generated.json`
  (ignorado por git).
- `src/utils/menu.ts` fusiona esos precios por `categoria + producto`.
- Si los precios están activos (`PUBLIC_SHOW_PRICES=true`) y la descarga falla, el build se detiene
  para no publicar precios incompletos.
- La plantilla editable de la hoja se genera con `npm run export:precios`.

Para editar el contenido del menú (categorías, ítems, descripciones) solo hay que modificar
`src/data/menu.json`. El script `validate-menu.mjs` valida la estructura en cada build para
que un error de edición no rompa el sitio.

## Alérgenos

- El objeto `alergenos` de `menu.json` define cada alérgeno con `emoji` y `nombre`.
- Cada ítem lleva `"alergenos": ["gluten", "lacteos", ...]` con las claves válidas, o `[]` si no
  tiene alérgenos destacados (se muestra "Sin alérgenos destacados").
- El validador comprueba que todas las claves de alérgenos existen.

## Despliegue en Vercel

1. Sube este repositorio a GitHub.
2. En Vercel, importa el repositorio (framework: Astro). Todo se detecta automáticamente.
3. Añade la variable de entorno `PUBLIC_SHOW_PRICES=false` (o `true` cuando corresponda).
4. Si usas un dominio propio, define `ASTRO_SITE` con la URL final para el SEO (canonical y Open Graph).
5. Define `PUBLIC_MENU_URL` con la URL pública (es la que codifica el QR de mesas). Si Vercel
   asigna otro subdominio o configuras uno propio, actualiza esta variable y reconstruye.

## QR para las mesas

- `scripts/generate-qr.mjs` genera `public/qr-menu.svg` y `public/qr-menu.png` en cada build
  a partir de `PUBLIC_MENU_URL` (por defecto `https://cafeteria-continental-menu.vercel.app`).
- La página `/qr` muestra una tarjeta imprimible con el QR, la marca y las instrucciones para
  colocarlo en las mesas (no está indexada en buscadores).

## Decisión técnica: mapa de ubicación

Se integró un **embed de Google Maps** (sin API key, carga perezosa y solo cuando llega al
viewport) combinado con botones "Cómo llegar" que abren **Google Maps nativo** en el móvil.
Razones:

- Cero coste y cero claves de API.
- El embed aporta contexto visual sin penalizar el rendimiento (`loading="lazy"`).
- Los enlaces a Google Maps nativo son la mejor experiencia en móvil (es el dispositivo
  principal del público de un menú digital vía QR en mesa).
- Alternativas descartadas: OpenStreetMap (menos pulido en móvil) y mapas estáticos
  (requieren clave de API). Se mantiene también el enlace "Abrir en Google Maps" como
  respaldo si el embed falla.

## Pendientes con los dueños

- Confirmar productos reales, descripciones y horario exacto.
- Recibir el logo oficial y las fotos de los productos (el diseño ya acepta imágenes).
- Valorar versión en inglés (zona turística).
- Luz verde para activar precios.
