import { useState } from 'react'
import { motion } from 'motion/react'
import { UserPlus, Crown, X, Check } from 'lucide-react'
import { Language, t } from '../lib/i18n'
import { searchUsers, getUserByUsername } from '../lib/auth'
import { Button } from './ui/button'

type TripRole = 'owner' | 'editor' | 'viewer'

interface TripCollaborator {
  userId: string
  role: TripRole
  joinedAt: string
}

interface TripCollaboratorsProps {
  tripId: string
  ownerId: string
  currentUserId: string
  collaborators: TripCollaborator[]
  invitedUsers: string[]
  language: Language
  onInvite: (userId: string) => void
  onRemove?: (userId: string) => void
}

export function TripCollaborators({
  ownerId,
  currentUserId,
  collaborators,
  invitedUsers,
  language,
  onInvite
}: TripCollaboratorsProps) {
  const [showInvite, setShowInvite] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<any[]>([])

  const handleSearch = (query: string) => {
    setSearchQuery(query)
    if (query.trim().length > 0) {
      const collaboratorIds = collaborators.map(c => c.userId)
      const results = searchUsers(query)
        .filter(u => u.id !== currentUserId && u.id !== ownerId && !collaboratorIds.includes(u.id) && !invitedUsers.includes(u.id))
      setSearchResults(results)
    } else {
      setSearchResults([])
    }
  }

  const handleInviteUser = (userId: string) => {
    onInvite(userId)
    setSearchQuery('')
    setSearchResults([])
    setShowInvite(false)
  }

  // Get user details (with error handling)
  let owner = null
  let collaboratorUsers: any[] = []
  let invitedUsersList: any[] = []
  
  try {
    owner = getUserByUsername(ownerId)
    collaboratorUsers = collaborators.map(collab => {
      try {
        const user = getUserByUsername(collab.userId)
        return user ? { ...user, role: collab.role } : null
      } catch {
        return null
      }
    }).filter(Boolean)
    invitedUsersList = invitedUsers.map(id => {
      try {
        return getUserByUsername(id)
      } catch {
        return null
      }
    }).filter(Boolean)
  } catch (e) {
    console.error('Error fetching user details:', e)
  }

  const isOwner = currentUserId === ownerId

  return (
    <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-white">{t('trip.collaborators', language)}</h3>
        {isOwner && (
          <Button
            onClick={() => setShowInvite(!showInvite)}
            variant="outline"
            size="sm"
            className="border-white/10"
          >
            <UserPlus className="w-4 h-4 mr-2" />
            {t('trip.inviteCollaborator', language)}
          </Button>
        )}
      </div>

      {/* Invite Search */}
      {showInvite && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="mb-4"
        >
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder={t('profile.search.placeholder', language)}
            className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white placeholder:text-white/30"
          />
          
          {searchResults.length > 0 && (
            <div className="mt-2 max-h-48 overflow-y-auto space-y-1">
              {searchResults.map((user) => (
                <button
                  key={user.id}
                  onClick={() => handleInviteUser(user.id)}
                  className="w-full p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors flex items-center gap-3 text-left"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-teal-500 to-cyan-500 flex items-center justify-center">
                    <span className="text-white text-sm">{user.fullName.charAt(0)}</span>
                  </div>
                  <div>
                    <p className="text-white text-sm">{user.fullName}</p>
                    <p className="text-white/40 text-xs">@{user.username}</p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </motion.div>
      )}

      {/* Owner */}
      <div className="space-y-2">
        <div className="flex items-center gap-3 p-3 rounded-lg bg-white/5">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center">
            <Crown className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1">
            <p className="text-white">{owner?.fullName || 'Organizador'}</p>
            <p className="text-white/40 text-sm">{t('trip.owner', language)}</p>
          </div>
          {currentUserId === ownerId && (
            <span className="px-2 py-1 rounded-full bg-white/10 text-white/60 text-xs">
              {t('trip.you', language)}
            </span>
          )}
        </div>

        {/* Collaborators */}
        {collaboratorUsers.map((user: any) => (
          <div key={user.id} className="flex items-center gap-3 p-3 rounded-lg bg-white/5">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-teal-500 to-cyan-500 flex items-center justify-center">
              {user.avatar ? (
                <img src={user.avatar} alt={user.fullName} className="w-full h-full rounded-full object-cover" />
              ) : (
                <span className="text-white">{user.fullName.charAt(0)}</span>
              )}
            </div>
            <div className="flex-1">
              <p className="text-white">{user.fullName}</p>
              <p className="text-white/40 text-sm">
                {t(`trip.${user.role}`, language)}
              </p>
            </div>
            {currentUserId === user.id && (
              <span className="px-2 py-1 rounded-full bg-white/10 text-white/60 text-xs">
                {t('trip.you', language)}
              </span>
            )}
          </div>
        ))}

        {/* Invited Users */}
        {invitedUsersList.map((user: any) => (
          <div key={user.id} className="flex items-center gap-3 p-3 rounded-lg bg-white/5 opacity-60">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-500 to-slate-500 flex items-center justify-center">
              <span className="text-white">{user.fullName.charAt(0)}</span>
            </div>
            <div className="flex-1">
              <p className="text-white">{user.fullName}</p>
              <p className="text-white/40 text-sm">Convite pendente...</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
