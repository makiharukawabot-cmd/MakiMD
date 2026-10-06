// Capa de compatibilidad Baileys 6.x -> 7.x (ESM puro).
// En v7 el `default` es solo makeWASocket; el bot (2025) esperaba un objeto con todo
// (`(await import('@whiskeysockets/baileys')).default.proto`, etc.).
// Aqui reconstruimos ese objeto para no tocar los ~70 usos en plugins.
import * as B from '@whiskeysockets/baileys'

const makeWASocket = B.default ?? B.makeWASocket

const compat = {
  ...B,
  default: makeWASocket,
  makeWASocket,
  // Utilidades que v7 elimino o renombro
  isJidUser: B.isJidUser ?? B.isPnUser,
  // makeInMemoryStore ya no existe en v7 (el bot usa lib/store.js propio)
  makeInMemoryStore: B.makeInMemoryStore,
  // makeWALegacySocket ya no existe; se deja undefined a proposito
  makeWALegacySocket: B.makeWALegacySocket,
}

export * from '@whiskeysockets/baileys'
export { makeWASocket }
export default compat
