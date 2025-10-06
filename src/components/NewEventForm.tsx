'use client'
import { useState } from 'react'
import { X } from 'lucide-react'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Label } from './ui/label'

interface NewEventFormProps {
  onClose: () => void
  onSave: (event: {
    title: string
    location: string
    startDate: string
    endDate: string
    kind: string
  }) => void
  tripId?: string
}

const EVENT_KINDS = [
  { value: 'flight', label: '✈️ Voo' },
  { value: 'hotel', label: '🏨 Hotel' },
  { value: 'activity', label: '🎯 Atividade' },
  { value: 'restaurant', label: '🍽️ Restaurante' },
  { value: 'transport', label: '🚗 Transporte' },
  { value: 'other', label: '📌 Outro' }
]

export function NewEventForm({ onClose, onSave, tripId }: NewEventFormProps) {
  const [title, setTitle] = useState('')
  const [location, setLocation] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [kind, setKind] = useState('activity')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave({
      title,
      location,
      startDate,
      endDate,
      kind
    })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="w-full max-w-2xl rounded-3xl border border-white/10 bg-[#0a0a0a] p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2>Novo Evento</h2>
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
            <Label>Tipo de evento</Label>
            <div className="grid grid-cols-3 gap-3">
              {EVENT_KINDS.map((eventKind) => (
                <button
                  key={eventKind.value}
                  type="button"
                  onClick={() => setKind(eventKind.value)}
                  className={`rounded-xl p-3 border transition-all ${
                    kind === eventKind.value
                      ? 'border-teal-400 bg-teal-400/10 text-teal-400'
                      : 'border-white/10 bg-white/5 hover:border-white/30'
                  }`}
                >
                  {eventKind.label}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="title">Título do evento</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ex: Check-in no hotel"
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
              placeholder="Ex: Hotel Colosseum, Via Roma 123"
              required
              className="bg-white/5 border-white/10"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startDate">Data e hora de início</Label>
              <Input
                id="startDate"
                type="datetime-local"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                required
                className="bg-white/5 border-white/10"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="endDate">Data e hora de término</Label>
              <Input
                id="endDate"
                type="datetime-local"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="bg-white/5 border-white/10"
              />
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
              Criar Evento
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}