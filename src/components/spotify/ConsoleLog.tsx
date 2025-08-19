"use client"

import * as React from "react"

export interface ConsoleLogProps {
  lines: string[]
  className?: string
}

export function ConsoleLog({ lines, className = "" }: ConsoleLogProps) {
  const [autoScroll, setAutoScroll] = React.useState(true)
  const scrollRef = React.useRef<HTMLPreElement | null>(null)

  React.useEffect(() => {
    if (!autoScroll) return
    const el = scrollRef.current
    if (!el) return
    // Only scroll the console element, not the page
    el.scrollTop = el.scrollHeight
  }, [lines, autoScroll])

  const clear = () => {
    const evt = new CustomEvent("console-clear")
    window.dispatchEvent(evt)
  }

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(lines.join("\n"))
    } catch {}
  }

  return (
    <div className={`rounded-lg border border-zinc-200/60 dark:border-white/10 bg-zinc-50 dark:bg-zinc-900/40`}> 
      <div className="flex items-center justify-between px-3 py-2 border-b border-zinc-200/60 dark:border-white/10">
        <div className="text-xs text-zinc-700 dark:text-zinc-300">Console</div>
        <div className="flex items-center gap-2">
          <label className="flex items-center gap-1 text-xs text-zinc-600 dark:text-zinc-400">
            <input type="checkbox" className="h-3 w-3 accent-emerald-600 dark:accent-emerald-400" checked={autoScroll} onChange={e => setAutoScroll(e.target.checked)} />
            Autoscroll
          </label>
          <button onClick={copy} className="text-xs px-2 py-1 rounded border border-zinc-300 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition">Copy</button>
          <button onClick={clear} className="text-xs px-2 py-1 rounded border border-zinc-300 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition">Clear</button>
        </div>
      </div>
      <pre ref={scrollRef} className={`text-xs whitespace-pre-wrap text-zinc-800 dark:text-zinc-200 p-3 overflow-auto max-h-[40vh] ${className}`}>
        {lines.join("\n")}
      </pre>
    </div>
  )
}
