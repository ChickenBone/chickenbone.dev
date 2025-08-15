import portfolio from '@/data/portfolio'
import fs from 'node:fs'
import path from 'node:path'
import staticRoutes from '@/data/routes'

const notesRoot = path.join(process.cwd(), 'src/data/notes')

function listNotePaths(): string[] {
  const items: string[] = []
  if (!fs.existsSync(notesRoot)) return items
  function walk(current: string, parts: string[] = []) {
    const entries = fs.readdirSync(current, { withFileTypes: true })
    let hasIndex = false
    for (const e of entries) {
      if (e.isFile() && e.name === 'index.md') hasIndex = true
    }
    if (hasIndex) items.push('/notes/' + parts.join('/'))
    for (const e of entries) {
      if (e.isDirectory()) walk(path.join(current, e.name), [...parts, e.name])
    }
  }
  walk(notesRoot)
  return items
}

export default async function sitemap() {
  const staticPaths = staticRoutes.map((p) => ({ url: `${portfolio.publicUrl}${p}` }))
  const notePaths = listNotePaths().map((p) => ({ url: `${portfolio.publicUrl}${p}` }))
  return [...staticPaths, ...notePaths]
}
