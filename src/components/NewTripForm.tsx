'use client'
import { useState } from 'react'
import { X } from 'lucide-react'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Label } from './ui/label'

interface NewTripFormProps {
  onClose: () => void
  onSave: (trip: {
    title: string
    location: string
    startDate: string
    endDate: string
    coverUrl: string
  }) => void
}

const DEFAULT_COVERS = [
  'https://images.unsplash.com/photo-1712595706714-a5c5ba55edfb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0cmF2ZWwlMjBkZXN0aW5hdGlvbiUyMHN1bnNldHxlbnwxfHx8fDE3NTkzNjIwMDV8MA&ixlib=rb-4.1.0&q=80&w=1080',
  'https://images.unsplash.com/photo-1513563326940-e76e4641069e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaXR5JTIwc2t5bGluZSUyMG5pZ2h0fGVufDF8fHx8MTc1OTM4MzgwN3ww&ixlib=rb-4.1.0&q=80&w=1080',
  'https://images.unsplash.com/photo-1702743599501-a821d0b38b66?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiZWFjaCUyMHBhcmFkaXNlJTIwdHJvcGljYWx8ZW58MXx8fHwxNzU5NDI0NzA4fDA&ixlib=rb-4.1.0&q=80&w=1080',
  'https://images.unsplash.com/photo-1631684181713-e697596d2165?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb3VudGFpbiUyMGxhbmRzY2FwZSUyMGFkdmVudHVyZXxlbnwxfHx8fDE3NTk0MjMyOTJ8MA&ixlib=rb-4.1.0&q=80&w=1080'
]

export function NewTripForm({ onClose, onSave }: NewTripFormProps) {
  const [title, setTitle] = useState('')
  const [location, setLocation] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [selectedCover, setSelectedCover] = useState(DEFAULT_COVERS[0])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave({
      title,
      location,
      startDate,
      endDate,
      coverUrl: selectedCover
    })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="w-full max-w-2xl rounded-3xl border border-white/10 bg-[#0a0a0a] p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2>Nova Viagem</h2>
          <button
            onClick={onClose}
            className="rounded-full p-2 hover:bg-white/10 transition-colors"
            aria-label="Fechar"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">Título da viagem</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ex: Verão em Roma"
              required
              className="bg-white/5 border-white/10"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">Local</Label>
            <Input
              id="location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Ex: Roma, Itália"
              required
              className="bg-white/5 border-white/10"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startDate">Data de início</Label>
              <Input
                id="startDate"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                required
                className="bg-white/5 border-white/10"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="endDate">Data de término</Label>
              <Input
                id="endDate"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                required
                className="bg-white/5 border-white/10"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Escolha uma imagem de capa</Label>
            <div className="grid grid-cols-2 gap-3">
              {DEFAULT_COVERS.map((cover, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => setSelectedCover(cover)}
                  className={`relative h-32 rounded-xl overflow-hidden border-2 transition-all ${
                    selectedCover === cover
                      ? 'border-teal-400 ring-2 ring-teal-400/50'
                      : 'border-white/10 hover:border-white/30'
                  }`}
                >
                  <img src={cover} alt={`Cover ${index + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1"
            >
              Cancelar
            </Button>
            <Button type="submit" className="flex-1 bg-teal-400 text-black hover:bg-teal-500">
              Criar Viagem
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}