import menu from '../data/menu.json'
import { SHOW_PRICES } from './config'

export interface MenuItem {
  nombre: string
  descripcion?: string
  detalle?: string
  precio?: number | null
  destacado?: boolean
}

export interface MenuCategory {
  id: string
  nombre: string
  icono: string
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
  establecimiento: Establecimiento
  categorias: MenuCategory[]
}

export const data = menu as unknown as MenuData

export const { establecimiento } = data
export const categorias = data.categorias

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
