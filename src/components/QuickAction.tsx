import { motion, useReducedMotion } from 'motion/react'
import { LucideIcon } from 'lucide-react'

interface QuickActionProps {
  icon: LucideIcon
  title: string
  description: string
  count?: number
  onClick: () => void
  index: number
  gradient: string
}

export function QuickAction({
  icon: Icon,
  title,
  description,
  count,
  onClick,
  index,
  gradient
}: QuickActionProps) {
  const prefersReducedMotion = useReducedMotion()

  return (
    <motion.button
      initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        delay: prefersReducedMotion ? 0 : index * 0.1,
        type: "spring",
        stiffness: 300,
        damping: 30
      }}
      whileHover={{ 
        scale: prefersReducedMotion ? 1 : 1.02,
        y: prefersReducedMotion ? 0 : -4
      }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="relative p-6 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:border-white/20 transition-all duration-300 text-left group overflow-hidden"
    >
      {/* Background gradient on hover */}
      <motion.div
        initial={{ opacity: 0 }}
        whileHover={{ opacity: 0.1 }}
        transition={{ duration: 0.3 }}
        className={`absolute inset-0 ${gradient}`}
      />

      {/* Shimmer effect */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent"
        initial={{ x: '-100%' }}
        whileHover={{ x: '100%' }}
        transition={{ duration: 0.8, ease: "easeInOut" }}
      />

      <div className="relative z-10">
        {/* Icon with animated background */}
        <motion.div
          whileHover={{ rotate: prefersReducedMotion ? 0 : [0, -5, 5, 0] }}
          transition={{ duration: 0.4 }}
          className="mb-4 inline-flex"
        >
          <div className={`p-3 rounded-xl ${gradient} bg-opacity-20 backdrop-blur-sm group-hover:shadow-lg transition-shadow duration-300`}>
            <Icon className="w-6 h-6 text-white" />
          </div>
        </motion.div>

        {/* Content */}
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <h3 className="text-white">{title}</h3>
            {count !== undefined && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: index * 0.1 + 0.2, type: "spring" }}
                className="px-2 py-1 rounded-full bg-white/10 text-white/60"
              >
                {count}
              </motion.span>
            )}
          </div>
          <p className="text-white/40">{description}</p>
        </div>

        {/* Arrow indicator */}
        <motion.div
          initial={{ x: 0, opacity: 0 }}
          whileHover={{ x: 5, opacity: 1 }}
          className="absolute right-6 top-1/2 -translate-y-1/2"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="text-white/20 group-hover:text-white/40 transition-colors"
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
      </div>
    </motion.button>
  )
}
