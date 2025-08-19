import { Badge, Card, Checkbox, Thumb } from './atoms'

export type ArtistItem = { id: string; name: string; image: string | null }

export function ArtistCard({ item, selected, onToggle }: { item: ArtistItem; selected: boolean; onToggle: (id: string) => void }) {
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
        <div className="text-xs text-zinc-500 dark:text-zinc-400">Top tracks</div>
      </div>
      <Badge>Artist</Badge>
    </Card>
  )
}
