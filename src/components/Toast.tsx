'use client'
import { motion, AnimatePresence } from 'motion/react'
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react'
import { useEffect } from 'react'

interface ToastProps {
  message: string
  type?: 'success' | 'error' | 'info'
  isVisible: boolean
  onClose: () => void
  duration?: number
}

export function Toast({ message, type = 'info', isVisible, onClose, duration = 3000 }: ToastProps) {
  useEffect(() => {
    if (isVisible && duration > 0) {
      const timer = setTimeout(onClose, duration)
      return () => clearTimeout(timer)
    }
  }, [isVisible, duration, onClose])

  const icons = {
    success: CheckCircle2,
    error: AlertCircle,
    info: Info
  }

  const colors = {
    success: 'from-green-500/20 to-emerald-500/20 border-green-500/30',
    error: 'from-red-500/20 to-pink-500/20 border-red-500/30',
    info: 'from-blue-500/20 to-cyan-500/20 border-blue-500/30'
  }

  const iconColors = {
    success: 'text-green-400',
    error: 'text-red-400',
    info: 'text-blue-400'
  }

  const Icon = icons[type]

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -50, scale: 0.3 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.2 } }}
          transition={{ type: "spring", stiffness: 500, damping: 25 }}
          className="fixed top-4 right-4 z-50"
        >
          <motion.div
            className={`bg-gradient-to-br ${colors[type]} backdrop-blur-md border rounded-lg px-4 py-3 shadow-lg max-w-md flex items-center gap-3`}
            whileHover={{ scale: 1.02 }}
          >
            <motion.div
              initial={{ rotate: -180, scale: 0 }}
              animate={{ rotate: 0, scale: 1 }}
              transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
            >
              <Icon className={`w-5 h-5 ${iconColors[type]}`} />
            </motion.div>
            
            <p className="text-white/90 flex-1">{message}</p>
            
            <motion.button
              onClick={onClose}
              className="text-white/40 hover:text-white/90 transition-colors"
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
            >
              <X className="w-4 h-4" />
            </motion.button>

            {/* Progress bar */}
            {duration > 0 && (
              <motion.div
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-white/20"
                initial={{ scaleX: 1 }}
                animate={{ scaleX: 0 }}
                transition={{ duration: duration / 1000, ease: "linear" }}
                style={{ transformOrigin: "left" }}
              />
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
