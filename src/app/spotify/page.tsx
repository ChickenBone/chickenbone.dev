'use client'

import type React from 'react'
import { useEffect, useMemo, useState } from 'react'
import type { PlaylistItem } from '@/components/spotify/PlaylistCard'
import type { AlbumItem } from '@/components/spotify/AlbumCard'
import type { ArtistItem } from '@/components/spotify/ArtistCard'
import { TopBar } from '@/components/spotify/TopBar'
import { StatusCard } from '@/components/spotify/StatusCard'
import { SelectionPanel } from '@/components/spotify/SelectionPanel'
import { CreatePlaylistCard } from '@/components/spotify/CreatePlaylistCard'
import { ConsoleLog } from '@/components/spotify/ConsoleLog'

export default function SpotifyManager() {
    const [busy, setBusy] = useState(false)
    const [msg, setMsg] = useState<string[]>([])
    const [status, setStatus] = useState<{ source: boolean; target: boolean; sourceUser?: any; targetUser?: any } | null>(null)
    const [data, setData] = useState<{ playlists: PlaylistItem[]; albums: AlbumItem[]; artists: ArtistItem[]; liked: { count: number }; scopes?: string } | null>(null)
    const [loadingData, setLoadingData] = useState(false)

    const [selPlaylists, setSelPlaylists] = useState<Record<string, boolean>>({})
    const [selAlbums, setSelAlbums] = useState<Record<string, boolean>>({})
    const [selArtists, setSelArtists] = useState<Record<string, boolean>>({})
    const [includeLiked, setIncludeLiked] = useState(false)
    const [playlistName, setPlaylistName] = useState('My Sync Playlist')
    const [isPublic, setIsPublic] = useState(false)

    const loadStatus = async () => {
        try {
            const res = await fetch('/api/spotify/status', { cache: 'no-store' })
            if (res.ok) setStatus(await res.json())
        } catch { }
    }

    const loadData = async () => {
        setLoadingData(true)
        try {
            const res = await fetch('/api/spotify/browse/source', { cache: 'no-store' })
            if (res.ok) setData(await res.json())
        } finally {
            setLoadingData(false)
        }
    }

    useEffect(() => { loadStatus() }, [])
    useEffect(() => { if (status?.source) loadData() }, [status?.source])

    // Listen for console clear events from ConsoleLog
    useEffect(() => {
        const onClear = () => setMsg([])
        window.addEventListener('console-clear', onClear)
        return () => window.removeEventListener('console-clear', onClear)
    }, [])

    const authUrl = (role: 'source' | 'target') => `/api/spotify/auth/authorize?role=${role}`

    const selectionPayload = useMemo(() => {
        const items: any[] = []
        if (includeLiked) items.push({ type: 'liked' })
        Object.keys(selPlaylists).forEach(id => { if (selPlaylists[id]) items.push({ type: 'playlist', id }) })
        Object.keys(selAlbums).forEach(id => { if (selAlbums[id]) items.push({ type: 'album', id }) })
        Object.keys(selArtists).forEach(id => { if (selArtists[id]) items.push({ type: 'artist', id }) })
        return items
    }, [includeLiked, selPlaylists, selAlbums, selArtists])

    const syncSelection = async () => {
        setBusy(true)
        setMsg(['Starting sync...'])
        try {
            const res = await fetch('/api/spotify/sync/selection', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: playlistName, public: isPublic, items: selectionPayload }),
            })
            if (!res.ok && !res.body) throw new Error(await res.text())

            if (res.body) {
                const reader = res.body.getReader()
                const decoder = new TextDecoder()
                let buffer = ''
                while (true) {
                    const { done, value } = await reader.read()
                    if (done) break
                    buffer += decoder.decode(value, { stream: true })
                    let idx
                    while ((idx = buffer.indexOf('\n')) !== -1) {
                        const line = buffer.slice(0, idx)
                        buffer = buffer.slice(idx + 1)
                        if (line) setMsg(prev => [...prev, line])
                    }
                }
                if (buffer.trim().length) setMsg(prev => [...prev, buffer.trim()])
            } else {
                // Fallback: plain text
                const text = await res.text()
                setMsg(text.split(/\r?\n/).filter(Boolean))
            }
        } catch (e: any) {
            setMsg([`Error: ${String(e.message || e)}`])
        } finally {
            setBusy(false)
            loadStatus()
        }
    }

    const connected = status?.source && status?.target
    const showScopesHint = !!(status?.source && !loadingData && data && data.playlists?.length === 0 && data.albums?.length === 0 && data.artists?.length === 0)

    return (
        <main className="max-w-6xl mx-auto px-4 sm:px-6 py-10 lg:py-14 text-zinc-900 dark:text-zinc-100">
            <h1 className="text-2xl font-bold mb-1">Spotify Sync</h1>
            <p className="text-sm text-zinc-600 dark:text-zinc-300 mb-6">Connect accounts, select content, and sync into a new playlist on the target.</p>

            <TopBar
                onConnectSource={() => (window.location.href = authUrl('source'))}
                onConnectTarget={() => (window.location.href = authUrl('target'))}
                onRefresh={() => loadStatus()}
            />

            <StatusCard status={status} dataScopes={data?.scopes} showScopesHint={showScopesHint} />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                <section className="lg:col-span-8">
                    <SelectionPanel
                        data={data ? { playlists: data.playlists, albums: data.albums, artists: data.artists, liked: data.liked } : null}
                        loading={loadingData}
                        includeLiked={includeLiked}
                        setIncludeLiked={setIncludeLiked}
                        selPlaylists={selPlaylists}
                        setSelPlaylists={setSelPlaylists}
                        selAlbums={selAlbums}
                        setSelAlbums={setSelAlbums}
                        selArtists={selArtists}
                        setSelArtists={setSelArtists}
                    />
                </section>
                <aside className="lg:col-span-4">
                    <div className="sticky top-24">
                        <CreatePlaylistCard
                            name={playlistName}
                            setName={setPlaylistName}
                            isPublic={isPublic}
                            setIsPublic={setIsPublic}
                            selectedCount={selectionPayload.length}
                            connected={!!connected}
                            busy={busy}
                            onSync={syncSelection}
                        />
                        {msg.length > 0 && (
                            <div className="mt-4">
                                <ConsoleLog lines={msg} />
                            </div>
                        )}
                    </div>
                </aside>
            </div>
        </main>
    )
}
