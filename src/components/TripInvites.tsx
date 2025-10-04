import { motion, AnimatePresence } from 'motion/react'
import { Bell, Check, X, MapPin } from 'lucide-react'
import { Language, t } from '../lib/i18n'
import { getUserByUsername } from '../lib/auth'
import { Button } from './ui/button'

interface TripInvite {
  tripId: string
  tripTitle: string
  tripLocation: string
  tripCover: string
  invitedBy: string
}

interface TripInvitesProps {
  invites: TripInvite[]
  language: Language
  onAccept: (tripId: string) => void
  onDecline: (tripId: string) => void
}

export function TripInvites({ invites, language, onAccept, onDecline }: TripInvitesProps) {
  if (invites.length === 0) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-8"
    >
      <div className="bg-gradient-to-r from-teal-500/10 to-cyan-500/10 border border-teal-500/20 rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-lg bg-teal-500/20">
            <Bell className="w-5 h-5 text-teal-400" />
          </div>
          <h3 className="text-white">
            {t('trip.invites.pending', language)} ({invites.length})
          </h3>
        </div>

        <div className="space-y-3">
          <AnimatePresence mode="popLayout">
            {invites.map((invite, index) => {
              const inviter = getUserByUsername(invite.invitedBy)
              
              return (
                <motion.div
                  key={invite.tripId}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/10"
                >
                  {/* Trip Cover */}
                  <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                    <img 
                      src={invite.tripCover} 
                      alt={invite.tripTitle}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-white/60 text-sm mb-1">
                      <span className="text-teal-400">{inviter?.fullName || 'Alguém'}</span>{' '}
                      {t('trip.invites.from', language)}
                    </p>
                    <p className="text-white truncate">{invite.tripTitle}</p>
                    <p className="text-white/40 text-sm flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {invite.tripLocation}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 flex-shrink-0">
                    <Button
                      onClick={() => onAccept(invite.tripId)}
                      size="sm"
                      className="bg-teal-500 hover:bg-teal-600 text-white"
                    >
                      <Check className="w-4 h-4 mr-1" />
                      {t('trip.invites.accept', language)}
                    </Button>
                    <Button
                      onClick={() => onDecline(invite.tripId)}
                      size="sm"
                      variant="outline"
                      className="border-white/10 text-white/60 hover:text-white"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </motion.div>
              )
            })}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  )
}
