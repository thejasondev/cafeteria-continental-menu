# Gestión de precios sin conocimientos técnicos

Este documento explica cómo los dueños pueden **actualizar los precios por sí mismos** sin tocar
código, git ni la web, usando una hoja de cálculo de Google. El sitio se actualiza solo.

## Cómo funciona (resumen)

```text
Hoja de Google (dueños editan el precio)
        │  (al editar, un activador de Google Apps Script avisa a Vercel)
        ▼
Vercel lanza un nuevo build
        │  (el build lee los precios desde la hoja con un token)
        ▼
Web publicada con los precios nuevos (≈ 1 minuto)
```

- Todo con recursos **gratuitos**: Google Sheets + Google Apps Script + Vercel.
- La hoja puede ser **privada** (solo la comparten contigo); la web nunca la expone.
- Mientras `PUBLIC_SHOW_PRICES=false`, los precios se cargan pero **no se muestran**.

---

## Para los dueños (uso diario)

1. Abre la hoja **"Precios Continental"** en tu móvil u ordenador (Google Sheets).
2. Busca el producto y escribe el precio en la columna **Precio** (solo números, por ejemplo `3,50`).
3. Espera **un minuto**. La web se actualiza sola. No tienes que hacer nada más.

> **Importante:** no cambies las columnas *Categoria* ni *Producto*, ni el orden de las filas.
> Solo se edita la columna **Precio**. Si necesitas añadir o quitar productos, avisa al responsable
> técnico (eso sí requiere tocar el menú).

---

## Para el responsable técnico (configuración única)

### 1. Crear la hoja de precios

1. Crea una hoja de cálculo nueva en <https://sheets.new> llamada **"Precios Continental"**.
2. Importa el archivo **`docs/precios-iniciales.csv`** (ya trae los 71 productos con precios de
   ejemplo para probar):
   - Descárgalo desde
     <https://github.com/thejasondev/cafeteria-continental-menu/blob/main/docs/precios-iniciales.csv>
     (botón **Download** / **Descargar**).
   - En Google Sheets: **Archivo > Importar > Subir** y selecciona el archivo.
   - Elige **Reemplazar hoja de cálculo**.
3. Sustituye los precios de ejemplo por los reales cuando los dueños den luz verde.
4. Comparte la hoja con los dueños (botón **Compartir**, permiso **Editor**). Recomendado: por
   correo con sus cuentas de Google. Alternativa: enlace con permiso de edición (menos seguro).

> `docs/precios-template.csv` es la plantilla **vacía** que se regenera con `npm run export:precios`
> cuando cambia la lista de productos. Para la primera puesta en marcha usa `precios-iniciales.csv`.

### 2. Pegar el Apps Script

1. En la hoja: **Extensiones > Apps Script**.
2. Borra el contenido y pega el de `docs/apps-script-precios.gs`.
3. Guarda el proyecto con un nombre, por ejemplo `Puente precios`.

### 3. Configurar las propiedades del script

En Apps Script: **Configuración del proyecto > Propiedades del script > Añadir propiedad**.

| Propiedad | Valor |
| --- | --- |
| `TOKEN` | Una cadena larga y aleatoria (por ejemplo 40+ caracteres). Guárdala. |
| `SHEET_ID` | El ID de la hoja: en su URL, lo que va entre `/d/` y `/edit`. |
| `DEPLOY_HOOK` | La URL del *Deploy Hook* de Vercel (paso 5). |

### 4. Publicar como aplicación web

1. **Implementar > Nueva implementación > Aplicación web**.
2. **Ejecutar como:** *Yo*.
3. **Quién tiene acceso:** *Cualquier persona* (el acceso real queda protegido por `TOKEN`).
4. Copia la **URL de la aplicación web**. A esa URL se le añadirá `?token=TU_TOKEN`.

### 5. Crear el Deploy Hook en Vercel

1. En el proyecto de Vercel: **Settings > Git > Deploy Hooks**.
2. Crea uno, por ejemplo nombre `precios-automaticos`, rama `main`.
3. Copia la URL generada y pégala en la propiedad `DEPLOY_HOOK` del Apps Script (paso 3).

### 6. Crear el activador instalable (para que el deploy sea automático)

1. En Apps Script: **Activadores** (icono del reloj) **> Añadir activador**.
2. Función: **alEditar**. Evento: **Al editar**. Guarda y autoriza los permisos.

> El activador debe ser **instalable** (no el `onEdit` simple) porque necesita llamar a Vercel.

### 7. Configurar Vercel

En **Settings > Environment Variables** del proyecto:

| Variable | Valor |
| --- | --- |
| `PRICES_SOURCE_URL` | `URL_DEL_APPS_SCRIPT?token=TU_TOKEN` |
| `PUBLIC_SHOW_PRICES` | `false` hasta que los dueños den luz verde |
| `PUBLIC_MENU_URL` | URL pública del menú |

`PRICES_SOURCE_URL` es **secreta** (sin prefijo `PUBLIC`) y solo se usa durante el build.

---

## Activar la visualización de precios

Cuando los dueños aprueben mostrar precios:

1. En Vercel, cambia `PUBLIC_SHOW_PRICES` a `true`.
2. Vuelve a desplegar (o haz un pequeño cambio en la hoja para lanzar el deploy automático).

Desde ese momento, cada edición de precio en la hoja se publicará sola en la web.

---

## Seguridad y buenas prácticas

- La hoja permanece **privada**; la web obtiene los datos con un token, no con un enlace público.
- No expongas `PRICES_SOURCE_URL` en el navegador ni en el repositorio (es una variable de build).
- Si el token se filtra, genera uno nuevo en propiedades del script y actualiza la variable en Vercel.
- Si el build **no puede leer la hoja** y los precios están activados (`PUBLIC_SHOW_PRICES=true`),
  el build **se detiene** para no publicar precios incompletos o desactualizados.
- Si los precios están desactivados, un fallo de lectura solo genera un aviso y el sitio se publica igual.

## Mantenimiento

Si cambia la lista de productos (añadir/quitar platos), regenera la plantilla desde el menú y vuelve a
importarla en la hoja:

```bash
npm run export:precios
```

Luego, en Google Sheets, importa de nuevo `docs/precios-template.csv` **en una hoja nueva** y copia
allí los precios ya rellenados (o revisa la hoja antes de reemplazar para no perder datos).
