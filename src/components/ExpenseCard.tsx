import { motion } from 'motion/react'
import { Hotel, Utensils, Car, Ticket, ShoppingBag, MoreHorizontal } from 'lucide-react'
import { Language, t } from '../lib/i18n'

interface ExpenseCardProps {
  category: 'hotel' | 'food' | 'transport' | 'activity' | 'shopping' | 'other'
  amount: number
  currency: string
  description: string
  date: string
  index: number
  language: Language
}

const categoryConfig = {
  hotel: { icon: Hotel, color: 'from-blue-500 to-cyan-500', bg: 'bg-blue-500/10' },
  food: { icon: Utensils, color: 'from-orange-500 to-amber-500', bg: 'bg-orange-500/10' },
  transport: { icon: Car, color: 'from-purple-500 to-pink-500', bg: 'bg-purple-500/10' },
  activity: { icon: Ticket, color: 'from-green-500 to-emerald-500', bg: 'bg-green-500/10' },
  shopping: { icon: ShoppingBag, color: 'from-rose-500 to-red-500', bg: 'bg-rose-500/10' },
  other: { icon: MoreHorizontal, color: 'from-gray-500 to-slate-500', bg: 'bg-gray-500/10' }
}

export function ExpenseCard({
  category,
  amount,
  currency,
  description,
  date,
  index,
  language
}: ExpenseCardProps) {
  const config = categoryConfig[category]
  const Icon = config.icon

  const formattedDate = new Date(date).toLocaleDateString(language, {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  })

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-300 group"
    >
      <div className="flex items-start gap-4">
        {/* Icon */}
        <div className={`flex-shrink-0 w-12 h-12 rounded-lg bg-gradient-to-br ${config.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
          <Icon className="w-6 h-6 text-white" />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-1">
            <p className="text-white truncate">{description}</p>
            <span className="text-white flex-shrink-0">
              {currency} {amount.toLocaleString(language, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </div>
          <div className="flex items-center gap-3 text-white/40 text-sm">
            <span>{t(`expense.category.${category}`, language)}</span>
            <span>•</span>
            <span>{formattedDate}</span>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
