import QRCode from 'qrcode'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')

const URL = process.env.PUBLIC_MENU_URL || 'https://cafeteria-continental-menu.vercel.app'

const outSvg = resolve(root, 'public/qr-menu.svg')
const outPng = resolve(root, 'public/qr-menu.png')

await QRCode.toFile(outSvg, URL, { type: 'svg', margin: 1, width: 640, color: { dark: '#2C1A12', light: '#FFFFFF' } })
await QRCode.toFile(outPng, URL, { type: 'png', margin: 1, width: 640, color: { dark: '#2C1A12', light: '#FFFFFF' } })

console.log(`✅ QR generado para ${URL}`)
