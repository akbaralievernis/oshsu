'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'
import { useLanguageAndTheme } from '../LanguageAndThemeContext'
import { dictionaries } from '@/utils/dictionaries'
import { 
  Shield, Landmark, Users, ClipboardList, CheckCircle, AlertCircle, Wrench,
  Check, LogOut, ChevronRight, Sparkles, Phone, UserPlus, Menu, X, Sun, Moon, Globe
} from 'lucide-react'

export default function CommandantDashboard() {
  const router = useRouter()
  const supabase = createClient()
  const { language, setLanguage, theme, toggleTheme } = useLanguageAndTheme()
  const d = dictionaries[language]
  
  const [activeTab, setActiveTab] = useState<'rooms' | 'tickets' | 'students'>('rooms')
  const [commandantName, setCommandantName] = useState('Комендант')

  // Mobile drawer states
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [langMenuOpen, setLangMenuOpen] = useState(false)
  
  // Mock data for the specific dormitory
  const [stats, setStats] = useState({
    activeStudents: 412,
    emptyBeds: 38,
    activeTickets: 5,
    cleanRooms: 142
  })

  const [rooms, setRooms] = useState([
    { id: '101', floor: 1, beds: 3, occupied: 3, status: 'clean', type: language === 'kg' ? 'кыздар' : language === 'ru' ? 'девочки' : 'girls' },
    { id: '102', floor: 1, beds: 3, occupied: 2, status: 'dirty', type: language === 'kg' ? 'кыздар' : language === 'ru' ? 'девочки' : 'girls' },
    { id: '103', floor: 1, beds: 4, occupied: 4, status: 'clean', type: language === 'kg' ? 'кыздар' : language === 'ru' ? 'девочки' : 'girls' },
    { id: '201', floor: 2, beds: 3, occupied: 1, status: 'clean', type: language === 'kg' ? 'балдар' : language === 'ru' ? 'мальчики' : 'boys' },
    { id: '202', floor: 2, beds: 3, occupied: 3, status: 'clean', type: language === 'kg' ? 'балдар' : language === 'ru' ? 'мальчики' : 'boys' },
    { id: '203', floor: 2, beds: 4, occupied: 0, status: 'clean', type: language === 'kg' ? 'бош бөлмө' : language === 'ru' ? 'свободная' : 'empty' },
  ])

  const [tickets, setTickets] = useState([
    { id: '1', room: '102', student: 'Алиев Тимур', title: language === 'kg' ? 'Душ бузулду' : 'Сломался душ', urgency: 'high', status: 'new', date: '19.05.2026' },
    { id: '2', room: '201', student: 'Маматов Бектур', title: language === 'kg' ? 'Розетка иштебейт' : 'Не работает розетка', urgency: 'medium', status: 'new', date: '19.05.2026' },
    { id: '3', room: '103', student: 'Бакытова Нурай', title: language === 'kg' ? 'Терезе жабылбайт' : 'Окно не закрывается', urgency: 'low', status: 'resolved', date: '18.05.2026' },
  ])

  // Check auth & role
  useEffect(() => {
    async function checkAuth() {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        setCommandantName(user.user_metadata?.full_name || user.email || 'Комендант')
      }
    }
    checkAuth()
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  const resolveTicket = (id: string) => {
    setTickets(prev => 
      prev.map(t => t.id === id ? { ...t, status: 'resolved' } : t)
    )
    setStats(prev => ({
      ...prev,
      activeTickets: Math.max(0, prev.activeTickets - 1)
    }))
  }

  const toggleRoomCleanliness = (id: string) => {
    setRooms(prev => 
      prev.map(r => {
        if (r.id === id) {
          const newStatus = r.status === 'clean' ? 'dirty' : 'clean'
          setStats(s => ({
            ...s,
            cleanRooms: newStatus === 'clean' ? s.cleanRooms + 1 : Math.max(0, s.cleanRooms - 1)
          }))
          return { ...r, status: newStatus }
        }
        return r
      })
    )
  }

  return (
    <div className="min-h-screen transition-colors duration-300 dark:bg-slate-950 bg-slate-50 dark:text-white text-slate-900 font-sans flex flex-col lg:flex-row overflow-x-hidden">
      {/* Background Gradients */}
      <div className="absolute top-0 left-0 w-[300px] h-[300px] rounded-full dark:bg-slate-900 bg-red-100/30 blur-[150px] opacity-60 pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] rounded-full dark:bg-red-950/10 bg-rose-100/30 blur-[150px] opacity-40 pointer-events-none" />

      {/* MOBILE HEADER */}
      <header className="lg:hidden w-full flex items-center justify-between px-6 py-4 dark:bg-slate-900/80 bg-white border-b dark:border-slate-900 border-slate-200 backdrop-blur-lg sticky top-0 z-30 shadow-sm transition-colors">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-gradient-to-br dark:from-slate-900 dark:to-slate-800 from-slate-100 to-slate-50 border dark:border-slate-800 border-slate-200">
            <Shield className="w-5 h-5 text-red-600" />
          </div>
          <span className="text-sm font-extrabold tracking-tight">
            {d.oshsu} <span className="text-red-600">{d.dormitorySystem}</span>
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Theme switcher */}
          <button onClick={toggleTheme} className="p-2 rounded-lg dark:bg-slate-950 bg-slate-100 border dark:border-slate-850 border-slate-200 text-xs">
            {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-500" /> : <Moon className="w-4 h-4 text-slate-700" />}
          </button>

          {/* Language selector */}
          <button
            onClick={() => setLangMenuOpen(!langMenuOpen)}
            className="flex items-center gap-1 px-2.5 py-2 rounded-lg dark:bg-slate-950 bg-slate-100 border dark:border-slate-850 border-slate-200 text-xs font-bold"
          >
            <Globe className="w-3.5 h-3.5 text-red-600" />
            <span className="uppercase">{language}</span>
          </button>

          {langMenuOpen && (
            <div className="absolute right-16 mt-32 w-28 rounded-xl dark:bg-slate-900 bg-white border dark:border-slate-800 border-slate-200 shadow-xl overflow-hidden z-50">
              <button onClick={() => { setLanguage('kg'); setLangMenuOpen(false); }} className="w-full px-3 py-2.5 text-left text-2xs font-bold hover:bg-red-500/10">KG</button>
              <button onClick={() => { setLanguage('ru'); setLangMenuOpen(false); }} className="w-full px-3 py-2.5 text-left text-2xs font-bold hover:bg-red-500/10">RU</button>
              <button onClick={() => { setLanguage('en'); setLangMenuOpen(false); }} className="w-full px-3 py-2.5 text-left text-2xs font-bold hover:bg-red-500/10">EN</button>
            </div>
          )}

          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2.5 rounded-xl dark:bg-slate-950 bg-slate-100 border dark:border-slate-850 border-slate-200 text-red-600"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </header>

      {/* MOBILE SLIDE-IN MENU */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 bg-slate-950/60 backdrop-blur-md z-40 animate-fadeIn" onClick={() => setMobileMenuOpen(false)}>
          <aside className="w-72 max-w-[80vw] h-full dark:bg-slate-900 bg-white p-6 border-r dark:border-slate-850 border-slate-200 flex flex-col justify-between" onClick={(e) => e.stopPropagation()}>
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-slate-850 dark:bg-slate-800 flex items-center justify-center border border-slate-255 dark:border-slate-700 font-bold text-red-600 shadow-md">
                  {commandantName[0].toUpperCase()}
                </div>
                <div>
                  <div className="text-sm font-bold">{commandantName}</div>
                  <div className="text-xs text-slate-500">{d.commandant}</div>
                </div>
              </div>

              {/* Links */}
              <nav className="space-y-2">
                <button
                  onClick={() => { setActiveTab('rooms'); setMobileMenuOpen(false); }}
                  className={`w-full flex items-center gap-3 px-4 py-3 text-xs font-bold rounded-xl transition-all ${activeTab === 'rooms' ? 'bg-red-600 text-white shadow-lg' : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-850'}`}
                >
                  <Landmark className="w-4 h-4" />
                  {d.roomsMapTitle}
                </button>
                <button
                  onClick={() => { setActiveTab('tickets'); setMobileMenuOpen(false); }}
                  className={`w-full flex items-center gap-3 px-4 py-3 text-xs font-bold rounded-xl transition-all ${activeTab === 'tickets' ? 'bg-red-600 text-white shadow-lg' : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-850'}`}
                >
                  <Wrench className="w-4 h-4" />
                  {d.studentTicketsTitle}
                </button>
                <button
                  onClick={() => { setActiveTab('students'); setMobileMenuOpen(false); }}
                  className={`w-full flex items-center gap-3 px-4 py-3 text-xs font-bold rounded-xl transition-all ${activeTab === 'students' ? 'bg-red-600 text-white shadow-lg' : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-850'}`}
                >
                  <Users className="w-4 h-4" />
                  {d.studentsCardtitle}
                </button>
              </nav>
            </div>

            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 py-3 bg-red-500/10 hover:bg-red-500/20 text-red-650 dark:text-red-400 text-xs font-bold rounded-xl border border-red-500/10 transition-all"
            >
              <LogOut className="w-4 h-4" />
              {d.logout}
            </button>
          </aside>
        </div>
      )}

      {/* DESKTOP SIDEBAR */}
      <aside className="hidden lg:flex w-80 dark:bg-slate-900/60 bg-white border-r dark:border-slate-900/80 border-slate-200 p-6 flex-col justify-between shrink-0 z-20 transition-colors duration-300">
        <div className="space-y-8">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-gradient-to-br dark:from-slate-900 dark:to-slate-800 from-slate-100 to-slate-50 border dark:border-slate-800 border-slate-200 shadow-lg">
              <Landmark className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <h1 className="text-lg font-black tracking-tight leading-none">{d.oshsu}</h1>
              <span className="text-xs text-red-650 dark:text-red-500 font-bold tracking-widest uppercase">{d.commandant}</span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-2">
            <button
              onClick={() => setActiveTab('rooms')}
              className={`w-full flex items-center justify-between px-4 py-3.5 text-sm font-semibold rounded-2xl transition-all duration-300 ${
                activeTab === 'rooms'
                  ? 'bg-red-600 text-white font-bold shadow-lg shadow-red-550/10'
                  : 'dark:text-slate-400 text-slate-555 hover:text-red-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-900/50'
              }`}
            >
              <div className="flex items-center gap-3">
                <Landmark className="w-5 h-5" />
                {language === 'kg' ? 'Бөлмөлөрдүн картасы' : language === 'ru' ? 'Карта комнат' : 'Rooms Map'}
              </div>
              <ChevronRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => setActiveTab('tickets')}
              className={`w-full flex items-center justify-between px-4 py-3.5 text-sm font-semibold rounded-2xl transition-all duration-300 ${
                activeTab === 'tickets'
                  ? 'bg-red-600 text-white font-bold shadow-lg shadow-red-550/10'
                  : 'dark:text-slate-400 text-slate-555 hover:text-red-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-900/50'
              }`}
            >
              <div className="flex items-center gap-3">
                <Wrench className="w-5 h-5" />
                {language === 'kg' ? 'Мүчүлүштүктөр' : language === 'ru' ? 'Неполадки' : 'Maintenance'}
              </div>
              {stats.activeTickets > 0 && (
                <span className={`px-2 py-0.5 text-xs font-black rounded-full ${activeTab === 'tickets' ? 'bg-slate-950 text-white' : 'bg-red-600 text-white'}`}>
                  {stats.activeTickets}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('students')}
              className={`w-full flex items-center justify-between px-4 py-3.5 text-sm font-semibold rounded-2xl transition-all duration-300 ${
                activeTab === 'students'
                  ? 'bg-red-600 text-white font-bold shadow-lg shadow-red-550/10'
                  : 'dark:text-slate-400 text-slate-555 hover:text-red-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-900/50'
              }`}
            >
              <div className="flex items-center gap-3">
                <Users className="w-5 h-5" />
                {d.studentsCardtitle}
              </div>
              <ChevronRight className="w-4 h-4" />
            </button>
          </nav>
        </div>

        {/* Action controllers & User info */}
        <div className="space-y-3">
          {/* Controllers */}
          <div className="flex items-center justify-between gap-2 p-2 dark:bg-slate-950 bg-slate-100 rounded-xl border dark:border-slate-900 border-slate-200">
            <button 
              onClick={toggleTheme} 
              className="flex-1 p-2 rounded-lg hover:bg-red-500/10 text-slate-500 hover:text-red-600 transition-colors flex justify-center"
              title="Темный / Светлый режим"
            >
              {theme === 'dark' ? <Sun className="w-4.5 h-4.5 text-amber-500" /> : <Moon className="w-4.5 h-4.5" />}
            </button>
            <div className="h-6 w-px dark:bg-slate-900 bg-slate-200" />
            <select 
              value={language}
              onChange={(e) => setLanguage(e.target.value as any)}
              className="bg-transparent text-xs font-bold text-slate-500 hover:text-red-600 focus:outline-none cursor-pointer uppercase py-1 px-2 rounded-md"
            >
              <option value="kg" className="dark:bg-slate-900 text-slate-900 dark:text-white">KG</option>
              <option value="ru" className="dark:bg-slate-900 text-slate-900 dark:text-white">RU</option>
              <option value="en" className="dark:bg-slate-900 text-slate-900 dark:text-white">EN</option>
            </select>
          </div>

          <div className="pt-4 border-t dark:border-slate-900 border-slate-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl dark:bg-slate-800 bg-slate-200 flex items-center justify-center border dark:border-slate-700 border-slate-300 font-bold text-red-600 shadow-md">
                {commandantName[0].toUpperCase()}
              </div>
              <div className="truncate">
                <div className="text-sm font-bold truncate">{commandantName}</div>
                <div className="text-xs text-slate-500">Башкы комендант</div>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 py-3 bg-red-500/10 hover:bg-red-500/20 text-red-650 dark:text-red-400 text-sm font-bold rounded-2xl border border-red-500/10 transition-all duration-300"
            >
              <LogOut className="w-4 h-4" />
              {d.logout}
            </button>
          </div>
        </div>
      </aside>

      {/* MAIN CONTAINER */}
      <main className="flex-1 flex flex-col min-h-screen overflow-y-auto p-6 md:p-8 lg:p-12 z-10">
        {/* Header */}
        <header className="mb-10">
          <h2 className="text-3xl font-extrabold tracking-tight">{d.commCabinet}</h2>
          <p className="text-sm text-slate-400 mt-1">{d.commCabinetDesc}</p>
        </header>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <div className="p-6 rounded-3xl dark:bg-slate-900/40 bg-white border dark:border-slate-900 border-slate-200 flex items-center gap-5 shadow-sm">
            <div className="p-4 rounded-2xl bg-red-550/10 text-red-600 border border-red-500/10">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <div className="text-2xl font-black">{stats.activeStudents}</div>
              <div className="text-xs text-slate-500 font-semibold uppercase tracking-wider">{d.metricActiveStudents}</div>
            </div>
          </div>

          <div className="p-6 rounded-3xl dark:bg-slate-900/40 bg-white border dark:border-slate-900 border-slate-200 flex items-center gap-5 shadow-sm">
            <div className="p-4 rounded-2xl bg-red-550/10 text-red-600 border border-red-500/10">
              <Landmark className="w-6 h-6" />
            </div>
            <div>
              <div className="text-2xl font-black">{stats.emptyBeds}</div>
              <div className="text-xs text-slate-500 font-semibold uppercase tracking-wider">{d.metricEmptyBeds}</div>
            </div>
          </div>

          <div className="p-6 rounded-3xl dark:bg-slate-900/40 bg-white border dark:border-slate-900 border-slate-200 flex items-center gap-5 shadow-sm">
            <div className="p-4 rounded-2xl bg-red-550/10 text-red-600 border border-red-500/10">
              <Wrench className="w-6 h-6" />
            </div>
            <div>
              <div className="text-2xl font-black">{stats.activeTickets}</div>
              <div className="text-xs text-slate-500 font-semibold uppercase tracking-wider">{d.metricActiveTickets}</div>
            </div>
          </div>

          <div className="p-6 rounded-3xl dark:bg-slate-900/40 bg-white border dark:border-slate-900 border-slate-200 flex items-center gap-5 shadow-sm">
            <div className="p-4 rounded-2xl bg-red-550/10 text-red-600 border border-red-500/10">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <div className="text-2xl font-black">{stats.cleanRooms}</div>
              <div className="text-xs text-slate-500 font-semibold uppercase tracking-wider">{d.metricCleanRooms}</div>
            </div>
          </div>
        </div>

        {/* Tab 1: Rooms Map */}
        {activeTab === 'rooms' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-bold">{d.roomsMapTitle}</h3>
              <span className="text-xs text-slate-500 font-medium">{d.roomsMapHint}</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {rooms.map(room => (
                <div 
                  key={room.id}
                  onClick={() => toggleRoomCleanliness(room.id)}
                  className="group p-6 rounded-3xl dark:bg-slate-900/30 bg-white border dark:border-slate-900 border-slate-200 hover:border-red-500/30 transition-all duration-300 cursor-pointer flex flex-col justify-between space-y-6 hover:shadow-md"
                >
                  <div className="flex items-center justify-between">
                    <div className="text-lg font-black">{room.id}-бөлмө</div>
                    <span className={`px-2.5 py-1 text-2xs font-extrabold rounded-full ${
                      room.status === 'clean' 
                        ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-450' 
                        : 'bg-red-500/10 border border-red-500/20 text-red-600'
                    }`}>
                      {room.status === 'clean' ? d.roomClean : d.roomDirty}
                    </span>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between text-xs font-semibold text-slate-500">
                      <span>{d.roomTypeLabel}</span>
                      <span className="dark:text-slate-200 text-slate-700 capitalize">{room.type}</span>
                    </div>

                    <div className="flex justify-between text-xs font-semibold text-slate-500">
                      <span>{d.roomOccupiedLabel}</span>
                      <span className="dark:text-slate-200 text-slate-700">{room.occupied} / {room.beds}</span>
                    </div>
                  </div>

                  <div className="h-1.5 w-full dark:bg-slate-950 bg-slate-100 rounded-full overflow-hidden border dark:border-slate-900 border-slate-200">
                    <div 
                      className="h-full bg-gradient-to-r from-red-600 to-rose-700 rounded-full" 
                      style={{ width: `${(room.occupied / room.beds) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 2: Tickets Resolver */}
        {activeTab === 'tickets' && (
          <div className="space-y-6 animate-fadeIn">
            <h3 className="text-xl font-bold">{d.studentTicketsTitle}</h3>

            <div className="dark:bg-slate-900/30 bg-white border dark:border-slate-900 border-slate-200 rounded-3xl overflow-hidden shadow-sm">
              <div className="w-full overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[700px]">
                  <thead>
                    <tr className="dark:bg-slate-950/60 bg-slate-100/60 border-b dark:border-slate-900 border-slate-200 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                      <th className="py-4.5 px-6">{d.tableRoomStudent}</th>
                      <th className="py-4.5 px-6">{d.tableIssue}</th>
                      <th className="py-4.5 px-6">{d.tableUrgency}</th>
                      <th className="py-4.5 px-6">{d.tableDate}</th>
                      <th className="py-4.5 px-6">{d.tableStatus}</th>
                      <th className="py-4.5 px-6 text-right">{d.tableAction}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y dark:divide-slate-900/80 divide-slate-200 text-sm">
                    {tickets.map(ticket => (
                      <tr key={ticket.id} className="hover:bg-slate-500/5 transition-colors">
                        <td className="py-4 px-6">
                          <div className="font-bold">{ticket.room}-бөлмө</div>
                          <div className="text-xs text-slate-500">{ticket.student}</div>
                        </td>
                        <td className="py-4 px-6 font-semibold dark:text-slate-300 text-slate-700">{ticket.title}</td>
                        <td className="py-4 px-6">
                          <span className={`px-2 py-0.5 text-2xs font-extrabold rounded-full ${
                            ticket.urgency === 'high' 
                              ? 'bg-red-500/10 border border-red-500/20 text-red-650 dark:text-red-400' 
                              : ticket.urgency === 'medium'
                              ? 'bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-500'
                              : 'dark:bg-slate-800 bg-slate-200 border dark:border-slate-700 border-slate-350 text-slate-500'
                          }`}>
                            {ticket.urgency === 'high' ? d.urgencyHigh : ticket.urgency === 'medium' ? d.urgencyMedium : d.urgencyLow}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-slate-500">{ticket.date}</td>
                        <td className="py-4 px-6">
                          {ticket.status === 'new' ? (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 text-xs font-bold rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-650 dark:text-amber-500">
                              {d.appStatusPending}
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 text-xs font-bold rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-450">
                              {d.ticketResolvedStatus}
                            </span>
                          )}
                        </td>
                        <td className="py-4 px-6 text-right">
                          {ticket.status === 'new' ? (
                            <button 
                              onClick={() => resolveTicket(ticket.id)}
                              className="px-3.5 py-1.5 bg-gradient-to-r from-red-600 to-rose-700 hover:from-red-700 hover:to-rose-800 text-white text-xs font-extrabold rounded-xl shadow-lg transition-colors flex items-center gap-1.5 ml-auto"
                            >
                              <Check className="w-3.5 h-3.5" />
                              {d.btnMarkResolved}
                            </button>
                          ) : (
                            <span className="text-xs text-slate-500 italic">{d.ticketResolvedStatus}</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Students list */}
        {activeTab === 'students' && (
          <div className="p-8 md:p-12 rounded-3xl dark:bg-slate-900/20 bg-white border dark:border-slate-900 border-slate-200 text-center space-y-4 shadow-sm animate-fadeIn">
            <Users className="w-12 h-12 text-red-600 mx-auto opacity-70" />
            <h3 className="text-xl font-bold">{d.studentsCardtitle}</h3>
            <p className="text-sm text-slate-450 max-w-md mx-auto leading-relaxed">
              {d.studentsCardDesc}
            </p>
            <button className="px-5 py-2.5 dark:bg-slate-950 bg-slate-100 hover:bg-slate-200 dark:hover:bg-slate-900 border dark:border-slate-800 border-slate-250 text-xs font-bold rounded-xl transition-all flex items-center gap-2 mx-auto">
              <Phone className="w-4 h-4 text-red-600" />
              {d.btnDownloadContacts}
            </button>
          </div>
        )}
      </main>
    </div>
  )
}
