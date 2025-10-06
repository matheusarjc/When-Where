import { motion } from 'motion/react'
import { Calendar, Image, DollarSign, FileText, CheckSquare } from 'lucide-react'
import { Language, t } from '../lib/i18n'

type TabType = 'timeline' | 'memories' | 'expenses' | 'gallery' | 'checklist'

interface TripTabsProps {
  activeTab: TabType
  onTabChange: (tab: TabType) => void
  language: Language
  counts: {
    events: number
    memories: number
    expenses: number
    photos: number
    checklist: number
  }
}

export function TripTabs({ activeTab, onTabChange, language, counts }: TripTabsProps) {
  const tabs = [
    { id: 'timeline' as const, icon: Calendar, label: t('trip.tabs.timeline', language), count: counts.events },
    { id: 'memories' as const, icon: FileText, label: t('trip.tabs.memories', language), count: counts.memories },
    { id: 'expenses' as const, icon: DollarSign, label: t('trip.tabs.expenses', language), count: counts.expenses },
    { id: 'gallery' as const, icon: Image, label: t('trip.tabs.gallery', language), count: counts.photos },
    { id: 'checklist' as const, icon: CheckSquare, label: t('trip.tabs.checklist', language), count: counts.checklist }
  ]

  return (
    <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
      {tabs.map((tab) => {
        const Icon = tab.icon
        const isActive = activeTab === tab.id
        
        return (
          <motion.button
            key={tab.id}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onTabChange(tab.id)}
            className={`relative px-6 py-3 rounded-xl flex items-center gap-3 transition-all flex-shrink-0 ${
              isActive
                ? 'bg-white/10 text-white border-2 border-white/20'
                : 'bg-white/5 text-white/60 hover:bg-white/10 border-2 border-transparent'
            }`}
          >
            <Icon className="w-5 h-5" />
            <span>{tab.label}</span>
            {tab.count > 0 && (
              <span className={`px-2 py-0.5 rounded-full text-xs ${
                isActive ? 'bg-white/20' : 'bg-white/10'
              }`}>
                {tab.count}
              </span>
            )}
            
            {isActive && (
              <motion.div
                layoutId="activeTab"
                className="absolute inset-0 bg-gradient-to-r from-teal-500/10 to-cyan-500/10 rounded-xl -z-10"
                transition={{ type: 'spring', duration: 0.6 }}
              />
            )}
          </motion.button>
        )
      })}
    </div>
  )
}
