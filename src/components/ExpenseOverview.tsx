import { useMemo } from 'react'
import { motion } from 'motion/react'
import { ArrowLeft, TrendingUp, Calendar, MapPin, DollarSign } from 'lucide-react'
import { Language, t } from '../lib/i18n'
import { Button } from './ui/button'

interface Trip {
  id: string
  title: string
  location: string
  coverUrl: string
  startDate: string
}

interface Expense {
  id: string
  tripId: string
  amount: number
  currency: string
  category: string
}

interface ExpenseOverviewProps {
  trips: Trip[]
  expenses: Expense[]
  language: Language
  onSelectTrip: (tripId: string) => void
  onBack: () => void
}

export function ExpenseOverview({ trips, expenses, language, onSelectTrip, onBack }: ExpenseOverviewProps) {
  // Calculate total expenses per trip
  const tripExpenses = useMemo(() => {
    return trips.map(trip => {
      const tripExpenseList = expenses.filter(e => e.tripId === trip.id)
      const total = tripExpenseList.reduce((sum, e) => sum + e.amount, 0)
      const count = tripExpenseList.length
      return { ...trip, total, count }
    })
  }, [trips, expenses])

  // Calculate global totals (only for the displayed trips)
  const tripIds = trips.map(t => t.id)
  const relevantExpenses = expenses.filter(e => tripIds.includes(e.tripId))
  const globalTotal = relevantExpenses.reduce((sum, e) => sum + e.amount, 0)
  const totalTrips = trips.length
  const totalExpenses = relevantExpenses.length

  // Get most used currency (from relevant expenses only)
  const currencyCount = relevantExpenses.reduce((acc, e) => {
    acc[e.currency] = (acc[e.currency] || 0) + 1
    return acc
  }, {} as Record<string, number>)
  
  const mainCurrency = Object.keys(currencyCount).sort((a, b) => 
    currencyCount[b] - currencyCount[a]
  )[0] || 'BRL'

  // Calculate by category for global overview (only relevant expenses)
  const categoryTotals = useMemo(() => {
    const totals: Record<string, number> = {}
    relevantExpenses.forEach(expense => {
      if (!totals[expense.category]) totals[expense.category] = 0
      totals[expense.category] += expense.amount
    })
    return totals
  }, [relevantExpenses])

  const topCategory = Object.entries(categoryTotals)
    .sort((a, b) => b[1] - a[1])[0]

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
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
          <h1 className="text-white mb-2">{t('expenses.investing', language)} ✨</h1>
          <p className="text-white/40">{t('expenses.subtitle', language)}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content - Trip Cards */}
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-white">Selecione uma Viagem</h2>
          
          {trips.length === 0 ? (
            <div className="py-16 text-center">
              <div className="mb-6 inline-flex p-4 rounded-full bg-white/5">
                <MapPin className="w-8 h-8 text-white/40" />
              </div>
              <p className="text-white/30 mb-6">
                Crie uma viagem primeiro para registrar gastos
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {tripExpenses.map((trip, index) => (
                <motion.button
                  key={trip.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  onClick={() => onSelectTrip(trip.id)}
                  className="group relative overflow-hidden rounded-2xl bg-white/5 border border-white/10 hover:border-white/20 transition-all text-left"
                >
                  {/* Cover Image */}
                  <div className="relative h-32 overflow-hidden">
                    <img 
                      src={trip.coverUrl} 
                      alt={trip.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                  </div>

                  {/* Content */}
                  <div className="p-4">
                    <h3 className="text-white mb-1">{trip.title}</h3>
                    <p className="text-white/40 text-sm mb-3 flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {trip.location}
                    </p>

                    {/* Stats */}
                    <div className="pt-3 border-t border-white/10">
                      <p className="text-white/40 text-xs mb-1">Total investido</p>
                      <p className="text-white">
                        {mainCurrency} {trip.total.toLocaleString(language, { 
                          minimumFractionDigits: 2, 
                          maximumFractionDigits: 2 
                        })}
                      </p>
                    </div>
                  </div>

                  {/* Arrow indicator */}
                  <motion.div
                    initial={{ x: 0, opacity: 0 }}
                    whileHover={{ x: 5, opacity: 1 }}
                    className="absolute right-4 top-1/2 -translate-y-1/2"
                  >
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 20 20"
                      fill="none"
                      className="text-white/40"
                    >
                      <path
                        d="M7.5 15L12.5 10L7.5 5"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </motion.div>
                </motion.button>
              ))}
            </div>
          )}
        </div>

        {/* Sidebar - Relatório Geral do Viajante */}
        <div className="space-y-4">
          <h3 className="text-white mb-4">📊 Relatório Geral</h3>

          {/* Total Global Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-6 rounded-2xl bg-gradient-to-br from-teal-500/20 to-cyan-500/20 border border-white/10 relative overflow-hidden"
          >
            <div className="absolute top-2 right-2 text-5xl opacity-10">💎</div>
            <p className="text-white/60 mb-2">Total Investido</p>
            <h2 className="text-white mb-2">
              {mainCurrency} {globalTotal.toLocaleString(language, { 
                minimumFractionDigits: 2, 
                maximumFractionDigits: 2 
              })}
            </h2>
            <p className="text-teal-400 text-sm">
              = {totalExpenses} {t('expenses.memories', language)}
            </p>
          </motion.div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-4 rounded-xl bg-white/5 border border-white/10">
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="w-4 h-4 text-purple-400" />
                <p className="text-white/60 text-sm">Viagens</p>
              </div>
              <p className="text-white text-xl">{totalTrips}</p>
            </div>

            <div className="p-4 rounded-xl bg-white/5 border border-white/10">
              <div className="flex items-center gap-2 mb-2">
                <DollarSign className="w-4 h-4 text-amber-400" />
                <p className="text-white/60 text-sm">Despesas</p>
              </div>
              <p className="text-white text-xl">{totalExpenses}</p>
            </div>
          </div>

          {/* Top Category */}
          {topCategory && (
            <div className="p-4 rounded-xl bg-white/5 border border-white/10">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-4 h-4 text-green-400" />
                <p className="text-white/60 text-sm">Categoria Principal</p>
              </div>
              <p className="text-white capitalize">
                {t(`expense.category.${topCategory[0]}`, language)}
              </p>
              <p className="text-white/40 text-sm mt-1">
                {mainCurrency} {topCategory[1].toLocaleString(language, { 
                  minimumFractionDigits: 2, 
                  maximumFractionDigits: 2 
                })}
              </p>
            </div>
          )}

          {/* Inspirational Quote */}
          <div className="p-4 rounded-xl bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20">
            <p className="text-white/80 text-sm italic">
              "Cada centavo investido em experiências se transforma em memórias que duram para sempre" ✨
            </p>
          </div>

          {/* Average per trip */}
          {totalTrips > 0 && (
            <div className="p-4 rounded-xl bg-white/5 border border-white/10">
              <p className="text-white/60 text-sm mb-2">Média por Viagem</p>
              <p className="text-white">
                {mainCurrency} {(globalTotal / totalTrips).toLocaleString(language, { 
                  minimumFractionDigits: 2, 
                  maximumFractionDigits: 2 
                })}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
