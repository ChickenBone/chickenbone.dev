"use client"

import * as React from "react"
import AppButton from '@/components/ui/AppButton'
import { Card as AtomCard } from '@/components/spotify/atoms'

export interface CreatePlaylistCardProps {
  name: string
  setName: (v: string) => void
  isPublic: boolean
  setIsPublic: (v: boolean) => void
  selectedCount: number
  connected: boolean
  busy: boolean
  onSync: () => Promise<void> | void
}

export function CreatePlaylistCard({ name, setName, isPublic, setIsPublic, selectedCount, connected, busy, onSync }: CreatePlaylistCardProps) {
  return (
    <AtomCard>
      <h2 className="text-lg font-semibold mb-3 text-zinc-900 dark:text-zinc-100">Create playlist</h2>
      <div className="space-y-3">
        <div>
          <label htmlFor="playlist-name" className="block text-xs mb-1 text-zinc-600 dark:text-zinc-400">Name</label>
          <input
            id="playlist-name"
            className="w-full rounded-md border border-zinc-300 dark:border-zinc-700 bg-white/90 dark:bg-zinc-900/60 px-3 py-2 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/50"
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="My Sync Playlist"
          />
        </div>
        <div className="flex items-center gap-2">
          <input id="public" type="checkbox" className="h-4 w-4 accent-emerald-600 dark:accent-emerald-400" checked={isPublic} onChange={e => setIsPublic(e.target.checked)} />
          <label htmlFor="public" className="text-sm text-zinc-800 dark:text-zinc-200">Public playlist</label>
        </div>
        <div className="text-xs text-zinc-600 dark:text-zinc-400">
          Selected items: {selectedCount}
        </div>
        <AppButton onClick={onSync} disabled={busy || !connected || selectedCount === 0} aria-disabled={busy || !connected || selectedCount === 0} className="w-full justify-center">
          {busy ? 'Syncing…' : 'Sync selection → New playlist'}
        </AppButton>
      </div>
    </AtomCard>
  )
}
