import { readFileSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const file = resolve(root, 'src/data/menu.json')

const menu = JSON.parse(readFileSync(file, 'utf8'))

const errors = []

function requireStr(obj, path, field) {
  if (typeof obj?.[field] !== 'string' || obj[field].trim() === '') {
    errors.push(`${path}.${field} debe ser un texto no vacío`)
  }
}

const establecimiento = menu?.establecimiento
if (!establecimiento) errors.push('Falta "establecimiento"')
else {
  requireStr(establecimiento, 'establecimiento', 'nombre')
  requireStr(establecimiento, 'establecimiento', 'direccion')
  requireStr(establecimiento, 'establecimiento', 'telefono')
  if (!Array.isArray(establecimiento.horario) || establecimiento.horario.length === 0) {
    errors.push('establecimiento.horario debe ser un array no vacío')
  }
}

const categorias = menu?.categorias
if (!Array.isArray(categorias) || categorias.length === 0) {
  errors.push('"categorias" debe ser un array no vacío')
} else {
  const ids = new Set()
  categorias.forEach((cat, ci) => {
    const base = `categorias[${ci}]`
    requireStr(cat, base, 'id')
    requireStr(cat, base, 'nombre')
    requireStr(cat, base, 'icono')
    if (cat.id && ids.has(cat.id)) errors.push(`categorias[${ci}].id duplicado: "${cat.id}"`)
    if (cat.id) ids.add(cat.id)
    if (!Array.isArray(cat.items) || cat.items.length === 0) {
      errors.push(`${base}.items debe ser un array no vacío`)
    } else {
      cat.items.forEach((item, ii) => {
        const itemBase = `${base}.items[${ii}]`
        requireStr(item, itemBase, 'nombre')
        if (item.precio != null && (typeof item.precio !== 'number' || item.precio < 0)) {
          errors.push(`${itemBase}.precio debe ser un número ≥ 0 o null`)
        }
        if (item.destacado != null && typeof item.destacado !== 'boolean') {
          errors.push(`${itemBase}.destacado debe ser true/false`)
        }
      })
    }
  })
}

if (errors.length > 0) {
  console.error('\n❌ El menú no es válido. Corrige src/data/menu.json:\n')
  errors.forEach((e) => console.error(`  - ${e}`))
  process.exit(1)
}

console.log(`✅ Menú válido: ${categorias.length} categorías, ${categorias.reduce((n, c) => n + c.items.length, 0)} ítems.`)
