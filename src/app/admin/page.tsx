'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'
import { useLanguageAndTheme } from '../LanguageAndThemeContext'
import { dictionaries } from '@/utils/dictionaries'
import { 
  Shield, Users, Landmark, FileText, CheckCircle, XCircle, Clock, 
  Plus, Settings, LogOut, ChevronRight, Search, Filter, RefreshCw, BarChart3,
  Menu, X, Sun, Moon, Globe, Bell, Printer, CreditCard, ClipboardList
} from 'lucide-react'
import { localDb } from '@/utils/localDb'

export default function AdminDashboard() {
  const router = useRouter()
  const supabase = createClient()
  const { language, setLanguage, theme, toggleTheme } = useLanguageAndTheme()
  const d = dictionaries[language]
  
  const [activeTab, setActiveTab] = useState<'overview' | 'applications' | 'dormitories' | 'users' | 'bookings'>('overview')
  const [loading, setLoading] = useState(false)
  const [adminName, setAdminName] = useState('Администратор')
  const [bookings, setBookings] = useState<any[]>([])

  // Mobile drawer states
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [langMenuOpen, setLangMenuOpen] = useState(false)

  // Real-time notifications state
  const [notifications, setNotifications] = useState([
    { id: '1', textKg: 'Асанов Алмаздын №1 Жатаканага жайгашуу боюнча арызы келип түштү.', textRu: 'Поступило новое заявление от Асанова Алмаза на заселение в Общежитие №1.', textEn: 'New application received from Asanov Almaz for Dormitory №1.', date: '1 саат мурун', read: false },
    { id: '2', textKg: 'Комендант бөлмөлөрдүн тазалык рейтингин жаңыртты.', textRu: 'Комендант обновил рейтинг чистоты комнат.', textEn: 'The commandant updated the room cleanliness rating.', date: '4 саат мурун', read: false }
  ])
  const [notifOpen, setNotifOpen] = useState(false)
  const unreadCount = notifications.filter(n => !n.read).length
  
  // Stats
  const [stats, setStats] = useState({
    totalStudents: 1420,
    totalDorms: 7,
    pendingApps: 0,
    activeTickets: 5
  })

  const [applications, setApplications] = useState<any[]>([])

  // Static base occupancy values (used to prevent double-counting on re-renders)
  const BASE_DORMITORIES = [
    { id: '1', name: '№1 Жатакана (Башкы корпус)', address: 'Ленин көчөсү, 331', rooms: 120, beds: 450, occupied: 412, status: 'Активдүү' },
    { id: '2', name: '№2 Жатакана (Эл аралык)', address: 'Исанов көчөсү, 73', rooms: 150, beds: 600, occupied: 580, status: 'Активдүү' },
    { id: '3', name: '№3 Жатакана (Жаңы конуш)', address: 'Г. Айтиев көчөсү, 12', rooms: 200, beds: 800, occupied: 610, status: 'Толуп калды' },
    { id: '4', name: '№4 Жатакана (Медициналык)', address: 'Курманжан Датка көчөсү, 204', rooms: 130, beds: 500, occupied: 420, status: 'Активдүү' },
    { id: '5', name: '№5 Жатакана (Педагогикалык)', address: 'Г. Айтиев көчөсү, 8', rooms: 90, beds: 350, occupied: 310, status: 'Активдүү' },
    { id: '6', name: '№6 Жатакана (Техникалык)', address: 'Ленин көчөсү, 287', rooms: 100, beds: 400, occupied: 360, status: 'Активдүү' },
    { id: '7', name: '№7 Жатакана (Спортук)', address: 'Исанов көчөсү, 89', rooms: 80, beds: 300, occupied: 250, status: 'Активдүү' },
  ]

  const [dormitories, setDormitories] = useState(BASE_DORMITORIES)

  // Check auth & role
  useEffect(() => {
    const user = localDb.getCurrentUser()
    if (!user) {
      router.push('/login')
      return
    }
    if (user.role !== 'admin') {
      router.push(user.role === 'commandant' ? '/commandant' : '/dashboard')
      return
    }
    setAdminName(user.fullName || user.email || 'Администратор')

    // Load initial data
    setApplications(localDb.getApplications())
    setBookings(localDb.getBookings())
  }, [])

  // Sync statistics and occupancy dynamically
  useEffect(() => {
    const allApps = localDb.getApplications()
    const allBookings = localDb.getBookings()
    
    // Update dormitories occupancy dynamically based on bookings (uses static base values to prevent double-counting)
    setDormitories(
      BASE_DORMITORIES.map(dorm => {
        const bookingsCount = allBookings.filter(b => b.dormId === dorm.id).length
        const totalOccupied = dorm.occupied + bookingsCount
        return {
          ...dorm,
          occupied: totalOccupied > dorm.beds ? dorm.beds : totalOccupied
        }
      })
    )

    setStats({
      totalStudents: 1420 + allBookings.length,
      totalDorms: 7,
      pendingApps: allApps.filter(a => a.status === 'pending').length,
      activeTickets: 5
    })
  }, [applications, bookings])

  const handleLogout = () => {
    document.cookie = "oshsu_role=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;"
    localDb.clearCurrentUser()
    router.push('/login')
  }

  const updateAppStatus = (id: string, newStatus: 'approved' | 'rejected') => {
    localDb.updateApplicationStatus(id, newStatus)
    const updatedApps = localDb.getApplications()
    setApplications(updatedApps)
  }

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })))
  }

  return (
    <div className="min-h-screen transition-colors duration-300 dark:bg-slate-950 bg-slate-50 dark:text-white text-slate-900 font-sans flex flex-col lg:flex-row overflow-x-hidden">
      {/* Background Gradients */}
      <div className="absolute top-0 left-0 w-[300px] h-[300px] rounded-full dark:bg-slate-900 bg-rose-100/30 blur-[150px] opacity-60 pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] rounded-full dark:bg-violet-955/10 bg-violet-100/30 blur-[150px] opacity-40 pointer-events-none" />

      {/* MOBILE HEADER */}
      <header className="lg:hidden w-full flex items-center justify-between px-6 py-4 dark:bg-slate-900/80 bg-white border-b dark:border-slate-900 border-slate-200 backdrop-blur-lg sticky top-0 z-30 shadow-sm transition-colors">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-gradient-to-br dark:from-slate-900 dark:to-slate-800 from-slate-100 to-slate-50 border dark:border-slate-800 border-slate-200">
            <Shield className="w-5 h-5 text-rose-500" />
          </div>
          <span className="text-sm font-extrabold tracking-tight">
            {d.oshsu} <span className="bg-gradient-to-r from-rose-500 to-violet-605 bg-clip-text text-transparent">{d.dormitorySystem}</span>
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Mobile Notification Bell */}
          <div className="relative">
            <button onClick={() => setNotifOpen(!notifOpen)} className="p-2 rounded-lg dark:bg-slate-950 bg-slate-100 border dark:border-slate-850 border-slate-200 text-xs cursor-pointer relative">
              <Bell className="w-4 h-4 text-rose-500" />
              {unreadCount > 0 && (
                <span className="absolute top-0.5 right-0.5 w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
              )}
            </button>

            {notifOpen && (
              <div className="absolute right-0 mt-3 w-72 rounded-2xl dark:bg-slate-900 bg-white border dark:border-slate-800 border-slate-200 shadow-xl overflow-hidden z-50 p-4 space-y-3.5 text-xs animate-fadeIn text-slate-800 dark:text-slate-100">
                <div className="flex items-center justify-between font-bold border-b dark:border-slate-850 border-slate-200 pb-2">
                  <span>Журнал кабарлары</span>
                  <button onClick={markAllRead} className="text-rose-500 hover:underline text-2xs cursor-pointer">Окулду</button>
                </div>
                <div className="space-y-3.5 max-h-48 overflow-y-auto">
                  {notifications.map(n => (
                    <div key={n.id} className={`p-2.5 rounded-xl border ${n.read ? 'dark:bg-slate-900/50 bg-slate-50 border-slate-200' : 'bg-rose-500/5 border-rose-500/10'}`}>
                      <p className="leading-relaxed text-2xs font-semibold">{language === 'kg' ? n.textKg : language === 'ru' ? n.textRu : n.textEn}</p>
                      <span className="text-[10px] text-slate-400 mt-1 block font-medium">{n.date}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Theme switcher */}
          <button onClick={toggleTheme} className="p-2 rounded-lg dark:bg-slate-950 bg-slate-100 border dark:border-slate-850 border-slate-200 text-xs cursor-pointer animate-pulse">
            {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-500" /> : <Moon className="w-4 h-4 text-slate-700" />}
          </button>

          {/* Language selector */}
          <button
            onClick={() => setLangMenuOpen(!langMenuOpen)}
            className="flex items-center gap-1 px-2.5 py-2 rounded-lg dark:bg-slate-950 bg-slate-100 border dark:border-slate-850 border-slate-200 text-xs font-bold cursor-pointer"
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

          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2.5 rounded-xl dark:bg-slate-950 bg-slate-100 border dark:border-slate-855 border-slate-200 text-rose-500 cursor-pointer"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </header>

      {/* MOBILE MENU DRAWER */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 bg-slate-950/60 backdrop-blur-md z-40 animate-fadeIn" onClick={() => setMobileMenuOpen(false)}>
          <aside className="w-72 max-w-[80vw] h-full dark:bg-slate-900 bg-white p-6 border-r dark:border-slate-850 border-slate-200 flex flex-col justify-between" onClick={(e) => e.stopPropagation()}>
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-slate-855 dark:bg-slate-800 flex items-center justify-center border border-slate-255 dark:border-slate-700 font-bold text-rose-500 shadow-md">
                  {adminName[0].toUpperCase()}
                </div>
                <div>
                  <div className="text-sm font-bold">{adminName}</div>
                  <div className="text-xs text-slate-500">{d.admin}</div>
                </div>
              </div>

              {/* Links */}
              <nav className="space-y-2">
                <button
                  onClick={() => { setActiveTab('overview'); setMobileMenuOpen(false); }}
                  className={`w-full flex items-center gap-3 px-4 py-3 text-xs font-bold rounded-xl transition-all cursor-pointer ${activeTab === 'overview' ? 'bg-gradient-to-r from-rose-500 to-violet-605 text-white shadow-lg' : 'text-slate-555 hover:bg-slate-100 dark:hover:bg-slate-855'}`}
                >
                  <BarChart3 className="w-4 h-4" />
                  {d.navOverview}
                </button>
                <button
                  onClick={() => { setActiveTab('applications'); setMobileMenuOpen(false); }}
                  className={`w-full flex items-center gap-3 px-4 py-3 text-xs font-bold rounded-xl transition-all cursor-pointer ${activeTab === 'applications' ? 'bg-gradient-to-r from-rose-500 to-violet-605 text-white shadow-lg' : 'text-slate-555 hover:bg-slate-100 dark:hover:bg-slate-855'}`}
                >
                  <FileText className="w-4 h-4" />
                  {d.navApplications}
                </button>
                <button
                  onClick={() => { setActiveTab('bookings'); setMobileMenuOpen(false); }}
                  className={`w-full flex items-center gap-3 px-4 py-3 text-xs font-bold rounded-xl transition-all cursor-pointer ${activeTab === 'bookings' ? 'bg-gradient-to-r from-rose-500 to-violet-605 text-white shadow-lg' : 'text-slate-555 hover:bg-slate-100 dark:hover:bg-slate-855'}`}
                >
                  <CreditCard className="w-4 h-4" />
                  {language === 'kg' ? 'Төлөмдөр жана орундар' : language === 'ru' ? 'Платежи и брони' : 'Payments & Bookings'}
                </button>
                <button
                  onClick={() => { setActiveTab('dormitories'); setMobileMenuOpen(false); }}
                  className={`w-full flex items-center gap-3 px-4 py-3 text-xs font-bold rounded-xl transition-all cursor-pointer ${activeTab === 'dormitories' ? 'bg-gradient-to-r from-rose-500 to-violet-605 text-white shadow-lg' : 'text-slate-555 hover:bg-slate-100 dark:hover:bg-slate-855'}`}
                >
                  <Landmark className="w-4 h-4" />
                  {d.navDormitories}
                </button>
              </nav>
            </div>

            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 py-3 bg-rose-500/10 hover:bg-rose-500/20 text-rose-650 dark:text-rose-455 text-xs font-bold rounded-xl border border-rose-500/10 transition-all cursor-pointer"
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
              <Shield className="w-6 h-6 text-rose-500" />
            </div>
            <div>
              <h1 className="text-lg font-black tracking-tight leading-none">{d.oshsu}</h1>
              <span className="text-xs bg-gradient-to-r from-rose-500 to-violet-600 bg-clip-text text-transparent font-bold tracking-widest uppercase">{d.admin}</span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-2">
            <button
              onClick={() => setActiveTab('overview')}
              className={`w-full flex items-center justify-between px-4 py-3.5 text-sm font-semibold rounded-2xl transition-all duration-300 cursor-pointer ${
                activeTab === 'overview'
                  ? 'bg-gradient-to-r from-rose-500 to-violet-600 text-white font-bold shadow-lg shadow-rose-550/10'
                  : 'dark:text-slate-400 text-slate-555 hover:text-rose-500 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-900/50'
              }`}
            >
              <div className="flex items-center gap-3">
                <BarChart3 className="w-5 h-5" />
                {d.navOverview}
              </div>
              <ChevronRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => setActiveTab('applications')}
              className={`w-full flex items-center justify-between px-4 py-3.5 text-sm font-semibold rounded-2xl transition-all duration-300 cursor-pointer ${
                activeTab === 'applications'
                  ? 'bg-gradient-to-r from-rose-500 to-violet-600 text-white font-bold shadow-lg shadow-rose-550/10'
                  : 'dark:text-slate-400 text-slate-555 hover:text-rose-500 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-900/50'
              }`}
            >
              <div className="flex items-center gap-3">
                <FileText className="w-5 h-5" />
                {d.navApplications}
              </div>
              {stats.pendingApps > 0 && (
                <span className={`px-2 py-0.5 text-xs font-black rounded-full ${activeTab === 'applications' ? 'bg-slate-950 text-white' : 'bg-rose-500 text-white'}`}>
                  {stats.pendingApps}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('bookings')}
              className={`w-full flex items-center justify-between px-4 py-3.5 text-sm font-semibold rounded-2xl transition-all duration-300 cursor-pointer ${
                activeTab === 'bookings'
                  ? 'bg-gradient-to-r from-rose-500 to-violet-600 text-white font-bold shadow-lg shadow-rose-550/10'
                  : 'dark:text-slate-400 text-slate-555 hover:text-rose-500 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-900/50'
              }`}
            >
              <div className="flex items-center gap-3">
                <CreditCard className="w-5 h-5" />
                {language === 'kg' ? 'Төлөмдөр жана орундар' : language === 'ru' ? 'Платежи и брони' : 'Payments & Bookings'}
              </div>
              <ChevronRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => setActiveTab('dormitories')}
              className={`w-full flex items-center justify-between px-4 py-3.5 text-sm font-semibold rounded-2xl transition-all duration-300 cursor-pointer ${
                activeTab === 'dormitories'
                  ? 'bg-gradient-to-r from-rose-500 to-violet-600 text-white font-bold shadow-lg shadow-rose-550/10'
                  : 'dark:text-slate-400 text-slate-555 hover:text-rose-500 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-900/50'
              }`}
            >
              <div className="flex items-center gap-3">
                <Landmark className="w-5 h-5" />
                {d.navDormitories}
              </div>
              <ChevronRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => setActiveTab('users')}
              className={`w-full flex items-center justify-between px-4 py-3.5 text-sm font-semibold rounded-2xl transition-all duration-300 cursor-pointer ${
                activeTab === 'users'
                  ? 'bg-gradient-to-r from-rose-500 to-violet-600 text-white font-bold shadow-lg shadow-rose-550/10'
                  : 'dark:text-slate-400 text-slate-555 hover:text-rose-500 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-900/50'
              }`}
            >
              <div className="flex items-center gap-3">
                <Users className="w-5 h-5" />
                {d.navUsers}
              </div>
              <ChevronRight className="w-4 h-4" />
            </button>
          </nav>
        </div>

        {/* User Info / Toggles / Logout */}
        <div className="space-y-3">
          {/* Controllers */}
          <div className="flex items-center justify-between gap-2 p-2 dark:bg-slate-950 bg-slate-100 rounded-xl border dark:border-slate-900 border-slate-200">
            <button 
              onClick={toggleTheme} 
              className="flex-1 p-2 rounded-lg hover:bg-rose-500/10 text-slate-500 hover:text-rose-500 transition-colors flex justify-center cursor-pointer"
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

          <div className="pt-4 border-t dark:border-slate-900 border-slate-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl dark:bg-slate-800 bg-slate-200 flex items-center justify-center border dark:border-slate-700 border-slate-300 font-bold text-rose-500 shadow-md">
                {adminName[0].toUpperCase()}
              </div>
              <div className="truncate">
                <div className="text-sm font-bold truncate">{adminName}</div>
                <div className="text-xs text-slate-555">Системалык администратор</div>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 py-3 bg-rose-500/10 hover:bg-rose-500/20 text-rose-650 dark:text-rose-455 text-sm font-bold rounded-2xl border border-rose-500/10 transition-all duration-300 cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              {d.logout}
            </button>
          </div>
        </div>
      </aside>

      {/* MAIN CONTAINER */}
      <main className="flex-1 flex flex-col min-h-screen overflow-y-auto p-6 md:p-8 lg:p-12 z-10 animate-fadeIn">
        {/* Desktop Header */}
        <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-10">
          <div>
            <h2 className="text-3xl font-extrabold tracking-tight">{d.adminCabinet}</h2>
            <p className="text-sm text-slate-400 mt-1">{d.adminCabinetDesc}</p>
          </div>
          
          <div className="flex items-center gap-2 w-full sm:w-auto">
            {/* Desktop Notification Bell */}
            <div className="relative">
              <button
                onClick={() => setNotifOpen(!notifOpen)}
                className="p-3 rounded-2xl dark:bg-slate-900 bg-white border dark:border-slate-800 border-slate-200 hover:border-rose-550/30 transition-all shadow-sm relative cursor-pointer"
              >
                <Bell className="w-5 h-5 text-rose-500" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-2.5 h-2.5 rounded-full bg-rose-500 border-2 dark:border-slate-905 border-white" />
                )}
              </button>

              {notifOpen && (
                <div className="absolute right-0 mt-3 w-80 rounded-2xl dark:bg-slate-900 bg-white border dark:border-slate-800 border-slate-200 shadow-2xl overflow-hidden z-50 p-5 space-y-3.5 text-xs animate-fadeIn text-slate-800 dark:text-slate-100">
                  <div className="flex items-center justify-between font-bold border-b dark:border-slate-850 border-slate-200 pb-2">
                    <span>Системалык билдирүүлөр</span>
                    <button onClick={markAllRead} className="text-rose-500 hover:underline text-2xs cursor-pointer">Жок кылуу</button>
                  </div>
                  <div className="space-y-3 max-h-52 overflow-y-auto">
                    {notifications.map(n => (
                      <div key={n.id} className={`p-3 rounded-xl border ${n.read ? 'dark:bg-slate-900/50 bg-slate-50 border-slate-150' : 'bg-rose-500/5 border-rose-500/10'}`}>
                        <p className="leading-relaxed text-2xs font-semibold">{language === 'kg' ? n.textKg : language === 'ru' ? n.textRu : n.textEn}</p>
                        <span className="text-[10px] text-slate-400 mt-1 block font-medium">{n.date}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <button 
              onClick={() => setLoading(true)}
              className="flex items-center justify-center gap-2 px-4 py-3 dark:bg-slate-900 bg-white border dark:border-slate-800 border-slate-200 text-xs font-semibold rounded-xl hover:bg-slate-50 dark:hover:bg-slate-850 transition-all cursor-pointer flex-1 sm:flex-initial"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-rose-500 ${loading ? 'animate-spin' : ''}`} />
              {d.btnRefresh}
            </button>
          </div>
        </header>

        {/* Tab 1: Overview */}
        {activeTab === 'overview' && (
          <div className="space-y-10 animate-fadeIn">
            {/* Stats Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="p-6 rounded-3xl dark:bg-slate-900/40 bg-white border dark:border-slate-900 border-slate-200 flex items-center gap-5 shadow-sm">
                <div className="p-4 rounded-2xl bg-rose-500/10 text-rose-500 border border-rose-500/10">
                  <Users className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-2xl font-black">{stats.totalStudents}</div>
                  <div className="text-xs text-slate-500 font-semibold uppercase tracking-wider">{d.metricDormTotal}</div>
                </div>
              </div>

              <div className="p-6 rounded-3xl dark:bg-slate-900/40 bg-white border dark:border-slate-900 border-slate-200 flex items-center gap-5 shadow-sm">
                <div className="p-4 rounded-2xl bg-rose-500/10 text-rose-500 border border-rose-500/10">
                  <Landmark className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-2xl font-black">{stats.totalDorms}</div>
                  <div className="text-xs text-slate-500 font-semibold uppercase tracking-wider">{d.metricActiveDorms}</div>
                </div>
              </div>

              <div className="p-6 rounded-3xl dark:bg-slate-900/40 bg-white border dark:border-slate-900 border-slate-200 flex items-center gap-5 shadow-sm">
                <div className="p-4 rounded-2xl bg-rose-500/10 text-rose-505 border border-rose-500/10">
                  <FileText className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-2xl font-black">{stats.pendingApps}</div>
                  <div className="text-xs text-slate-500 font-semibold uppercase tracking-wider">{d.metricPendingApps}</div>
                </div>
              </div>

              <div className="p-6 rounded-3xl dark:bg-slate-900/40 bg-white border dark:border-slate-900 border-slate-200 flex items-center gap-5 shadow-sm">
                <div className="p-4 rounded-2xl bg-rose-500/10 text-rose-505 border border-rose-500/10">
                  <Clock className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-2xl font-black">{stats.activeTickets}</div>
                  <div className="text-xs text-slate-500 font-semibold uppercase tracking-wider">{d.metricActiveTicketsAdmin}</div>
                </div>
              </div>
            </div>

            {/* Quick Actions & Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Dormitory Occupancy Progress */}
              <div className="lg:col-span-2 p-6 md:p-8 rounded-3xl dark:bg-slate-900/30 bg-white border dark:border-slate-900 border-slate-200 shadow-sm space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold">{d.dormOccupancyTitle}</h3>
                  <button onClick={() => setActiveTab('dormitories')} className="text-xs text-rose-500 font-bold hover:underline cursor-pointer">{language === 'kg' ? 'Баарын көрүү' : 'Смотреть все'}</button>
                </div>
                
                <div className="space-y-5">
                  {dormitories.map(dorm => {
                    const percentage = Math.round((dorm.occupied / dorm.beds) * 100)
                    return (
                      <div key={dorm.id} className="space-y-2">
                        <div className="flex justify-between text-sm font-semibold">
                          <span>{dorm.name}</span>
                          <span className="text-rose-500">{dorm.occupied}/{dorm.beds} {language === 'kg' ? 'орун' : 'мест'} ({percentage}%)</span>
                        </div>
                        <div className="h-2.5 w-full dark:bg-slate-950 bg-slate-100 border dark:border-slate-900 border-slate-200 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-rose-500 to-violet-600 rounded-full transition-all duration-500" 
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Quick Actions Panel */}
              <div className="p-6 md:p-8 rounded-3xl dark:bg-slate-900/30 bg-white border dark:border-slate-900 border-slate-200 shadow-sm flex flex-col justify-between space-y-6">
                <h3 className="text-xl font-bold">{d.quickActionsTitle}</h3>
                
                <div className="space-y-3">
                  <button className="w-full flex items-center justify-center gap-2.5 py-3.5 bg-gradient-to-r from-rose-500 to-violet-605 hover:brightness-110 text-white font-bold rounded-2xl shadow-lg transition-all duration-300 cursor-pointer">
                    <Plus className="w-5 h-5 shrink-0" />
                    {d.btnAddDorm}
                  </button>
                  <button className="w-full flex items-center justify-center gap-2.5 py-3.5 dark:bg-slate-950 bg-slate-100 hover:bg-slate-200 dark:hover:bg-slate-900 border dark:border-slate-800 border-slate-250 dark:text-slate-305 text-slate-700 font-semibold rounded-2xl transition-all duration-300 cursor-pointer">
                    <Users className="w-5 h-5 shrink-0" />
                    {d.btnAssignComm}
                  </button>
                  <button className="w-full flex items-center justify-center gap-2.5 py-3.5 dark:bg-slate-950 bg-slate-100 hover:bg-slate-200 dark:hover:bg-slate-900 border dark:border-slate-800 border-slate-250 dark:text-slate-305 text-slate-700 font-semibold rounded-2xl transition-all duration-300 cursor-pointer">
                    <Settings className="w-5 h-5 shrink-0" />
                    {d.btnUnivSettings}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Applications */}
        {activeTab === 'applications' && (
          <div className="space-y-6 animate-fadeIn">
            {/* Filters & Search */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 dark:bg-slate-900/30 bg-white border dark:border-slate-900 border-slate-200 rounded-2xl shadow-sm">
              <div className="relative w-full sm:w-80">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input 
                  type="text" 
                  placeholder={d.applicationsSearchPlaceholder} 
                  className="w-full dark:bg-slate-950 bg-white border dark:border-slate-800 border-slate-200 dark:text-white text-slate-900 rounded-xl py-2 pl-9 pr-4 text-sm focus:outline-none focus:ring-1 focus:ring-rose-500 focus:border-rose-500 transition-all"
                />
              </div>
              
              <button className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 dark:bg-slate-950 bg-slate-100 border dark:border-slate-800 border-slate-200 rounded-xl text-xs font-semibold hover:bg-slate-200 dark:hover:bg-slate-900 cursor-pointer">
                <Filter className="w-3.5 h-3.5 text-rose-500" />
                {d.btnFilter}
              </button>
            </div>

            {/* Applications Table */}
            <div className="dark:bg-slate-900/30 bg-white border dark:border-slate-900 border-slate-200 rounded-3xl overflow-hidden shadow-sm">
              <div className="w-full overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[700px]">
                  <thead>
                    <tr className="dark:bg-slate-950/60 bg-slate-100/60 border-b dark:border-slate-900 border-slate-200 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                      <th className="py-4.5 px-6">{d.tableStudent}</th>
                      <th className="py-4.5 px-6">{d.tableDorm}</th>
                      <th className="py-4.5 px-6">{d.tableDate}</th>
                      <th className="py-4.5 px-6">{d.tableStatus}</th>
                      <th className="py-4.5 px-6 text-right">{d.appDecisionLabel}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y dark:divide-slate-900/80 divide-slate-200 text-sm">
                    {applications.map(app => (
                      <tr key={app.id} className="hover:bg-slate-500/5 transition-colors">
                        <td className="py-4 px-6">
                          <div className="font-bold">{app.studentName}</div>
                          <div className="text-xs text-slate-500">{app.studentEmail}</div>
                        </td>
                        <td className="py-4 px-6 font-semibold dark:text-slate-300 text-slate-700">{app.dormName}</td>
                        <td className="py-4 px-6 text-slate-500">{app.date}</td>
                        <td className="py-4 px-6">
                          {app.status === 'pending' && (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-bold rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-500">
                              {d.appStatusPending}
                            </span>
                          )}
                          {app.status === 'approved' && (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-bold rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-605 dark:text-emerald-450">
                              {d.appStatusApproved}
                            </span>
                          )}
                          {app.status === 'rejected' && (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-bold rounded-full bg-red-500/10 border border-red-500/20 text-red-650 dark:text-red-400">
                              {d.appStatusRejected}
                            </span>
                          )}
                        </td>
                        <td className="py-4 px-6 text-right">
                          {app.status === 'pending' ? (
                            <div className="flex justify-end gap-2">
                              <button 
                                onClick={() => updateAppStatus(app.id, 'approved')}
                                className="p-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20 text-emerald-605 dark:text-emerald-455 transition-colors cursor-pointer"
                              >
                                <CheckCircle className="w-4 h-4" />
                              </button>
                              <button 
                                onClick={() => updateAppStatus(app.id, 'rejected')}
                                className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 text-rose-655 dark:text-rose-455 transition-colors cursor-pointer"
                              >
                                <XCircle className="w-4 h-4" />
                              </button>
                            </div>
                          ) : (
                            <span className="text-xs text-slate-500 font-semibold italic">{d.appDecisionSolved}</span>
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

        {/* Tab 3: Dormitories */}
        {activeTab === 'dormitories' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <h3 className="text-xl font-bold">{d.dormListTitle}</h3>
              <button className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-rose-500 to-violet-605 hover:brightness-110 text-white font-bold rounded-xl shadow-lg transition-all duration-300 cursor-pointer">
                <Plus className="w-4 h-4" />
                {d.btnAddDorm}
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {dormitories.map(dorm => {
                const percentage = Math.round((dorm.occupied / dorm.beds) * 100)
                return (
                  <div key={dorm.id} className="p-6 rounded-3xl dark:bg-slate-900/30 bg-white border dark:border-slate-900 border-slate-200 shadow-sm flex flex-col justify-between space-y-6">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className={`px-2.5 py-1 text-2xs font-extrabold rounded-full ${dorm.status === 'Активдүү' ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-450' : 'bg-rose-500/10 border border-rose-500/20 text-rose-500'}`}>
                          {dorm.status}
                        </span>
                        <span className="text-xs text-slate-500 font-semibold">{dorm.rooms} {language === 'kg' ? 'бөлмө' : 'комнат'}</span>
                      </div>
                      
                      <h4 className="text-lg font-bold">{dorm.name}</h4>
                      <p className="text-xs text-slate-500">{dorm.address}</p>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-xs font-semibold">
                        <span className="text-slate-500">{language === 'kg' ? 'Орундар' : 'Места'}</span>
                        <span>{dorm.occupied}/{dorm.beds} ({percentage}%)</span>
                      </div>
                      <div className="h-2 w-full dark:bg-slate-950 bg-slate-100 rounded-full overflow-hidden border dark:border-slate-900 border-slate-200">
                        <div 
                          className="h-full bg-gradient-to-r from-rose-500 to-violet-605 rounded-full" 
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Tab 4: Users */}
        {activeTab === 'users' && (
          <div className="p-8 md:p-12 rounded-3xl dark:bg-slate-900/20 bg-white border dark:border-slate-900 border-slate-200 text-center space-y-4 shadow-sm animate-fadeIn">
            <Users className="w-12 h-12 text-rose-500 mx-auto opacity-70" />
            <h3 className="text-xl font-bold">{d.usersManagementTitle}</h3>
            <p className="text-sm text-slate-400 max-w-md mx-auto leading-relaxed">
              {d.usersManagementDesc}
            </p>
            <button className="px-5 py-2.5 dark:bg-slate-950 bg-slate-100 hover:bg-slate-200 dark:hover:bg-slate-900 border dark:border-slate-800 border-slate-250 text-xs font-bold rounded-xl transition-all mx-auto cursor-pointer">
              {d.btnStaffList}
            </button>
          </div>
        )}

        {/* Tab 5: Bookings list & Payments Table */}
        {activeTab === 'bookings' && (
          <div className="space-y-6 animate-fadeIn print:hidden">
            {/* Header section with download button */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-xl font-bold">
                  {language === 'kg' ? 'Жатакана орундарын ээлөө жана төлөмдөр журналы' : language === 'ru' ? 'Журнал бронирования мест и платежей' : 'Dormitory Room Bookings & Payments Register'}
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  {language === 'kg' ? 'Студенттердин тастыкталган төлөмдөрүнүн жана жатакана бөлмөлөрүнүн тизмеси' : language === 'ru' ? 'Официальный реестр оплаченных броней и распределения комнат студентов' : 'Official ledger of verified payments and room allocations for students'}
                </p>
              </div>

              <button 
                onClick={() => window.print()}
                className="w-full sm:w-auto flex items-center justify-center gap-2.5 px-5 py-3 bg-gradient-to-r from-rose-500 to-violet-605 hover:brightness-110 text-white font-bold rounded-2xl shadow-lg hover:scale-105 active:scale-95 transition-all cursor-pointer"
              >
                <Printer className="w-5 h-5" />
                {language === 'kg' ? 'Официалдуу отчетту PDF жүктөө' : language === 'ru' ? 'Скачать отчет PDF' : 'Download PDF Report'}
              </button>
            </div>

            {/* Dynamic Bookings Table */}
            <div className="dark:bg-slate-900/30 bg-white border dark:border-slate-900 border-slate-200 rounded-3xl overflow-hidden shadow-sm">
              <div className="w-full overflow-x-auto">
                {bookings.length === 0 ? (
                  <div className="p-12 text-center space-y-4">
                    <CreditCard className="w-12 h-12 text-rose-500 mx-auto opacity-70" />
                    <p className="text-sm text-slate-450">
                      {language === 'kg' ? 'Брондоолор табылган жок' : language === 'ru' ? 'Оплаченные бронирования отсутствуют' : 'No verified room bookings found'}
                    </p>
                  </div>
                ) : (
                  <table className="w-full text-left border-collapse min-w-[900px]">
                    <thead>
                      <tr className="dark:bg-slate-950/60 bg-slate-100/60 border-b dark:border-slate-900 border-slate-200 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                        <th className="py-4.5 px-6 font-bold">{language === 'kg' ? 'Студент' : language === 'ru' ? 'Студент' : 'Student'}</th>
                        <th className="py-4.5 px-6 font-bold">{language === 'kg' ? 'Жатакана' : language === 'ru' ? 'Общежитие' : 'Dormitory'}</th>
                        <th className="py-4.5 px-6 font-bold">{language === 'kg' ? 'Бөлмө / Орун' : language === 'ru' ? 'Комната / Место' : 'Room / Bed'}</th>
                        <th className="py-4.5 px-6 font-bold">{language === 'kg' ? 'Сумма' : language === 'ru' ? 'Сумма' : 'Amount'}</th>
                        <th className="py-4.5 px-6 font-bold">{language === 'kg' ? 'Төлөм ыкмасы' : language === 'ru' ? 'Способ оплаты' : 'Payment Type'}</th>
                        <th className="py-4.5 px-6 font-bold">{language === 'kg' ? 'Транзакция ID' : language === 'ru' ? 'Транзакция ID' : 'Transaction ID'}</th>
                        <th className="py-4.5 px-6 font-bold">{language === 'kg' ? 'Брондолгон күн' : language === 'ru' ? 'Дата брони' : 'Date'}</th>
                        <th className="py-4.5 px-6 text-right font-bold">{language === 'kg' ? 'Абалы' : language === 'ru' ? 'Статус' : 'Status'}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y dark:divide-slate-900/80 divide-slate-200 text-sm">
                      {bookings.map(book => (
                        <tr key={book.id} className="hover:bg-slate-500/5 transition-colors">
                          <td className="py-4 px-6">
                            <div className="font-bold">{book.studentName}</div>
                            <div className="text-xs text-slate-500">{book.studentEmail}</div>
                          </td>
                          <td className="py-4 px-6 font-semibold dark:text-slate-350 text-slate-700">{book.dormName}</td>
                          <td className="py-4 px-6">
                            <div className="font-semibold text-rose-500">{book.roomNumber}-бөлмө</div>
                            <div className="text-xs text-slate-450">{book.bedNumber}</div>
                          </td>
                          <td className="py-4 px-6 font-extrabold text-emerald-600 dark:text-emerald-450">{book.amount}</td>
                          <td className="py-4 px-6 font-semibold">{book.paymentType}</td>
                          <td className="py-4 px-6 font-mono text-xs text-slate-500">{book.referenceId}</td>
                          <td className="py-4 px-6 text-slate-555">{book.date}</td>
                          <td className="py-4 px-6 text-right">
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 text-xs font-bold rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-450">
                              {language === 'kg' ? 'Төлөндү' : language === 'ru' ? 'Оплачено' : 'Paid & Confirmed'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* PRINT-ONLY FORMAL UNIVERSITY BOOKING REPORT DOWLOADABLE VIA media-print */}
      <div className="hidden print:block print-report-section w-full p-10 bg-white text-slate-900 font-serif leading-relaxed">
        <style dangerouslySetInnerHTML={{ __html: `
          @media print {
            body {
              background: white !important;
              color: black !important;
            }
            .print\\:hidden {
              display: none !important;
            }
            header, aside, main, .bg-gradient-to-br, .blur-3xl {
              display: none !important;
            }
            .hidden.print\\:block {
              display: block !important;
            }
          }
        `}} />
        
        {/* University Header */}
        <div className="text-center space-y-2 border-b-2 border-slate-900 pb-6 mb-8">
          <div className="text-2xl font-black uppercase tracking-wider">
            КЫРГЫЗ РЕСПУБЛИКАСЫНЫН БИЛИМ БЕРҮҮ ЖАНА ИЛИМ МИНИСТРЛИГИ
          </div>
          <div className="text-xl font-extrabold uppercase tracking-wide">
            ОШ МАМЛЕКЕТТИК УНИВЕРСИТЕТИ (ОшМУ)
          </div>
          <div className="text-sm font-semibold text-slate-550 tracking-widest">
            Государственный Университет Ош (ОшГУ) | Osh State University (OshSU)
          </div>
          <div className="text-xs text-slate-400 font-medium">
            Ош шаары, Ленин көчөсү, 331 | www.oshsu.kg | info@oshsu.kg
          </div>
        </div>

        {/* Report Meta Info */}
        <div className="flex justify-between items-start mb-8 text-xs font-semibold">
          <div className="space-y-1">
            <div><strong>Документ:</strong> Жатаканаларга орун ээлөө жана төлөмдөр боюнча расмий реестр</div>
            <div><strong>Реестр ID:</strong> REG-{Date.now().toString().slice(-6)}</div>
            <div><strong>Генерация кылган колдонуучу:</strong> {adminName}</div>
          </div>
          <div className="text-right space-y-1">
            <div><strong>Генерацияланган күнү:</strong> {new Date().toLocaleDateString('ru-RU')}</div>
            <div><strong>Убактысы:</strong> {new Date().toLocaleTimeString('ru-RU')}</div>
            <div><strong>Кагаз форматы:</strong> A4 Портрет</div>
          </div>
        </div>

        {/* Title */}
        <div className="text-center mb-8">
          <h2 className="text-lg font-black uppercase tracking-wide underline decoration-double">
            Студенттерди жатаканаларга жайгаштыруу жана төлөмдөрдүн расмий ведомосту
          </h2>
        </div>

        {/* Official Printable Table */}
        <table className="w-full text-left border-collapse border border-slate-800 text-xs mb-10">
          <thead>
            <tr className="bg-slate-100 border-b border-slate-800 text-[10px] font-bold uppercase">
              <th className="border border-slate-800 py-3 px-2 text-center w-8 font-bold">№</th>
              <th className="border border-slate-800 py-3 px-3 font-bold">Студент</th>
              <th className="border border-slate-800 py-3 px-3 font-bold">Жатакана</th>
              <th className="border border-slate-800 py-3 px-2 text-center font-bold">Бөлмө</th>
              <th className="border border-slate-800 py-3 px-2 text-center font-bold">Орун</th>
              <th className="border border-slate-800 py-3 px-3 text-right font-bold">Сумма</th>
              <th className="border border-slate-800 py-3 px-3 text-center font-bold">Ыкма</th>
              <th className="border border-slate-800 py-3 px-3 font-mono text-center font-bold">Транзакция ID</th>
              <th className="border border-slate-800 py-3 px-2 text-center font-bold">Дата</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((book, idx) => (
              <tr key={book.id} className="border-b border-slate-800">
                <td className="border border-slate-800 py-2.5 px-2 text-center font-bold">{idx + 1}</td>
                <td className="border border-slate-800 py-2.5 px-3">
                  <div className="font-bold">{book.studentName}</div>
                  <div className="text-[10px] text-slate-500 font-mono">{book.studentEmail}</div>
                </td>
                <td className="border border-slate-800 py-2.5 px-3 font-semibold">{book.dormName}</td>
                <td className="border border-slate-800 py-2.5 px-2 text-center font-bold">{book.roomNumber}</td>
                <td className="border border-slate-800 py-2.5 px-2 text-center">{book.bedNumber}</td>
                <td className="border border-slate-800 py-2.5 px-3 text-right font-black">{book.amount}</td>
                <td className="border border-slate-800 py-2.5 px-3 text-center font-semibold">{book.paymentType}</td>
                <td className="border border-slate-800 py-2.5 px-3 font-mono text-center text-[10px]">{book.referenceId}</td>
                <td className="border border-slate-800 py-2.5 px-2 text-center">{book.date}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Totals and Signatures */}
        <div className="grid grid-cols-2 gap-8 text-xs pt-6 border-t border-dashed border-slate-400">
          <div className="space-y-2">
            <div><strong>Жалпы брондолгон орундар:</strong> {bookings.length}</div>
            <div><strong>Жалпы кабыл алынган төлөмдөр суммасы:</strong> {bookings.reduce((sum, b) => sum + parseInt(b.amount.replace(/[^0-9]/g, '') || '0'), 0).toLocaleString()} KGS</div>
          </div>
          <div className="text-right space-y-12">
            <div>
              <strong>Башкы бухгалтер / Декандын колу:</strong>
              <div className="mt-8 border-b border-slate-800 w-48 inline-block" />
            </div>
            <div>
              <strong>Жатакана департаментинин башчысы:</strong>
              <div className="mt-8 border-b border-slate-800 w-48 inline-block" />
              <div className="text-[10px] text-slate-400 mt-1">ОшМУ Мөөр орду / Место печати</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
