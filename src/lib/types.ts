import { Language } from './i18n'

export interface UserProfile {
  id: string
  email: string
  fullName: string
  username: string // @username
  avatar?: string
  bio?: string
  isPublic: boolean // perfil aberto ou fechado
  createdAt: Date
  following: string[] // IDs de usuários seguindo
  followers: string[] // IDs de seguidores
  pendingRequests: string[] // IDs de solicitações pendentes (para perfis privados)
}

export interface UserSettings {
  language: Language
  theme: 'teal' | 'purple' | 'blue' | 'pink'
  name: string
}

export type TripRole = 'owner' | 'editor' | 'viewer'

export interface TripCollaborator {
  userId: string
  role: TripRole
  joinedAt: Date
}

export interface Trip {
  id: string
  userId: string // proprietário
  name: string
  location: string
  startDate: Date
  endDate: Date
  coverImage: string
  gradientStart?: string
  gradientEnd?: string
  isPublic: boolean // se pode ser visualizada publicamente
  collaborators: TripCollaborator[] // colaboradores com suas roles
  invitedUsers: string[] // IDs de usuários com convite pendente
  createdAt: Date
}

export interface ChecklistItem {
  id: string
  tripId?: string
  userId: string
  text: string
  completed: boolean
  category: 'documents' | 'packing' | 'bookings' | 'tasks' | 'other'
  createdAt: Date
}

export interface Event {
  id: string
  tripId: string
  userId: string
  name: string
  location: string
  startDate: Date
  endDate: Date
  type: 'flight' | 'hotel' | 'activity' | 'restaurant' | 'transport' | 'other'
}

export interface Memory {
  id: string
  tripId?: string
  userId: string
  type: 'note' | 'tip' | 'photo'
  content: string
  image?: string
  isTimeCapsule: boolean
  openAt?: Date
  createdAt: Date
}

export interface Expense {
  id: string
  tripId: string // Obrigatório - toda despesa pertence a uma viagem
  userId: string
  category: 'hotel' | 'food' | 'transport' | 'activity' | 'shopping' | 'other'
  amount: number
  currency: string
  description: string
  date: Date
  createdAt: Date
}
