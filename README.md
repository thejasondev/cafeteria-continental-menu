# Cafetería Continental — Menú Digital

Sitio web estático y gratuito (Astro + Tailwind CSS) con el menú de **Cafetería Continental**
(C. El Bernegal 1, El Matorral, Puerto del Rosario, Fuerteventura).

**Estado actual:** versión pública SIN precios, a la espera de la luz verde de los dueños.

## Características

- 100% estático y ultrarrápido (cero JavaScript en el cliente salvo el scrollspy).
- Menú sin precios por decisión de los dueños; soporte de precios ya integrado y desactivado.
- Hero con imagen optimizada en WebP.
- Mapa integrado (embed de Google Maps con carga perezosa) + enlaces "Cómo llegar" que abren Google Maps nativo.
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

El sistema ya está preparado para precios. Cuando los dueños den luz verde:

1. En `src/data/menu.json`, rellena el campo `"precio"` de cada ítem, por ejemplo `"precio": 3.5`.
2. Activa los precios en el entorno de despliegue con `PUBLIC_SHOW_PRICES=true`.
3. Redespliega (en Vercel se hace solo al hacer push). El precio aparece con estilo de carta.

Mientras `PUBLIC_SHOW_PRICES` no sea `true`, **ningún precio se renderiza** aunque existan en el JSON.

Para editar el contenido del menú (categorías, ítems, descripciones) solo hay que modificar
`src/data/menu.json`. El script `validate-menu.mjs` valida la estructura en cada build para
que un error de edición no rompa el sitio.

## Despliegue en Vercel

1. Sube este repositorio a GitHub.
2. En Vercel, importa el repositorio (framework: Astro). Todo se detecta automáticamente.
3. Añade la variable de entorno `PUBLIC_SHOW_PRICES=false` (o `true` cuando corresponda).
4. Si usas un dominio propio, define `ASTRO_SITE` con la URL final para el SEO (canonical y Open Graph).

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
