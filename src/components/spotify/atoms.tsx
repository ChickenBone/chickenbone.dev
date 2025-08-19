import Image from 'next/image'
import React from 'react'

export function Card(props: React.HTMLAttributes<HTMLDivElement>) {
  const { className = '', onClick, ...rest } = props
  const interactive = typeof onClick === 'function'
  return (
    <div
      {...rest}
      onClick={onClick}
      role={interactive ? 'button' : rest.role}
      className={`rounded-2xl border border-zinc-200/60 dark:border-white/10 p-4 backdrop-blur-2xl bg-white/70 dark:bg-zinc-900/40 shadow-lg shadow-black/5 transition-colors ${
        interactive
          ? 'cursor-pointer hover:bg-zinc-50/80 dark:hover:bg-zinc-900/60 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/50 focus-visible:border-emerald-500/30'
          : 'focus:outline-none'
      } ${className}`}
      tabIndex={interactive ? 0 : props.tabIndex}
    />
  )
}

export function Badge(props: React.HTMLAttributes<HTMLSpanElement>) {
  const { className = '', ...rest } = props
  return (
    <span
      {...rest}
      className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-zinc-100 dark:bg-zinc-800/60 text-zinc-700 dark:text-zinc-200 border border-zinc-200/60 dark:border-white/10 ${className}`}
    />
  )
}

export function Button(props: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const { className = '', ...rest } = props
  return (
    <button
      {...rest}
      className={`px-3 py-2 rounded-md border border-zinc-300 dark:border-zinc-700 bg-white/80 dark:bg-zinc-800/60 hover:bg-zinc-100 dark:hover:bg-zinc-700 transition shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/50 active:translate-y-[0.5px] disabled:opacity-50 ${className}`}
    />
  )
}

export function Checkbox(props: React.InputHTMLAttributes<HTMLInputElement>) {
  const { className = '', ...rest } = props
  return (
    <input
      type="checkbox"
      {...rest}
      className={`h-4 w-4 accent-emerald-600 dark:accent-emerald-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/50 rounded ${className}`}
    />
  )
}

export function Thumb({ src, alt }: { src: string | null; alt: string }) {
  if (!src)
    return (
      <div
        className="w-12 h-12 rounded-md bg-zinc-200 dark:bg-zinc-800 ring-1 ring-inset ring-black/5 dark:ring-white/5"
        aria-label={alt}
      />
    )
  return (
    <div className="relative w-12 h-12 overflow-hidden rounded-md ring-1 ring-inset ring-black/5 dark:ring-white/5 shadow-sm">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt={alt} className="w-full h-full object-cover" />
    </div>
  )
}
