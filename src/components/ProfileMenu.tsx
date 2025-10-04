import { motion, AnimatePresence } from 'motion/react'
import { User, Settings, LogOut } from 'lucide-react'
import { Language, t } from '../lib/i18n'
import { UserProfile } from '../lib/types'

interface ProfileMenuProps {
  user: UserProfile
  language: Language
  isOpen: boolean
  onClose: () => void
  onViewProfile: () => void
  onSettings: () => void
  onLogout: () => void
}

export function ProfileMenu({
  user,
  language,
  isOpen,
  onClose,
  onViewProfile,
  onSettings,
  onLogout
}: ProfileMenuProps) {
  if (!isOpen) return null

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40"
        onClick={onClose}
      />

      {/* Menu */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: -10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: -10 }}
        className="absolute right-0 top-12 w-64 bg-white/10 backdrop-blur-xl rounded-2xl border border-white/10 overflow-hidden z-50"
      >
        {/* User Info */}
        <div className="p-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-teal-500 to-cyan-500 p-0.5 flex-shrink-0">
              <div className="w-full h-full rounded-full bg-gray-900 flex items-center justify-center overflow-hidden">
                {user.avatar ? (
                  <img src={user.avatar} alt={user.fullName} className="w-full h-full object-cover" />
                ) : (
                  <User className="w-5 h-5 text-white" />
                )}
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white truncate">{user.fullName}</p>
              <p className="text-white/40 text-sm truncate">@{user.username}</p>
            </div>
          </div>
        </div>

        {/* Menu Items */}
        <div className="py-2">
          <button
            onClick={() => {
              onViewProfile()
              onClose()
            }}
            className="w-full px-4 py-3 flex items-center gap-3 hover:bg-white/5 transition-colors text-left"
          >
            <User className="w-5 h-5 text-white/60" />
            <span className="text-white">{t('profile.title', language)}</span>
          </button>

          <button
            onClick={() => {
              onSettings()
              onClose()
            }}
            className="w-full px-4 py-3 flex items-center gap-3 hover:bg-white/5 transition-colors text-left"
          >
            <Settings className="w-5 h-5 text-white/60" />
            <span className="text-white">{t('profile.settings', language)}</span>
          </button>

          <div className="my-2 h-px bg-white/10" />

          <button
            onClick={() => {
              onLogout()
              onClose()
            }}
            className="w-full px-4 py-3 flex items-center gap-3 hover:bg-red-500/10 transition-colors text-left"
          >
            <LogOut className="w-5 h-5 text-red-400" />
            <span className="text-red-400">{t('auth.logout', language)}</span>
          </button>
        </div>
      </motion.div>
    </>
  )
}
