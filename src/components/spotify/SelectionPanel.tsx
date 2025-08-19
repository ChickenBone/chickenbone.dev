"use client"

import * as React from "react"
import { Card as AtomCard, Button as AtomButton } from '@/components/spotify/atoms'
import { PlaylistCard, type PlaylistItem } from '@/components/spotify/PlaylistCard'
import { AlbumCard, type AlbumItem } from '@/components/spotify/AlbumCard'
import { ArtistCard, type ArtistItem } from '@/components/spotify/ArtistCard'

export interface SelectionPanelProps {
  data: { playlists: PlaylistItem[]; albums: AlbumItem[]; artists: ArtistItem[]; liked: { count: number } } | null
  loading: boolean
  includeLiked: boolean
  setIncludeLiked: (v: boolean) => void
  selPlaylists: Record<string, boolean>
  setSelPlaylists: React.Dispatch<React.SetStateAction<Record<string, boolean>>>
  selAlbums: Record<string, boolean>
  setSelAlbums: React.Dispatch<React.SetStateAction<Record<string, boolean>>>
  selArtists: Record<string, boolean>
  setSelArtists: React.Dispatch<React.SetStateAction<Record<string, boolean>>>
}

export function SelectionPanel(props: SelectionPanelProps) {
  const { data, loading, includeLiked, setIncludeLiked, selPlaylists, setSelPlaylists, selAlbums, setSelAlbums, selArtists, setSelArtists } = props

  // helpers
  const selectAll = React.useCallback(() => {
    if (!data) return
    setIncludeLiked((data.liked?.count ?? 0) > 0)
    const p: Record<string, boolean> = {}
    const a: Record<string, boolean> = {}
    const r: Record<string, boolean> = {}
    for (const x of data.playlists || []) p[x.id] = true
    for (const x of data.albums || []) a[x.id] = true
    for (const x of data.artists || []) r[x.id] = true
    setSelPlaylists(p); setSelAlbums(a); setSelArtists(r)
  }, [data, setIncludeLiked, setSelPlaylists, setSelAlbums, setSelArtists])

  const clearAll = React.useCallback(() => {
    setIncludeLiked(false)
    setSelPlaylists({}); setSelAlbums({}); setSelArtists({})
  }, [setIncludeLiked, setSelPlaylists, setSelAlbums, setSelArtists])

  const counts = React.useMemo(() => ({
    playlists: Object.values(selPlaylists).filter(Boolean).length,
    albums: Object.values(selAlbums).filter(Boolean).length,
    artists: Object.values(selArtists).filter(Boolean).length,
    playlistsTotal: data?.playlists?.length ?? 0,
    albumsTotal: data?.albums?.length ?? 0,
    artistsTotal: data?.artists?.length ?? 0,
  }), [selPlaylists, selAlbums, selArtists, data])

  return (
    <div className="rounded-2xl border border-zinc-200/60 dark:border-white/10 p-4 backdrop-blur-2xl bg-white/70 dark:bg-zinc-900/40 shadow-lg shadow-black/5">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">Your content</h2>
        <div className="flex items-center gap-2">
          <AtomButton onClick={selectAll} disabled={!data || loading} className="text-xs px-2 py-1">Select all</AtomButton>
          <AtomButton onClick={clearAll} disabled={(!counts.playlists && !counts.albums && !counts.artists && !includeLiked)} className="text-xs px-2 py-1">Clear all</AtomButton>
        </div>
      </div>
      <div className="max-h-[60vh] overflow-y-auto space-y-4 pr-1">
        <div>
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-zinc-900 dark:text-zinc-100">Quick pick</h3>
            <div className="flex items-center gap-2">
              <AtomButton onClick={() => setIncludeLiked(true)} disabled={!data || (data?.liked?.count ?? 0) === 0} className="text-xs px-2 py-1">Select</AtomButton>
              <AtomButton onClick={() => setIncludeLiked(false)} disabled={!includeLiked} className="text-xs px-2 py-1">Clear</AtomButton>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <AtomCard className="flex items-center gap-3">
              <input type="checkbox" className="h-4 w-4 accent-emerald-600 dark:accent-emerald-400" checked={includeLiked} onChange={(e) => setIncludeLiked(e.target.checked)} aria-label="Select Liked Songs" />
              <div className="w-12 h-12 rounded-md bg-gradient-to-br from-purple-500 to-pink-500 ring-1 ring-inset ring-black/5 dark:ring-white/5" />
              <div className="flex-1">
                <div className="font-medium text-zinc-900 dark:text-zinc-100">Liked Songs</div>
                <div className="text-xs text-zinc-500 dark:text-zinc-400">{data?.liked?.count ?? 0} tracks</div>
              </div>
            </AtomCard>
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-zinc-900 dark:text-zinc-100">Playlists <span className="text-xs text-zinc-500">({counts.playlists}/{counts.playlistsTotal})</span></h3>
            <div className="flex items-center gap-2">
              <AtomButton onClick={() => {
                if (!data) return
                const next: Record<string, boolean> = {}
                for (const p of data.playlists || []) next[p.id] = true
                setSelPlaylists(next)
              }} disabled={!data || counts.playlistsTotal === 0} className="text-xs px-2 py-1">Select all</AtomButton>
              <AtomButton onClick={() => setSelPlaylists({})} disabled={counts.playlists === 0} className="text-xs px-2 py-1">Clear</AtomButton>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {loading && <div className="text-sm text-zinc-500">Loading playlists…</div>}
            {data?.playlists?.map(p => (
              <PlaylistCard key={p.id} item={p} selected={!!selPlaylists[p.id]} onToggle={(id) => setSelPlaylists(s => ({ ...s, [id]: !s[id] }))} />
            ))}
            {!loading && !data && <div className="text-sm text-zinc-500">Connect source to load playlists.</div>}
            {!loading && data && (data.playlists?.length ?? 0) === 0 && (
              <div className="text-sm text-zinc-500 dark:text-zinc-400">No playlists found.</div>
            )}
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-zinc-900 dark:text-zinc-100">Albums <span className="text-xs text-zinc-500">({counts.albums}/{counts.albumsTotal})</span></h3>
            <div className="flex items-center gap-2">
              <AtomButton onClick={() => {
                if (!data) return
                const next: Record<string, boolean> = {}
                for (const a of data.albums || []) next[a.id] = true
                setSelAlbums(next)
              }} disabled={!data || counts.albumsTotal === 0} className="text-xs px-2 py-1">Select all</AtomButton>
              <AtomButton onClick={() => setSelAlbums({})} disabled={counts.albums === 0} className="text-xs px-2 py-1">Clear</AtomButton>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {loading && <div className="text-sm text-zinc-500">Loading albums…</div>}
            {data?.albums?.map(a => (
              <AlbumCard key={a.id} item={a} selected={!!selAlbums[a.id]} onToggle={(id) => setSelAlbums(s => ({ ...s, [id]: !s[id] }))} />
            ))}
            {!loading && data && (data.albums?.length ?? 0) === 0 && (
              <div className="text-sm text-zinc-500 dark:text-zinc-400">No albums found.</div>
            )}
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-zinc-900 dark:text-zinc-100">Artists <span className="text-xs text-zinc-500">({counts.artists}/{counts.artistsTotal})</span></h3>
            <div className="flex items-center gap-2">
              <AtomButton onClick={() => {
                if (!data) return
                const next: Record<string, boolean> = {}
                for (const ar of data.artists || []) next[ar.id] = true
                setSelArtists(next)
              }} disabled={!data || counts.artistsTotal === 0} className="text-xs px-2 py-1">Select all</AtomButton>
              <AtomButton onClick={() => setSelArtists({})} disabled={counts.artists === 0} className="text-xs px-2 py-1">Clear</AtomButton>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {loading && <div className="text-sm text-zinc-500">Loading artists…</div>}
            {data?.artists?.map(ar => (
              <ArtistCard key={ar.id} item={ar} selected={!!selArtists[ar.id]} onToggle={(id) => setSelArtists(s => ({ ...s, [id]: !s[id] }))} />
            ))}
            {!loading && data && (data.artists?.length ?? 0) === 0 && (
              <div className="text-sm text-zinc-500 dark:text-zinc-400">No artists found.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
