'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'
import { LogIn, UserPlus, Mail, Lock, User, AlertCircle, CheckCircle, Shield } from 'lucide-react'

export default function LoginPage() {
  const router = useRouter()
  const supabase = createClient()

  // Tab State: 'signin' | 'signup'
  const [mode, setMode] = useState<'signin' | 'signup'>('signin')

  // Form State
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')

  // UI State
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [successMsg, setSuccessMsg] = useState<string | null>(null)

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setErrorMsg(null)
    setSuccessMsg(null)

    if (!email || !password || (mode === 'signup' && !fullName)) {
      setErrorMsg('Сураныч, бардык талааларды толтуруңуз.')
      setLoading(false)
      return
    }

    try {
      if (mode === 'signin') {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        })

        if (error) throw error

        setSuccessMsg('Ийгиликтүү кирдиңиз! Багыттоо жүрүүдө...')
        
        // Fetch role to route correctly
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', data.user.id)
          .single()

        const role = profile?.role
        setTimeout(() => {
          if (role === 'admin') {
            router.push('/admin')
          } else if (role === 'commandant') {
            router.push('/commandant')
          } else {
            router.push('/dashboard')
          }
          router.refresh()
        }, 1500)

      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: fullName,
            },
          },
        })

        if (error) throw error

        setSuccessMsg('Каттоо ийгиликтүү бүттү! Электрондук почтаңызды текшерип, ырастаңыз.')
        setEmail('')
        setPassword('')
        setFullName('')
        setMode('signin')
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Ката кетти. Кайра аракет кылып көрүңүз.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-slate-950 font-sans overflow-hidden py-12 px-4 sm:px-6 lg:px-8">
      {/* Dynamic Background Glow Effects */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-slate-900 blur-[150px] opacity-60 pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-amber-950 blur-[150px] opacity-40 pointer-events-none" />

      <div className="w-full max-w-md z-10 space-y-8">
        {/* OshSU Logo / Header */}
        <div className="text-center">
          <div className="inline-flex items-center justify-center p-3 rounded-full bg-gradient-to-br from-slate-900 to-slate-800 border border-slate-800 shadow-xl mb-4">
            <Shield className="w-10 h-10 text-amber-500 animate-pulse" />
          </div>
          <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            ОшМУ <span className="text-amber-500">Жатакана</span>
          </h2>
          <p className="mt-3 text-sm text-slate-400">
            Жатаканаларды санариптештирүүнүн бирдиктүү платформасы
          </p>
        </div>

        {/* Auth Glassmorphic Card */}
        <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800/80 rounded-3xl p-8 shadow-2xl space-y-6">
          {/* Tab Selector */}
          <div className="flex p-1.5 bg-slate-950 rounded-2xl border border-slate-800/50">
            <button
              onClick={() => {
                setMode('signin')
                setErrorMsg(null)
                setSuccessMsg(null)
              }}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-semibold rounded-xl transition-all duration-300 ${
                mode === 'signin'
                  ? 'bg-amber-500 text-slate-950 shadow-lg font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <LogIn className="w-4 h-4" />
              Кирүү
            </button>
            <button
              onClick={() => {
                setMode('signup')
                setErrorMsg(null)
                setSuccessMsg(null)
              }}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-semibold rounded-xl transition-all duration-300 ${
                mode === 'signup'
                  ? 'bg-amber-500 text-slate-950 shadow-lg font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <UserPlus className="w-4 h-4" />
              Каттоо
            </button>
          </div>

          {/* Status Messages */}
          {errorMsg && (
            <div className="flex items-start gap-3 p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-2xl text-sm animate-fadeIn">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}
          {successMsg && (
            <div className="flex items-start gap-3 p-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-2xl text-sm animate-fadeIn">
              <CheckCircle className="w-5 h-5 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleAuth} className="space-y-5">
            {mode === 'signup' && (
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Толук аты-жөнүңүз (ФИО)
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-500">
                    <User className="w-5 h-5" />
                  </span>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Алиев Тимур Самадович"
                    className="w-full bg-slate-950/70 border border-slate-800 text-white rounded-2xl py-3 pl-11 pr-4 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition-all text-sm"
                  />
                </div>
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Электрондук почта (Email)
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-500">
                  <Mail className="w-5 h-5" />
                </span>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="student@oshsu.kg"
                  className="w-full bg-slate-950/70 border border-slate-800 text-white rounded-2xl py-3 pl-11 pr-4 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition-all text-sm"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Сыр сөз (Password)
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-500">
                  <Lock className="w-5 h-5" />
                </span>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-slate-950/70 border border-slate-800 text-white rounded-2xl py-3 pl-11 pr-4 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition-all text-sm"
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3.5 bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-bold rounded-2xl shadow-xl hover:from-amber-600 hover:to-amber-700 hover:shadow-amber-500/10 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-950 focus:ring-amber-500 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed text-sm mt-3"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
              ) : mode === 'signin' ? (
                <>
                  <LogIn className="w-5 h-5" />
                  Системага кирүү
                </>
              ) : (
                <>
                  <UserPlus className="w-5 h-5" />
                  Катталуу
                </>
              )}
            </button>
          </form>
        </div>

        {/* Footer / Copyright */}
        <div className="text-center text-xs text-slate-500 space-y-1">
          <p>© {new Date().getFullYear()} Ош мамлекеттик университети.</p>
          <p>Бардык укуктар корголгон.</p>
        </div>
      </div>
    </div>
  )
}
