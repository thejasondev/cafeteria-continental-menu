import menu from '../data/menu.json'
import preciosGenerados from '../data/precios.generated.json'
import { SHOW_PRICES } from './config'

export interface Alergeno {
  emoji: string
  nombre: string
}

export interface MenuItem {
  nombre: string
  descripcion?: string
  detalle?: string
  precio?: number | null
  destacado?: boolean
  alergenos?: string[]
}

export interface MenuCategory {
  id: string
  nombre: string
  icono: string
  descripcion?: string
  porcion?: string
  items: MenuItem[]
}

export interface Establecimiento {
  nombre: string
  eslogan?: string
  direccion: string
  telefono: string
  horario: string[]
  notaHorario?: string
}

export interface MenuData {
  alergenos: Record<string, Alergeno>
  establecimiento: Establecimiento
  categorias: MenuCategory[]
}

export const data = menu as unknown as MenuData

export const { establecimiento, alergenos } = data

const preciosExternos = preciosGenerados as Record<string, number>

export const categorias: MenuCategory[] = data.categorias.map((categoria) => ({
  ...categoria,
  items: categoria.items.map((item) => {
    const precio = preciosExternos[`${categoria.nombre}::${item.nombre}`]
    return precio != null ? { ...item, precio } : item
  }),
}))

export const alergenosList = Object.entries(alergenos).map(([clave, valor]) => ({
  clave,
  ...valor,
}))

const TELEFONO_ENLACE = establecimiento.telefono.replace(/[^\d+]/g, '')

export const telHref = `tel:${TELEFONO_ENLACE}`

const destinoMapas = encodeURIComponent(
  `${establecimiento.nombre}, ${establecimiento.direccion}`
)

export const mapsDirectionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${destinoMapas}`

export const mapsEmbedUrl = `https://www.google.com/maps?q=${destinoMapas}&output=embed&z=16`

export const mapsOpenUrl = `https://www.google.com/maps/search/?api=1&query=${destinoMapas}`

export const formatearPrecio = (precio: number | null | undefined): string | null => {
  if (!SHOW_PRICES || precio == null) return null
  return `${precio.toFixed(2).replace('.', ',')} €`
}

export const obtenerAlergenos = (item: MenuItem) =>
  (item.alergenos ?? []).map((clave) => ({
    clave,
    ...(alergenos[clave] ?? { emoji: '?', nombre: clave }),
  }))
