'use client'
import { motion } from 'motion/react'

interface LoadingSkeletonProps {
  type?: 'card' | 'list' | 'text'
  count?: number
}

export function LoadingSkeleton({ type = 'card', count = 3 }: LoadingSkeletonProps) {
  const shimmer = {
    initial: { x: '-100%' },
    animate: { x: '100%' }
  }

  if (type === 'card') {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: count }).map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="rounded-lg overflow-hidden bg-white/[0.02]"
          >
            <div className="relative h-48 bg-white/5 overflow-hidden">
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent"
                variants={shimmer}
                initial="initial"
                animate="animate"
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
            </div>
            <div className="p-5 space-y-3">
              <div className="h-4 bg-white/5 rounded w-3/4 overflow-hidden relative">
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent"
                  variants={shimmer}
                  initial="initial"
                  animate="animate"
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 0.2
                  }}
                />
              </div>
              <div className="h-3 bg-white/5 rounded w-1/2 overflow-hidden relative">
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent"
                  variants={shimmer}
                  initial="initial"
                  animate="animate"
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 0.3
                  }}
                />
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    )
  }

  if (type === 'list') {
    return (
      <div className="space-y-4">
        {Array.from({ length: count }).map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05 }}
            className="flex items-center gap-4 p-4 bg-white/[0.02] rounded-lg"
          >
            <div className="h-12 w-12 bg-white/5 rounded-full overflow-hidden relative">
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent"
                variants={shimmer}
                initial="initial"
                animate="animate"
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
            </div>
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-white/5 rounded w-2/3 overflow-hidden relative">
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent"
                  variants={shimmer}
                  initial="initial"
                  animate="animate"
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 0.1
                  }}
                />
              </div>
              <div className="h-3 bg-white/5 rounded w-1/2 overflow-hidden relative">
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent"
                  variants={shimmer}
                  initial="initial"
                  animate="animate"
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 0.2
                  }}
                />
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-2">
      {Array.from({ length: count }).map((_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: i * 0.1 }}
          className="h-4 bg-white/5 rounded overflow-hidden relative"
          style={{ width: `${Math.random() * 40 + 60}%` }}
        >
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent"
            variants={shimmer}
            initial="initial"
            animate="animate"
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.1
            }}
          />
        </motion.div>
      ))}
    </div>
  )
}
