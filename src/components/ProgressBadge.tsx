'use client'
import { motion, useReducedMotion } from 'motion/react'
import { Trophy, Star, Zap, Target } from 'lucide-react'

interface ProgressBadgeProps {
  type: 'trips' | 'memories' | 'events' | 'streak'
  count: number
  milestone?: number
  label: string
}

export function ProgressBadge({ type, count, milestone = 10, label }: ProgressBadgeProps) {
  const prefersReducedMotion = useReducedMotion()
  const progress = Math.min((count / milestone) * 100, 100)
  const isComplete = count >= milestone

  const icons = {
    trips: Trophy,
    memories: Star,
    events: Target,
    streak: Zap
  }

  const colors = {
    trips: {
      gradient: 'from-yellow-500 to-orange-500',
      glow: 'shadow-yellow-500/50'
    },
    memories: {
      gradient: 'from-purple-500 to-pink-500',
      glow: 'shadow-purple-500/50'
    },
    events: {
      gradient: 'from-blue-500 to-cyan-500',
      glow: 'shadow-blue-500/50'
    },
    streak: {
      gradient: 'from-green-500 to-emerald-500',
      glow: 'shadow-green-500/50'
    }
  }

  const Icon = icons[type]
  const color = colors[type]

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ 
        scale: prefersReducedMotion ? 1 : 1.05,
        transition: { type: "spring", stiffness: 400 }
      }}
      className="relative"
    >
      <div className={`bg-white/5 border border-white/10 rounded-lg p-4 ${isComplete ? `shadow-lg ${color.glow}` : ''}`}>
        <div className="flex items-center gap-3 mb-3">
          <motion.div
            className={`p-2 rounded-lg bg-gradient-to-br ${color.gradient} ${isComplete ? 'shadow-lg' : ''}`}
            animate={isComplete && !prefersReducedMotion ? {
              scale: [1, 1.1, 1],
              rotate: [0, 5, -5, 0]
            } : {}}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Icon className="w-5 h-5 text-white" />
          </motion.div>
          
          <div className="flex-1">
            <p className="text-white/60 text-sm">{label}</p>
            <p className="text-white">
              {count} / {milestone}
            </p>
          </div>

          {isComplete && (
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
            >
              <div className="bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full p-1">
                <Star className="w-4 h-4 text-white fill-white" />
              </div>
            </motion.div>
          )}
        </div>

        {/* Progress bar */}
        <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
          <motion.div
            className={`h-full bg-gradient-to-r ${color.gradient} rounded-full`}
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
          />
        </div>

        {/* Completion sparkles */}
        {isComplete && !prefersReducedMotion && (
          <>
            <motion.div
              className="absolute -top-1 -right-1 w-2 h-2 bg-yellow-400 rounded-full"
              animate={{
                scale: [0, 1, 0],
                opacity: [0, 1, 0]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: 0
              }}
            />
            <motion.div
              className="absolute top-2 -right-2 w-1.5 h-1.5 bg-orange-400 rounded-full"
              animate={{
                scale: [0, 1, 0],
                opacity: [0, 1, 0]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: 0.5
              }}
            />
            <motion.div
              className="absolute -top-2 right-2 w-1 h-1 bg-yellow-300 rounded-full"
              animate={{
                scale: [0, 1, 0],
                opacity: [0, 1, 0]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: 1
              }}
            />
          </>
        )}
      </div>
    </motion.div>
  )
}
