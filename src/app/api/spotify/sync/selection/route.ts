import { collectUrisForSelection, createPlaylist, addTracksInBatchesSafe, getCurrentUser, type SelectItem } from '@/lib/spotify'

export const dynamic = 'force-dynamic'

function chunk<T>(arr: T[], size: number): T[][] {
  const out: T[][] = []
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size))
  return out
}

export async function POST(req: Request) {
  const encoder = new TextEncoder()

  let body: { name?: string; public?: boolean; items?: SelectItem[] }
  try {
    body = (await req.json().catch(() => ({}))) as { name?: string; public?: boolean; items?: SelectItem[] }
  } catch {
    return new Response('Bad JSON', { status: 400 })
  }

  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      const write = (line: string) => controller.enqueue(encoder.encode(line + '\n'))

      try {
        const items = body.items || []
        if (items.length === 0) {
          write('No items selected')
          controller.close()
          return
        }

        write('Starting sync...')
        const sourceUser = await getCurrentUser('source')
        const targetUser = await getCurrentUser('target')

        const uris = await collectUrisForSelection('source', items)
        write(`Collected ${uris.length} unique track URIs`) 

        const baseName = body.name || `Sync — ${new Date().toISOString().slice(0, 10)}`
        const descriptionBase = `Cloned from ${sourceUser.display_name || sourceUser.id} on ${new Date().toLocaleString()}`

        const MAX_PER_PLAYLIST = 1969
        const chunks = chunk(uris, MAX_PER_PLAYLIST)
        write(`Preparing to create ${chunks.length} playlist(s) with up to ${MAX_PER_PLAYLIST} tracks each`)

        let totalRequested = uris.length
        let totalAdded = 0
        let totalFailures = 0
        let playlistsCreated = 0

        for (let idx = 0; idx < chunks.length; idx++) {
          const chunkUris = chunks[idx]
          const suffix = chunks.length > 1 ? ` (${idx + 1}/${chunks.length})` : ''
          const playlistName = `${baseName}${suffix}`
          write(`Creating playlist: ${playlistName} with ${chunkUris.length} tracks`)
          try {
            const created = await createPlaylist('target', targetUser.id, playlistName, `${descriptionBase} — part ${idx + 1}`, !!body.public)
            write(`✔ Created: ${created.id}`)
            const res = await addTracksInBatchesSafe('target', created.id, chunkUris, (line) => write(line))
            write(`Summary: requested=${res.requested}, added=${res.added}, failures=${res.failures.length}`)
            write(`Playlist URL: ${created.external_urls.spotify}`)
            totalAdded += res.added
            totalFailures += res.failures.length
            playlistsCreated++
          } catch (e: any) {
            const message = e instanceof Response ? await e.text() : String(e)
            write(`✖ Failed creating or filling playlist part ${idx + 1}: ${message}`)
            // continue next chunk
          }
        }

        write(`Done. requested=${totalRequested}, added=${totalAdded}, failures=${totalFailures}, playlists_created=${playlistsCreated}`)
      } catch (e: any) {
        const status = e instanceof Response ? e.status : 500
        const message = e instanceof Response ? await e.text() : String(e)
        write(`Error (${status}): ${message}`)
      } finally {
        controller.close()
      }
    },
  })

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'no-cache, no-transform',
      'X-Accel-Buffering': 'no',
    },
  })
}
