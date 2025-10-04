import { useState } from 'react'
import { motion } from 'motion/react'
import { Settings, MapPin, Users, Lock, Globe, Edit2, Check } from 'lucide-react'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Language, t } from '../lib/i18n'
import { UserProfile } from '../lib/types'
import { TripCard } from './TripCard'
import { setCurrentUser } from '../lib/auth'

interface ProfilePageProps {
  user: UserProfile
  isOwnProfile: boolean
  language: Language
  trips: any[]
  onBack: () => void
  onViewTrip: (tripId: string) => void
  isFollowing?: boolean
  onFollow?: () => void
  onUnfollow?: () => void
  userSettings: any
}

export function ProfilePage({
  user,
  isOwnProfile,
  language,
  trips,
  onBack,
  onViewTrip,
  isFollowing = false,
  onFollow,
  onUnfollow,
  userSettings
}: ProfilePageProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [editedProfile, setEditedProfile] = useState({
    fullName: user.fullName,
    username: user.username,
    bio: user.bio || '',
    isPublic: user.isPublic
  })

  const handleSaveProfile = () => {
    const updatedUser: UserProfile = {
      ...user,
      ...editedProfile
    }
    setCurrentUser(updatedUser)
    setIsEditing(false)
    window.location.reload() // Reload to reflect changes
  }

  const themeColors = {
    teal: 'bg-teal-500',
    purple: 'bg-purple-500',
    blue: 'bg-blue-500',
    pink: 'bg-pink-500'
  }

  const themeColor = themeColors[userSettings.theme as keyof typeof themeColors]

  // Check if user has requested to follow
  const hasRequested = user.pendingRequests?.includes('current-user-id')
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <div className="max-w-5xl mx-auto p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={onBack}
            className="text-white/60 hover:text-white transition-colors"
          >
            ← {t('action.back', language)}
          </button>
          
          {isOwnProfile && !showSettings && (
            <button
              onClick={() => setShowSettings(true)}
              className="p-2 text-white/60 hover:text-white transition-colors"
            >
              <Settings className="w-5 h-5" />
            </button>
          )}
        </div>

        {showSettings && isOwnProfile ? (
          /* Settings View */
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/5 backdrop-blur-xl rounded-3xl p-8 border border-white/10"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-white">{t('profile.settings', language)}</h2>
              <button
                onClick={() => setShowSettings(false)}
                className="text-white/60 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="space-y-6">
              {/* Profile Visibility */}
              <div>
                <label className="block text-white/80 mb-3">
                  {t('profile.visibility', language)}
                </label>
                <div className="flex gap-3">
                  <button
                    onClick={() => setEditedProfile({ ...editedProfile, isPublic: true })}
                    className={`flex-1 p-4 rounded-xl border-2 transition-all ${
                      editedProfile.isPublic
                        ? 'border-teal-500 bg-teal-500/10'
                        : 'border-white/10 bg-white/5'
                    }`}
                  >
                    <Globe className="w-5 h-5 text-white mb-2" />
                    <div className="text-white">{t('profile.visibility.public', language)}</div>
                  </button>
                  <button
                    onClick={() => setEditedProfile({ ...editedProfile, isPublic: false })}
                    className={`flex-1 p-4 rounded-xl border-2 transition-all ${
                      !editedProfile.isPublic
                        ? 'border-teal-500 bg-teal-500/10'
                        : 'border-white/10 bg-white/5'
                    }`}
                  >
                    <Lock className="w-5 h-5 text-white mb-2" />
                    <div className="text-white">{t('profile.visibility.private', language)}</div>
                  </button>
                </div>
              </div>

              {/* Edit Bio */}
              <div>
                <label className="block text-white/80 mb-2">{t('profile.bio', language)}</label>
                <textarea
                  value={editedProfile.bio}
                  onChange={(e) => setEditedProfile({ ...editedProfile, bio: e.target.value })}
                  placeholder={t('profile.bio.placeholder', language)}
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/30 resize-none"
                  rows={3}
                />
              </div>

              <Button
                onClick={handleSaveProfile}
                className={`w-full ${themeColor} text-white`}
              >
                <Check className="w-4 h-4 mr-2" />
                {t('action.save', language)}
              </Button>
            </div>
          </motion.div>
        ) : (
          /* Profile View */
          <>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white/5 backdrop-blur-xl rounded-3xl p-8 border border-white/10 mb-8"
            >
              <div className="flex flex-col md:flex-row gap-6">
                {/* Avatar */}
                <div className="flex-shrink-0">
                  <div className="w-32 h-32 rounded-full bg-gradient-to-br from-teal-500 to-cyan-500 p-1">
                    <div className="w-full h-full rounded-full bg-gray-900 flex items-center justify-center overflow-hidden">
                      {user.avatar ? (
                        <img src={user.avatar} alt={user.fullName} className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-white text-3xl">
                          {user.fullName.charAt(0).toUpperCase()}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* User Info */}
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      {isEditing ? (
                        <Input
                          value={editedProfile.fullName}
                          onChange={(e) => setEditedProfile({ ...editedProfile, fullName: e.target.value })}
                          className="mb-2 bg-white/5 border-white/10 text-white"
                        />
                      ) : (
                        <h1 className="text-white mb-1">{user.fullName}</h1>
                      )}
                      <p className="text-white/40">@{user.username}</p>
                    </div>

                    {isOwnProfile ? (
                      <Button
                        onClick={() => {
                          if (isEditing) {
                            handleSaveProfile()
                          } else {
                            setIsEditing(true)
                          }
                        }}
                        variant="outline"
                        className="border-white/10"
                      >
                        {isEditing ? <Check className="w-4 h-4 mr-2" /> : <Edit2 className="w-4 h-4 mr-2" />}
                        {isEditing ? t('action.save', language) : t('profile.edit', language)}
                      </Button>
                    ) : (
                      <Button
                        onClick={isFollowing ? onUnfollow : onFollow}
                        className={isFollowing ? 'bg-white/10 text-white' : `${themeColor} text-white`}
                      >
                        {hasRequested
                          ? t('profile.requested', language)
                          : isFollowing
                          ? t('profile.unfollow', language)
                          : t('profile.follow', language)}
                      </Button>
                    )}
                  </div>

                  {/* Stats */}
                  <div className="flex gap-6 mb-4">
                    <div>
                      <span className="text-white">{trips.length}</span>{' '}
                      <span className="text-white/40">{t('profile.trips', language)}</span>
                    </div>
                    <div>
                      <span className="text-white">{user.followers.length}</span>{' '}
                      <span className="text-white/40">{t('profile.followers', language)}</span>
                    </div>
                    <div>
                      <span className="text-white">{user.following.length}</span>{' '}
                      <span className="text-white/40">{t('profile.following', language)}</span>
                    </div>
                  </div>

                  {/* Bio */}
                  {isEditing ? (
                    <textarea
                      value={editedProfile.bio}
                      onChange={(e) => setEditedProfile({ ...editedProfile, bio: e.target.value })}
                      placeholder={t('profile.bio.placeholder', language)}
                      className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white placeholder:text-white/30 resize-none"
                      rows={2}
                    />
                  ) : user.bio ? (
                    <p className="text-white/60">{user.bio}</p>
                  ) : null}

                  {/* Privacy indicator */}
                  {!user.isPublic && (
                    <div className="mt-4 flex items-center gap-2 text-white/40">
                      <Lock className="w-4 h-4" />
                      <span>{t('profile.private', language)}</span>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>

            {/* Trips Grid */}
            {!isOwnProfile && !user.isPublic && !isFollowing ? (
              <div className="py-16 text-center">
                <Lock className="w-12 h-12 text-white/20 mx-auto mb-4" />
                <p className="text-white/40">{t('profile.privateMessage', language)}</p>
              </div>
            ) : (
              <div>
                <h2 className="text-white mb-6">
                  {isOwnProfile ? t('profile.myTrips', language) : t('dashboard.trips.title', language)}
                </h2>
                {trips.length === 0 ? (
                  <div className="py-16 text-center">
                    <MapPin className="w-12 h-12 text-white/20 mx-auto mb-4" />
                    <p className="text-white/40">{t('dashboard.trips.empty', language)}</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {trips.map((trip, index) => (
                      <TripCard
                        key={trip.id}
                        {...trip}
                        onClick={() => onViewTrip(trip.id)}
                        index={index}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
