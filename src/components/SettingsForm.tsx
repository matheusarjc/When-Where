'use client'
import { useState } from 'react'
import { X } from 'lucide-react'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { Language, languageNames, t } from '../lib/i18n'

interface SettingsFormProps {
  currentSettings: {
    name: string
    language: Language
    theme: 'teal' | 'purple' | 'blue' | 'pink'
  }
  onClose: () => void
  onSave: (settings: {
    name: string
    language: Language
    theme: 'teal' | 'purple' | 'blue' | 'pink'
  }) => void
}

export function SettingsForm({ currentSettings, onClose, onSave }: SettingsFormProps) {
  const [name, setName] = useState(currentSettings.name)
  const [language, setLanguage] = useState(currentSettings.language)
  const [theme, setTheme] = useState(currentSettings.theme)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (name.trim()) {
      onSave({ name: name.trim(), language, theme })
    }
  }

  const themeColors = {
    teal: { bg: 'bg-teal-400', border: 'border-teal-400', ring: 'ring-teal-400/50' },
    purple: { bg: 'bg-purple-500', border: 'border-purple-500', ring: 'ring-purple-500/50' },
    blue: { bg: 'bg-blue-500', border: 'border-blue-500', ring: 'ring-blue-500/50' },
    pink: { bg: 'bg-pink-500', border: 'border-pink-500', ring: 'ring-pink-500/50' }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="w-full max-w-2xl rounded-3xl border border-white/10 bg-[#0a0a0a] p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2>{t('settings.title', language)}</h2>
          <button
            onClick={onClose}
            className="rounded-full p-2 hover:bg-white/10 transition-colors"
            aria-label="Fechar"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <h3>{t('settings.profile', language)}</h3>
            
            <div className="space-y-2">
              <Label htmlFor="name">{t('settings.name', language)}</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="bg-white/5 border-white/10"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="language">{t('settings.language', language)}</Label>
              <Select value={language} onValueChange={(value) => setLanguage(value as Language)}>
                <SelectTrigger className="bg-white/5 border-white/10">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(languageNames).map(([code, name]) => (
                    <SelectItem key={code} value={code}>
                      {name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>{t('settings.theme', language)}</Label>
              <div className="grid grid-cols-2 gap-3">
                {(['teal', 'purple', 'blue', 'pink'] as const).map((themeOption) => (
                  <button
                    key={themeOption}
                    type="button"
                    onClick={() => setTheme(themeOption)}
                    className={`relative rounded-xl p-3 border-2 transition-all ${
                      theme === themeOption
                        ? `${themeColors[themeOption].border} ring-2 ${themeColors[themeOption].ring} bg-white/5`
                        : 'border-white/10 bg-white/[0.02] hover:border-white/30'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-6 h-6 rounded-full ${themeColors[themeOption].bg}`} />
                      <span className="capitalize">{themeOption}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1"
            >
              {t('action.cancel', language)}
            </Button>
            <Button type="submit" className={`flex-1 ${themeColors[theme].bg} text-black hover:opacity-90`}>
              {t('settings.save', language)}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}