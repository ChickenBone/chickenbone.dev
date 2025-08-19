import { NextResponse } from 'next/server'
import { exchangeCodeForToken, getEnv, saveToken, validateState, type SpotifyRole } from '@/lib/spotify'

export async function GET(req: Request) {
  const url = new URL(req.url)
  const code = url.searchParams.get('code')
  const state = url.searchParams.get('state')
  // State encodes the role at start: role:random:ts
  const role = (state?.split(':')[0] ?? 'source') as SpotifyRole

  if (!code || !state || !validateState(role, state)) {
    return new NextResponse('Invalid state', { status: 400 })
  }

  try {
    const token = await exchangeCodeForToken(code)
    const expires_at = Math.floor(Date.now() / 1000) + (token.expires_in ?? 3600) - 60

    saveToken(role, {
      access_token: token.access_token,
      token_type: token.token_type,
      scope: token.scope,
      refresh_token: token.refresh_token,
      expires_at,
    })

    // Redirect back to UI page
    const { redirectUri } = getEnv()
    const ui = new URL(redirectUri)
    // Go to /spotify manager page
    ui.pathname = '/spotify'
    ui.search = ''
    return NextResponse.redirect(ui.toString())
  } catch (e) {
    return new NextResponse('Token exchange failed', { status: 500 })
  }
}
