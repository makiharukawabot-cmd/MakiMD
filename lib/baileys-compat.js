// Capa de compatibilidad Baileys 6.x -> 7.x (ESM puro).
import * as B from '@whiskeysockets/baileys'
import fs from 'fs'
import path from 'path'
import { fileURLToPath, pathToFileURL } from 'url'

const makeWASocket = B.default ?? B.makeWASocket

// `proto` puede no estar exportado en el indice de v7: se busca en varios sitios
async function loadProto() {
  const direct = B.proto ?? B.WAProto?.proto ?? B.WAProto ?? B.default?.proto
  if (direct?.WebMessageInfo) return direct
  try {
    const entry = fileURLToPath(import.meta.resolve('@whiskeysockets/baileys'))
    let dir = path.dirname(entry)
    for (let i = 0; i < 4; i++) {
      for (const rel of ['WAProto/index.js', 'WAProto/index.cjs', 'WAProto/index.mjs']) {
        const f = path.join(dir, rel)
        if (!fs.existsSync(f)) continue
        const m = await import(pathToFileURL(f).href)
        const pr = m.proto ?? m.default?.proto ?? m.default
        if (pr?.WebMessageInfo) return pr
      }
      dir = path.dirname(dir)
    }
  } catch (e) { console.error('[baileys-compat] no se pudo cargar proto:', e.message) }
  return direct
}
const proto = await loadProto()

const compat = {
  ...B,
  proto,
  default: makeWASocket,
  makeWASocket,
  isJidUser: B.isJidUser ?? B.isPnUser,
  makeInMemoryStore: B.makeInMemoryStore,
  makeWALegacySocket: B.makeWALegacySocket,
}

export * from '@whiskeysockets/baileys'
export { makeWASocket, proto }
export default compat