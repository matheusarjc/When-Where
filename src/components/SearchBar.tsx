'use client'
import { Search, X } from 'lucide-react'
import { Input } from './ui/input'
import { motion, AnimatePresence, useReducedMotion } from 'motion/react'

interface SearchBarProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

export function SearchBar({ value, onChange, placeholder = 'Buscar...' }: SearchBarProps) {
  const prefersReducedMotion = useReducedMotion()
  
  return (
    <div className="relative group">
      <motion.div
        animate={value ? { scale: prefersReducedMotion ? 1 : [1, 1.1, 1] } : {}}
        transition={{ duration: 0.3 }}
      >
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30 group-focus-within:text-teal-400 transition-colors" />
      </motion.div>
      
      <Input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="pl-11 pr-11 bg-white/[0.02] border-white/5 text-white placeholder:text-white/20 focus:border-teal-500/30 focus:bg-white/[0.04] transition-all duration-300"
      />
      
      <AnimatePresence>
        {value && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8, rotate: -90 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            exit={{ opacity: 0, scale: 0.8, rotate: 90 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => onChange('')}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/90 transition-colors"
          >
            <X className="h-4 w-4" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Focus ring animation */}
      <motion.div
        className="absolute inset-0 rounded-lg border border-teal-500/30 pointer-events-none opacity-0 group-focus-within:opacity-100"
        initial={false}
        animate={{
          scale: [1, 1.02, 1]
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          repeatType: "reverse"
        }}
      />
    </div>
  )
}