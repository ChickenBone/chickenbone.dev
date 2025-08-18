import Link from 'next/link'
import fs from 'node:fs'
import path from 'node:path'
import portfolio from '@/data/portfolio'

export const metadata = {
  title: `${portfolio.fullName} Notes`,
  description: portfolio.ogDescription,
}

const contentRoot = path.join(process.cwd(), 'src/data/notes')

function readMarkdown(filePath: string) {
  return fs.readFileSync(filePath, 'utf8')
}

function extractTitleAndExcerpt(md: string): { title?: string; excerpt?: string } {
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

function listNotes(): { slug: string[]; path: string; title: string; excerpt: string }[] {
  const items: { slug: string[]; path: string; title: string; excerpt: string }[] = []
  function walk(current: string, parts: string[] = []) {
    const entries = fs.readdirSync(current, { withFileTypes: true })
    let hasIndex = false
    for (const e of entries) {
      if (e.isFile() && e.name === 'index.md') hasIndex = true
    }
    if (hasIndex) {
      const mdPath = path.join(current, 'index.md')
      const md = readMarkdown(mdPath)
      const { title, excerpt } = extractTitleAndExcerpt(md)
      items.push({
        slug: parts,
        path: '/' + parts.join('/'),
        title: title || (parts[parts.length - 1] || 'index'),
        excerpt: excerpt || '',
      })
    }
    for (const e of entries) {
      if (e.isDirectory()) walk(path.join(current, e.name), [...parts, e.name])
    }
  }
  if (fs.existsSync(contentRoot)) walk(contentRoot)
  return items.sort((a, b) => a.path.localeCompare(b.path))
}

export default function NotesIndex() {
  const notes = listNotes()
  return (
    <main className="max-w-6xl mx-auto px-4 sm:px-6 py-10 lg:py-14">
      <div className="mb-6 sm:mb-8">
        <h1 className="sr-only">{portfolio.fullName} Notes</h1>
        <div className="rounded-[40px] border border-zinc-200/60 dark:border-white/10 p-6 backdrop-blur-2xl bg-white/70 dark:bg-zinc-900/40 shadow-lg shadow-black/5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold tracking-wide text-zinc-500 dark:text-zinc-400 uppercase">Notes</p>
              <p className="text-sm text-zinc-600 dark:text-zinc-300">A collection of personal notes and research.</p>
            </div>
          </div>
        </div>
      </div>

      <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {notes.map((n) => (
          <li key={n.slug.join('/')}
              className="group rounded-3xl border border-zinc-200/60 dark:border-white/10 p-5 backdrop-blur-2xl bg-white/70 dark:bg-zinc-900/40 shadow-md shadow-black/5 hover:shadow-lg transition-shadow">
            <Link href={`/notes${n.path}`} className="block focus:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400/50 dark:focus-visible:ring-white/30 rounded-2xl">
              <h2 className="text-lg font-semibold text-zinc-900 dark:text-white mb-1 group-hover:underline">
                {n.title}
              </h2>
              {n.excerpt && (
                <p className="text-sm text-zinc-600 dark:text-zinc-300 line-clamp-3">{n.excerpt}</p>
              )}
            </Link>
          </li>
        ))}
        {notes.length === 0 && (
          <li className="text-zinc-600 dark:text-zinc-300">No notes found.</li>
        )}
      </ul>
    </main>
  )
}
