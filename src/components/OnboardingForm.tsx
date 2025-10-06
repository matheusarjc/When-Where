'use client'
import { useState } from 'react'
import { motion } from 'motion/react'
import { Sparkles } from 'lucide-react'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { Language, languageNames, t } from '../lib/i18n'

interface OnboardingFormProps {
  onComplete: (data: {
    name: string
    language: Language
    theme: 'teal' | 'purple' | 'blue' | 'pink'
  }) => void
}

export function OnboardingForm({ onComplete }: OnboardingFormProps) {
  const [name, setName] = useState('')
  const [language, setLanguage] = useState<Language>('pt-BR')
  const [theme, setTheme] = useState<'teal' | 'purple' | 'blue' | 'pink'>('teal')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (name.trim()) {
      onComplete({ name: name.trim(), language, theme })
    }
  }

  const themeColors = {
    teal: { bg: 'bg-teal-400', border: 'border-teal-400', ring: 'ring-teal-400/50' },
    purple: { bg: 'bg-purple-500', border: 'border-purple-500', ring: 'ring-purple-500/50' },
    blue: { bg: 'bg-blue-500', border: 'border-blue-500', ring: 'ring-blue-500/50' },
    pink: { bg: 'bg-pink-500', border: 'border-pink-500', ring: 'ring-pink-500/50' }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0a0a0a] via-[#0f0f1a] to-[#0a0a0a] text-white p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-lg"
      >
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring' }}
            className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-teal-400 to-purple-500 mb-6"
          >
            <Sparkles className="h-8 w-8 text-white" />
          </motion.div>
          <h1 className="mb-2">{t('onboarding.welcome', language)}</h1>
          <p className="text-white/60">{t('onboarding.subtitle', language)}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 rounded-3xl border border-white/10 bg-white/[0.02] backdrop-blur p-8">
          <div className="space-y-2">
            <Label htmlFor="name">{t('onboarding.name.label', language)}</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t('onboarding.name.placeholder', language)}
              required
              className="bg-white/5 border-white/10 h-12"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="language">{t('onboarding.language.label', language)}</Label>
            <Select value={language} onValueChange={(value) => setLanguage(value as Language)}>
              <SelectTrigger className="bg-white/5 border-white/10 h-12">
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
            <Label>{t('onboarding.theme.label', language)}</Label>
            <div className="grid grid-cols-2 gap-3">
              {(['teal', 'purple', 'blue', 'pink'] as const).map((themeOption) => (
                <button
                  key={themeOption}
                  type="button"
                  onClick={() => setTheme(themeOption)}
                  className={`relative rounded-xl p-4 border-2 transition-all ${
                    theme === themeOption
                      ? `${themeColors[themeOption].border} ring-2 ${themeColors[themeOption].ring} bg-white/5`
                      : 'border-white/10 bg-white/[0.02] hover:border-white/30'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full ${themeColors[themeOption].bg}`} />
                    <span>
                      {themeOption === 'teal' && t('onboarding.theme.teal', language)}
                      {themeOption === 'purple' && t('onboarding.theme.purple', language)}
                      {themeOption === 'blue' && t('onboarding.theme.blue', language)}
                      {themeOption === 'pink' && t('onboarding.theme.pink', language)}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <Button
            type="submit"
            className={`w-full h-12 ${themeColors[theme].bg} text-black hover:opacity-90`}
          >
            {t('onboarding.start', language)}
          </Button>
        </form>
      </motion.div>
    </div>
  )
}