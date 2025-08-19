import { NextResponse } from 'next/server'
import { getEnv, getScopeForRole, makeState, type SpotifyRole } from '@/lib/spotify'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const roleParam = (searchParams.get('role') || 'source') as SpotifyRole
  const role: SpotifyRole = roleParam === 'target' ? 'target' : 'source'
  const { clientId, redirectUri } = getEnv()
  const state = makeState(role)
  const scope = getScopeForRole(role)
  const authUrl = new URL('https://accounts.spotify.com/authorize')
  authUrl.searchParams.set('client_id', clientId)
  authUrl.searchParams.set('response_type', 'code')
  authUrl.searchParams.set('redirect_uri', redirectUri)
  authUrl.searchParams.set('scope', scope)
  authUrl.searchParams.set('state', state)
  authUrl.searchParams.set('show_dialog', 'true')
  return NextResponse.redirect(authUrl.toString())
}
