import { NextResponse } from 'next/server'
import { getAllPlaylists, getSavedAlbums, getFollowedArtists, getSavedTracksTotal, readToken } from '@/lib/spotify'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const token = readToken('source')
    const scopes = token?.scope || ''

    const [playlists, albums, artists, likedTotal] = await Promise.all([
      getAllPlaylists('source'),
      getSavedAlbums('source'),
      getFollowedArtists('source'),
      getSavedTracksTotal('source'),
    ])

    return NextResponse.json({
      playlists: playlists.map(p => ({ id: p.id, name: p.name, image: p.images?.[0]?.url || null, tracks: p.tracks.total })),
      albums: albums.map(a => ({ id: a.album.id, name: a.album.name, image: a.album.images?.[0]?.url || null, artists: a.album.artists.map(ar => ar.name).join(', ') })),
      artists: artists.map(ar => ({ id: ar.id, name: ar.name, image: ar.images?.[0]?.url || null })),
      liked: { count: likedTotal },
      scopes,
    })
  } catch (e: any) {
    const status = e instanceof Response ? e.status : 500
    const message = e instanceof Response ? await e.text() : String(e)
    return new NextResponse(message, { status })
  }
}
