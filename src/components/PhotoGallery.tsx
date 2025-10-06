'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { X, ChevronLeft, ChevronRight } from 'lucide-react'
import Masonry, { ResponsiveMasonry } from 'react-responsive-masonry'

interface Photo {
  id: string
  url: string
  caption: string
  date: string
}

interface PhotoGalleryProps {
  photos: Photo[]
}

function PhotoGalleryComponent({ photos }: PhotoGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)

  // Safety check
  if (!photos || !Array.isArray(photos) || photos.length === 0) {
    return null
  }

  const handlePrevious = () => {
    if (selectedIndex !== null && selectedIndex > 0) {
      setSelectedIndex(selectedIndex - 1)
    }
  }

  const handleNext = () => {
    if (selectedIndex !== null && selectedIndex < photos.length - 1) {
      setSelectedIndex(selectedIndex + 1)
    }
  }

  const handleKeyDown = (e: KeyboardEvent) => {
    if (selectedIndex === null) return
    if (e.key === 'ArrowLeft') handlePrevious()
    if (e.key === 'ArrowRight') handleNext()
    if (e.key === 'Escape') setSelectedIndex(null)
  }

  return (
    <>
      <ResponsiveMasonry columnsCountBreakPoints={{ 350: 1, 750: 2, 900: 3 }}>
        <Masonry gutter="1.5rem">
          {photos.map((photo, index) => (
            <motion.button
              key={photo.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05, duration: 0.4 }}
              whileHover={{ opacity: 0.8 }}
              onClick={() => setSelectedIndex(index)}
              className="w-full rounded-lg overflow-hidden transition-opacity focus:outline-none"
            >
              <img
                src={photo.url}
                alt={photo.caption}
                className="w-full h-auto object-cover"
                loading="lazy"
              />
            </motion.button>
          ))}
        </Masonry>
      </ResponsiveMasonry>

      {/* Lightbox */}
      <AnimatePresence>
        {selectedIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedIndex(null)}
            onKeyDown={(e: any) => handleKeyDown(e)}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-sm p-4"
            role="dialog"
            aria-modal="true"
            aria-label="Visualização de foto"
          >
            <button
              onClick={() => setSelectedIndex(null)}
              className="absolute top-6 right-6 p-2 text-white/40 hover:text-white transition-colors z-10"
              aria-label="Fechar"
            >
              <X className="h-6 w-6" />
            </button>

            {selectedIndex > 0 && (
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  handlePrevious()
                }}
                className="absolute left-6 p-2 text-white/40 hover:text-white transition-colors z-10"
                aria-label="Anterior"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>
            )}

            {selectedIndex < photos.length - 1 && (
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  handleNext()
                }}
                className="absolute right-6 p-2 text-white/40 hover:text-white transition-colors z-10"
                aria-label="Próxima"
              >
                <ChevronRight className="h-6 w-6" />
              </button>
            )}

            <motion.div
              key={selectedIndex}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
              onClick={(e) => e.stopPropagation()}
              className="max-w-6xl w-full"
            >
              <img
                src={photos[selectedIndex].url}
                alt={photos[selectedIndex].caption}
                className="w-full h-auto max-h-[85vh] object-contain rounded-lg"
              />
              {photos[selectedIndex].caption && (
                <div className="mt-6 text-center">
                  <p className="text-white/90">{photos[selectedIndex].caption}</p>
                  <p className="text-white/30 mt-2">
                    {new Date(photos[selectedIndex].date).toLocaleDateString('pt-BR', {
                      day: '2-digit',
                      month: 'long',
                      year: 'numeric'
                    })}
                  </p>
                </div>
              )}
              <div className="text-center mt-3 text-white/20">
                {selectedIndex + 1} / {photos.length}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export { PhotoGalleryComponent as PhotoGallery }