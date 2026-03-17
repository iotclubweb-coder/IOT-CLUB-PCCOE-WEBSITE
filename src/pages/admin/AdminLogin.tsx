import { useState } from 'react'
import { motion } from 'framer-motion'
import { Lock, User, AlertCircle, Cpu } from 'lucide-react'

interface AdminLoginProps {
  onLogin: () => void
}

const ADMIN_ID = 'adminpccoe'
const ADMIN_PASSWORD = 'password1234'

export default function AdminLogin({ onLogin }: AdminLoginProps) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isShaking, setIsShaking] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (username === ADMIN_ID && password === ADMIN_PASSWORD) {
      sessionStorage.setItem('iot_admin_auth', 'true')
      onLogin()
    } else {
      setError('Invalid credentials')
      setIsShaking(true)
      setTimeout(() => setIsShaking(false), 500)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black flex items-center justify-center p-4">
      {/* Background grid */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,69,0,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,69,0,0.03)_1px,transparent_1px)] bg-[size:50px_50px]" />

      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="relative w-full max-w-md"
      >
        {/* Card glow */}
        <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 via-orange-500/10 to-primary/20 rounded-3xl blur-xl opacity-60" />

        <div className="relative bg-gray-900/80 backdrop-blur-xl border border-white/10 rounded-3xl p-8 md:p-10 shadow-2xl">
          {/* Logo / Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 mb-4">
              <Cpu className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-2xl font-black text-white tracking-tight">Admin Panel</h1>
            <p className="text-sm text-gray-500 mt-1 font-medium">IoT Club PCCOE</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Username */}
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">
                Admin ID
              </label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter admin ID"
                  className="w-full pl-12 pr-4 py-3 bg-gray-800/50 border border-white/10 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30 transition-all"
                  autoFocus
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  className="w-full pl-12 pr-4 py-3 bg-gray-800/50 border border-white/10 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30 transition-all"
                />
              </div>
            </div>

            {/* Error message */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0, x: isShaking ? [0, -8, 8, -8, 8, 0] : 0 }}
                transition={{ duration: 0.4 }}
                className="flex items-center gap-2 text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3"
              >
                <AlertCircle className="w-4 h-4 shrink-0" />
                {error}
              </motion.div>
            )}

            {/* Submit */}
            <button
              type="submit"
              className="w-full py-3.5 bg-primary hover:bg-primary/90 text-white font-bold rounded-xl transition-all duration-200 uppercase tracking-widest text-sm shadow-lg shadow-primary/25 hover:shadow-primary/40 active:scale-[0.98]"
            >
              Access Dashboard
            </button>
          </form>

          <p className="text-center text-gray-600 text-xs mt-6">
            Authorized personnel only
          </p>
        </div>
      </motion.div>
    </div>
  )
}
