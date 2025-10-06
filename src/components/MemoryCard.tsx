'use client'
import { motion, useReducedMotion } from 'motion/react'
import { Image, FileText, Lightbulb, Calendar, Lock } from 'lucide-react'
import { CapsuleBadge } from './CapsuleBadge'
import { Language, t } from '../lib/i18n'

interface MemoryCardProps {
  id: string
  type: 'note' | 'photo' | 'tip'
  content: string
  mediaUrl?: string
  openAt?: string
  createdAt: string
  index?: number
  language?: Language
}

export function MemoryCard({
  type,
  content,
  mediaUrl,
  openAt,
  createdAt,
  index = 0,
  language = 'pt-BR'
}: MemoryCardProps) {
  const prefersReducedMotion = useReducedMotion()
  const isLocked = openAt && new Date(openAt) > new Date()
  const date = new Date(createdAt)
  const formattedDate = date.toLocaleDateString(language, {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit'
  })

  const getIcon = () => {
    switch (type) {
      case 'photo':
        return <Image className="h-4 w-4" aria-hidden="true" />
      case 'tip':
        return <Lightbulb className="h-4 w-4" aria-hidden="true" />
      default:
        return <FileText className="h-4 w-4" aria-hidden="true" />
    }
  }

  const getTypeLabel = () => {
    switch (type) {
      case 'photo':
        return t('memory.type.photo', language)
      case 'tip':
        return t('memory.type.tip', language)
      default:
        return t('memory.type.note', language)
    }
  }

  const typeColors = {
    photo: 'from-purple-500/10 to-pink-500/10',
    tip: 'from-yellow-500/10 to-orange-500/10',
    note: 'from-blue-500/10 to-teal-500/10'
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        delay: prefersReducedMotion ? 0 : index * 0.1,
        type: "spring",
        stiffness: 260,
        damping: 20
      }}
      whileHover={{ 
        y: prefersReducedMotion ? 0 : -4,
        scale: prefersReducedMotion ? 1 : 1.01,
        transition: { type: "spring", stiffness: 400, damping: 10 }
      }}
      className="rounded-lg overflow-hidden bg-white/[0.02] border border-white/5 relative group"
    >
      {/* Gradient glow effect */}
      <div className={`absolute inset-0 bg-gradient-to-br ${typeColors[type]} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} aria-hidden="true" />
      
      {mediaUrl && !isLocked && (
        <div className="relative h-48 w-full overflow-hidden">
          <motion.img 
            src={mediaUrl} 
            alt="" 
            className="w-full h-full object-cover"
            whileHover={{ scale: prefersReducedMotion ? 1 : 1.05 }}
            transition={{ duration: 0.6 }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        </div>
      )}
      
      <div className="p-5 relative z-10">
        <div className="flex items-center justify-between mb-4">
          <motion.div 
            className="flex items-center gap-2 text-white/40"
            whileHover={{ scale: 1.05 }}
          >
            <motion.div
              animate={{ 
                rotate: prefersReducedMotion ? 0 : [0, 5, -5, 0],
                scale: [1, 1.1, 1]
              }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
            >
              {getIcon()}
            </motion.div>
            {getTypeLabel()}
          </motion.div>
          <div className="text-white/20 text-sm flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            {formattedDate}
          </div>
        </div>

        {openAt && <CapsuleBadge openAt={openAt} isOpen={!isLocked} language={language} />}

        {isLocked ? (
          <motion.div 
            className="mt-4 py-8 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <motion.div
              animate={{ 
                scale: prefersReducedMotion ? 1 : [1, 1.1, 1],
                rotate: prefersReducedMotion ? 0 : [0, -5, 5, 0]
              }}
              transition={{ duration: 2, repeat: Infinity }}
              className="inline-block mb-3"
            >
              <Lock className="w-8 h-8 text-white/20" />
            </motion.div>
            <p className="text-white/30">{t('memory.capsule.locked', language)}</p>
          </motion.div>
        ) : (
          <motion.p 
            className="mt-3 text-white/80 whitespace-pre-wrap leading-relaxed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            {content}
          </motion.p>
        )}
      </div>
    </motion.div>
  )
}