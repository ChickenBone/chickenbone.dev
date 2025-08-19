import { Badge, Card, Checkbox, Thumb } from './atoms'

export type AlbumItem = { id: string; name: string; image: string | null; artists: string }

export function AlbumCard({ item, selected, onToggle }: { item: AlbumItem; selected: boolean; onToggle: (id: string) => void }) {
  const handleClick: React.MouseEventHandler<HTMLDivElement> = (e) => {
    const target = e.target as HTMLElement
    if (target.closest('input,button,a,svg')) return
    onToggle(item.id)
  }
  const handleKey: React.KeyboardEventHandler<HTMLDivElement> = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      onToggle(item.id)
    }
  }
  return (
    <Card className="flex items-center gap-3" onClick={handleClick} onKeyDown={handleKey}>
      <Checkbox checked={selected} onChange={() => onToggle(item.id)} aria-label={`Select ${item.name}`} />
      <Thumb src={item.image} alt={item.name} />
      <div className="flex-1 min-w-0">
        <div className="font-medium truncate text-zinc-900 dark:text-zinc-100">{item.name}</div>
        <div className="text-xs text-zinc-500 dark:text-zinc-400 truncate">{item.artists}</div>
      </div>
      <Badge>Album</Badge>
    </Card>
  )
}
