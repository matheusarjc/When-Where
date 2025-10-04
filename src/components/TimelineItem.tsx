'use client'
import { motion, useReducedMotion } from 'motion/react'
import { MapPin, Clock } from 'lucide-react'

interface TimelineItemProps {
  title: string
  when: string
  meta?: string
  index?: number
}

export function TimelineItem({ title, when, meta, index = 0 }: TimelineItemProps) {
  const prefersReducedMotion = useReducedMotion()
  
  return (
    <motion.div
      initial={{ opacity: 0, x: prefersReducedMotion ? 0 : -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ 
        delay: prefersReducedMotion ? 0 : index * 0.08,
        type: "spring",
        stiffness: 300,
        damping: 25
      }}
      whileHover={{ 
        x: prefersReducedMotion ? 0 : 4,
        transition: { type: "spring", stiffness: 400, damping: 10 }
      }}
      className="relative pl-6 group"
    >
      <div className="text-white/30 mb-2 flex items-center gap-1.5 text-sm">
        <Clock className="w-3 h-3" />
        {when}
      </div>
      <motion.div 
        className="text-white/90"
        whileHover={{ color: "rgba(255,255,255,1)" }}
      >
        {title}
      </motion.div>
      {meta && (
        <div className="mt-1.5 text-white/40 flex items-center gap-1.5 text-sm">
          <MapPin className="w-3 h-3" />
          {meta}
        </div>
      )}
      
      {/* Animated dot */}
      <motion.div
        className="absolute left-[-3px] top-1 h-2 w-2 rounded-full bg-teal-400/60"
        aria-hidden="true"
        animate={{
          scale: prefersReducedMotion ? 1 : [1, 1.2, 1],
          boxShadow: [
            "0 0 0 0 rgba(45, 212, 191, 0.4)",
            "0 0 0 4px rgba(45, 212, 191, 0)",
            "0 0 0 0 rgba(45, 212, 191, 0)"
          ]
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          repeatDelay: 3
        }}
      />
      
      {/* Hover glow */}
      <motion.div
        className="absolute left-[-6px] top-[-2px] h-4 w-4 rounded-full bg-teal-400/20 opacity-0 group-hover:opacity-100"
        aria-hidden="true"
        animate={{
          scale: prefersReducedMotion ? 1 : [1, 1.3, 1]
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity
        }}
      />
    </motion.div>
  )
}