'use client'
import { motion } from 'motion/react'

export type FilterType = 'all' | 'note' | 'photo' | 'tip' | 'capsule'

interface FilterPanelProps {
  activeFilter: FilterType
  onFilterChange: (filter: FilterType) => void
  counts: {
    all: number
    note: number
    photo: number
    tip: number
    capsule: number
  }
  labels: {
    all: string
    notes: string
    photos: string
    tips: string
    capsules: string
  }
}

export function FilterPanel({ activeFilter, onFilterChange, counts, labels }: FilterPanelProps) {
  const filters: { key: FilterType; label: string }[] = [
    { key: 'all', label: labels.all },
    { key: 'note', label: labels.notes },
    { key: 'photo', label: labels.photos },
    { key: 'tip', label: labels.tips },
    { key: 'capsule', label: labels.capsules }
  ]

  return (
    <div className="flex flex-wrap gap-3">
      {filters.map((filter) => (
        <button
          key={filter.key}
          onClick={() => onFilterChange(filter.key)}
          className={`px-3 py-1.5 transition-colors ${
            activeFilter === filter.key
              ? 'text-white'
              : 'text-white/30 hover:text-white/60'
          }`}
        >
          {filter.label} <span className="text-white/20">({counts[filter.key]})</span>
        </button>
      ))}
    </div>
  )
}