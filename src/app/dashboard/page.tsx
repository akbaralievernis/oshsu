'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'
import { 
  Shield, Landmark, Users, ClipboardList, CheckCircle, AlertCircle, Wrench,
  Check, LogOut, ChevronRight, Sparkles, MapPin, User, FileText, Send
} from 'lucide-react'

export default function StudentDashboard() {
  const router = useRouter()
  const supabase = createClient()
  
  const [studentName, setStudentName] = useState('Студент')
  const [ticketTitle, setTicketTitle] = useState('')
  const [ticketUrgency, setTicketUrgency] = useState('medium')
  const [submittingTicket, setSubmittingTicket] = useState(false)
  const [ticketSuccess, setTicketSuccess] = useState(false)

  // Interactive mock data for real-time demonstration
  const [hasRoom, setHasRoom] = useState(true)
  const [applicationStatus, setApplicationStatus] = useState<'pending' | 'approved' | 'rejected'>('approved')
  const [paymentStatus, setPaymentStatus] = useState<'paid' | 'unpaid'>('unpaid')
  
  const [assignedRoom, setAssignedRoom] = useState({
    dormName: '№1 Жатакана (Башкы корпус)',
    roomNumber: '102',
    floor: 1,
    bedNumber: 'Берене №2',
    roommates: [
      { name: 'Касымов Улукбек', faculty: 'Медициналык факультет' },
      { name: 'Абдуллаев Азамат', faculty: 'Юридикалык колледж' },
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
    <div className="min-h-screen bg-slate-950 text-white font-sans flex overflow-hidden">
      {/* Decorative Background Gradients */}
      <div className="absolute top-0 left-0 w-[300px] h-[300px] rounded-full bg-slate-900 blur-[150px] opacity-60 pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] rounded-full bg-amber-950/20 blur-[150px] opacity-40 pointer-events-none" />

      {/* Sidebar Navigation */}
      <aside className="w-80 bg-slate-900/60 backdrop-blur-xl border-r border-slate-900/80 p-6 flex flex-col justify-between shrink-0 z-20">
        <div className="space-y-8">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-gradient-to-br from-slate-900 to-slate-800 border border-slate-800 shadow-lg">
              <Shield className="w-6 h-6 text-amber-500" />
            </div>
            <div>
              <h1 className="text-lg font-black tracking-tight leading-none">ОшМУ Жатакана</h1>
              <span className="text-xs text-amber-500 font-bold tracking-widest uppercase">Студент</span>
            </div>
          </div>

          {/* Student Profile Quick Panel */}
          <div className="p-5 rounded-2xl bg-slate-950 border border-slate-900/80 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center border border-slate-700 font-bold text-amber-500 shadow-md">
                {studentName[0].toUpperCase()}
              </div>
              <div className="truncate">
                <div className="text-sm font-bold truncate">{studentName}</div>
                <div className="text-xs text-slate-500">Студенттик кабинет</div>
              </div>
            </div>
            
            {hasRoom && (
              <div className="space-y-2 border-t border-slate-900/80 pt-3 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-555 text-slate-500 font-semibold">Имарат:</span>
                  <span className="text-slate-300 font-bold text-right truncate max-w-[130px]">№1 Жатакана</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-555 text-slate-500 font-semibold">Бөлмө:</span>
                  <span className="text-amber-500 font-extrabold">{assignedRoom.roomNumber} ({assignedRoom.floor}-кабат)</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Logout */}
        <div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 py-3.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 text-sm font-bold rounded-2xl border border-red-500/10 transition-all duration-300"
          >
            <LogOut className="w-4 h-4" />
            Системадан чыгуу
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-h-screen overflow-y-auto p-8 lg:p-12 z-10">
        {/* Header */}
        <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-10">
          <div>
            <h2 className="text-3xl font-extrabold tracking-tight">Студенттин жеке кабинети</h2>
            <p className="text-sm text-slate-400 mt-1">Жатакана тиешелүү арыздардын маалыматы, бөлмө жана төлөмдөр</p>
          </div>
        </header>

        {/* Main Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Room Details & Roommates (Left Column) */}
          <div className="lg:col-span-2 space-y-8">
            {hasRoom ? (
              <div className="p-8 rounded-3xl bg-slate-900/30 border border-slate-900 space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-amber-500" />
                    Бөлмө маалыматы
                  </h3>
                  <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-450 text-xs font-bold uppercase tracking-wider">
                    Жайгашкан
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 rounded-2xl bg-slate-950 border border-slate-900/80">
                  <div className="space-y-1">
                    <div className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Жатакана имараты</div>
                    <div className="text-sm font-bold flex items-center gap-1.5">
                      <MapPin className="w-4 h-4 text-amber-500 shrink-0" />
                      {assignedRoom.dormName}
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-xs font-semibold text-slate-500 uppercase tracking-wide font-sans">Сиздин орун</div>
                    <div className="text-sm font-extrabold text-amber-500">{assignedRoom.bedNumber} (Бөлмө {assignedRoom.roomNumber})</div>
                  </div>
                </div>

                {/* Roommates */}
                <div className="space-y-4">
                  <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wide">Бөлмөлөштөрүңүз:</h4>
                  <div className="divide-y divide-slate-900">
                    {assignedRoom.roommates.map((mate, idx) => (
                      <div key={idx} className="flex items-center gap-4 py-3 first:pt-0 last:pb-0">
                        <div className="w-9 h-9 rounded-xl bg-slate-800 flex items-center justify-center border border-slate-700 text-xs font-bold text-amber-500 shrink-0">
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
              <div className="p-8 rounded-3xl bg-slate-900/30 border border-slate-900 space-y-6 text-center py-12">
                <FileText className="w-12 h-12 text-amber-500 mx-auto opacity-70" />
                <h3 className="text-xl font-bold">Сизде бөлмө жок</h3>
                <p className="text-sm text-slate-400 max-w-md mx-auto leading-relaxed">
                  Жатаканага бөлмө алуу үчүн тиешелүү арыз тапшырыңыз же комендант менен байланышыңыз.
                </p>
              </div>
            )}

            {/* Application Progress Status */}
            <div className="p-8 rounded-3xl bg-slate-900/30 border border-slate-900 space-y-6">
              <h3 className="text-xl font-bold">Арыздын учурдагы статусу</h3>
              
              <div className="flex items-center gap-5 p-6 rounded-2xl bg-slate-950 border border-slate-900/80">
                <div className={`p-3.5 rounded-xl border ${
                  applicationStatus === 'approved' 
                    ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-450' 
                    : 'bg-amber-500/10 border-amber-500/20 text-amber-500'
                }`}>
                  <ClipboardList className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-sm font-bold">
                    {applicationStatus === 'approved' ? 'Сиздин арызыңыз кабыл алынды!' : 'Арыз каралууда...'}
                  </div>
                  <div className="text-xs text-slate-500 mt-1">
                    {applicationStatus === 'approved' 
                      ? 'Комендант бөлмөгө бөлүү келишимин түзүп, сизге №102 бөлмөнү дайындады.' 
                      : 'Жатаканаларга каттоо бөлүмү сиздин арызыңызды карап жатат.'}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Help Desk (Right Column) & Payments */}
          <div className="space-y-8">
            {/* Payment Panel */}
            <div className="p-8 rounded-3xl bg-slate-900/30 border border-slate-900 space-y-6">
              <h3 className="text-xl font-bold">Окуу жылы үчүн төлөм</h3>
              
              <div className="p-6 rounded-2xl bg-slate-950 border border-slate-900/80 space-y-4">
                <div className="flex justify-between items-center text-sm font-semibold">
                  <span className="text-slate-400">Төлөм статусу</span>
                  <span className={`px-2.5 py-1 text-2xs font-extrabold rounded-full ${
                    paymentStatus === 'paid' 
                      ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-450' 
                      : 'bg-red-500/10 border border-red-500/20 text-red-400 animate-pulse'
                  }`}>
                    {paymentStatus === 'paid' ? 'Төлөндү' : 'Төлөнгөн жок'}
                  </span>
                </div>

                <div className="h-px bg-slate-900" />
                
                <div className="text-xs text-slate-400 leading-relaxed">
                  Жатаканада туруу келишимин толук бекитүү үчүн төлөмдү аткарып, дүмүрчөктү тиркеп коюңуз.
                </div>

                <button className="w-full flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-bold rounded-xl transition-all duration-300">
                  Оплата кылуу (Элкарт)
                </button>
              </div>
            </div>

            {/* Help Desk Ticket Submitter */}
            <div className="p-8 rounded-3xl bg-slate-900/30 border border-slate-900 space-y-6">
              <h3 className="text-xl font-bold flex items-center gap-2">
                <Wrench className="w-5 h-5 text-amber-500" />
                Комендантка кайрылуу
              </h3>
              
              <form onSubmit={handleSubmitTicket} className="space-y-4">
                {ticketSuccess && (
                  <div className="flex items-start gap-2.5 p-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl text-xs">
                    <CheckCircle className="w-4 h-4 shrink-0" />
                    <span>Кайрылуу жөнөтүлдү! Жазуу коменданттын дашбордунда жеткиликтүү болду.</span>
                  </div>
                )}

                <div className="space-y-1.5">
                  <label className="text-2xs font-bold text-slate-450 uppercase tracking-wide">Бузулган нерсе (Титул)</label>
                  <input
                    type="text"
                    required
                    value={ticketTitle}
                    onChange={(e) => setTicketTitle(e.target.value)}
                    placeholder="Бөлмөдөгү лампа күйбөй жатат"
                    className="w-full bg-slate-950 border border-slate-900 text-white rounded-xl py-3 px-4 placeholder-slate-700 text-xs focus:outline-none focus:ring-1 focus:ring-amber-500 focus:border-amber-500 transition-all"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-2xs font-bold text-slate-450 uppercase tracking-wide">Өзгөчө кырдаал (Шарт)</label>
                  <select
                    value={ticketUrgency}
                    onChange={(e) => setTicketUrgency(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-900 text-white rounded-xl py-3 px-4 text-xs focus:outline-none focus:ring-1 focus:ring-amber-500 focus:border-amber-500 transition-all"
                  >
                    <option value="low">Төмөн (Шашылыш эмес)</option>
                    <option value="medium">Орточо кырдаал</option>
                    <option value="high">Абдан кызыл (Катуу бузулуу)</option>
                  </select>
                </div>

                <button
                  type="submit"
                  disabled={submittingTicket || !ticketTitle}
                  className="w-full flex items-center justify-center gap-2 py-3 bg-slate-950 hover:bg-slate-900 border border-slate-800 hover:border-amber-500/20 text-xs font-bold rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submittingTicket ? (
                    <div className="w-4 h-4 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5" />
                      Жөнөтүү
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
