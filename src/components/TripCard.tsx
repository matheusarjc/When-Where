'use client'
import { motion, useReducedMotion } from 'motion/react'
import { MapPin, Calendar } from 'lucide-react'
import { Countdown } from './Countdown'

interface TripCardProps {
  id: string
  title: string
  location: string
  startDate: string
  endDate: string
  coverUrl: string
  onClick: () => void
  index?: number
}

export function TripCard({
  title,
  location,
  startDate,
  endDate,
  coverUrl,
  onClick,
  index = 0
}: TripCardProps) {
  const prefersReducedMotion = useReducedMotion()
  const start = new Date(startDate)
  const end = new Date(endDate)
  const now = new Date()
  const isUpcoming = start > now
  const isOngoing = start <= now && end >= now

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'short'
    })
  }

  return (
    <motion.button
      initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        delay: prefersReducedMotion ? 0 : index * 0.1,
        type: "spring",
        stiffness: 260,
        damping: 20
      }}
      whileHover={{ 
        scale: prefersReducedMotion ? 1 : 1.02,
        y: prefersReducedMotion ? 0 : -4,
        transition: { type: "spring", stiffness: 400, damping: 10 }
      }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="w-full rounded-lg overflow-hidden text-left group relative"
    >
      {/* Glow effect on hover */}
      <motion.div 
        className="absolute -inset-0.5 bg-gradient-to-r from-teal-500 to-purple-500 rounded-lg opacity-0 group-hover:opacity-20 blur-sm transition-opacity duration-300"
        aria-hidden="true"
      />
      
      <div className="relative h-48 w-full overflow-hidden rounded-lg">
        <motion.img 
          src={coverUrl} 
          alt={title} 
          className="w-full h-full object-cover"
          whileHover={{ scale: prefersReducedMotion ? 1 : 1.05 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        
        {isUpcoming && (
          <motion.div 
            className="absolute top-4 right-4"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            <div className="bg-black/50 backdrop-blur-sm px-3 py-1.5 rounded-full text-white/90">
              <Countdown to={startDate} />
            </div>
          </motion.div>
        )}
        
        {isOngoing && (
          <motion.div 
            className="absolute top-4 right-4"
            animate={{ scale: prefersReducedMotion ? 1 : [1, 1.05, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <div className="bg-green-500/20 backdrop-blur-sm px-3 py-1.5 rounded-full text-green-400 flex items-center gap-1.5">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              Em andamento
            </div>
          </motion.div>
        )}

        <div className="absolute bottom-4 left-4 right-4">
          <motion.h3 
            className="mb-1 text-white"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            {title}
          </motion.h3>
          <motion.div 
            className="text-white/70 flex items-center gap-1"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.35 }}
          >
            <MapPin className="w-3 h-3" />
            {location}
          </motion.div>
        </div>
      </div>

      <motion.div 
        className="p-4 bg-black/20 backdrop-blur-sm text-white/40 relative overflow-hidden"
        whileHover={{ backgroundColor: "rgba(0,0,0,0.3)" }}
      >
        <Calendar className="w-3 h-3 inline mr-1.5" />
        {formatDate(start)} - {formatDate(end)}
        
        {/* Shine effect */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent"
          initial={{ x: '-100%' }}
          whileHover={{ x: '100%' }}
          transition={{ duration: 0.6 }}
        />
      </motion.div>
    </motion.button>
  )
}