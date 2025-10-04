import { useState, useMemo } from 'react'
import { motion } from 'motion/react'
import { Plus, ArrowLeft, Filter, Hotel, Utensils, Car, Ticket, ShoppingBag, MoreHorizontal } from 'lucide-react'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, LineChart, Line, XAxis, YAxis, CartesianGrid } from 'recharts'
import { ExpenseCard } from './ExpenseCard'
import { Button } from './ui/button'
import { Language, t } from '../lib/i18n'

interface Expense {
  id: string
  category: 'hotel' | 'food' | 'transport' | 'activity' | 'shopping' | 'other'
  amount: number
  currency: string
  description: string
  date: string
}

interface ExpenseManagerProps {
  expenses: Expense[]
  language: Language
  tripId?: string
  tripTitle?: string
  onBack: () => void
  onAddExpense: () => void
}

const categoryColors = {
  hotel: '#3b82f6',
  food: '#f97316',
  transport: '#a855f7',
  activity: '#10b981',
  shopping: '#f43f5e',
  other: '#6b7280'
}

const categoryIcons = {
  hotel: Hotel,
  food: Utensils,
  transport: Car,
  activity: Ticket,
  shopping: ShoppingBag,
  other: MoreHorizontal
}

type CategoryFilter = 'all' | 'hotel' | 'food' | 'transport' | 'activity' | 'shopping' | 'other'

export function ExpenseManager({ expenses, language, tripId, tripTitle, onBack, onAddExpense }: ExpenseManagerProps) {
  const [activeFilter, setActiveFilter] = useState<CategoryFilter>('all')

  // Filter expenses by trip (if tripId provided) and category
  const tripExpenses = useMemo(() => {
    if (tripId) {
      return expenses.filter(e => e.tripId === tripId)
    }
    return expenses
  }, [expenses, tripId])

  const filteredExpenses = useMemo(() => {
    if (activeFilter === 'all') return tripExpenses
    return tripExpenses.filter(e => e.category === activeFilter)
  }, [tripExpenses, activeFilter])

  // Calculate totals by category
  const categoryTotals = useMemo(() => {
    const totals: Record<string, number> = {}
    tripExpenses.forEach(expense => {
      if (!totals[expense.category]) totals[expense.category] = 0
      // Convert all to same currency (simplified - just add amounts)
      totals[expense.category] += expense.amount
    })
    return totals
  }, [tripExpenses])

  // Prepare data for pie chart
  const pieData = useMemo(() => {
    return Object.entries(categoryTotals).map(([category, total]) => ({
      name: t(`expense.category.${category}`, language),
      value: total,
      category
    }))
  }, [categoryTotals, language])

  // Prepare data for timeline chart (group by date)
  const timelineData = useMemo(() => {
    const grouped: Record<string, number> = {}
    tripExpenses.forEach(expense => {
      if (!grouped[expense.date]) grouped[expense.date] = 0
      grouped[expense.date] += expense.amount
    })
    
    return Object.entries(grouped)
      .map(([date, amount]) => ({
        date: new Date(date).toLocaleDateString(language, { month: 'short', day: 'numeric' }),
        amount
      }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
  }, [tripExpenses, language])

  // Calculate total
  const total = tripExpenses.reduce((sum, expense) => sum + expense.amount, 0)

  // Get most used currency
  const mainCurrency = tripExpenses.length > 0
    ? tripExpenses.reduce((acc, expense) => {
        acc[expense.currency] = (acc[expense.currency] || 0) + 1
        return acc
      }, {} as Record<string, number>)
    : { BRL: 1 }
  
  const currency = Object.keys(mainCurrency).sort((a, b) => mainCurrency[b] - mainCurrency[a])[0] || 'BRL'

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-6xl mx-auto px-4 py-8"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <button
            onClick={onBack}
            className="flex items-center gap-2 mb-4 text-white/40 hover:text-white transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            {t('action.back', language)}
          </button>
          <div>
            <h1 className="text-white">{t('expenses.investing', language)} ✨</h1>
            <p className="text-white/40 mt-1">
              {tripTitle || t('expenses.subtitle', language)}
            </p>
          </div>
        </div>
        <Button
          onClick={onAddExpense}
          className="bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white"
        >
          <Plus className="w-4 h-4 mr-2" />
          {t('expenses.add', language)}
        </Button>
      </div>

      {tripExpenses.length === 0 ? (
        <div className="py-16 text-center">
          <div className="mb-6 inline-flex p-4 rounded-full bg-white/5">
            <ShoppingBag className="w-8 h-8 text-white/40" />
          </div>
          <p className="text-white/30 mb-6">{t('expenses.empty', language)}</p>
          <Button
            onClick={onAddExpense}
            className="bg-gradient-to-r from-teal-500 to-cyan-500 text-white"
          >
            {t('expenses.add', language)}
          </Button>
        </div>
      ) : (
        <>
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {/* Total */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-6 rounded-2xl bg-gradient-to-br from-teal-500/20 to-cyan-500/20 border border-white/10 relative overflow-hidden"
            >
              <div className="absolute top-2 right-2 text-4xl opacity-10">💎</div>
              <p className="text-white/60 mb-2">{t('expenses.investing', language)}</p>
              <h2 className="text-white mb-1">
                {currency} {total.toLocaleString(language, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </h2>
              <p className="text-teal-400 text-sm">
                = {tripExpenses.length} {t('expenses.memories', language)}
              </p>
            </motion.div>

            {/* Pie Chart */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="p-6 rounded-2xl bg-white/5 border border-white/10 col-span-1 md:col-span-2"
            >
              <h3 className="text-white mb-4">{t('expenses.byCategory', language)}</h3>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={(entry) => `${entry.name}: ${entry.value.toFixed(0)}`}
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={categoryColors[entry.category as keyof typeof categoryColors]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgba(0, 0, 0, 0.8)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: '8px',
                      color: 'white'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </motion.div>
          </div>

          {/* Timeline Chart */}
          {timelineData.length > 1 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="p-6 rounded-2xl bg-white/5 border border-white/10 mb-8"
            >
              <h3 className="text-white mb-4">{t('expenses.timeline', language)}</h3>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={timelineData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis dataKey="date" stroke="rgba(255,255,255,0.4)" />
                  <YAxis stroke="rgba(255,255,255,0.4)" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgba(0, 0, 0, 0.8)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: '8px',
                      color: 'white'
                    }}
                  />
                  <Line type="monotone" dataKey="amount" stroke="#14b8a6" strokeWidth={2} dot={{ fill: '#14b8a6' }} />
                </LineChart>
              </ResponsiveContainer>
            </motion.div>
          )}

          {/* Category Filters */}
          <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-2">
            <button
              onClick={() => setActiveFilter('all')}
              className={`px-4 py-2 rounded-lg flex-shrink-0 transition-all ${
                activeFilter === 'all'
                  ? 'bg-white/20 text-white'
                  : 'bg-white/5 text-white/40 hover:bg-white/10'
              }`}
            >
              {t('expenses.filter.all', language)}
            </button>
            {Object.keys(categoryColors).map((cat) => {
              const Icon = categoryIcons[cat as keyof typeof categoryIcons]
              const count = categoryTotals[cat] || 0
              if (count === 0) return null
              
              return (
                <button
                  key={cat}
                  onClick={() => setActiveFilter(cat as CategoryFilter)}
                  className={`px-4 py-2 rounded-lg flex items-center gap-2 flex-shrink-0 transition-all ${
                    activeFilter === cat
                      ? 'bg-white/20 text-white'
                      : 'bg-white/5 text-white/40 hover:bg-white/10'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {t(`expense.category.${cat}`, language)}
                </button>
              )
            })}
          </div>

          {/* Expenses List */}
          <div className="space-y-3">
            {filteredExpenses.length === 0 ? (
              <p className="text-center text-white/40 py-8">
                Nenhuma despesa nesta categoria
              </p>
            ) : (
              filteredExpenses.map((expense, index) => (
                <ExpenseCard
                  key={expense.id}
                  {...expense}
                  index={index}
                  language={language}
                />
              ))
            )}
          </div>
        </>
      )}
    </motion.div>
  )
}
