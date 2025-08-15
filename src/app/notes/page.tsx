import Link from 'next/link'
import fs from 'node:fs'
import path from 'node:path'

const contentRoot = path.join(process.cwd(), 'src/data/notes')

function listNotes(): { slug: string[]; path: string }[] {
  const items: { slug: string[]; path: string }[] = []
  function walk(current: string, parts: string[] = []) {
    const entries = fs.readdirSync(current, { withFileTypes: true })
    let hasIndex = false
    for (const e of entries) {
      if (e.isFile() && e.name === 'index.md') hasIndex = true
    }
    if (hasIndex) items.push({ slug: parts, path: '/' + parts.join('/') })
    for (const e of entries) {
      if (e.isDirectory()) walk(path.join(current, e.name), [...parts, e.name])
    }
  }
  if (fs.existsSync(contentRoot)) walk(contentRoot)
  return items
}

export default function NotesIndex() {
  const notes = listNotes()
  return (
    <main className="max-w-3xl mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Notes</h1>
      <ul className="list-disc pl-6">
        {notes.map((n) => (
          <li key={n.slug.join('/')}> 
            <Link href={`/notes${n.path}`}>{n.slug[n.slug.length - 1] || 'index'}</Link>
          </li>
        ))}
      </ul>
    </main>
  )
}
