import fs from 'node:fs'
import path from 'node:path'
import { NextResponse } from 'next/server'

const contentRoot = path.join(process.cwd(), 'src/data/notes')

function extractTitleAndExcerpt(md: string): { title?: string; excerpt?: string } {
  // Strip front matter
  let body = md
  if (md.startsWith('---')) {
    const end = md.indexOf('\n---', 3)
    if (end !== -1) body = md.slice(end + 4)
  }
  const lines = body.split(/\r?\n/)
  let title: string | undefined
  let excerpt: string | undefined
  let inCode = false
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    if (/^```/.test(line)) inCode = !inCode
    if (!title && /^#\s+/.test(line)) title = line.replace(/^#\s+/, '').trim()
    if (!excerpt && !inCode && line.trim() && !/^#{1,6}\s+/.test(line)) {
      excerpt = line.trim()
    }
    if (title && excerpt) break
  }
  return { title, excerpt }
}

function listNotes() {
  const items: { slug: string[]; href: string; title: string; excerpt: string }[] = []
  const walk = (current: string, parts: string[] = []) => {
    if (!fs.existsSync(current)) return
    const entries = fs.readdirSync(current, { withFileTypes: true })
    let hasIndex = false
    for (const e of entries) if (e.isFile() && e.name === 'index.md') hasIndex = true
    if (hasIndex) {
      const file = path.join(current, 'index.md')
      try {
        const raw = fs.readFileSync(file, 'utf8')
        const { title, excerpt } = extractTitleAndExcerpt(raw)
        const href = '/notes/' + parts.join('/')
        const displayTitle = title || (parts[parts.length - 1] || 'index')
        items.push({ slug: parts, href, title: displayTitle, excerpt: excerpt || '' })
      } catch {
        // ignore read errors
      }
    }
    for (const e of entries) if (e.isDirectory()) walk(path.join(current, e.name), [...parts, e.name])
  }
  walk(contentRoot)
  return items
}

export async function GET() {
  const items = listNotes()
  // Sort by path for determinism; no dates available
  items.sort((a, b) => a.href.localeCompare(b.href))
  return NextResponse.json({ notes: items })
}
