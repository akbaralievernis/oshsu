'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'
import { useLanguageAndTheme } from '../LanguageAndThemeContext'
import { dictionaries } from '@/utils/dictionaries'
import { 
  Shield, Landmark, Users, ClipboardList, CheckCircle, AlertCircle, Wrench,
  Check, LogOut, ChevronRight, Sparkles, Phone, UserPlus, Menu, X, Sun, Moon, Globe,
  ArrowUpRight, HelpCircle, Activity, ShieldCheck, Bell
} from 'lucide-react'

interface Room {
  id: string
  floor: number
  beds: number
  occupied: number
  status: 'clean' | 'dirty'
  type: string
  residents: string[]
}

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

  // Interactive 2D Schema states
  const [selectedFloor, setSelectedFloor] = useState<number>(1)
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null)
  
  // Assign Student Modal state
  const [assigningBedIndex, setAssigningBedIndex] = useState<number | null>(null)
  const [newStudentName, setNewStudentName] = useState('')

  // Real-time Notifications state
  const [notifications, setNotifications] = useState([
    { id: '1', textKg: 'Алиев Тимур (202-бөлмө) жаңы техникалык мүчүлүштүк каттады: Розетка иштебейт.', textRu: 'Алиев Тимур (комната 202) зарегистрировал новую неполадку: Не работает розетка.', textEn: 'Aliev Timur (room 202) reported a new maintenance issue: Faulty power outlet.', date: '30 мүнөт мурун', read: false },
    { id: '2', textKg: 'Жаңы студент Маматов Бектур №201 бөлмөгө ийгиликтүү жайгаштырылды.', textRu: 'Новый студент Маматов Бектур успешно заселен в комнату №201.', textEn: 'New student Mamatov Bektur successfully assigned to room №201.', date: '2 саат мурун', read: false }
  ])
  const [notifOpen, setNotifOpen] = useState(false)
  const unreadCount = notifications.filter(n => !n.read).length
  
  // Mock data for the specific dormitory
  const [stats, setStats] = useState({
    activeStudents: 412,
    emptyBeds: 38,
    activeTickets: 5,
    cleanRooms: 142
  })

  const [rooms, setRooms] = useState<Room[]>([
    // Floor 1 Rooms
    { id: '101', floor: 1, beds: 3, occupied: 3, status: 'clean', type: 'girls', residents: ['Сыдыкова Жазгүл', 'Токтосунова Алина', 'Абдыкадырова Назгүл'] },
    { id: '102', floor: 1, beds: 3, occupied: 2, status: 'dirty', type: 'girls', residents: ['Маматова Асел', 'Карыбекова Бурул'] },
    { id: '103', floor: 1, beds: 4, occupied: 4, status: 'clean', type: 'girls', residents: ['Арстанбекова Гүлзат', 'Нурматова Жамила', 'Ысакова Каныкей', 'Осмонова Самара'] },
    { id: '104', floor: 1, beds: 3, occupied: 0, status: 'clean', type: 'girls', residents: [] },
    
    // Floor 2 Rooms
    { id: '201', floor: 2, beds: 3, occupied: 1, status: 'clean', type: 'boys', residents: ['Маматов Бектур'] },
    { id: '202', floor: 2, beds: 3, occupied: 3, status: 'clean', type: 'boys', residents: ['Касымов Улукбек', 'Абдуллаев Азамат', 'Алиев Тимур'] },
    { id: '203', floor: 2, beds: 4, occupied: 0, status: 'clean', type: 'empty', residents: [] },
    { id: '204', floor: 2, beds: 3, occupied: 2, status: 'dirty', type: 'boys', residents: ['Садыков Кутман', 'Ибраимов Адилет'] },
  ])

  const [tickets, setTickets] = useState([
    { id: '1', room: '102', student: 'Маматова Асел', title: language === 'kg' ? 'Душ бузулду' : 'Сломался душ', urgency: 'high', status: 'new', date: '19.05.2026' },
    { id: '2', room: '201', student: 'Маматов Бектур', title: language === 'kg' ? 'Розетка иштебейт' : 'Не работает розетка', urgency: 'medium', status: 'new', date: '19.05.2026' },
    { id: '3', room: '103', student: 'Арстанбекова Гүлзат', title: language === 'kg' ? 'Терезе жабылбайт' : 'Окно не закрывается', urgency: 'low', status: 'resolved', date: '18.05.2026' },
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
          const newStatus: 'clean' | 'dirty' = r.status === 'clean' ? 'dirty' : 'clean'
          setStats(s => ({
            ...s,
            cleanRooms: newStatus === 'clean' ? s.cleanRooms + 1 : Math.max(0, s.cleanRooms - 1)
          }))
          const updated: Room = { ...r, status: newStatus }
          if (selectedRoom?.id === id) setSelectedRoom(updated)
          return updated
        }
        return r
      })
    )
  }

  const assignStudentToBed = () => {
    if (!selectedRoom || assigningBedIndex === null || !newStudentName.trim()) return

    setRooms(prev =>
      prev.map(r => {
        if (r.id === selectedRoom.id) {
          const newResidents = [...r.residents]
          newResidents[assigningBedIndex] = newStudentName.trim()
          const newOccupied = newResidents.filter(Boolean).length
          
          setStats(s => ({
            ...s,
            activeStudents: s.activeStudents + 1,
            emptyBeds: Math.max(0, s.emptyBeds - 1)
          }))

          const updated: Room = {
            ...r,
            occupied: newOccupied,
            residents: newResidents,
            type: r.type === 'empty' ? 'girls' : r.type
          }
          setSelectedRoom(updated)
          return updated
        }
        return r
      })
    )

    setNewStudentName('')
    setAssigningBedIndex(null)
  }

  const evictStudentFromBed = (index: number) => {
    if (!selectedRoom) return

    setRooms(prev =>
      prev.map(r => {
        if (r.id === selectedRoom.id) {
          const newResidents = [...r.residents]
          newResidents.splice(index, 1)
          const newOccupied = newResidents.length

          setStats(s => ({
            ...s,
            activeStudents: Math.max(0, s.activeStudents - 1),
            emptyBeds: s.emptyBeds + 1
          }))

          const updated: Room = {
            ...r,
            occupied: newOccupied,
            residents: newResidents,
            type: newOccupied === 0 ? 'empty' : r.type
          }
          setSelectedRoom(updated)
          return updated
        }
        return r
      })
    )
  }

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })))
  }

  // Filtered rooms based on floor plan
  const filteredRooms = rooms.filter(r => r.floor === selectedFloor)

  return (
    <div className="min-h-screen transition-colors duration-300 dark:bg-slate-955 bg-slate-50 dark:text-white text-slate-900 font-sans flex flex-col lg:flex-row overflow-x-hidden">
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
          {/* Mobile Notifications Bell */}
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
                  <span>Маалыматтар (Alerts)</span>
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
          <button onClick={toggleTheme} className="p-2 rounded-lg dark:bg-slate-955 bg-slate-100 border dark:border-slate-850 border-slate-200 text-xs cursor-pointer animate-pulse">
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
            className="p-2.5 rounded-xl dark:bg-slate-955 bg-slate-100 border dark:border-slate-855 border-slate-200 text-rose-500 cursor-pointer"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </header>

      {/* MOBILE SLIDE-IN MENU */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 bg-slate-955/60 backdrop-blur-md z-40 animate-fadeIn" onClick={() => setMobileMenuOpen(false)}>
          <aside className="w-72 max-w-[80vw] h-full dark:bg-slate-900 bg-white p-6 border-r dark:border-slate-850 border-slate-200 flex flex-col justify-between" onClick={(e) => e.stopPropagation()}>
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-slate-855 dark:bg-slate-800 flex items-center justify-center border border-slate-255 dark:border-slate-700 font-bold text-rose-500 shadow-md">
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
                  className={`w-full flex items-center gap-3 px-4 py-3 text-xs font-bold rounded-xl transition-all cursor-pointer ${activeTab === 'rooms' ? 'bg-gradient-to-r from-rose-500 to-violet-600 text-white shadow-lg' : 'text-slate-555 hover:bg-slate-100 dark:hover:bg-slate-850'}`}
                >
                  <Landmark className="w-4 h-4" />
                  {d.roomsMapTitle}
                </button>
                <button
                  onClick={() => { setActiveTab('tickets'); setMobileMenuOpen(false); }}
                  className={`w-full flex items-center gap-3 px-4 py-3 text-xs font-bold rounded-xl transition-all cursor-pointer ${activeTab === 'tickets' ? 'bg-gradient-to-r from-rose-500 to-violet-600 text-white shadow-lg' : 'text-slate-555 hover:bg-slate-100 dark:hover:bg-slate-850'}`}
                >
                  <Wrench className="w-4 h-4" />
                  {d.studentTicketsTitle}
                </button>
                <button
                  onClick={() => { setActiveTab('students'); setMobileMenuOpen(false); }}
                  className={`w-full flex items-center gap-3 px-4 py-3 text-xs font-bold rounded-xl transition-all cursor-pointer ${activeTab === 'students' ? 'bg-gradient-to-r from-rose-500 to-violet-600 text-white shadow-lg' : 'text-slate-555 hover:bg-slate-100 dark:hover:bg-slate-850'}`}
                >
                  <Users className="w-4 h-4" />
                  {d.studentsCardtitle}
                </button>
              </nav>
            </div>

            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 py-3 bg-rose-500/10 hover:bg-rose-500/20 text-rose-650 dark:text-rose-400 text-xs font-bold rounded-xl border border-rose-500/10 transition-all cursor-pointer"
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
              <Landmark className="w-6 h-6 text-rose-500" />
            </div>
            <div>
              <h1 className="text-lg font-black tracking-tight leading-none">{d.oshsu}</h1>
              <span className="text-xs bg-gradient-to-r from-rose-500 to-violet-600 bg-clip-text text-transparent font-bold tracking-widest uppercase">{d.commandant}</span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-2">
            <button
              onClick={() => setActiveTab('rooms')}
              className={`w-full flex items-center justify-between px-4 py-3.5 text-sm font-semibold rounded-2xl transition-all duration-300 cursor-pointer ${
                activeTab === 'rooms'
                  ? 'bg-gradient-to-r from-rose-500 to-violet-600 text-white font-bold shadow-lg shadow-rose-550/10'
                  : 'dark:text-slate-400 text-slate-555 hover:text-rose-500 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-900/50'
              }`}
            >
              <div className="flex items-center gap-3">
                <Landmark className="w-5 h-5" />
                {language === 'kg' ? 'Бөлмөлөрдүн схемасы' : language === 'ru' ? 'Схема комнат (2D)' : 'Rooms Schema (2D)'}
              </div>
              <ChevronRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => setActiveTab('tickets')}
              className={`w-full flex items-center justify-between px-4 py-3.5 text-sm font-semibold rounded-2xl transition-all duration-300 cursor-pointer ${
                activeTab === 'tickets'
                  ? 'bg-gradient-to-r from-rose-500 to-violet-600 text-white font-bold shadow-lg shadow-rose-550/10'
                  : 'dark:text-slate-400 text-slate-555 hover:text-rose-500 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-900/50'
              }`}
            >
              <div className="flex items-center gap-3">
                <Wrench className="w-5 h-5" />
                {language === 'kg' ? 'Мүчүлүштүктөр' : language === 'ru' ? 'Неполадки' : 'Maintenance'}
              </div>
              {stats.activeTickets > 0 && (
                <span className={`px-2 py-0.5 text-xs font-black rounded-full ${activeTab === 'tickets' ? 'bg-slate-950 text-white' : 'bg-rose-500 text-white'}`}>
                  {stats.activeTickets}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('students')}
              className={`w-full flex items-center justify-between px-4 py-3.5 text-sm font-semibold rounded-2xl transition-all duration-300 cursor-pointer ${
                activeTab === 'students'
                  ? 'bg-gradient-to-r from-rose-500 to-violet-600 text-white font-bold shadow-lg shadow-rose-550/10'
                  : 'dark:text-slate-400 text-slate-555 hover:text-rose-500 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-900/50'
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

        {/* Action controls & User info */}
        <div className="space-y-3">
          {/* Controllers */}
          <div className="flex items-center justify-between gap-2 p-2 dark:bg-slate-955 bg-slate-100 rounded-xl border dark:border-slate-900 border-slate-200">
            <button 
              onClick={toggleTheme} 
              className="flex-1 p-2 rounded-lg hover:bg-rose-500/10 text-slate-500 hover:text-rose-555 transition-colors flex justify-center cursor-pointer"
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
                {commandantName[0].toUpperCase()}
              </div>
              <div className="truncate">
                <div className="text-sm font-bold truncate">{commandantName}</div>
                <div className="text-xs text-slate-500">Башкы комендант</div>
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
        <header className="mb-10 flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-extrabold tracking-tight">{d.commCabinet}</h2>
            <p className="text-sm text-slate-400 mt-1">{d.commCabinetDesc}</p>
          </div>

          {/* Desktop Notifications Bell */}
          <div className="relative hidden lg:block">
            <button
              onClick={() => setNotifOpen(!notifOpen)}
              className="p-3 rounded-2xl dark:bg-slate-900 bg-white border dark:border-slate-800 border-slate-200 hover:border-rose-550/30 transition-all shadow-sm relative cursor-pointer"
            >
              <Bell className="w-5 h-5 text-rose-500" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-2.5 h-2.5 rounded-full bg-rose-500 border-2 dark:border-slate-900 border-white" />
              )}
            </button>

            {notifOpen && (
              <div className="absolute right-0 mt-3 w-80 rounded-2xl dark:bg-slate-900 bg-white border dark:border-slate-800 border-slate-200 shadow-2xl overflow-hidden z-50 p-5 space-y-3.5 text-xs animate-fadeIn text-slate-800 dark:text-slate-100">
                <div className="flex items-center justify-between font-bold border-b dark:border-slate-850 border-slate-200 pb-2">
                  <span>Эскертүүлөр (Alerts)</span>
                  <button onClick={markAllRead} className="text-rose-500 hover:underline text-2xs cursor-pointer">Баарын өчүрүү</button>
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
        </header>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <div className="p-6 rounded-3xl dark:bg-slate-900/40 bg-white border dark:border-slate-900 border-slate-200 flex items-center gap-5 shadow-sm">
            <div className="p-4 rounded-2xl bg-rose-500/10 text-rose-500 border border-rose-500/10">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <div className="text-2xl font-black">{stats.activeStudents}</div>
              <div className="text-xs text-slate-500 font-semibold uppercase tracking-wider">{d.metricActiveStudents}</div>
            </div>
          </div>

          <div className="p-6 rounded-3xl dark:bg-slate-900/40 bg-white border dark:border-slate-900 border-slate-200 flex items-center gap-5 shadow-sm">
            <div className="p-4 rounded-2xl bg-rose-500/10 text-rose-500 border border-rose-500/10">
              <Landmark className="w-6 h-6" />
            </div>
            <div>
              <div className="text-2xl font-black">{stats.emptyBeds}</div>
              <div className="text-xs text-slate-500 font-semibold uppercase tracking-wider">{d.metricEmptyBeds}</div>
            </div>
          </div>

          <div className="p-6 rounded-3xl dark:bg-slate-900/40 bg-white border dark:border-slate-900 border-slate-200 flex items-center gap-5 shadow-sm">
            <div className="p-4 rounded-2xl bg-rose-500/10 text-rose-500 border border-rose-500/10">
              <Wrench className="w-6 h-6" />
            </div>
            <div>
              <div className="text-2xl font-black">{stats.activeTickets}</div>
              <div className="text-xs text-slate-500 font-semibold uppercase tracking-wider">{d.metricActiveTickets}</div>
            </div>
          </div>

          <div className="p-6 rounded-3xl dark:bg-slate-900/40 bg-white border dark:border-slate-900 border-slate-200 flex items-center gap-5 shadow-sm">
            <div className="p-4 rounded-2xl bg-rose-500/10 text-rose-500 border border-rose-500/10">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <div className="text-2xl font-black">{stats.cleanRooms}</div>
              <div className="text-xs text-slate-500 font-semibold uppercase tracking-wider">{d.metricCleanRooms}</div>
            </div>
          </div>
        </div>

        {/* Tab 1: Rooms Interactive 2D Layout Map */}
        {activeTab === 'rooms' && (
          <div className="space-y-8 animate-fadeIn">
            {/* Interactive Title & Floor plan controller */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-xl font-bold">{language === 'kg' ? 'Интерактивдүү Карта (2D)' : 'Интерактивная Карта (2D)'}</h3>
                <p className="text-xs text-slate-555 mt-1">{language === 'kg' ? 'Корпустун коридору жана бөлмөлөрдүн жайгашуу схемасы' : 'Интерактивная планировка коридоров и комнат общежития'}</p>
              </div>

              {/* Floor Switcher */}
              <div className="flex p-1 dark:bg-slate-955 bg-slate-200/80 rounded-xl border dark:border-slate-900 border-slate-300">
                <button
                  onClick={() => { setSelectedFloor(1); setSelectedRoom(null); }}
                  className={`px-4 py-2 text-xs font-black rounded-lg transition-all cursor-pointer ${selectedFloor === 1 ? 'bg-gradient-to-r from-rose-500 to-violet-605 text-white shadow-md' : 'text-slate-555 hover:text-rose-505'}`}
                >
                  1-кабат (1st Floor)
                </button>
                <button
                  onClick={() => { setSelectedFloor(2); setSelectedRoom(null); }}
                  className={`px-4 py-2 text-xs font-black rounded-lg transition-all cursor-pointer ${selectedFloor === 2 ? 'bg-gradient-to-r from-rose-500 to-violet-605 text-white shadow-md' : 'text-slate-555 hover:text-rose-505'}`}
                >
                  2-кабат (2nd Floor)
                </button>
              </div>
            </div>

            {/* 2D ARCHITECTURAL LAYOUT PLAN */}
            <div className="p-8 rounded-3xl dark:bg-slate-900/20 bg-white border dark:border-slate-900 border-slate-200 shadow-md space-y-6 overflow-x-auto min-w-[750px]">
              {/* TOP ROW ROOMS (EVEN NUMBERS) */}
              <div className="grid grid-cols-4 gap-6">
                {filteredRooms.slice(0, 2).map((room) => {
                  const isFull = room.occupied === room.beds
                  const isEmpty = room.occupied === 0
                  return (
                    <div
                      key={room.id}
                      onClick={() => setSelectedRoom(room)}
                      className={`relative p-5 rounded-2xl border text-center transition-all duration-300 cursor-pointer hover:-translate-y-1 ${
                        room.status === 'dirty'
                          ? 'border-rose-550/40 bg-rose-500/5 animate-pulse'
                          : isFull
                          ? 'border-violet-600 bg-gradient-to-br from-violet-955/20 to-slate-955/20'
                          : isEmpty
                          ? 'border-dashed border-emerald-500/40 bg-emerald-500/5'
                          : 'border-slate-350 dark:border-slate-800 dark:bg-slate-955 bg-slate-50'
                      }`}
                    >
                      <span className="absolute top-3 right-3 flex h-2 w-2">
                        <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${room.status === 'dirty' ? 'bg-rose-500' : isFull ? 'bg-violet-500' : 'bg-emerald-500'}`} />
                        <span className={`relative inline-flex rounded-full h-2 w-2 ${room.status === 'dirty' ? 'bg-rose-500' : isFull ? 'bg-violet-500' : 'bg-emerald-500'}`} />
                      </span>

                      <div className="text-sm font-extrabold">{room.id}-Бөлмө</div>
                      <div className="text-2xs text-slate-500 uppercase tracking-widest mt-1 font-semibold">{room.type}</div>
                      
                      <div className="mt-4 flex items-center justify-center gap-1 text-xs">
                        <Users className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                        <span className="font-extrabold">{room.occupied} / {room.beds}</span>
                      </div>
                    </div>
                  )
                })}
                {/* Empty spacer block to mimic floor plan */}
                <div className="col-span-2 border dark:border-slate-900 border-slate-200 border-dashed rounded-2xl flex items-center justify-center text-[10px] text-slate-555 font-bold uppercase tracking-wider bg-slate-500/5">
                  <ShieldCheck className="w-4 h-4 text-rose-500 mr-2" />
                  {language === 'kg' ? 'Окуу жана эс алуу залы' : 'Комната отдыха / Коворкинг'}
                </div>
              </div>

              {/* CENTRAL HALLWAY (КОРИДОР) */}
              <div className="w-full h-14 bg-gradient-to-r dark:from-slate-950 dark:via-slate-900 dark:to-slate-955 from-slate-200 via-slate-100 to-slate-200 rounded-xl flex items-center justify-between px-8 border dark:border-slate-850 border-slate-300">
                <span className="text-[10px] font-black text-slate-555 uppercase tracking-widest">{language === 'kg' ? '◀ БАШКЫ ЧЫГУУ / ВЫХОД' : '◀ ГЛАВНЫЙ ВЫХОД / EXIT'}</span>
                <span className="text-xs font-black bg-gradient-to-r from-rose-500 to-violet-605 bg-clip-text text-transparent uppercase tracking-widest">{language === 'kg' ? 'КОРИДОР / ХОЛЛ' : 'ЦЕНТРАЛЬНЫЙ КОРИДОР'}</span>
                <span className="text-[10px] font-black text-slate-555 uppercase tracking-widest">{language === 'kg' ? 'КҮЗӨТ / ОХРАНА ▶' : 'ПОСТ ДЕЖУРНОГО ▶'}</span>
              </div>

              {/* BOTTOM ROW ROOMS (ODD NUMBERS) */}
              <div className="grid grid-cols-4 gap-6">
                {filteredRooms.slice(2).map((room) => {
                  const isFull = room.occupied === room.beds
                  const isEmpty = room.occupied === 0
                  return (
                    <div
                      key={room.id}
                      onClick={() => setSelectedRoom(room)}
                      className={`relative p-5 rounded-2xl border text-center transition-all duration-300 cursor-pointer hover:-translate-y-1 ${
                        room.status === 'dirty'
                          ? 'border-rose-550/40 bg-rose-500/5 animate-pulse'
                          : isFull
                          ? 'border-violet-605 bg-gradient-to-br from-violet-955/20 to-slate-955/20'
                          : isEmpty
                          ? 'border-dashed border-emerald-500/40 bg-emerald-500/5'
                          : 'border-slate-350 dark:border-slate-800 dark:bg-slate-955 bg-slate-50'
                      }`}
                    >
                      <span className="absolute top-3 right-3 flex h-2 w-2">
                        <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${room.status === 'dirty' ? 'bg-rose-500' : isFull ? 'bg-violet-500' : 'bg-emerald-500'}`} />
                        <span className={`relative inline-flex rounded-full h-2 w-2 ${room.status === 'dirty' ? 'bg-rose-500' : isFull ? 'bg-violet-500' : 'bg-emerald-500'}`} />
                      </span>

                      <div className="text-sm font-extrabold">{room.id}-Бөлмө</div>
                      <div className="text-2xs text-slate-500 uppercase tracking-widest mt-1 font-semibold">{room.type}</div>
                      
                      <div className="mt-4 flex items-center justify-center gap-1 text-xs">
                        <Users className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                        <span className="font-extrabold">{room.occupied} / {room.beds}</span>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* SELECTED ROOM INTERACTIVE MODAL OVERLAY */}
            {selectedRoom && (
              <div className="fixed inset-0 bg-slate-955/70 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-fadeIn" onClick={() => setSelectedRoom(null)}>
                <div 
                  className="w-full max-w-lg dark:bg-slate-900 bg-white border dark:border-slate-800 border-slate-200 rounded-3xl p-8 shadow-2xl space-y-6"
                  onClick={(e) => e.stopPropagation()}
                >
                  {/* Modal Header */}
                  <div className="flex items-center justify-between border-b dark:border-slate-850 border-slate-200 pb-4">
                    <div>
                      <h4 className="text-2xl font-black">{selectedRoom.id}-Бөлмө маалыматы</h4>
                      <p className="text-xs text-slate-500 mt-0.5">{selectedRoom.floor}-кабат, Башкы корпус</p>
                    </div>
                    <button 
                      onClick={() => setSelectedRoom(null)}
                      className="p-1.5 rounded-xl hover:bg-slate-500/10 transition-all cursor-pointer"
                    >
                      <X className="w-6 h-6 text-slate-400" />
                    </button>
                  </div>

                  {/* Room Config Status */}
                  <div className="flex items-center justify-between p-4 rounded-2xl dark:bg-slate-955 bg-slate-100 border dark:border-slate-850 border-slate-200 text-xs">
                    <div className="flex items-center gap-2">
                      <span className={`px-2.5 py-1 font-extrabold rounded-full ${selectedRoom.status === 'clean' ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-450' : 'bg-rose-500/10 border border-rose-500/20 text-rose-500'}`}>
                        {selectedRoom.status === 'clean' ? d.roomClean : d.roomDirty}
                      </span>
                      <button 
                        onClick={() => toggleRoomCleanliness(selectedRoom.id)}
                        className="text-[10px] font-bold text-rose-500 hover:underline cursor-pointer"
                      >
                        {selectedRoom.status === 'clean' ? 'Кир деп белгилөө' : 'Тазаланды деп белгилөө'}
                      </button>
                    </div>
                    <div className="font-bold text-slate-500 uppercase tracking-widest">{selectedRoom.type}</div>
                  </div>

                  {/* Bed Allocation Slots */}
                  <div className="space-y-4">
                    <h5 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Койко-орундардын тизмеси:</h5>
                    <div className="space-y-3">
                      {Array.from({ length: selectedRoom.beds }).map((_, idx) => {
                        const occupant = selectedRoom.residents[idx]
                        return (
                          <div 
                            key={idx} 
                            className="flex items-center justify-between p-4 rounded-xl dark:bg-slate-955 bg-slate-50 border dark:border-slate-855 border-slate-200"
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-lg dark:bg-slate-800 bg-slate-200 flex items-center justify-center font-bold text-xs text-rose-500 shrink-0">
                                {idx + 1}
                              </div>
                              {occupant ? (
                                <div>
                                  <div className="text-sm font-bold">{occupant}</div>
                                  <div className="text-[10px] text-slate-500 font-medium">Студент</div>
                                </div>
                              ) : (
                                <span className="text-xs text-slate-400 italic">Орун бош / Свободное место</span>
                              )}
                            </div>

                            {/* Evict / Assign Action buttons */}
                            {occupant ? (
                              <button 
                                onClick={() => evictStudentFromBed(idx)}
                                className="px-2.5 py-1 border border-rose-500/20 hover:bg-rose-500/10 text-rose-500 text-2xs font-extrabold rounded-lg transition-colors cursor-pointer"
                              >
                                Чыгаруу
                              </button>
                            ) : (
                              assigningBedIndex === idx ? (
                                <div className="flex gap-1.5 items-center">
                                  <input 
                                    type="text" 
                                    placeholder="Студент аты..." 
                                    value={newStudentName}
                                    onChange={(e) => setNewStudentName(e.target.value)}
                                    className="bg-slate-100 dark:bg-slate-900 border dark:border-slate-800 border-slate-300 rounded-lg text-2xs px-2 py-1 w-28 focus:outline-none dark:text-white"
                                  />
                                  <button 
                                    onClick={assignStudentToBed}
                                    className="p-1 bg-emerald-500 text-white rounded-lg cursor-pointer"
                                  >
                                    <Check className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              ) : (
                                <button 
                                  onClick={() => setAssigningBedIndex(idx)}
                                  className="px-2.5 py-1 bg-gradient-to-r from-rose-500 to-violet-605 text-white text-2xs font-extrabold rounded-lg shadow-sm transition-transform cursor-pointer"
                                >
                                  + Заселить
                                </button>
                              )
                            )}
                          </div>
                        )
                      })}
                    </div>
                  </div>
                </div>
              </div>
            )}
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
                              ? 'bg-rose-500/10 border border-rose-500/20 text-rose-500 dark:text-rose-455' 
                              : ticket.urgency === 'medium'
                              ? 'bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-500'
                              : 'dark:bg-slate-800 bg-slate-200 border dark:border-slate-700 border-slate-350 text-slate-505'
                          }`}>
                            {ticket.urgency === 'high' ? d.urgencyHigh : ticket.urgency === 'medium' ? d.urgencyMedium : d.urgencyLow}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-slate-555">{ticket.date}</td>
                        <td className="py-4 px-6">
                          {ticket.status === 'new' ? (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 text-xs font-bold rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-655 dark:text-amber-500">
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
                              className="px-3.5 py-1.5 bg-gradient-to-r from-rose-500 to-violet-605 hover:brightness-110 text-white text-xs font-extrabold rounded-xl shadow-lg transition-all flex items-center gap-1.5 ml-auto cursor-pointer"
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
            <Users className="w-12 h-12 text-rose-500 mx-auto opacity-70" />
            <h3 className="text-xl font-bold">{d.studentsCardtitle}</h3>
            <p className="text-sm text-slate-450 max-w-md mx-auto leading-relaxed">
              {d.studentsCardDesc}
            </p>
            <button className="px-5 py-2.5 dark:bg-slate-955 bg-slate-100 hover:bg-slate-200 dark:hover:bg-slate-900 border dark:border-slate-800 border-slate-250 text-xs font-bold rounded-xl transition-all flex items-center gap-2 mx-auto cursor-pointer">
              <Phone className="w-4 h-4 text-rose-500" />
              {d.btnDownloadContacts}
            </button>
          </div>
        )}
      </main>
    </div>
  )
}
