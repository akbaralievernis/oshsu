'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'
import { 
  Shield, Landmark, Users, ClipboardList, CheckCircle, AlertCircle, Wrench,
  Check, LogOut, ChevronRight, Sparkles, Phone, UserPlus
} from 'lucide-react'

export default function CommandantDashboard() {
  const router = useRouter()
  const supabase = createClient()
  
  const [activeTab, setActiveTab] = useState<'rooms' | 'tickets' | 'students'>('rooms')
  const [commandantName, setCommandantName] = useState('Комендант')
  
  // Interactive mock data for real-time demonstration
  const [stats, setStats] = useState({
    activeStudents: 412,
    emptyBeds: 38,
    activeTickets: 5,
    cleanRooms: 142
  })

  const [rooms, setRooms] = useState([
    { id: '101', floor: 1, beds: 3, occupied: 3, status: 'clean', type: 'кыздар' },
    { id: '102', floor: 1, beds: 3, occupied: 2, status: 'dirty', type: 'кыздар' },
    { id: '103', floor: 1, beds: 4, occupied: 4, status: 'clean', type: 'кыздар' },
    { id: '201', floor: 2, beds: 3, occupied: 1, status: 'clean', type: 'балдар' },
    { id: '202', floor: 2, beds: 3, occupied: 3, status: 'clean', type: 'балдар' },
    { id: '203', floor: 2, beds: 4, occupied: 0, status: 'clean', type: 'бош бөлмө' },
  ])

  const [tickets, setTickets] = useState([
    { id: '1', room: '102', student: 'Алиев Тимур', title: 'Душ бузулду', urgency: 'high', status: 'new', date: '19.05.2026' },
    { id: '2', room: '201', student: 'Маматов Бектур', title: 'Розетка иштебейт', urgency: 'medium', status: 'new', date: '19.05.2026' },
    { id: '3', room: '103', student: 'Бакытова Нурай', title: 'Терезе жабылбайт', urgency: 'low', status: 'resolved', date: '18.05.2026' },
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
              <Landmark className="w-6 h-6 text-amber-500" />
            </div>
            <div>
              <h1 className="text-lg font-black tracking-tight leading-none">ОшМУ Жатакана</h1>
              <span className="text-xs text-amber-500 font-bold tracking-widest uppercase">Комендант</span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-2">
            <button
              onClick={() => setActiveTab('rooms')}
              className={`w-full flex items-center justify-between px-4 py-3.5 text-sm font-semibold rounded-2xl transition-all duration-300 ${
                activeTab === 'rooms'
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-lg shadow-amber-500/10'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900/50'
              }`}
            >
              <div className="flex items-center gap-3">
                <Landmark className="w-5 h-5" />
                Бөлмөлөрдүн картасы
              </div>
              <ChevronRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => setActiveTab('tickets')}
              className={`w-full flex items-center justify-between px-4 py-3.5 text-sm font-semibold rounded-2xl transition-all duration-300 ${
                activeTab === 'tickets'
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-lg shadow-amber-500/10'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900/50'
              }`}
            >
              <div className="flex items-center gap-3">
                <Wrench className="w-5 h-5" />
                Мүчүлүштүктөр (Тикеттер)
              </div>
              {stats.activeTickets > 0 && (
                <span className={`px-2 py-0.5 text-xs font-black rounded-full ${activeTab === 'tickets' ? 'bg-slate-950 text-white' : 'bg-amber-500 text-slate-950'}`}>
                  {stats.activeTickets}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('students')}
              className={`w-full flex items-center justify-between px-4 py-3.5 text-sm font-semibold rounded-2xl transition-all duration-300 ${
                activeTab === 'students'
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-lg shadow-amber-500/10'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900/50'
              }`}
            >
              <div className="flex items-center gap-3">
                <Users className="w-5 h-5" />
                Студенттердин тизмеси
              </div>
              <ChevronRight className="w-4 h-4" />
            </button>
          </nav>
        </div>

        {/* User Info / Logout */}
        <div className="pt-6 border-t border-slate-900/80">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center border border-slate-700 font-bold text-amber-500 shadow-md">
              {commandantName[0].toUpperCase()}
            </div>
            <div className="truncate">
              <div className="text-sm font-bold truncate">{commandantName}</div>
              <div className="text-xs text-slate-500">Башкы комендант (№1)</div>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 py-3 bg-red-500/10 hover:bg-red-500/20 text-red-400 text-sm font-bold rounded-2xl border border-red-500/10 transition-all duration-300"
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
            <h2 className="text-3xl font-extrabold tracking-tight">Коменданттык дашборд</h2>
            <p className="text-sm text-slate-400 mt-1">№1 Жатакананын күнүмдүк абалын, тазалыгын жана мүчүлүштүктөрүн көзөмөлдөө</p>
          </div>
        </header>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <div className="p-6 rounded-3xl bg-slate-900/40 border border-slate-900 flex items-center gap-5 shadow-lg">
            <div className="p-4 rounded-2xl bg-amber-500/10 text-amber-500 border border-amber-500/10">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <div className="text-2xl font-black">{stats.activeStudents}</div>
              <div className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Жашаган студенттер</div>
            </div>
          </div>

          <div className="p-6 rounded-3xl bg-slate-900/40 border border-slate-900 flex items-center gap-5 shadow-lg">
            <div className="p-4 rounded-2xl bg-amber-500/10 text-amber-500 border border-amber-500/10">
              <Landmark className="w-6 h-6" />
            </div>
            <div>
              <div className="text-2xl font-black">{stats.emptyBeds}</div>
              <div className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Бош орундар</div>
            </div>
          </div>

          <div className="p-6 rounded-3xl bg-slate-900/40 border border-slate-900 flex items-center gap-5 shadow-lg">
            <div className="p-4 rounded-2xl bg-amber-500/10 text-amber-500 border border-amber-500/10">
              <Wrench className="w-6 h-6" />
            </div>
            <div>
              <div className="text-2xl font-black">{stats.activeTickets}</div>
              <div className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Чечилбеген тикеттер</div>
            </div>
          </div>

          <div className="p-6 rounded-3xl bg-slate-900/40 border border-slate-900 flex items-center gap-5 shadow-lg">
            <div className="p-4 rounded-2xl bg-amber-500/10 text-amber-500 border border-amber-500/10">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <div className="text-2xl font-black">{stats.cleanRooms}</div>
              <div className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Таза бөлмөлөр</div>
            </div>
          </div>
        </div>

        {/* Tab 1: Rooms Map */}
        {activeTab === 'rooms' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-bold">Бөлмөлөрдүн деталдуу тизмеси</h3>
              <span className="text-xs text-slate-500 font-medium">* Статусту алмаштыруу үчүн бөлмөнүн үстүнө басыңыз</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {rooms.map(room => (
                <div 
                  key={room.id}
                  onClick={() => toggleRoomCleanliness(room.id)}
                  className="group p-6 rounded-3xl bg-slate-900/30 border border-slate-900 hover:border-slate-800 transition-all duration-300 cursor-pointer flex flex-col justify-between space-y-6"
                >
                  <div className="flex items-center justify-between">
                    <div className="text-lg font-black">{room.id}-бөлмө</div>
                    <span className={`px-2.5 py-1 text-2xs font-extrabold rounded-full ${
                      room.status === 'clean' 
                        ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-450' 
                        : 'bg-amber-500/10 border border-amber-500/20 text-amber-500'
                    }`}>
                      {room.status === 'clean' ? 'Таза' : 'Оңдоо/Жуу керек'}
                    </span>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between text-xs font-semibold text-slate-400">
                      <span>Ички тип:</span>
                      <span className="text-slate-200 capitalize">{room.type}</span>
                    </div>

                    <div className="flex justify-between text-xs font-semibold text-slate-400">
                      <span>Толушу:</span>
                      <span className="text-slate-200">{room.occupied} / {room.beds} орун</span>
                    </div>
                  </div>

                  <div className="h-1.5 w-full bg-slate-950 rounded-full overflow-hidden border border-slate-900">
                    <div 
                      className="h-full bg-gradient-to-r from-amber-500 to-amber-600 rounded-full" 
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
            <h3 className="text-xl font-bold">Студенттердин кайрылуулары</h3>

            <div className="bg-slate-900/30 border border-slate-900 rounded-3xl overflow-hidden shadow-lg">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-950/60 border-b border-slate-900 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                      <th className="py-4.5 px-6">Бөлмө / Студент</th>
                      <th className="py-4.5 px-6">Маселе</th>
                      <th className="py-4.5 px-6">Шарты</th>
                      <th className="py-4.5 px-6">Дата</th>
                      <th className="py-4.5 px-6">Статус</th>
                      <th className="py-4.5 px-6 text-right">Уруксат берүү</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-900/80 text-sm">
                    {tickets.map(ticket => (
                      <tr key={ticket.id} className="hover:bg-slate-900/10 transition-colors">
                        <td className="py-4 px-6">
                          <div className="font-bold">{ticket.room}-бөлмө</div>
                          <div className="text-xs text-slate-500">{ticket.student}</div>
                        </td>
                        <td className="py-4 px-6 font-semibold text-slate-300">{ticket.title}</td>
                        <td className="py-4 px-6">
                          <span className={`px-2 py-0.5 text-2xs font-extrabold rounded-full ${
                            ticket.urgency === 'high' 
                              ? 'bg-red-500/10 border border-red-500/20 text-red-400' 
                              : ticket.urgency === 'medium'
                              ? 'bg-amber-500/10 border border-amber-500/20 text-amber-500'
                              : 'bg-slate-800 border border-slate-700 text-slate-400'
                          }`}>
                            {ticket.urgency === 'high' ? 'Кызыл' : ticket.urgency === 'medium' ? 'Орто' : 'Төмөн'}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-slate-500">{ticket.date}</td>
                        <td className="py-4 px-6">
                          {ticket.status === 'new' ? (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 text-xs font-bold rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-500">
                              Каралууда
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 text-xs font-bold rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-450">
                              Оңдолду
                            </span>
                          )}
                        </td>
                        <td className="py-4 px-6 text-right">
                          {ticket.status === 'new' ? (
                            <button 
                              onClick={() => resolveTicket(ticket.id)}
                              className="px-3.5 py-1.5 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-slate-950 text-xs font-extrabold rounded-xl shadow-lg transition-colors flex items-center gap-1.5 ml-auto"
                            >
                              <Check className="w-3.5 h-3.5" />
                              Оңдолду деп белгилөө
                            </button>
                          ) : (
                            <span className="text-xs text-slate-500 italic">Чечилген</span>
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
          <div className="p-12 rounded-3xl bg-slate-900/20 border border-slate-900 text-center space-y-4 animate-fadeIn">
            <Users className="w-12 h-12 text-amber-500 mx-auto opacity-70" />
            <h3 className="text-xl font-bold">Студенттердин картотекасы</h3>
            <p className="text-sm text-slate-400 max-w-md mx-auto leading-relaxed">
              Бул бөлүмдө сиз №1 жатаканада катталган бардык 412 студенттин байланыш телефондорун, документтерин (паспорт, флюорография) жана келишимдерин көрө аласыз.
            </p>
            <button className="px-5 py-2.5 bg-slate-900 hover:bg-slate-850 border border-slate-850 text-xs font-bold rounded-xl transition-all flex items-center gap-2 mx-auto">
              <Phone className="w-4 h-4 text-amber-500" />
              Байланыш тизмесин жүктөө
            </button>
          </div>
        )}
      </main>
    </div>
  )
}
