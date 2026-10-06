import fs from 'fs'
import path from 'path'

let n = 0
function walk(dir) {
  for (const f of fs.readdirSync(dir, { withFileTypes: true })) {
    if (f.name === 'node_modules' || f.name === 'Session' || f.name.startsWith('.git')) continue
    const p = path.join(dir, f.name)
    if (f.isDirectory()) { walk(p); continue }
    if (!p.endsWith('.js') || p.endsWith('baileys-compat.js') || p.endsWith('actualizar-imports.js')) continue
    const s = fs.readFileSync(p, 'utf8')
    const t = s.replaceAll('@whiskeysockets/baileys', '#baileys').replaceAll('@adiwajshing/baileys', '#baileys')
    if (t !== s) { fs.writeFileSync(p, t); n++ }
  }
}
walk('.')
console.log(`Listo: ${n} archivos actualizados`)