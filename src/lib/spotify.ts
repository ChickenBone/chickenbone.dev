import { cookies } from 'next/headers'

export type SpotifyRole = 'source' | 'target'

export type TokenSet = {
  access_token: string
  token_type: string
  expires_in?: number
  scope?: string
  refresh_token?: string
  expires_at: number // epoch seconds
}

// Common paging interfaces
interface Paging<T> {
  items: T[]
  next: string | null
  total: number
}

interface FollowedArtistsResponse {
  artists: Paging<{ id: string; name: string; images: { url: string }[] }>
}

export function getEnv() {
  const clientId = process.env.SPOTIFY_CLIENT_ID
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET
  const redirectUri = process.env.SPOTIFY_REDIRECT_URI
  if (!clientId || !clientSecret || !redirectUri) {
    throw new Error('Missing SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET, or SPOTIFY_REDIRECT_URI')
  }
  return { clientId, clientSecret, redirectUri }
}

const SCOPE_SOURCE = [
  'user-library-read',
  'playlist-read-private',
  'playlist-read-collaborative',
  'user-follow-read',
].join(' ')

const SCOPE_TARGET = [
  'playlist-modify-private',
  'playlist-modify-public',
].join(' ')

export function makeState(role: SpotifyRole) {
  const state = `${role}:${Math.random().toString(36).slice(2)}:${Date.now()}`
  const c = cookies()
  c.set(`spotify_oauth_state_${role}` as any, state, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 600, // 10 min
  })
  return state
}

export function validateState(role: SpotifyRole, state: string | null) {
  if (!state) return false
  const c = cookies()
  const expected = c.get(`spotify_oauth_state_${role}`)
  if (!expected || expected.value !== state) return false
  // clear the one-time state cookie
  c.delete(`spotify_oauth_state_${role}`)
  return true
}

export function getScopeForRole(role: SpotifyRole) {
  return role === 'source' ? SCOPE_SOURCE : SCOPE_TARGET
}

export function getTokenCookieName(role: SpotifyRole) {
  return `spotify_${role}`
}

export function readToken(role: SpotifyRole): TokenSet | null {
  const name = getTokenCookieName(role)
  const c = cookies().get(name)
  if (!c) return null
  try {
    const obj = JSON.parse(c.value) as TokenSet
    return obj
  } catch {
    return null
  }
}

export function saveToken(role: SpotifyRole, token: TokenSet) {
  const name = getTokenCookieName(role)
  cookies().set(name as any, JSON.stringify(token), {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    // 30 days cap; we still refresh when needed
    maxAge: 60 * 60 * 24 * 30,
  })
}

export async function exchangeCodeForToken(code: string) {
  const { clientId, clientSecret, redirectUri } = getEnv()
  const body = new URLSearchParams({
    grant_type: 'authorization_code',
    code,
    redirect_uri: redirectUri,
  })
  const res = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: 'Basic ' + Buffer.from(`${clientId}:${clientSecret}`).toString('base64'),
    },
    body,
    cache: 'no-store',
  })
  if (!res.ok) throw new Error(`Spotify token exchange failed: ${res.status}`)
  const json = await res.json()
  return json as { access_token: string; token_type: string; expires_in: number; refresh_token?: string; scope?: string }
}

export async function refreshAccessToken(refresh_token: string) {
  const { clientId, clientSecret } = getEnv()
  const body = new URLSearchParams({
    grant_type: 'refresh_token',
    refresh_token,
  })
  const res = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: 'Basic ' + Buffer.from(`${clientId}:${clientSecret}`).toString('base64'),
    },
    body,
    cache: 'no-store',
  })
  if (!res.ok) throw new Error(`Spotify token refresh failed: ${res.status}`)
  const json = await res.json()
  return json as { access_token: string; token_type: string; expires_in: number; refresh_token?: string; scope?: string }
}

export async function ensureAccessToken(role: SpotifyRole): Promise<TokenSet> {
  let token = readToken(role)
  if (!token) throw new Response('Not authorized', { status: 401 })
  const now = Math.floor(Date.now() / 1000)
  if (token.expires_at <= now + 30) {
    const refreshed = await refreshAccessToken(token.refresh_token!)
    token = {
      access_token: refreshed.access_token,
      token_type: refreshed.token_type,
      scope: refreshed.scope,
      refresh_token: refreshed.refresh_token || token.refresh_token,
      expires_at: Math.floor(Date.now() / 1000) + (refreshed.expires_in ?? 3600) - 60,
    }
    saveToken(role, token)
  }
  return token
}

export async function spotifyApiFetch<T>(role: SpotifyRole, url: string, init?: RequestInit): Promise<T> {
  const token = await ensureAccessToken(role)
  const res = await fetch(url, {
    ...init,
    headers: {
      ...(init?.headers || {}),
      Authorization: `${token.token_type} ${token.access_token}`,
      'Content-Type': init?.method && init.method !== 'GET' ? 'application/json' : undefined as any,
    },
    cache: 'no-store',
    next: { revalidate: 0 },
  })
  if (!res.ok) {
    const text = await res.text()
    throw new Response(`Spotify API error ${res.status}: ${text}`, { status: res.status })
  }
  if (res.status === 204) return undefined as unknown as T
  return (await res.json()) as T
}

export async function getCurrentUser(role: SpotifyRole) {
  return spotifyApiFetch<{ id: string; display_name: string | null; uri: string; href: string; external_urls: { spotify: string } }>(role, 'https://api.spotify.com/v1/me')
}

export async function getSavedTracksTotal(role: SpotifyRole) {
  const resp = await spotifyApiFetch<Paging<{ added_at: string; track: { uri: string } }>>(role, 'https://api.spotify.com/v1/me/tracks?limit=1')
  return resp.total
}

export async function getAllLikedTrackUris(role: SpotifyRole) {
  const uris: string[] = []
  let url = 'https://api.spotify.com/v1/me/tracks?limit=50'
  // Paginate until done
  while (true) {
    const pageResp = await spotifyApiFetch<Paging<{ added_at: string; track: { uri: string } }>>(role, url)
    for (const it of pageResp.items) {
      if (it.track?.uri) uris.push(it.track.uri)
    }
    if (!pageResp.next) break
    url = pageResp.next
  }
  return uris
}

export async function getAllPlaylists(role: SpotifyRole) {
  const items: Array<{ id: string; name: string; images: { url: string }[]; tracks: { total: number } }> = []
  let url = 'https://api.spotify.com/v1/me/playlists?limit=50'
  while (true) {
    const pageResp = await spotifyApiFetch<Paging<{ id: string; name: string; images: { url: string }[]; tracks: { total: number } }>>(role, url)
    items.push(...pageResp.items)
    if (!pageResp.next) break
    url = pageResp.next
  }
  return items
}

export async function getSavedAlbums(role: SpotifyRole) {
  const items: Array<{ album: { id: string; name: string; images: { url: string }[]; artists: { name: string }[] } }> = []
  let url = 'https://api.spotify.com/v1/me/albums?limit=50'
  while (true) {
    const pageResp = await spotifyApiFetch<Paging<{ album: { id: string; name: string; images: { url: string }[]; artists: { name: string }[] } }>>(role, url)
    items.push(...pageResp.items)
    if (!pageResp.next) break
    url = pageResp.next
  }
  return items
}

export async function getFollowedArtists(role: SpotifyRole) {
  const items: Array<{ id: string; name: string; images: { url: string }[] }> = []
  let url: string | null = 'https://api.spotify.com/v1/me/following?type=artist&limit=50'
  while (url) {
    const pageResp: FollowedArtistsResponse = await spotifyApiFetch<FollowedArtistsResponse>(role, url)
    items.push(...pageResp.artists.items)
    url = pageResp.artists.next
  }
  return items
}

export async function getPlaylistTrackUris(role: SpotifyRole, playlistId: string) {
  const uris: string[] = []
  let url = `https://api.spotify.com/v1/playlists/${encodeURIComponent(playlistId)}/tracks?limit=100`
  while (true) {
    const pageResp = await spotifyApiFetch<Paging<{ track: { uri: string | null } }>>(role, url)
    for (const it of pageResp.items) if (it.track?.uri) uris.push(it.track.uri)
    if (!pageResp.next) break
    url = pageResp.next
  }
  return uris
}

export async function getAlbumTrackUris(role: SpotifyRole, albumId: string) {
  const uris: string[] = []
  let url = `https://api.spotify.com/v1/albums/${encodeURIComponent(albumId)}/tracks?limit=50`
  while (true) {
    const pageResp = await spotifyApiFetch<Paging<{ uri?: string; id: string }>>(role, url)
    for (const it of pageResp.items) {
      if (it.uri) uris.push(it.uri)
    }
    if (!pageResp.next) break
    url = pageResp.next
  }
  return uris
}

export async function getArtistTopTrackUris(role: SpotifyRole, artistId: string, market = 'US') {
  const res = await spotifyApiFetch<{ tracks: Array<{ uri: string }> }>(role, `https://api.spotify.com/v1/artists/${encodeURIComponent(artistId)}/top-tracks?market=${market}`)
  return res.tracks.map(t => t.uri)
}

export async function createPlaylist(role: SpotifyRole, userId: string, name: string, description: string, isPublic: boolean) {
  return spotifyApiFetch<{ id: string; external_urls: { spotify: string } }>(role, `https://api.spotify.com/v1/users/${encodeURIComponent(userId)}/playlists`, {
    method: 'POST',
    body: JSON.stringify({ name, description, public: isPublic }),
  })
}

export async function addTracksInBatches(role: SpotifyRole, playlistId: string, uris: string[]) {
  // Spotify limit is 100 per request
  for (let i = 0; i < uris.length; i += 100) {
    const chunk = uris.slice(i, i + 100)
    await spotifyApiFetch(role, `https://api.spotify.com/v1/playlists/${encodeURIComponent(playlistId)}/tracks`, {
      method: 'POST',
      body: JSON.stringify({ uris: chunk }),
    })
  }
}

// New: safe variant that continues on errors and returns a summary
export type AddTracksResult = {
  requested: number
  added: number
  failures: Array<{ index: number; status: number; message: string }>
}

export async function addTracksInBatchesSafe(
  role: SpotifyRole,
  playlistId: string,
  uris: string[],
  logger?: (line: string) => void,
): Promise<AddTracksResult> {
  const requested = uris.length
  let added = 0
  const failures: AddTracksResult['failures'] = []

  async function tryAddChunk(chunk: string[], startIndex: number) {
    if (chunk.length === 0) return
    try {
      logger?.(`Adding ${chunk.length} tracks [${startIndex + 1}-${startIndex + chunk.length}]…`)
      await spotifyApiFetch(role, `https://api.spotify.com/v1/playlists/${encodeURIComponent(playlistId)}/tracks`, {
        method: 'POST',
        body: JSON.stringify({ uris: chunk }),
      })
      added += chunk.length
      logger?.(`✔ Added ${chunk.length} tracks [${startIndex + 1}-${startIndex + chunk.length}]`)
    } catch (e: any) {
      // If the chunk is size 1, record the failure and continue
      let status = 0
      let message = ''
      if (e instanceof Response) {
        status = e.status
        try { message = await e.text() } catch { message = '' }
      } else {
        message = String(e)
      }
      if (chunk.length === 1) {
        failures.push({ index: Math.floor(startIndex), status, message })
        logger?.(`✖ Failed to add track [${startIndex + 1}]: ${status} ${message}`)
        return
      }
      // Split the chunk and try each half to isolate bad URIs
      const mid = Math.floor(chunk.length / 2)
      const left = chunk.slice(0, mid)
      const right = chunk.slice(mid)
      logger?.(`Retrying by splitting failed batch [${startIndex + 1}-${startIndex + chunk.length}] into [${startIndex + 1}-${startIndex + left.length}] and [${startIndex + left.length + 1}-${startIndex + chunk.length}]`)
      await tryAddChunk(left, startIndex)
      await tryAddChunk(right, startIndex + left.length)
    }
  }

  // Spotify limit is 100 per request; iterate in 100-sized windows
  for (let i = 0; i < uris.length; i += 100) {
    const chunk = uris.slice(i, i + 100)
    await tryAddChunk(chunk, i)
  }

  return { requested, added, failures }
}

// Selection support
export type SelectItem =
  | { type: 'liked' }
  | { type: 'playlist'; id: string }
  | { type: 'album'; id: string }
  | { type: 'artist'; id: string; market?: string }

export async function collectUrisForSelection(role: SpotifyRole, items: SelectItem[]) {
  const all: string[] = []
  for (const it of items) {
    if (it.type === 'liked') {
      all.push(...(await getAllLikedTrackUris(role)))
    } else if (it.type === 'playlist') {
      all.push(...(await getPlaylistTrackUris(role, it.id)))
    } else if (it.type === 'album') {
      all.push(...(await getAlbumTrackUris(role, it.id)))
    } else if (it.type === 'artist') {
      all.push(...(await getArtistTopTrackUris(role, it.id, it.market || 'US')))
    }
  }
  // Filter to valid track URIs only (avoid episodes, local, etc.)
  const trackOnly = all.filter(u => typeof u === 'string' && u.startsWith('spotify:track:'))

  // de-dup URIs preserving order
  const seen = new Set<string>()
  const deduped: string[] = []
  for (const u of trackOnly) {
    if (!seen.has(u)) {
      seen.add(u)
      deduped.push(u)
    }
  }
  return deduped
}
