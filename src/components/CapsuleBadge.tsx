import { Lock } from 'lucide-react'
import { Language, t } from '../lib/i18n'

interface CapsuleBadgeProps {
  openAt: string
  isOpen?: boolean
  language?: Language
}

export function CapsuleBadge({ openAt, isOpen = false, language = 'pt-BR' }: CapsuleBadgeProps) {
  const date = new Date(openAt)
  const formattedDate = date.toLocaleDateString(language, {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  })

  if (isOpen) {
    return (
      <div className="inline-flex items-center gap-2 text-teal-400/80">
        <Lock className="h-3 w-3" aria-hidden="true" />
        <span>{t('memory.capsule.badge.open', language)}</span>
      </div>
    )
  }

  return (
    <div className="inline-flex items-center gap-2 text-amber-400/80">
      <Lock className="h-3 w-3" aria-hidden="true" />
      <span>{t('memory.capsule.badge.locked', language)} {formattedDate}</span>
    </div>
  )
}