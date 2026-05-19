'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'
import { useLanguageAndTheme } from '../LanguageAndThemeContext'
import { dictionaries } from '@/utils/dictionaries'
import { 
  Shield, Landmark, Users, ClipboardList, CheckCircle, AlertCircle, Wrench,
  Check, LogOut, ChevronRight, Sparkles, MapPin, User, FileText, Send,
  Menu, X, Sun, Moon, Globe, Printer, Bell, CreditCard, QrCode, UploadCloud,
  FileCheck2, Eye, Receipt
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

  // Notifications State
  const [notifications, setNotifications] = useState([
    { id: '1', textKg: 'Сиздин №102 бөлмөгө жайгашуу боюнча арызыңыз комендант тарабынан жактырылды!', textRu: 'Ваша заявка на заселение в комнату №102 одобрена комендантом!', textEn: 'Your room assignment application for room №102 has been approved!', date: '1 саат мурун', read: false },
    { id: '2', textKg: 'Ижара акысы боюнча жаңы эсеп катталды. Төлөм жүргүзүңүз.', textRu: 'Выставлен новый счет за проживание. Пожалуйста, оплатите.', textEn: 'A new rental invoice has been generated. Please proceed to payment.', date: '3 саат мурун', read: false }
  ])
  const [notifOpen, setNotifOpen] = useState(false)
  const unreadCount = notifications.filter(n => !n.read).length

  // Payments & OCR Scanner States
  const [paymentStatus, setPaymentStatus] = useState<'paid' | 'unpaid'>('unpaid')
  const [paymentHistory, setPaymentHistory] = useState([
    { id: '1', amount: '12,000 сом', type: 'MBank', date: '01.09.2025', status: 'approved', ref: 'TXN-9821-OshSU' },
    { id: '2', amount: '12,000 сом', type: 'Elcart', date: '01.02.2026', status: 'approved', ref: 'TXN-3011-OshSU' }
  ])
  const [payModalOpen, setPayModalOpen] = useState(false)
  const [receiptFileName, setReceiptFileName] = useState('')
  const [ocrScanning, setOcrScanning] = useState(false)
  const [ocrStatus, setOcrStatus] = useState('')
  const [ocrSuccess, setOcrSuccess] = useState(false)

  // Mock data for student housing details
  const [hasRoom, setHasRoom] = useState(true)
  const [applicationStatus, setApplicationStatus] = useState<'pending' | 'approved' | 'rejected'>('approved')
  
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

  // Trigger print-to-PDF
  const handlePrintContract = () => {
    if (typeof window !== 'undefined') {
      window.print()
    }
  }

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })))
  }

  // Simulated AI receipt scanner handler
  const handleReceiptUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    
    setReceiptFileName(file.name)
    setOcrScanning(true)
    setOcrSuccess(false)
    
    // Step-by-step scanner simulator log
    setOcrStatus(language === 'kg' ? 'Сүрөт файлы окулуудо...' : language === 'ru' ? 'Чтение графического файла...' : 'Reading graphic file...')
    
    setTimeout(() => {
      setOcrStatus(language === 'kg' ? 'ОшМУ реквизиттери текшерилүүдө...' : language === 'ru' ? 'Проверка реквизитов ОшГУ...' : 'Checking OshSU bank credentials...')
      
      setTimeout(() => {
        setOcrStatus(language === 'kg' ? 'Төлөм суммасы эсептелүүдө (12,000 сом)...' : language === 'ru' ? 'Распознавание суммы платежа (12,000 сом)...' : 'Extracting payment total (12,000 KGS)...')
        
        setTimeout(() => {
          setOcrScanning(false)
          setOcrSuccess(true)
          setPaymentStatus('paid')
          
          // Append new payment to logs archive!
          const newTx = {
            id: Math.random().toString(),
            amount: '12,000 сом',
            type: 'MBank (ИИ Сканер)',
            date: new Date().toLocaleDateString('ru-RU'),
            status: 'pending',
            ref: `TXN-${Math.floor(1000 + Math.random() * 9000)}-OshSU`
          }
          setPaymentHistory(prev => [newTx, ...prev])
          
          // Push notification alert
          setNotifications(prev => [
            {
              id: Math.random().toString(),
              textKg: 'Сиздин жаңы МБанк чегиңиз ИИ тарабынан ийгиликтүү текшерилди жана комендантка жөнөтүлдү!',
              textRu: 'Ваш новый чек МБанк успешно верифицирован ИИ и направлен коменданту!',
              textEn: 'Your new MBank receipt has been successfully scanned by AI and sent to the commandant!',
              date: 'Азыр эле',
              read: false
            },
            ...prev
          ])
        }, 1200)
      }, 1200)
    }, 1200)
  }

  return (
    <div className="min-h-screen transition-colors duration-300 dark:bg-slate-955 bg-slate-50 dark:text-white text-slate-900 font-sans flex flex-col lg:flex-row overflow-x-hidden">
      {/* Background Glows */}
      <div className="absolute top-0 left-0 w-[300px] h-[300px] rounded-full dark:bg-slate-900 bg-rose-100/30 blur-[150px] opacity-60 pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] rounded-full dark:bg-violet-955/10 bg-violet-100/30 blur-[150px] opacity-40 pointer-events-none" />

      {/* MOBILE HEADER */}
      <header className="lg:hidden w-full flex items-center justify-between px-6 py-4 dark:bg-slate-900/80 bg-white border-b dark:border-slate-900 border-slate-200 backdrop-blur-lg sticky top-0 z-35 shadow-sm transition-colors">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-gradient-to-br dark:from-slate-900 dark:to-slate-800 from-slate-100 to-slate-50 border dark:border-slate-800 border-slate-200">
            <Shield className="w-5 h-5 text-rose-500" />
          </div>
          <span className="text-sm font-extrabold tracking-tight">
            {d.oshsu} <span className="bg-gradient-to-r from-rose-500 to-violet-605 bg-clip-text text-transparent">{d.dormitorySystem}</span>
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Notifications Trigger Mobile */}
          <div className="relative">
            <button
              onClick={() => setNotifOpen(!notifOpen)}
              className="p-2 rounded-lg dark:bg-slate-955 bg-slate-100 border dark:border-slate-850 border-slate-200 text-xs cursor-pointer relative"
            >
              <Bell className="w-4 h-4 text-rose-500" />
              {unreadCount > 0 && (
                <span className="absolute top-0.5 right-0.5 w-2 h-2 rounded-full bg-rose-500 animate-ping" />
              )}
            </button>

            {notifOpen && (
              <div className="absolute right-0 mt-3 w-72 rounded-2xl dark:bg-slate-900 bg-white border dark:border-slate-800 border-slate-200 shadow-xl overflow-hidden z-50 p-4 space-y-3 text-xs animate-fadeIn text-slate-850 dark:text-slate-100">
                <div className="flex items-center justify-between font-bold border-b dark:border-slate-850 border-slate-200 pb-2">
                  <span>Жаңылыктар (Notifications)</span>
                  <button onClick={markAllRead} className="text-rose-500 hover:underline text-2xs cursor-pointer">Баарын окудум</button>
                </div>
                <div className="space-y-3.5 max-h-48 overflow-y-auto">
                  {notifications.map(n => (
                    <div key={n.id} className={`p-2.5 rounded-xl border ${n.read ? 'dark:bg-slate-900/50 bg-slate-50 border-slate-200 dark:border-slate-800' : 'bg-rose-500/5 border-rose-500/10'}`}>
                      <p className="leading-relaxed text-2xs font-semibold">{language === 'kg' ? n.textKg : language === 'ru' ? n.textRu : n.textEn}</p>
                      <span className="text-[10px] text-slate-400 mt-1 block font-medium">{n.date}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Theme Switcher */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg dark:bg-slate-955 bg-slate-100 border dark:border-slate-850 border-slate-200 text-xs cursor-pointer animate-pulse"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-500" /> : <Moon className="w-4 h-4 text-slate-700" />}
          </button>

          {/* Language menu */}
          <button
            onClick={() => setLangMenuOpen(!langMenuOpen)}
            className="flex items-center gap-1 px-2.5 py-2 rounded-lg dark:bg-slate-955 bg-slate-100 border dark:border-slate-855 border-slate-200 text-xs font-bold cursor-pointer"
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
              <div className="p-4 rounded-2xl dark:bg-slate-955 bg-slate-100 border dark:border-slate-855 border-slate-200 space-y-4">
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
                className="w-full flex items-center justify-center gap-2 py-3 bg-rose-500/10 hover:bg-rose-500/20 text-rose-655 dark:text-rose-400 text-sm font-bold rounded-2xl border border-rose-500/10 transition-all cursor-pointer"
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
          <div className="p-5 rounded-2xl dark:bg-slate-955 bg-slate-105 border dark:border-slate-900 border-slate-200 space-y-4 shadow-sm">
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
                  <span className="text-slate-500 font-semibold">{d.dormNameLabel}:</span>
                  <span className="dark:text-slate-300 text-slate-700 font-bold text-right truncate max-w-[130px]">№1 Жатакана</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 font-semibold">Бөлмө:</span>
                  <span className="text-rose-500 font-extrabold">{assignedRoom.roomNumber} ({assignedRoom.floor}-кабат)</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Action controls / Logout */}
        <div className="space-y-3">
          {/* Controllers */}
          <div className="flex items-center justify-between gap-2 p-2 dark:bg-slate-955 bg-slate-100 rounded-xl border dark:border-slate-900 border-slate-200">
            <button 
              onClick={toggleTheme} 
              className="flex-1 p-2 rounded-lg hover:bg-rose-500/10 text-slate-500 hover:text-rose-655 transition-colors flex justify-center cursor-pointer"
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
            className="w-full flex items-center justify-center gap-2 py-3.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-655 dark:text-rose-455 text-sm font-bold rounded-2xl border border-rose-500/10 transition-all duration-300 cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            {d.logout}
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT CONTAINER */}
      <main className="flex-1 flex flex-col min-h-screen overflow-y-auto p-6 md:p-8 lg:p-12 z-10 animate-fadeIn">
        {/* Desktop Header */}
        <header className="mb-8 flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-extrabold tracking-tight">{d.studentCabinet}</h2>
            <p className="text-sm text-slate-400 mt-1">{d.studentCabinetDesc}</p>
          </div>

          {/* Desktop Notifications Trigger */}
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
                  <span>Кабарлар (Notifications)</span>
                  <button onClick={markAllRead} className="text-rose-500 hover:underline text-2xs cursor-pointer">Баарын окудум</button>
                </div>
                <div className="space-y-3 max-h-52 overflow-y-auto">
                  {notifications.map(n => (
                    <div key={n.id} className={`p-3 rounded-xl border ${n.read ? 'dark:bg-slate-900/50 bg-slate-50 border-slate-150 dark:border-slate-800' : 'bg-rose-500/5 border-rose-500/10'}`}>
                      <p className="leading-relaxed text-2xs font-semibold">{language === 'kg' ? n.textKg : language === 'ru' ? n.textRu : n.textEn}</p>
                      <span className="text-[10px] text-slate-400 mt-1 block font-medium">{n.date}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </header>

        {/* Main Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Room Details & Roommates (Left Column) */}
          <div className="lg:col-span-2 space-y-8">
            {hasRoom ? (
              <div className="p-6 md:p-8 rounded-3xl dark:bg-slate-900/30 bg-white border dark:border-slate-900 border-slate-200 shadow-md space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <h3 className="text-xl font-bold flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-rose-500" />
                    {d.roomInfo}
                  </h3>
                  
                  <div className="flex items-center gap-2">
                    {/* DOWNLOAD AGREEMENT PDF TRIGGER BUTTON */}
                    <button
                      onClick={handlePrintContract}
                      className="flex items-center gap-1.5 px-4.5 py-2.5 bg-gradient-to-r from-rose-500 to-violet-605 hover:brightness-110 text-white text-xs font-black rounded-xl transition-all cursor-pointer shadow-md shadow-rose-500/10"
                    >
                      <Printer className="w-4 h-4 shrink-0 animate-pulse" />
                      {language === 'kg' ? 'Келишимди жүктөө (PDF)' : language === 'ru' ? 'Скачать Договор (PDF)' : 'Download Contract (PDF)'}
                    </button>

                    <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-450 text-xs font-bold uppercase tracking-wider shrink-0">
                      {d.assignedStatus}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 rounded-2xl dark:bg-slate-955 bg-slate-100 border dark:border-slate-900 border-slate-200">
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
              
              <div className="flex items-center gap-5 p-6 rounded-2xl dark:bg-slate-955 bg-slate-100 border dark:border-slate-900 border-slate-200">
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

          {/* Help Desk & Dynamic Payment Archive Panel (Right Column) */}
          <div className="space-y-8">
            {/* PAYMENT LOGS & SCANNER INTERACTIVE PANEL */}
            <div className="p-6 md:p-8 rounded-3xl dark:bg-slate-900/30 bg-white border dark:border-slate-900 border-slate-200 shadow-md space-y-6">
              <h3 className="text-xl font-bold flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-rose-550 shrink-0" />
                {d.dormPaymentTitle}
              </h3>
              
              <div className="p-6 rounded-2xl dark:bg-slate-950 bg-slate-100 border dark:border-slate-900 border-slate-200 space-y-4">
                <div className="flex justify-between items-center text-sm font-semibold">
                  <span className="text-slate-400">{d.paymentStatusLabel}</span>
                  <span className={`px-2.5 py-1 text-2xs font-extrabold rounded-full ${
                    paymentStatus === 'paid' 
                      ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-450' 
                      : 'bg-rose-500/10 border border-rose-500/20 text-rose-505 dark:text-rose-400'
                  }`}>
                    {paymentStatus === 'paid' ? d.paymentPaid : d.paymentUnpaid}
                  </span>
                </div>

                <div className="h-px dark:bg-slate-900 bg-slate-200" />
                
                <div className="text-xs text-slate-400 leading-relaxed">
                  {language === 'kg' 
                    ? 'Акыркы семестр үчүн ижара акысы: 12,000 сом. МБанк аркылуу төлөп, чекти ИИ сканерине жүктөңүз.'
                    : language === 'ru'
                    ? 'Аренда за текущий семестр: 12,000 сом. Оплатите через МБанк и загрузите квитанцию в ИИ сканер.'
                    : 'Rent due for current semester: 12,000 KGS. Pay via MBank and upload receipt to AI OCR scanner.'
                  }
                </div>

                {/* PAY NOW TRIGGER BUTTON */}
                <button 
                  onClick={() => setPayModalOpen(true)}
                  className="w-full flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-rose-500 to-violet-650 hover:brightness-110 text-white font-bold rounded-xl transition-all duration-300 cursor-pointer shadow-lg shadow-rose-500/10 text-xs"
                >
                  <CreditCard className="w-4 h-4 shrink-0" />
                  {language === 'kg' ? 'МБанк / Элкарт менен төлөө' : language === 'ru' ? 'Оплатить через MBank / Элкарт' : 'Pay via MBank / Elcart'}
                </button>
              </div>

              {/* PAYMENT ARCHIVE LOGS */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">{language === 'kg' ? 'Төлөмдөрдүн тарыхы' : language === 'ru' ? 'Архив транзакций' : 'Billing Archive'}</h4>
                <div className="space-y-2 max-h-[180px] overflow-y-auto pr-1">
                  {paymentHistory.map(tx => (
                    <div key={tx.id} className="p-3.5 rounded-xl dark:bg-slate-950 bg-slate-50 border dark:border-slate-850 border-slate-200 flex items-center justify-between text-2xs">
                      <div>
                        <div className="font-bold">{tx.amount}</div>
                        <div className="text-[10px] text-slate-400 mt-0.5">{tx.date} • {tx.type}</div>
                      </div>
                      <div className="text-right">
                        <span className={`px-2 py-0.5 font-extrabold rounded-full ${
                          tx.status === 'approved' 
                            ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-450' 
                            : 'bg-amber-500/10 text-amber-600 dark:text-amber-500'
                        }`}>
                          {tx.status === 'approved' ? (language === 'kg' ? 'Кабыл алынды' : 'Одобрено') : (language === 'kg' ? 'Күтүүдө' : 'В обработке')}
                        </span>
                        <div className="text-[9px] text-slate-400 mt-1 font-semibold">{tx.ref}</div>
                      </div>
                    </div>
                  ))}
                </div>
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
                  <div className="flex items-start gap-2.5 p-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-450 rounded-xl text-xs animate-fadeIn">
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
                    className="w-full dark:bg-slate-955 bg-white border dark:border-slate-900 border-slate-200 dark:text-white text-slate-900 rounded-xl py-3 px-4 placeholder-slate-400 dark:placeholder-slate-700 text-xs focus:outline-none focus:ring-1 focus:ring-rose-500 focus:border-rose-500 transition-all"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-2xs font-bold text-slate-500 uppercase tracking-wide">{d.ticketUrgencyLabel}</label>
                  <select
                    value={ticketUrgency}
                    onChange={(e) => setTicketUrgency(e.target.value)}
                    className="w-full dark:bg-slate-955 bg-white border dark:border-slate-900 border-slate-200 dark:text-white text-slate-900 rounded-xl py-3 px-4 text-xs focus:outline-none focus:ring-1 focus:ring-rose-500 focus:border-rose-500 transition-all cursor-pointer"
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

      {/* MBANK / ELCART INTERACTIVE PAYMENT SCANNER MODAL */}
      {payModalOpen && (
        <div className="fixed inset-0 bg-slate-955/70 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-fadeIn" onClick={() => setPayModalOpen(false)}>
          <div 
            className="w-full max-w-lg dark:bg-slate-900 bg-white border dark:border-slate-800 border-slate-200 rounded-3xl p-8 shadow-2xl space-y-6 relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b dark:border-slate-850 border-slate-200 pb-4">
              <div className="flex items-center gap-2">
                <QrCode className="w-6 h-6 text-rose-500" />
                <div>
                  <h4 className="text-xl font-black">{language === 'kg' ? 'ОшМУ төлөм терминалы' : language === 'ru' ? 'Платежный терминал ОшГУ' : 'OshSU Payment Gateway'}</h4>
                  <p className="text-xs text-slate-500 mt-0.5">Официалдуу MBank / Элкарт транзакциясы</p>
                </div>
              </div>
              <button 
                onClick={() => setPayModalOpen(false)}
                className="p-1 rounded-xl hover:bg-slate-500/10 transition-all cursor-pointer"
              >
                <X className="w-6 h-6 text-slate-400" />
              </button>
            </div>

            {/* Requisites Reusable component */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-5 rounded-2xl dark:bg-slate-950 bg-slate-100 border dark:border-slate-850 border-slate-250 text-xs">
              <div className="space-y-1">
                <span className="text-slate-500 font-semibold">Алуучу / Получатель:</span>
                <div className="font-extrabold text-rose-550">ОшМУ Студенттик Дирекциясы</div>
              </div>
              <div className="space-y-1">
                <span className="text-slate-500 font-semibold">Эсеп номери / Счет получателя:</span>
                <div className="font-extrabold tracking-wider">109000331002</div>
              </div>
              <div className="space-y-1 md:col-span-2">
                <span className="text-slate-500 font-semibold">Дареги / Назначение:</span>
                <div className="font-bold text-slate-700 dark:text-slate-300">№1 Жатакана, 102-бөлмө ижарасы</div>
              </div>
            </div>

            {/* DRAG AND DROP RECEIPTS UPLOADER */}
            <div className="space-y-3">
              <label className="text-2xs font-extrabold text-slate-500 uppercase tracking-widest">{language === 'kg' ? 'Төлөм чекти жүктөө (ИИ OCR Сканер)' : language === 'ru' ? 'Загрузите чек оплаты (ИИ OCR Сканер)' : 'Upload Receipt Screenshot (AI OCR Scanner)'}</label>
              
              <div className="relative border-2 border-dashed dark:border-slate-800 border-slate-300 hover:border-rose-500/50 rounded-2xl p-8 text-center transition-all cursor-pointer">
                <input 
                  type="file" 
                  accept="image/*"
                  onChange={handleReceiptUpload}
                  className="absolute inset-0 opacity-0 cursor-pointer w-full h-full z-10"
                />
                
                <div className="space-y-3 pointer-events-none">
                  <UploadCloud className="w-10 h-10 text-rose-500 mx-auto animate-bounce" />
                  <div>
                    <div className="text-xs font-bold">{receiptFileName || (language === 'kg' ? 'Чек файлын тандаңыз же бул жерге сүйрөңүз' : language === 'ru' ? 'Выберите файл чека или перетащите сюда' : 'Select receipt file or drag here')}</div>
                    <p className="text-[10px] text-slate-500 mt-1">PNG, JPG форматында (Макс. 5MB)</p>
                  </div>
                </div>
              </div>
            </div>

            {/* AI OCR NEON SCANNER SIMULATOR LOGS */}
            {ocrScanning && (
              <div className="p-4.5 rounded-2xl bg-rose-500/5 border border-rose-500/10 space-y-3 text-xs animate-fadeIn">
                <div className="flex items-center justify-between font-bold">
                  <span className="flex items-center gap-1.5 text-rose-500">
                    <Sparkles className="w-4 h-4 animate-spin" />
                    {language === 'kg' ? 'ИИ текшерүү жүрүүдө...' : 'ИИ верификация чека...'}
                  </span>
                  <span className="text-2xs text-slate-500">OCR Scanner Active</span>
                </div>
                
                {/* Neon progress bar */}
                <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-rose-500 via-pink-500 to-violet-500 rounded-full animate-pulse w-full" />
                </div>
                
                <p className="text-2xs text-slate-400 italic text-center font-medium">{ocrStatus}</p>
              </div>
            )}

            {/* AI SCANNER COMPLETED SUCCESS STATE */}
            {ocrSuccess && (
              <div className="p-5 rounded-2xl bg-emerald-500/5 border border-emerald-500/20 space-y-2 text-xs text-center animate-fadeIn text-emerald-600 dark:text-emerald-450">
                <FileCheck2 className="w-8 h-8 mx-auto animate-bounce text-emerald-500" />
                <h5 className="font-extrabold text-sm">{language === 'kg' ? 'Чек ийгиликтүү таанылды!' : 'Чек успешно верифицирован!'}</h5>
                <p className="text-2xs leading-relaxed max-w-sm mx-auto text-slate-500 font-medium">
                  {language === 'kg' 
                    ? 'Сумма: 12,000 сом. Дата: 19.05.2026. Төлөм ийгиликтүү катталды жана кабыл алуу үчүн жиберилди.'
                    : 'Сумма: 12,000 сом. Дата: 19.05.2026. Платеж зарегистрирован в архиве транзакций и направлен коменданту.'
                  }
                </p>
                <button 
                  onClick={() => setPayModalOpen(false)}
                  className="mt-3 px-4 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl text-2xs cursor-pointer"
                >
                  OK / Жабуу
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* HIDDEN PRINT-ONLY BILATERAL RENTAL AGREEMENT */}
      <div id="printable-contract" className="hidden print:block p-10 leading-relaxed text-black max-w-4xl mx-auto">
        {/* Kyrgyz Republic Coat of Arms Reference / Header */}
        <div className="text-center space-y-2 border-b-2 border-black pb-5">
          <h2 className="text-sm font-extrabold uppercase tracking-wide">Кыргыз Republicсынын Билим берүү жана илим министрлиги</h2>
          <h1 className="text-lg font-black uppercase tracking-wider">ОШ МАМЛЕКЕТТИК УНИВЕРСИТЕТИ (ОшМУ)</h1>
          <p className="text-xs font-bold italic">Студенттик жатаканада жашоо укугу жөнүндө эки тараптуу КЕЛИШИМ / Двусторонний ДОГОВОР</p>
        </div>

        {/* Contract Title & Number */}
        <div className="mt-8 flex justify-between text-xs font-bold">
          <span>Келишим № {Math.floor(1000 + Math.random() * 9000)}-OshSU</span>
          <span>Күнү / Дата: {new Date().toLocaleDateString('ru-RU')}</span>
        </div>

        {/* Parties involved */}
        <div className="mt-6 text-2xs space-y-4 text-justify">
          <p>
            Мындан ары <strong>«Берүүчү»</strong> деп аталуучу Ош мамлекеттик университетинин дирекциясынын атынан тиешелүү комендант бир тараптан, жана мындан ары <strong>«Жашоочу»</strong> деп аталуучу студент <strong>{studentName}</strong> экинчи тараптан, төмөнкү шарттардын негизинде ушул келишимди түзүштү:
          </p>
          <p className="italic text-gray-700">
            Настоящий договор заключен между администрацией Ошского государственного университета (ОшГУ) в лице коменданта, именуемым в дальнейшем <strong>«Наймодатель»</strong>, с одной стороны, и студентом <strong>{studentName}</strong>, именуемым в дальнейшем <strong>«Наниматель»</strong>, с другой стороны, о нижеследующем:
          </p>
        </div>

        {/* Section 1: Subject of Contract */}
        <div className="mt-6 space-y-2">
          <h3 className="text-xs font-bold uppercase tracking-wider">1. КЕЛИШИМДИН ПРЕДМЕТИ / ПРЕДМЕТ ДОГОВОРА</h3>
          <ul className="list-decimal pl-5 text-2xs space-y-1.5 text-justify">
            <li>
              <strong>Берүүчү</strong> жашоочуга <u>{assignedRoom.dormName}</u> дарегиндеги общежитиеден убактылуу жашоо үчүн <strong>{assignedRoom.roomNumber}-бөлмөдөн</strong> орун (кабат: {assignedRoom.floor}) берет.
            </li>
            <li className="italic text-gray-700">
              Наймодатель предоставляет Нанимателю койко-место в <strong>комнате №{assignedRoom.roomNumber}</strong> (этаж: {assignedRoom.floor}) в студенческом общежитии по адресу: <u>{assignedRoom.dormName}</u>.
            </li>
          </ul>
        </div>

        {/* Section 2: Rights & Duties */}
        <div className="mt-6 space-y-2">
          <h3 className="text-xs font-bold uppercase tracking-wider">2. ТАРАПТАРДЫН МИЛДЕТТЕРИ / ОБЯЗАННОСТИ СТОРОН</h3>
          <ul className="list-decimal pl-5 text-2xs space-y-1.5 text-justify">
            <li><strong>Жашоочу милдеттенет / Наниматель обязуется:</strong></li>
            <ul className="list-disc pl-5 space-y-1 text-slate-700">
              <li>Жатакананын эрежелерин жана тартибин толук сактоого. / Соблюдать правила внутреннего распорядка общежития.</li>
              <li>Ижара акысын жана коммуналдык кызматтарды өз убагында төлөөгө. / Своевременно оплачивать проживание и коммунальные услуги.</li>
              <li>Бөлмөдө тазалыкты жана техникалык коопсуздукту сактоого. / Поддерживать чистоту в комнате и соблюдать правила пожарной безопасности.</li>
            </ul>
            <li><strong>Берүүчү милдеттенет / Наймодатель обязуется:</strong></li>
            <ul className="list-disc pl-5 space-y-1 text-slate-700">
              <li>Турмуш-тиричиликке керектүү шарттарды түзүп берүүгө. / Предоставить необходимые жилищно-бытовые условия.</li>
              <li>Жатакананын коопсуздугун 24/7 камсыздоого. / Обеспечить круглосуточную охрану и безопасность в здании.</li>
            </ul>
          </ul>
        </div>

        {/* Section 3: Force Majeure & Special Rules */}
        <div className="mt-6 space-y-2">
          <h3 className="text-xs font-bold uppercase tracking-wider">3. ӨЗГӨЧӨ ШАРТТАР / ОСОБЫЕ УСЛОВИЯ</h3>
          <p className="text-2xs text-justify">
            Ушул келишим эки тарап тең кол койгон учурдан тартып күчүнө кирет жана бир окуу жылына жарактуу болуп эсептелет. Шарттар бузулган учурда келишим мөөнөтүнөн мурда жокко чыгарылышы мүмкүн.
          </p>
          <p className="text-2xs text-justify italic text-gray-700">
            Настоящий договор вступает в силу с момента его подписания обеими сторонами и действует в течение одного учебного года. В случае нарушения правил проживания договор может быть расторгнут в одностороннем порядке.
          </p>
        </div>

        {/* Signatures with Seal Placeholder */}
        <div className="mt-16 grid grid-cols-2 gap-12 text-xs font-bold pt-8 border-t border-dashed border-gray-400">
          <div className="space-y-6">
            <div>ОшМУ ЖАТАКАНА ДИРЕКЦИЯСЫ / АДМИНИСТРАЦИЯ:</div>
            <div className="h-10 border-b border-black w-48" />
            <div className="text-2xs text-gray-500 italic">Колу жана Мөөр орду / Подпись и место печати (М.П.)</div>
          </div>
          <div className="space-y-6">
            <div>СТУДЕНТ / ЖАШООЧУ:</div>
            <div className="h-10 border-b border-black w-48" />
            <div className="text-2xs text-gray-500 italic">Студенттин колу / Подпись нанимателя</div>
          </div>
        </div>
      </div>
    </div>
  )
}
