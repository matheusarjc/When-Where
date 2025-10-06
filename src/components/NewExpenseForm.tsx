import { useState } from 'react'
import { motion } from 'motion/react'
import { X, Hotel, Utensils, Car, Ticket, ShoppingBag, MoreHorizontal } from 'lucide-react'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Language, t } from '../lib/i18n'

interface NewExpenseFormProps {
  onClose: () => void
  onSave: (expense: {
    category: 'hotel' | 'food' | 'transport' | 'activity' | 'shopping' | 'other'
    amount: number
    currency: string
    description: string
    date: string
  }) => void
  tripId?: string
  language: Language
}

const categories = [
  { id: 'hotel' as const, icon: Hotel, color: 'from-blue-500 to-cyan-500' },
  { id: 'food' as const, icon: Utensils, color: 'from-orange-500 to-amber-500' },
  { id: 'transport' as const, icon: Car, color: 'from-purple-500 to-pink-500' },
  { id: 'activity' as const, icon: Ticket, color: 'from-green-500 to-emerald-500' },
  { id: 'shopping' as const, icon: ShoppingBag, color: 'from-rose-500 to-red-500' },
  { id: 'other' as const, icon: MoreHorizontal, color: 'from-gray-500 to-slate-500' }
]

const currencies = ['BRL', 'USD', 'EUR', 'GBP', 'JPY', 'AUD', 'CAD', 'CHF']

export function NewExpenseForm({ onClose, onSave, language }: NewExpenseFormProps) {
  const [category, setCategory] = useState<typeof categories[number]['id']>('food')
  const [amount, setAmount] = useState('')
  const [currency, setCurrency] = useState('BRL')
  const [description, setDescription] = useState('')
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!amount || parseFloat(amount) <= 0) return

    onSave({
      category,
      amount: parseFloat(amount),
      currency,
      description,
      date
    })
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-white/5 backdrop-blur-xl rounded-3xl p-8 max-w-2xl w-full border border-white/10 max-h-[90vh] overflow-y-auto"
      >
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-white">{t('form.expense.title', language)}</h2>
          <button
            onClick={onClose}
            className="p-2 text-white/40 hover:text-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Category Selection */}
          <div>
            <label className="block text-white/80 mb-3">
              {t('form.expense.category', language)}
            </label>
            <div className="grid grid-cols-3 gap-3">
              {categories.map((cat) => {
                const Icon = cat.icon
                const isSelected = category === cat.id
                return (
                  <motion.button
                    key={cat.id}
                    type="button"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setCategory(cat.id)}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      isSelected
                        ? 'border-white/20 bg-white/10'
                        : 'border-white/5 bg-white/5 hover:bg-white/10'
                    }`}
                  >
                    <div className={`w-10 h-10 mx-auto mb-2 rounded-lg bg-gradient-to-br ${cat.color} flex items-center justify-center`}>
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <p className="text-white text-sm">
                      {t(`expense.category.${cat.id}`, language)}
                    </p>
                  </motion.button>
                )
              })}
            </div>
          </div>

          {/* Amount and Currency */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-white/80 mb-2">
                {t('form.expense.amount', language)}
              </label>
              <Input
                type="number"
                step="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                className="bg-white/5 border-white/10 text-white"
                required
              />
            </div>
            <div>
              <label className="block text-white/80 mb-2">
                {t('form.expense.currency', language)}
              </label>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
              >
                {currencies.map((curr) => (
                  <option key={curr} value={curr} className="bg-gray-900">
                    {curr}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-white/80 mb-2">
              {t('form.expense.description', language)}
            </label>
            <Input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={t('form.expense.description.placeholder', language)}
              className="bg-white/5 border-white/10 text-white"
              required
            />
          </div>

          {/* Date */}
          <div>
            <label className="block text-white/80 mb-2">
              {t('form.expense.date', language)}
            </label>
            <Input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="bg-white/5 border-white/10 text-white"
              required
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1 border-white/10"
            >
              {t('action.cancel', language)}
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white"
            >
              {t('form.expense.create', language)}
            </Button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  )
}
