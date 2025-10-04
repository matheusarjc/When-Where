'use client'
import { useEffect, useState } from 'react'
import { motion } from 'motion/react'

interface DynamicCoverProps {
  imageUrl: string
  title: string
  location?: string
  startDate?: string
}

export function DynamicCover({ imageUrl, title, location, startDate }: DynamicCoverProps) {
  const [gradient, setGradient] = useState('from-amber-500/40 via-orange-500/30 to-transparent')

  useEffect(() => {
    // Simulação do gradiente circadiano baseado no horário local
    const hour = new Date().getHours()
    
    if (hour >= 5 && hour < 12) {
      // Manhã: tons quentes amarelados
      setGradient('from-amber-400/40 via-orange-400/30 to-transparent')
    } else if (hour >= 12 && hour < 18) {
      // Tarde: tons alaranjados
      setGradient('from-orange-500/40 via-pink-500/30 to-transparent')
    } else if (hour >= 18 && hour < 21) {
      // Entardecer: tons roxos e rosas
      setGradient('from-purple-600/40 via-pink-600/30 to-transparent')
    } else {
      // Noite: tons azuis profundos e teal
      setGradient('from-blue-900/60 via-teal-800/40 to-transparent')
    }
  }, [])

  return (
    <div className="relative w-full h-72 overflow-hidden rounded-lg">
      <img
        src={imageUrl}
        alt={title}
        className="w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
      
      <div className="absolute bottom-0 left-0 right-0 p-8">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="mb-2"
        >
          {title}
        </motion.h1>
        {location && (
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="text-white/60"
          >
            {location}
          </motion.p>
        )}
      </div>
    </div>
  )
}