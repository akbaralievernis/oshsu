'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'
import { useLanguageAndTheme } from '../LanguageAndThemeContext'
import { dictionaries } from '@/utils/dictionaries'
import { 
  LogIn, UserPlus, Mail, Lock, User, AlertCircle, CheckCircle, 
  Shield, Sun, Moon, Globe 
} from 'lucide-react'

export default function LoginPage() {
  const router = useRouter()
  const supabase = createClient()
  const { language, setLanguage, theme, toggleTheme } = useLanguageAndTheme()
  const d = dictionaries[language]

  // Tab State: 'signin' | 'signup'
  const [mode, setMode] = useState<'signin' | 'signup'>('signin')
  const [langMenuOpen, setLangMenuOpen] = useState(false)

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
      setErrorMsg(d.requiredFieldsErr)
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

        setSuccessMsg(d.authSuccessRedirect)
        
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
        const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: fullName,
            },
          },
        })

        if (signUpError) throw signUpError

        setSuccessMsg(d.signUpSuccess)

        // Auto-login after successful registration
        try {
          const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
            email,
            password,
          })

          if (signInError) {
            setSuccessMsg(d.fallbackSuccessMsg)
            setEmail('')
            setPassword('')
            setFullName('')
            setMode('signin')
            return
          }

          // Fetch role to route correctly
          const { data: profile } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', signInData.user.id)
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
        } catch {
          setSuccessMsg(d.fallbackSuccessMsg)
          setEmail('')
          setPassword('')
          setFullName('')
          setMode('signin')
        }
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Ката кетти. / Ошибка.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center transition-colors duration-300 dark:bg-slate-950 bg-slate-50 font-sans overflow-hidden py-12 px-4 sm:px-6 lg:px-8">
      {/* Floating Theme & Language controllers */}
      <div className="absolute top-6 right-6 z-50 flex items-center gap-2">
        <button
          onClick={toggleTheme}
          className="p-2.5 rounded-xl dark:bg-slate-900 bg-white border dark:border-slate-800 border-slate-200 hover:border-red-500/35 transition-all shadow-sm"
          title="Светлая / Темная тема"
        >
          {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-500" /> : <Moon className="w-4 h-4 text-slate-700" />}
        </button>

        <div className="relative">
          <button
            onClick={() => setLangMenuOpen(!langMenuOpen)}
            className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl dark:bg-slate-900 bg-white border dark:border-slate-800 border-slate-200 text-xs font-bold shadow-sm"
          >
            <Globe className="w-4 h-4 text-red-600" />
            <span className="uppercase">{language}</span>
          </button>

          {langMenuOpen && (
            <div className="absolute right-0 mt-2 w-32 rounded-2xl dark:bg-slate-900 bg-white border dark:border-slate-800 border-slate-200 shadow-xl overflow-hidden animate-fadeIn z-50">
              <button
                onClick={() => { setLanguage('kg'); setLangMenuOpen(false); }}
                className={`w-full px-4 py-3 text-left text-xs font-bold hover:bg-red-500/10 transition-colors ${language === 'kg' ? 'text-red-600' : ''}`}
              >
                Кыргызча
              </button>
              <button
                onClick={() => { setLanguage('ru'); setLangMenuOpen(false); }}
                className={`w-full px-4 py-3 text-left text-xs font-bold hover:bg-red-500/10 transition-colors ${language === 'ru' ? 'text-red-600' : ''}`}
              >
                Русский
              </button>
              <button
                onClick={() => { setLanguage('en'); setLangMenuOpen(false); }}
                className={`w-full px-4 py-3 text-left text-xs font-bold hover:bg-red-500/10 transition-colors ${language === 'en' ? 'text-red-600' : ''}`}
              >
                English
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Background Glow effects */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full dark:bg-slate-900 bg-red-100/50 blur-[150px] opacity-60 pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full dark:bg-red-950/20 bg-rose-100/50 blur-[150px] opacity-40 pointer-events-none" />

      <div className="w-full max-w-md z-10 space-y-8">
        {/* Logo / Header */}
        <div className="text-center">
          <div className="inline-flex items-center justify-center p-3 rounded-full bg-gradient-to-br dark:from-slate-900 dark:to-slate-800 from-slate-100 to-slate-50 border dark:border-slate-800 border-slate-200 shadow-xl mb-4">
            <Shield className="w-10 h-10 text-red-600 animate-pulse" />
          </div>
          <h2 className="text-3xl font-extrabold tracking-tight dark:text-white text-slate-900 sm:text-4xl">
            {d.authTitle}
          </h2>
          <p className="mt-3 text-sm dark:text-slate-400 text-slate-500">
            {d.authSub}
          </p>
        </div>

        {/* Card */}
        <div className="dark:bg-slate-900/60 bg-white border dark:border-slate-800/80 border-slate-200 rounded-3xl p-8 shadow-2xl space-y-6">
          {/* Tab Selector */}
          <div className="flex p-1.5 dark:bg-slate-950 bg-slate-100 rounded-2xl border dark:border-slate-900 border-slate-200">
            <button
              onClick={() => {
                setMode('signin')
                setErrorMsg(null)
                setSuccessMsg(null)
              }}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-semibold rounded-xl transition-all duration-300 ${
                mode === 'signin'
                  ? 'bg-red-600 text-white shadow-lg font-bold'
                  : 'dark:text-slate-400 text-slate-500 hover:text-red-600 dark:hover:text-white'
              }`}
            >
              <LogIn className="w-4 h-4" />
              {d.signInTab}
            </button>
            <button
              onClick={() => {
                setMode('signup')
                setErrorMsg(null)
                setSuccessMsg(null)
              }}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-semibold rounded-xl transition-all duration-300 ${
                mode === 'signup'
                  ? 'bg-red-600 text-white shadow-lg font-bold'
                  : 'dark:text-slate-400 text-slate-500 hover:text-red-600 dark:hover:text-white'
              }`}
            >
              <UserPlus className="w-4 h-4" />
              {d.signUpTab}
            </button>
          </div>

          {/* Status Messages */}
          {errorMsg && (
            <div className="flex items-start gap-3 p-4 bg-red-500/10 border border-red-500/20 text-red-650 dark:text-red-400 rounded-2xl text-sm animate-fadeIn">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}
          {successMsg && (
            <div className="flex items-start gap-3 p-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 rounded-2xl text-sm animate-fadeIn">
              <CheckCircle className="w-5 h-5 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleAuth} className="space-y-5">
            {mode === 'signup' && (
              <div className="space-y-1.5">
                <label className="text-xs font-semibold dark:text-slate-400 text-slate-500 uppercase tracking-wider">
                  {d.fullNameLabel}
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-555 text-slate-455">
                    <User className="w-5 h-5" />
                  </span>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder={d.fullNamePlaceholder}
                    className="w-full dark:bg-slate-950/70 bg-white border dark:border-slate-800 border-slate-200 dark:text-white text-slate-900 rounded-2xl py-3 pl-11 pr-4 placeholder-slate-400 dark:placeholder-slate-655 focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-red-500 transition-all text-sm"
                  />
                </div>
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-xs font-semibold dark:text-slate-400 text-slate-500 uppercase tracking-wider">
                {d.emailLabel}
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-555 text-slate-455">
                  <Mail className="w-5 h-5" />
                </span>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={d.emailPlaceholder}
                  className="w-full dark:bg-slate-950/70 bg-white border dark:border-slate-800 border-slate-200 dark:text-white text-slate-900 rounded-2xl py-3 pl-11 pr-4 placeholder-slate-400 dark:placeholder-slate-655 focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-red-500 transition-all text-sm"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold dark:text-slate-400 text-slate-500 uppercase tracking-wider">
                {d.passwordLabel}
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-555 text-slate-455">
                  <Lock className="w-5 h-5" />
                </span>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={d.passwordPlaceholder}
                  className="w-full dark:bg-slate-950/70 bg-white border dark:border-slate-800 border-slate-200 dark:text-white text-slate-900 rounded-2xl py-3 pl-11 pr-4 placeholder-slate-400 dark:placeholder-slate-655 focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-red-500 transition-all text-sm"
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3.5 bg-gradient-to-r from-red-600 to-rose-700 hover:from-red-700 hover:to-rose-800 text-white font-bold rounded-2xl shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed text-sm mt-3"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : mode === 'signin' ? (
                <>
                  <LogIn className="w-5 h-5" />
                  {d.btnSignIn}
                </>
              ) : (
                <>
                  <UserPlus className="w-5 h-5" />
                  {d.btnSignUp}
                </>
              )}
            </button>
          </form>
        </div>

        {/* Footer */}
        <div className="text-center text-xs dark:text-slate-500 text-slate-450 space-y-1">
          <p>© {new Date().getFullYear()} {d.copyright}</p>
        </div>
      </div>
    </div>
  )
}
