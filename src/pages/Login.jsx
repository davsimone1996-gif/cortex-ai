import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

export default function Login() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const { error: authError } = await supabase.auth.signInWithPassword({ email, password })

    if (authError) {
      setError('Credenziali non valide. Riprova.')
      setLoading(false)
    } else {
      navigate('/admin')
    }
  }

  return (
    <div className="min-h-screen bg-dark flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="mb-10 text-center">
          <h1 className="text-cream font-black text-2xl tracking-tight">
            HERO<span className="text-accent">.</span>COLLECTIVE
          </h1>
          <p className="text-cream/30 text-sm mt-1">Accesso area amministrativa</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-cream/50 text-xs font-semibold tracking-widest uppercase mb-2">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@example.com"
              required
              autoComplete="email"
              className="w-full bg-cream/5 border border-cream/10 rounded-lg px-4 py-3 text-cream text-sm
                focus:outline-none focus:border-accent/50 focus:bg-cream/[0.07] transition-all duration-300
                placeholder:text-cream/20"
            />
          </div>

          <div>
            <label className="block text-cream/50 text-xs font-semibold tracking-widest uppercase mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              autoComplete="current-password"
              className="w-full bg-cream/5 border border-cream/10 rounded-lg px-4 py-3 text-cream text-sm
                focus:outline-none focus:border-accent/50 focus:bg-cream/[0.07] transition-all duration-300
                placeholder:text-cream/20"
            />
          </div>

          {error && (
            <p className="text-accent text-sm bg-accent/10 border border-accent/20 rounded-lg px-4 py-3">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-accent text-white font-bold text-sm py-3 rounded-full mt-2
              hover:bg-accent/90 hover:scale-[0.98] transition-all duration-300
              disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Accesso in corso...' : 'Accedi'}
          </button>
        </form>
      </div>
    </div>
  )
}
