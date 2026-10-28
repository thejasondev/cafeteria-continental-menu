import { writeFileSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const outPath = resolve(root, 'src/data/precios.generated.json')

try {
  process.loadEnvFile(resolve(root, '.env'))
} catch {
  // .env es opcional
}

const source = process.env.PRICES_SOURCE_URL?.trim()
const mostrarPrecios = process.env.PUBLIC_SHOW_PRICES === 'true'

/** @type {Record<string, number>} */
const mapa = {}

function guardar() {
  writeFileSync(outPath, JSON.stringify(mapa, null, 2) + '\n', 'utf8')
}

const normalizar = (valor) => String(valor ?? '').trim()

if (source) {
  try {
    const respuesta = await fetch(source, { headers: { Accept: 'application/json' } })
    if (!respuesta.ok) throw new Error(`HTTP ${respuesta.status}`)

    const datos = await respuesta.json()
    const filas = Array.isArray(datos) ? datos : datos?.precios
    if (!Array.isArray(filas)) {
      throw new Error('formato inesperado (se esperaba un array o { precios: [] })')
    }

    for (const fila of filas) {
      const categoria = normalizar(fila?.categoria)
      const producto = normalizar(fila?.producto)
      const precio = Number(String(fila?.precio ?? '').replace(',', '.'))
      if (!categoria || !producto) continue
      if (!Number.isFinite(precio) || precio < 0) continue
      mapa[`${categoria}::${producto}`] = Math.round(precio * 100) / 100
    }

    console.log(`Precios cargados desde la hoja: ${Object.keys(mapa).length}`)
    guardar()
  } catch (error) {
    const mensaje = error instanceof Error ? error.message : String(error)
    if (mostrarPrecios) {
      console.error(`No se pudieron cargar los precios (${mensaje}).`)
      console.error('Build detenido para no publicar precios incompletos o desactualizados.')
      process.exit(1)
    }
    console.warn(`No se pudieron cargar los precios (${mensaje}). Se continúa sin precios externos.`)
    guardar()
  }
} else {
  console.log('PRICES_SOURCE_URL no definida: no se cargan precios externos.')
  guardar()
}
