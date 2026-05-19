'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'
import { useLanguageAndTheme } from '../LanguageAndThemeContext'
import { dictionaries } from '@/utils/dictionaries'
import { 
  Shield, Landmark, Users, ClipboardList, CheckCircle, AlertCircle, Wrench,
  Check, LogOut, ChevronRight, Sparkles, MapPin, User, FileText, Send,
  Menu, X, Sun, Moon, Globe
} from 'lucide-react'

export default function StudentDashboard() {
  const router = useRouter()
  const supabase = createClient()
  const { language, setLanguage, theme, toggleTheme } = useLanguageAndTheme()
  const d = dictionaries[language]
  
  const [studentName, setStudentName] = useState('Студент')
  const [ticketTitle, setTicketTitle] = useState('')
  const [ticketUrgency, setTicketUrgency] = useState('medium')
  const [submittingTicket, setSubmittingTicket] = useState(false)
  const [ticketSuccess, setTicketSuccess] = useState(false)

  // Mobile navigation drawer state
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [langMenuOpen, setLangMenuOpen] = useState(false)

  // Mock data for student housing details
  const [hasRoom, setHasRoom] = useState(true)
  const [applicationStatus, setApplicationStatus] = useState<'pending' | 'approved' | 'rejected'>('approved')
  const [paymentStatus, setPaymentStatus] = useState<'paid' | 'unpaid'>('unpaid')
  
  const [assignedRoom, setAssignedRoom] = useState({
    dormName: language === 'kg' ? '№1 Жатакана (Башкы корпус)' : language === 'ru' ? 'Общежитие №1 (Главный корпус)' : 'Dormitory №1 (Main Campus)',
    roomNumber: '102',
    floor: 1,
    bedNumber: language === 'kg' ? 'Орун №2' : language === 'ru' ? 'Место №2' : 'Bed №2',
    roommates: [
      { name: 'Касымов Улукбек', faculty: language === 'kg' ? 'Медициналык факультет' : language === 'ru' ? 'Медицинский факультет' : 'Faculty of Medicine' },
      { name: 'Абдуллаев Азамат', faculty: language === 'kg' ? 'Юридикалык колледж' : language === 'ru' ? 'Юридический колледж' : 'Legal College' },
    ]
  })

  // Check auth & role
  useEffect(() => {
    async function checkAuth() {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        setStudentName(user.user_metadata?.full_name || user.email || 'Студент')
      }
    }
    checkAuth()
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  const handleSubmitTicket = (e: React.FormEvent) => {
    e.preventDefault()
    if (!ticketTitle) return
    setSubmittingTicket(true)
    
    setTimeout(() => {
      setSubmittingTicket(false)
      setTicketSuccess(true)
      setTicketTitle('')
      
      setTimeout(() => {
        setTicketSuccess(false)
      }, 3000)
    }, 1200)
  }

  return (
    <div className="min-h-screen transition-colors duration-300 dark:bg-slate-950 bg-slate-50 dark:text-white text-slate-900 font-sans flex flex-col lg:flex-row overflow-x-hidden">
      {/* Background Glows */}
      <div className="absolute top-0 left-0 w-[300px] h-[300px] rounded-full dark:bg-slate-900 bg-rose-100/30 blur-[150px] opacity-60 pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] rounded-full dark:bg-violet-950/10 bg-violet-105/30 blur-[150px] opacity-40 pointer-events-none" />

      {/* MOBILE HEADER */}
      <header className="lg:hidden w-full flex items-center justify-between px-6 py-4 dark:bg-slate-900/80 bg-white border-b dark:border-slate-900 border-slate-200 backdrop-blur-lg sticky top-0 z-35 shadow-sm transition-colors">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-gradient-to-br dark:from-slate-900 dark:to-slate-800 from-slate-100 to-slate-50 border dark:border-slate-800 border-slate-200">
            <Shield className="w-5 h-5 text-rose-500" />
          </div>
          <span className="text-sm font-extrabold tracking-tight">
            {d.oshsu} <span className="bg-gradient-to-r from-rose-500 to-violet-600 bg-clip-text text-transparent">{d.dormitorySystem}</span>
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Theme Switcher */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg dark:bg-slate-950 bg-slate-100 border dark:border-slate-850 border-slate-200 text-xs cursor-pointer animate-pulse"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-500" /> : <Moon className="w-4 h-4 text-slate-700" />}
          </button>

          {/* Language menu */}
          <button
            onClick={() => setLangMenuOpen(!langMenuOpen)}
            className="flex items-center gap-1 px-2.5 py-2 rounded-lg dark:bg-slate-950 bg-slate-100 border dark:border-slate-855 border-slate-200 text-xs font-bold cursor-pointer"
          >
            <Globe className="w-3.5 h-3.5 text-rose-500" />
            <span className="uppercase">{language}</span>
          </button>

          {langMenuOpen && (
            <div className="absolute right-16 mt-32 w-28 rounded-xl dark:bg-slate-900 bg-white border dark:border-slate-800 border-slate-200 shadow-xl overflow-hidden z-50">
              <button onClick={() => { setLanguage('kg'); setLangMenuOpen(false); }} className="w-full px-3 py-2.5 text-left text-2xs font-bold hover:bg-rose-500/10 cursor-pointer">KG</button>
              <button onClick={() => { setLanguage('ru'); setLangMenuOpen(false); }} className="w-full px-3 py-2.5 text-left text-2xs font-bold hover:bg-rose-500/10 cursor-pointer">RU</button>
              <button onClick={() => { setLanguage('en'); setLangMenuOpen(false); }} className="w-full px-3 py-2.5 text-left text-2xs font-bold hover:bg-rose-500/10 cursor-pointer">EN</button>
            </div>
          )}

          {/* Hamburger Menu Toggle */}
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2.5 rounded-xl dark:bg-slate-950 bg-slate-100 border dark:border-slate-855 border-slate-200 text-rose-500 cursor-pointer"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </header>

      {/* MOBILE SLIDE-IN DRAWER */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 bg-slate-950/60 backdrop-blur-md z-40 animate-fadeIn" onClick={() => setMobileMenuOpen(false)}>
          <aside 
            className="w-72 max-w-[80vw] h-full dark:bg-slate-900 bg-white p-6 border-r dark:border-slate-855 border-slate-200 flex flex-col justify-between"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="space-y-6">
              {/* Profile Card */}
              <div className="p-4 rounded-2xl dark:bg-slate-950 bg-slate-100 border dark:border-slate-855 border-slate-200 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-855 dark:bg-slate-800 flex items-center justify-center border border-slate-255 dark:border-slate-700 font-bold text-rose-500 shadow-md">
                    {studentName[0].toUpperCase()}
                  </div>
                  <div className="truncate">
                    <div className="text-sm font-bold truncate">{studentName}</div>
                    <div className="text-xs text-slate-500">{d.student}</div>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-2 py-3 bg-rose-500/10 hover:bg-rose-500/20 text-rose-650 dark:text-rose-400 text-sm font-bold rounded-2xl border border-rose-500/10 transition-all cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                {d.logout}
              </button>
            </div>
          </aside>
        </div>
      )}

      {/* DESKTOP SIDEBAR */}
      <aside className="hidden lg:flex w-80 dark:bg-slate-900/60 bg-white border-r dark:border-slate-900/80 border-slate-200 p-6 flex-col justify-between shrink-0 z-20 transition-colors duration-300">
        <div className="space-y-8">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-gradient-to-br dark:from-slate-900 dark:to-slate-800 from-slate-100 to-slate-50 border dark:border-slate-800 border-slate-200 shadow-lg">
              <Shield className="w-6 h-6 text-rose-500" />
            </div>
            <div>
              <h1 className="text-lg font-black tracking-tight leading-none">{d.oshsu}</h1>
              <span className="text-xs bg-gradient-to-r from-rose-500 to-violet-600 bg-clip-text text-transparent font-bold tracking-widest uppercase">{d.student}</span>
            </div>
          </div>

          {/* Student Profile Card */}
          <div className="p-5 rounded-2xl dark:bg-slate-950 bg-slate-100 border dark:border-slate-900 border-slate-200 space-y-4 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl dark:bg-slate-800 bg-slate-200 flex items-center justify-center border dark:border-slate-700 border-slate-300 font-bold text-rose-500 shadow-md">
                {studentName[0].toUpperCase()}
              </div>
              <div className="truncate">
                <div className="text-sm font-bold truncate">{studentName}</div>
                <div className="text-xs text-slate-500">{d.studentCabinet}</div>
              </div>
            </div>
            
            {hasRoom && (
              <div className="space-y-2 border-t dark:border-slate-900 border-slate-200 pt-3 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-555 text-slate-500 font-semibold">{d.dormNameLabel}:</span>
                  <span className="dark:text-slate-300 text-slate-700 font-bold text-right truncate max-w-[130px]">№1 Жатакана</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-555 text-slate-500 font-semibold">Бөлмө:</span>
                  <span className="text-rose-500 font-extrabold">{assignedRoom.roomNumber} ({assignedRoom.floor}-кабат)</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Action controls / Logout */}
        <div className="space-y-3">
          {/* Controllers */}
          <div className="flex items-center justify-between gap-2 p-2 dark:bg-slate-950 bg-slate-100 rounded-xl border dark:border-slate-900 border-slate-200">
            <button 
              onClick={toggleTheme} 
              className="flex-1 p-2 rounded-lg hover:bg-rose-500/10 text-slate-500 hover:text-rose-600 transition-colors flex justify-center cursor-pointer"
              title="Темный / Светлый режим"
            >
              {theme === 'dark' ? <Sun className="w-4.5 h-4.5 text-amber-500" /> : <Moon className="w-4.5 h-4.5" />}
            </button>
            <div className="h-6 w-px dark:bg-slate-900 bg-slate-200" />
            <select 
              value={language}
              onChange={(e) => setLanguage(e.target.value as any)}
              className="bg-transparent text-xs font-bold text-slate-500 hover:text-rose-500 focus:outline-none cursor-pointer uppercase py-1 px-2 rounded-md"
            >
              <option value="kg" className="dark:bg-slate-900 text-slate-900 dark:text-white">KG</option>
              <option value="ru" className="dark:bg-slate-900 text-slate-900 dark:text-white">RU</option>
              <option value="en" className="dark:bg-slate-900 text-slate-900 dark:text-white">EN</option>
            </select>
          </div>

          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 py-3.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-650 dark:text-rose-455 text-sm font-bold rounded-2xl border border-rose-500/10 transition-all duration-300 cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            {d.logout}
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT CONTAINER */}
      <main className="flex-1 flex flex-col min-h-screen overflow-y-auto p-6 md:p-8 lg:p-12 z-10 animate-fadeIn">
        {/* Header */}
        <header className="mb-8">
          <h2 className="text-3xl font-extrabold tracking-tight">{d.studentCabinet}</h2>
          <p className="text-sm text-slate-400 mt-1">{d.studentCabinetDesc}</p>
        </header>

        {/* Main Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Room Details & Roommates (Left Column) */}
          <div className="lg:col-span-2 space-y-8">
            {hasRoom ? (
              <div className="p-6 md:p-8 rounded-3xl dark:bg-slate-900/30 bg-white border dark:border-slate-900 border-slate-200 shadow-md space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-rose-500" />
                    {d.roomInfo}
                  </h3>
                  <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-605 dark:text-emerald-400 text-xs font-bold uppercase tracking-wider">
                    {d.assignedStatus}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 rounded-2xl dark:bg-slate-950 bg-slate-100 border dark:border-slate-900 border-slate-200">
                  <div className="space-y-1">
                    <div className="text-xs font-semibold text-slate-500 uppercase tracking-wide">{d.dormNameLabel}</div>
                    <div className="text-sm font-bold flex items-center gap-1.5">
                      <MapPin className="w-4 h-4 text-rose-500 shrink-0" />
                      {assignedRoom.dormName}
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-xs font-semibold text-slate-500 uppercase tracking-wide">{d.assignedBedLabel}</div>
                    <div className="text-sm font-extrabold text-rose-500">{assignedRoom.bedNumber} (Бөлмө {assignedRoom.roomNumber})</div>
                  </div>
                </div>

                {/* Roommates */}
                <div className="space-y-4">
                  <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wide">{d.roommatesLabel}</h4>
                  <div className="divide-y dark:divide-slate-900 divide-slate-200">
                    {assignedRoom.roommates.map((mate, idx) => (
                      <div key={idx} className="flex items-center gap-4 py-3 first:pt-0 last:pb-0">
                        <div className="w-9 h-9 rounded-xl dark:bg-slate-800 bg-slate-200 flex items-center justify-center border dark:border-slate-700 border-slate-300 text-xs font-bold text-rose-500 shrink-0">
                          <User className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="text-sm font-bold">{mate.name}</div>
                          <div className="text-xs text-slate-500">{mate.faculty}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-8 rounded-3xl dark:bg-slate-900/30 bg-white border dark:border-slate-900 border-slate-200 shadow-md space-y-6 text-center py-12">
                <FileText className="w-12 h-12 text-rose-500 mx-auto opacity-70" />
                <h3 className="text-xl font-bold">{d.unassignedStatus}</h3>
                <p className="text-sm text-slate-400 max-w-md mx-auto leading-relaxed">
                  {d.noRoomDesc}
                </p>
              </div>
            )}

            {/* Application Progress Status */}
            <div className="p-6 md:p-8 rounded-3xl dark:bg-slate-900/30 bg-white border dark:border-slate-900 border-slate-200 shadow-md space-y-6">
              <h3 className="text-xl font-bold">{d.appStatusTitle}</h3>
              
              <div className="flex items-center gap-5 p-6 rounded-2xl dark:bg-slate-950 bg-slate-100 border dark:border-slate-900 border-slate-200">
                <div className={`p-3.5 rounded-xl border ${
                  applicationStatus === 'approved' 
                    ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-600 dark:text-emerald-450' 
                    : 'bg-rose-500/10 border-rose-500/20 text-rose-600'
                }`}>
                  <ClipboardList className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-sm font-bold">
                    {applicationStatus === 'approved' ? d.appApprovedMsg : d.appPendingMsg}
                  </div>
                  <div className="text-xs text-slate-500 mt-1">
                    {applicationStatus === 'approved' ? d.appApprovedDesc : d.appPendingDesc}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Help Desk (Right Column) & Payments */}
          <div className="space-y-8">
            {/* Payment Panel */}
            <div className="p-6 md:p-8 rounded-3xl dark:bg-slate-900/30 bg-white border dark:border-slate-900 border-slate-200 shadow-md space-y-6">
              <h3 className="text-xl font-bold">{d.dormPaymentTitle}</h3>
              
              <div className="p-6 rounded-2xl dark:bg-slate-950 bg-slate-100 border dark:border-slate-900 border-slate-200 space-y-4">
                <div className="flex justify-between items-center text-sm font-semibold">
                  <span className="text-slate-400">{d.paymentStatusLabel}</span>
                  <span className={`px-2.5 py-1 text-2xs font-extrabold rounded-full ${
                    paymentStatus === 'paid' 
                      ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-605 dark:text-emerald-450' 
                      : 'bg-rose-500/10 border-rose-500/20 text-rose-500 dark:text-rose-400'
                  }`}>
                    {paymentStatus === 'paid' ? d.paymentPaid : d.paymentUnpaid}
                  </span>
                </div>

                <div className="h-px dark:bg-slate-900 bg-slate-200" />
                
                <div className="text-xs text-slate-400 leading-relaxed">
                  {d.paymentDesc}
                </div>

                <button className="w-full flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-rose-500 to-violet-605 hover:brightness-110 text-white font-bold rounded-xl transition-all duration-300 cursor-pointer shadow-lg shadow-rose-500/10">
                  {d.btnPay}
                </button>
              </div>
            </div>

            {/* Help Desk Ticket Submitter */}
            <div className="p-6 md:p-8 rounded-3xl dark:bg-slate-900/30 bg-white border dark:border-slate-900 border-slate-200 shadow-md space-y-6">
              <h3 className="text-xl font-bold flex items-center gap-2">
                <Wrench className="w-5 h-5 text-rose-500" />
                {d.ticketTitle}
              </h3>
              
              <form onSubmit={handleSubmitTicket} className="space-y-4">
                {ticketSuccess && (
                  <div className="flex items-start gap-2.5 p-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-605 dark:text-emerald-450 rounded-xl text-xs animate-fadeIn">
                    <CheckCircle className="w-4 h-4 shrink-0" />
                    <span>{d.ticketSuccessMsg}</span>
                  </div>
                )}

                <div className="space-y-1.5">
                  <label className="text-2xs font-bold text-slate-500 uppercase tracking-wide">{d.ticketIssueLabel}</label>
                  <input
                    type="text"
                    required
                    value={ticketTitle}
                    onChange={(e) => setTicketTitle(e.target.value)}
                    placeholder={d.ticketPlaceholder}
                    className="w-full dark:bg-slate-950 bg-white border dark:border-slate-900 border-slate-200 dark:text-white text-slate-900 rounded-xl py-3 px-4 placeholder-slate-400 dark:placeholder-slate-700 text-xs focus:outline-none focus:ring-1 focus:ring-rose-500 focus:border-rose-500 transition-all"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-2xs font-bold text-slate-500 uppercase tracking-wide">{d.ticketUrgencyLabel}</label>
                  <select
                    value={ticketUrgency}
                    onChange={(e) => setTicketUrgency(e.target.value)}
                    className="w-full dark:bg-slate-950 bg-white border dark:border-slate-900 border-slate-200 dark:text-white text-slate-900 rounded-xl py-3 px-4 text-xs focus:outline-none focus:ring-1 focus:ring-rose-500 focus:border-rose-500 transition-all cursor-pointer"
                  >
                    <option value="low">{d.ticketUrgencyLow}</option>
                    <option value="medium">{d.ticketUrgencyMedium}</option>
                    <option value="high">{d.ticketUrgencyHigh}</option>
                  </select>
                </div>

                <button
                  type="submit"
                  disabled={submittingTicket || !ticketTitle}
                  className="w-full flex items-center justify-center gap-2 py-3 dark:bg-slate-950 bg-slate-100 hover:bg-slate-200 dark:hover:bg-slate-900 border dark:border-slate-800 border-slate-200 text-xs font-bold rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  {submittingTicket ? (
                    <div className="w-4 h-4 border-2 border-rose-500 border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5 text-rose-500" />
                      {d.btnSendTicket}
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
