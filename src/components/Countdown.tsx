'use client'
import { useEffect, useState } from 'react'

interface CountdownProps {
  to: string
  className?: string
}

export function Countdown({ to, className = '' }: CountdownProps) {
  const [ms, setMs] = useState(() => new Date(to).getTime() - Date.now())

  useEffect(() => {
    const id = setInterval(() => {
      setMs(new Date(to).getTime() - Date.now())
    }, 1000)
    return () => clearInterval(id)
  }, [to])

  if (ms <= 0) {
    return (
      <span aria-live="polite" className={className}>
        Agora
      </span>
    )
  }

  const s = Math.floor(ms / 1000)
  const d = Math.floor(s / 86400)
  const h = Math.floor((s % 86400) / 3600)
  const m = Math.floor((s % 3600) / 60)

  return (
    <span role="timer" aria-live="polite" className={`tabular-nums ${className}`}>
      {d}d {h}h {m}m
    </span>
  )
}