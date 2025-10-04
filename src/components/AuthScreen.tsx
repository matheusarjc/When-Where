import { useState } from 'react'
import { motion } from 'motion/react'
import { Mail, Lock, User, AtSign, Sparkles } from 'lucide-react'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Language, t } from '../lib/i18n'
import { UserProfile } from '../lib/types'
import { setCurrentUser } from '../lib/auth'

interface AuthScreenProps {
  language: Language
  onAuth: (user: UserProfile) => void
}

export function AuthScreen({ language, onAuth }: AuthScreenProps) {
  const [isSignup, setIsSignup] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    fullName: '',
    username: ''
  })

  const handleGoogleLogin = () => {
    // Mock Google login - create demo user
    const mockUser: UserProfile = {
      id: `user-${Date.now()}`,
      email: 'demo@example.com',
      fullName: 'Demo User',
      username: 'demouser',
      avatar: 'https://i.pravatar.cc/150?img=68',
      bio: '✈️ Explorando o mundo',
      isPublic: true,
      createdAt: new Date(),
      following: [],
      followers: [],
      pendingRequests: []
    }
    
    setCurrentUser(mockUser)
    onAuth(mockUser)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (isSignup) {
      // Create new user
      const newUser: UserProfile = {
        id: `user-${Date.now()}`,
        email: formData.email,
        fullName: formData.fullName,
        username: formData.username,
        isPublic: true,
        createdAt: new Date(),
        following: [],
        followers: [],
        pendingRequests: []
      }
      
      setCurrentUser(newUser)
      onAuth(newUser)
    } else {
      // Mock login
      handleGoogleLogin()
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-4">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute inset-0 opacity-20"
          animate={{
            backgroundPosition: ['0% 0%', '100% 100%']
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            repeatType: 'reverse'
          }}
          style={{
            backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(20, 184, 166, 0.3) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(139, 92, 246, 0.3) 0%, transparent 50%)',
            backgroundSize: '200% 200%'
          }}
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-md"
      >
        <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-8 border border-white/10">
          {/* Logo/Header */}
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', delay: 0.2 }}
              className="inline-flex p-4 rounded-full bg-gradient-to-br from-teal-500 to-cyan-500 mb-4"
            >
              <Sparkles className="w-8 h-8 text-white" />
            </motion.div>
            <h1 className="text-white mb-2">
              {isSignup ? t('auth.signupTitle', language) : t('auth.welcome', language)}
            </h1>
            <p className="text-white/40">
              {isSignup ? t('auth.signupSubtitle', language) : t('auth.subtitle', language)}
            </p>
          </div>

          {/* Google Sign In */}
          <Button
            onClick={handleGoogleLogin}
            className="w-full bg-white hover:bg-white/90 text-gray-900 mb-6"
          >
            <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="currentColor"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="currentColor"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="currentColor"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            {t('auth.googleLogin', language)}
          </Button>

          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/10"></div>
            </div>
            <div className="relative flex justify-center">
              <span className="px-4 bg-gray-900/50 text-white/40">
                {t('auth.or', language)}
              </span>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {isSignup && (
              <>
                <div>
                  <label className="block text-white/60 mb-2">
                    {t('auth.fullName', language)}
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                    <Input
                      type="text"
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      placeholder={t('auth.fullName.placeholder', language)}
                      className="pl-10 bg-white/5 border-white/10 text-white"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-white/60 mb-2">
                    {t('auth.username', language)}
                  </label>
                  <div className="relative">
                    <AtSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                    <Input
                      type="text"
                      value={formData.username}
                      onChange={(e) => setFormData({ ...formData, username: e.target.value.replace(/[^a-z0-9_]/gi, '').toLowerCase() })}
                      placeholder={t('auth.username.placeholder', language)}
                      className="pl-10 bg-white/5 border-white/10 text-white"
                      required
                    />
                  </div>
                </div>
              </>
            )}

            <div>
              <label className="block text-white/60 mb-2">
                {t('auth.email', language)}
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="seu@email.com"
                  className="pl-10 bg-white/5 border-white/10 text-white"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-white/60 mb-2">
                {t('auth.password', language)}
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                <Input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="••••••••"
                  className="pl-10 bg-white/5 border-white/10 text-white"
                  required
                />
              </div>
            </div>

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white"
            >
              {isSignup ? t('auth.signup', language) : t('auth.login', language)}
            </Button>
          </form>

          {/* Toggle Sign In/Sign Up */}
          <div className="mt-6 text-center">
            <button
              onClick={() => setIsSignup(!isSignup)}
              className="text-white/60 hover:text-white transition-colors"
            >
              {isSignup ? t('auth.hasAccount', language) : t('auth.noAccount', language)}{' '}
              <span className="text-teal-400">
                {isSignup ? t('auth.login', language) : t('auth.signup', language)}
              </span>
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
