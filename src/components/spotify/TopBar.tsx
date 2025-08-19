"use client"

import * as React from "react"
import AppButton from '@/components/ui/AppButton'

export interface TopBarProps {
  onConnectSource: () => void
  onConnectTarget: () => void
  onRefresh: () => void
}

export function TopBar({ onConnectSource, onConnectTarget, onRefresh }: TopBarProps) {
  return (
    <div className="flex flex-wrap gap-3 mb-4">
      <AppButton onClick={onConnectSource}>Connect Source</AppButton>
      <AppButton onClick={onConnectTarget}>Connect Target</AppButton>
      <AppButton onClick={onRefresh}>Refresh</AppButton>
    </div>
  )
}
