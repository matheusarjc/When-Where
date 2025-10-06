import { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { Plus, Check, Trash2, FileText, Package, Calendar, CheckSquare, MoreHorizontal, Sparkles } from 'lucide-react'
import { Language, t } from '../lib/i18n'
import { Button } from './ui/button'
import { Input } from './ui/input'

interface ChecklistItem {
  id: string
  text: string
  completed: boolean
  category: 'documents' | 'packing' | 'bookings' | 'tasks' | 'other'
}

interface TravelChecklistProps {
  items: ChecklistItem[]
  language: Language
  onAddItem: (text: string, category: ChecklistItem['category']) => void
  onToggleItem: (id: string) => void
  onDeleteItem: (id: string) => void
}

const categoryConfig = {
  documents: { icon: FileText, color: 'from-blue-500 to-cyan-500', bg: 'bg-blue-500/10' },
  packing: { icon: Package, color: 'from-purple-500 to-pink-500', bg: 'bg-purple-500/10' },
  bookings: { icon: Calendar, color: 'from-green-500 to-emerald-500', bg: 'bg-green-500/10' },
  tasks: { icon: CheckSquare, color: 'from-orange-500 to-amber-500', bg: 'bg-orange-500/10' },
  other: { icon: MoreHorizontal, color: 'from-gray-500 to-slate-500', bg: 'bg-gray-500/10' }
}

const templates = {
  international: [
    { text: 'Passaporte válido', category: 'documents' as const },
    { text: 'Visto (se necessário)', category: 'documents' as const },
    { text: 'Seguro viagem', category: 'documents' as const },
    { text: 'Cartão de vacinas', category: 'documents' as const },
    { text: 'Passagens aéreas', category: 'bookings' as const },
    { text: 'Reserva de hotel', category: 'bookings' as const },
    { text: 'Roupas para 7 dias', category: 'packing' as const },
    { text: 'Adaptador de tomada', category: 'packing' as const },
    { text: 'Medicamentos pessoais', category: 'packing' as const }
  ],
  beach: [
    { text: 'Protetor solar', category: 'packing' as const },
    { text: 'Óculos de sol', category: 'packing' as const },
    { text: 'Roupa de banho', category: 'packing' as const },
    { text: 'Chinelos', category: 'packing' as const },
    { text: 'Chapéu/Boné', category: 'packing' as const }
  ],
  city: [
    { text: 'Calçado confortável', category: 'packing' as const },
    { text: 'Mapa da cidade', category: 'tasks' as const },
    { text: 'Lista de atrações', category: 'tasks' as const },
    { text: 'Reservas de restaurantes', category: 'bookings' as const }
  ]
}

export function TravelChecklist({ items, language, onAddItem, onToggleItem, onDeleteItem }: TravelChecklistProps) {
  const [newItemText, setNewItemText] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<ChecklistItem['category']>('tasks')
  const [showTemplates, setShowTemplates] = useState(false)

  const handleAddItem = () => {
    if (newItemText.trim()) {
      onAddItem(newItemText.trim(), selectedCategory)
      setNewItemText('')
    }
  }

  const handleLoadTemplate = (templateKey: keyof typeof templates) => {
    templates[templateKey].forEach(item => {
      onAddItem(item.text, item.category)
    })
    setShowTemplates(false)
  }

  const completedCount = items.filter(i => i.completed).length
  const progress = items.length > 0 ? (completedCount / items.length) * 100 : 0

  // Group items by category
  const itemsByCategory = items.reduce((acc, item) => {
    if (!acc[item.category]) acc[item.category] = []
    acc[item.category].push(item)
    return acc
  }, {} as Record<string, ChecklistItem[]>)

  return (
    <div className="space-y-6">
      {/* Progress */}
      {items.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-6 rounded-2xl bg-gradient-to-br from-teal-500/20 to-cyan-500/20 border border-white/10"
        >
          <div className="flex items-center justify-between mb-3">
            <p className="text-white/60">{t('checklist.progress', language)}</p>
            <span className="text-white">{completedCount}/{items.length}</span>
          </div>
          <div className="h-3 bg-white/10 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5 }}
              className="h-full bg-gradient-to-r from-teal-500 to-cyan-500"
            />
          </div>
        </motion.div>
      )}

      {/* Add Item */}
      <div className="space-y-3">
        <div className="flex gap-2">
          <Input
            value={newItemText}
            onChange={(e) => setNewItemText(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleAddItem()}
            placeholder="Adicionar item..."
            className="flex-1 bg-white/5 border-white/10 text-white"
          />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value as ChecklistItem['category'])}
            className="px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white"
          >
            {Object.keys(categoryConfig).map(cat => (
              <option key={cat} value={cat} className="bg-gray-900">
                {t(`checklist.category.${cat}`, language)}
              </option>
            ))}
          </select>
          <Button
            onClick={handleAddItem}
            className="bg-teal-500 hover:bg-teal-600 text-white"
          >
            <Plus className="w-4 h-4" />
          </Button>
        </div>

        {/* Templates Button */}
        {items.length === 0 && (
          <Button
            onClick={() => setShowTemplates(!showTemplates)}
            variant="outline"
            className="w-full border-white/10 text-white/60"
          >
            <Sparkles className="w-4 h-4 mr-2" />
            {t('checklist.templates', language)}
          </Button>
        )}

        {/* Templates */}
        <AnimatePresence>
          {showTemplates && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="grid grid-cols-3 gap-2"
            >
              <button
                onClick={() => handleLoadTemplate('international')}
                className="p-3 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-white text-sm transition-colors"
              >
                ✈️ {t('checklist.template.international', language)}
              </button>
              <button
                onClick={() => handleLoadTemplate('beach')}
                className="p-3 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-white text-sm transition-colors"
              >
                🏖️ {t('checklist.template.beach', language)}
              </button>
              <button
                onClick={() => handleLoadTemplate('city')}
                className="p-3 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-white text-sm transition-colors"
              >
                🏙️ {t('checklist.template.city', language)}
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Items by Category */}
      {items.length === 0 ? (
        <div className="py-12 text-center">
          <p className="text-white/30">{t('checklist.empty', language)}</p>
        </div>
      ) : (
        <div className="space-y-6">
          {Object.entries(itemsByCategory).map(([category, categoryItems]) => {
            const config = categoryConfig[category as keyof typeof categoryConfig]
            const Icon = config.icon
            
            return (
              <div key={category}>
                <div className="flex items-center gap-2 mb-3">
                  <div className={`p-2 rounded-lg bg-gradient-to-br ${config.color} bg-opacity-20`}>
                    <Icon className="w-4 h-4 text-white" />
                  </div>
                  <h4 className="text-white/80">
                    {t(`checklist.category.${category}`, language)}
                  </h4>
                  <span className="text-white/40 text-sm">
                    ({categoryItems.filter(i => i.completed).length}/{categoryItems.length})
                  </span>
                </div>

                <div className="space-y-2">
                  <AnimatePresence mode="popLayout">
                    {categoryItems.map((item, index) => (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        transition={{ delay: index * 0.05 }}
                        className="flex items-center gap-3 p-3 rounded-lg bg-white/5 border border-white/10 group"
                      >
                        <button
                          onClick={() => onToggleItem(item.id)}
                          className={`w-6 h-6 rounded-md border-2 flex items-center justify-center transition-all ${
                            item.completed
                              ? 'bg-teal-500 border-teal-500'
                              : 'border-white/20 hover:border-teal-500'
                          }`}
                        >
                          {item.completed && (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              exit={{ scale: 0 }}
                            >
                              <Check className="w-4 h-4 text-white" />
                            </motion.div>
                          )}
                        </button>

                        <span className={`flex-1 ${item.completed ? 'text-white/40 line-through' : 'text-white'}`}>
                          {item.text}
                        </span>

                        <button
                          onClick={() => onDeleteItem(item.id)}
                          className="opacity-0 group-hover:opacity-100 p-1 text-white/40 hover:text-red-400 transition-all"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
