import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { Search, X, Lock, Globe } from 'lucide-react'
import { Input } from './ui/input'
import { Language, t } from '../lib/i18n'
import { UserProfile } from '../lib/types'
import { searchUsers } from '../lib/auth'

interface SearchUsersProps {
  language: Language
  currentUserId: string
  onSelectUser: (user: UserProfile) => void
  onClose: () => void
}

export function SearchUsers({ language, currentUserId, onSelectUser, onClose }: SearchUsersProps) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<UserProfile[]>([])

  useEffect(() => {
    if (query.trim().length > 0) {
      const users = searchUsers(query).filter(u => u.id !== currentUserId)
      setResults(users)
    } else {
      setResults([])
    }
  }, [query, currentUserId])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-start justify-center p-4 pt-20"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-2xl bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 overflow-hidden"
      >
        {/* Search Header */}
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
              <Input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={t('profile.search.placeholder', language)}
                className="pl-10 bg-white/5 border-white/10 text-white"
                autoFocus
              />
            </div>
            <button
              onClick={onClose}
              className="p-2 text-white/60 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Results */}
        <div className="max-h-[60vh] overflow-y-auto">
          <AnimatePresence mode="popLayout">
            {results.length === 0 && query.trim().length > 0 ? (
              <div className="p-8 text-center text-white/40">
                Nenhum usuário encontrado
              </div>
            ) : (
              results.map((user, index) => (
                <motion.button
                  key={user.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => {
                    onSelectUser(user)
                    onClose()
                  }}
                  className="w-full p-4 flex items-center gap-4 hover:bg-white/5 transition-colors border-b border-white/5 last:border-0"
                >
                  {/* Avatar */}
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-br from-teal-500 to-cyan-500 p-0.5">
                    <div className="w-full h-full rounded-full bg-gray-900 flex items-center justify-center overflow-hidden">
                      {user.avatar ? (
                        <img src={user.avatar} alt={user.fullName} className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-white">
                          {user.fullName.charAt(0).toUpperCase()}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* User Info */}
                  <div className="flex-1 text-left">
                    <div className="flex items-center gap-2">
                      <span className="text-white">{user.fullName}</span>
                      {user.isPublic ? (
                        <Globe className="w-3 h-3 text-white/40" />
                      ) : (
                        <Lock className="w-3 h-3 text-white/40" />
                      )}
                    </div>
                    <p className="text-white/40">@{user.username}</p>
                    {user.bio && (
                      <p className="text-white/30 text-sm mt-1 line-clamp-1">{user.bio}</p>
                    )}
                  </div>

                  {/* Stats */}
                  <div className="text-right">
                    <div className="text-white/40 text-sm">
                      {user.followers.length} {t('profile.followers', language)}
                    </div>
                  </div>
                </motion.button>
              ))
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </motion.div>
  )
}
