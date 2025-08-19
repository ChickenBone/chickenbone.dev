"use client"

import * as React from "react"
import { Card as AtomCard } from '@/components/spotify/atoms'

export interface StatusCardProps {
  status: { source: boolean; target: boolean; sourceUser?: any; targetUser?: any } | null
  dataScopes?: string
  showScopesHint: boolean
}

export function StatusCard({ status, dataScopes, showScopesHint }: StatusCardProps) {
  const Pill = ({ ok, label }: { ok: boolean; label: string }) => (
    <span className={`inline-flex items-center gap-2 px-2.5 py-1 rounded-full text-xs font-medium ring-1 ring-inset ${
      ok
        ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300 ring-emerald-500/20'
        : 'bg-rose-50 dark:bg-rose-900/20 text-rose-700 dark:text-rose-300 ring-rose-500/20'
    }`}>
      <span className={`h-1.5 w-1.5 rounded-full ${ok ? 'bg-emerald-500' : 'bg-rose-500'}`} />
      {label}
    </span>
  )

  return (
    <AtomCard className="mb-6">
      <div className="flex flex-wrap items-center gap-3">
        <div className="text-sm flex items-center gap-2">
          <span className="text-zinc-700 dark:text-zinc-200">Source</span>
          <Pill ok={!!status?.source} label={status?.source ? `Connected (${status?.sourceUser?.name || status?.sourceUser?.id || 'user'})` : 'Not connected'} />
        </div>
        <div className="text-sm flex items-center gap-2">
          <span className="text-zinc-700 dark:text-zinc-200">Target</span>
          <Pill ok={!!status?.target} label={status?.target ? `Connected (${status?.targetUser?.name || status?.targetUser?.id || 'user'})` : 'Not connected'} />
        </div>
        {dataScopes && (
          <div className="text-xs text-zinc-500 dark:text-zinc-400">Scopes: {dataScopes}</div>
        )}
      </div>
      {showScopesHint && (
        <div className="mt-2 text-xs text-amber-700 dark:text-amber-300">No items returned. If this looks wrong, click Connect Source again to grant playlist-read-private, playlist-read-collaborative, user-library-read, and user-follow-read scopes.</div>
      )}
    </AtomCard>
  )
}
