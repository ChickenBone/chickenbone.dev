import { NextResponse } from 'next/server'
import { readToken, getCurrentUser } from '@/lib/spotify'

export const dynamic = 'force-dynamic'

export async function GET() {
  const source = !!readToken('source')
  const target = !!readToken('target')
  let srcUser: any = null
  let tgtUser: any = null
  try { if (source) srcUser = await getCurrentUser('source') } catch {}
  try { if (target) tgtUser = await getCurrentUser('target') } catch {}
  return NextResponse.json({
    source, target,
    sourceUser: srcUser ? { id: srcUser.id, name: srcUser.display_name } : null,
    targetUser: tgtUser ? { id: tgtUser.id, name: tgtUser.display_name } : null,
  })
}
