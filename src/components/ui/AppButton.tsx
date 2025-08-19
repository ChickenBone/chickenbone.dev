"use client"

import * as React from "react"

export type AppButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement>

const AppButton = React.forwardRef<HTMLButtonElement, AppButtonProps>(
  (props, ref) => {
    const {
      className = "",
      children,
      type = "button",
      disabled = false,
      ...rest
    } = props

    return (
      <button
        ref={ref}
        type={type}
        disabled={disabled}
        {...rest}
        className={[
          // layout + spacing
          "inline-flex items-center justify-center px-4 py-2 rounded-md transition-transform",
          // typography
          "font-medium text-sm",
          // light mode
          "bg-white/90 text-zinc-900 border border-zinc-200 hover:bg-white",
          // dark mode
          "dark:bg-zinc-900/75 dark:text-zinc-100 dark:border-zinc-700 dark:hover:bg-zinc-800",
          // focus / accessibility
          "focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-zinc-400 dark:focus-visible:ring-zinc-600 focus-visible:ring-offset-white/90",
          // interaction
          "shadow-sm hover:shadow-md active:scale-[0.99]",
          // disabled
          disabled ? "opacity-60 cursor-not-allowed" : "cursor-pointer",
          // user classes
          className,
        ]
          .filter(Boolean)
          .join(" ")}
      >
        {children}
      </button>
    )
  }
)

AppButton.displayName = "AppButton"

export default AppButton
