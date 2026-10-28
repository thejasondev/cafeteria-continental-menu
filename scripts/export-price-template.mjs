import { readFileSync, writeFileSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const menu = JSON.parse(readFileSync(resolve(root, 'src/data/menu.json'), 'utf8'))

const celda = (valor) => {
  const texto = String(valor ?? '')
  return /[",\n\r]/.test(texto) ? `"${texto.replace(/"/g, '""')}"` : texto
}

const filas = [['Categoria', 'Producto', 'Precio']]
for (const categoria of menu.categorias) {
  for (const item of categoria.items) {
    filas.push([categoria.nombre, item.nombre, ''])
  }
}

const csv = filas.map((fila) => fila.map(celda).join(',')).join('\r\n') + '\r\n'
writeFileSync(resolve(root, 'docs/precios-template.csv'), csv, 'utf8')
console.log(`Plantilla de precios creada: ${filas.length - 1} productos`)
