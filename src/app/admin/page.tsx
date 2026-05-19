'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'
import { 
  Shield, Users, Landmark, FileText, CheckCircle, XCircle, Clock, 
  Plus, Settings, LogOut, ChevronRight, Search, Filter, RefreshCw, BarChart3
} from 'lucide-react'

export default function AdminDashboard() {
  const router = useRouter()
  const supabase = createClient()
  
  const [activeTab, setActiveTab] = useState<'overview' | 'applications' | 'dormitories' | 'users'>('overview')
  const [loading, setLoading] = useState(false)
  const [adminName, setAdminName] = useState('Администратор')
  
  // Interactive mock data for real-time demonstration
  const [stats, setStats] = useState({
    totalStudents: 1420,
    totalDorms: 5,
    pendingApps: 18,
    activeTickets: 12
  })

  const [applications, setApplications] = useState([
    { id: '1', student: 'Асанов Алмаз Талантбекович', email: 'almaz.asanov@oshsu.kg', dorm: '№1 Жатакана', status: 'pending', date: '19.05.2026' },
    { id: '2', student: 'Бакытова Айсулуу Кубанычбековна', email: 'aisuluu.b@oshsu.kg', dorm: '№2 Жатакана', status: 'approved', date: '18.05.2026' },
    { id: '3', student: 'Жапаров Данияр Темирбекович', email: 'daniyar.j@oshsu.kg', dorm: '№3 Жатакана', status: 'pending', date: '18.05.2026' },
    { id: '4', student: 'Сыдыкова Айжамал Адилетовна', email: 'aijamal.s@oshsu.kg', dorm: '№1 Жатакана', status: 'rejected', date: '17.05.2026' },
    { id: '5', student: 'Кадыров Эрнис Бектурсунович', email: 'ernis.k@oshsu.kg', dorm: '№3 Жатакана', status: 'approved', date: '16.05.2026' },
  ])

  const [dormitories, setDormitories] = useState([
    { id: '1', name: '№1 Жатакана (Башкы корпус)', address: 'Ленин көчөсү, 331', rooms: 150, beds: 450, occupied: 412, status: 'Активдүү' },
    { id: '2', name: '№2 Жатакана (Эл аралык)', address: 'Исанов көчөсү, 73', rooms: 200, beds: 600, occupied: 580, status: 'Активдүү' },
    { id: '3', name: '№3 Жатакана (Жаңы конуш)', address: 'Г. Айтиев көчөсү, 12', rooms: 250, beds: 800, occupied: 610, status: 'Толуп калды' },
  ])

  // Check auth & role
  useEffect(() => {
    async function checkAuth() {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        setAdminName(user.user_metadata?.full_name || user.email || 'Администратор')
      }
    }
    checkAuth()
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  const updateAppStatus = (id: string, newStatus: 'approved' | 'rejected') => {
    setApplications(prev => 
      prev.map(app => app.id === id ? { ...app, status: newStatus } : app)
    )
    // Update dashboard statistics dynamically
    if (newStatus === 'approved' || newStatus === 'rejected') {
      setStats(prev => ({
        ...prev,
        pendingApps: Math.max(0, prev.pendingApps - 1)
      }))
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans flex overflow-hidden">
      {/* Decorative Gradients */}
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
              <span className="text-xs text-amber-500 font-bold tracking-widest uppercase">Суперадмин</span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-2">
            <button
              onClick={() => setActiveTab('overview')}
              className={`w-full flex items-center justify-between px-4 py-3.5 text-sm font-semibold rounded-2xl transition-all duration-300 ${
                activeTab === 'overview'
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-lg shadow-amber-500/10'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900/50'
              }`}
            >
              <div className="flex items-center gap-3">
                <BarChart3 className="w-5 h-5" />
                Жалпы маалымат
              </div>
              <ChevronRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => setActiveTab('applications')}
              className={`w-full flex items-center justify-between px-4 py-3.5 text-sm font-semibold rounded-2xl transition-all duration-300 ${
                activeTab === 'applications'
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-lg shadow-amber-500/10'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900/50'
              }`}
            >
              <div className="flex items-center gap-3">
                <FileText className="w-5 h-5" />
                Студенттердин арыздары
              </div>
              {stats.pendingApps > 0 && (
                <span className={`px-2 py-0.5 text-xs font-black rounded-full ${activeTab === 'applications' ? 'bg-slate-950 text-white' : 'bg-amber-500 text-slate-950'}`}>
                  {stats.pendingApps}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('dormitories')}
              className={`w-full flex items-center justify-between px-4 py-3.5 text-sm font-semibold rounded-2xl transition-all duration-300 ${
                activeTab === 'dormitories'
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-lg shadow-amber-500/10'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900/50'
              }`}
            >
              <div className="flex items-center gap-3">
                <Landmark className="w-5 h-5" />
                Жатаканалар базасы
              </div>
              <ChevronRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => setActiveTab('users')}
              className={`w-full flex items-center justify-between px-4 py-3.5 text-sm font-semibold rounded-2xl transition-all duration-300 ${
                activeTab === 'users'
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-lg shadow-amber-500/10'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900/50'
              }`}
            >
              <div className="flex items-center gap-3">
                <Users className="w-5 h-5" />
                Кызматкерлер & Суденттер
              </div>
              <ChevronRight className="w-4 h-4" />
            </button>
          </nav>
        </div>

        {/* User Info / Logout */}
        <div className="pt-6 border-t border-slate-900/80">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center border border-slate-700 font-bold text-amber-500 shadow-md">
              {adminName[0].toUpperCase()}
            </div>
            <div className="truncate">
              <div className="text-sm font-bold truncate">{adminName}</div>
              <div className="text-xs text-slate-500">Системалык администратор</div>
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
            <h2 className="text-3xl font-extrabold tracking-tight">Суперадмин башкаруу панели</h2>
            <p className="text-sm text-slate-400 mt-1">ОшМУ жатаканаларынын жалпы абалын көзөмөлдөө жана башкаруу</p>
          </div>
          
          <button 
            onClick={() => setLoading(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-slate-900 border border-slate-800 text-xs font-semibold rounded-xl hover:bg-slate-850 hover:border-slate-750 transition-all"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-amber-500 ${loading ? 'animate-spin' : ''}`} />
            Маалыматты жаңылоо
          </button>
        </header>

        {/* Tab 1: Overview */}
        {activeTab === 'overview' && (
          <div className="space-y-10 animate-fadeIn">
            {/* Stats Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="p-6 rounded-3xl bg-slate-900/40 border border-slate-900 flex items-center gap-5 shadow-lg">
                <div className="p-4 rounded-2xl bg-amber-500/10 text-amber-500 border border-amber-500/10">
                  <Users className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-2xl font-black">{stats.totalStudents}</div>
                  <div className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Студенттер жалпы</div>
                </div>
              </div>

              <div className="p-6 rounded-3xl bg-slate-900/40 border border-slate-900 flex items-center gap-5 shadow-lg">
                <div className="p-4 rounded-2xl bg-amber-500/10 text-amber-500 border border-amber-500/10">
                  <Landmark className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-2xl font-black">{stats.totalDorms}</div>
                  <div className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Активдүү имарат</div>
                </div>
              </div>

              <div className="p-6 rounded-3xl bg-slate-900/40 border border-slate-900 flex items-center gap-5 shadow-lg">
                <div className="p-4 rounded-2xl bg-amber-500/10 text-amber-500 border border-amber-500/10">
                  <FileText className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-2xl font-black">{stats.pendingApps}</div>
                  <div className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Каралуучу арыздар</div>
                </div>
              </div>

              <div className="p-6 rounded-3xl bg-slate-900/40 border border-slate-900 flex items-center gap-5 shadow-lg">
                <div className="p-4 rounded-2xl bg-amber-500/10 text-amber-500 border border-amber-500/10">
                  <Clock className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-2xl font-black">{stats.activeTickets}</div>
                  <div className="text-xs text-slate-500 font-semibold uppercase tracking-wider font-sans">Активдүү тикеттер</div>
                </div>
              </div>
            </div>

            {/* Quick Actions & Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Dormitory Quick Overview */}
              <div className="lg:col-span-2 p-8 rounded-3xl bg-slate-900/30 border border-slate-900 space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold">Жатаканалардын толтурулушу</h3>
                  <button onClick={() => setActiveTab('dormitories')} className="text-xs text-amber-500 font-bold hover:underline">Толук көрүү</button>
                </div>
                
                <div className="space-y-5">
                  {dormitories.map(dorm => {
                    const percentage = Math.round((dorm.occupied / dorm.beds) * 100)
                    return (
                      <div key={dorm.id} className="space-y-2">
                        <div className="flex justify-between text-sm font-semibold">
                          <span>{dorm.name}</span>
                          <span className="text-amber-500">{dorm.occupied}/{dorm.beds} орун ({percentage}%)</span>
                        </div>
                        <div className="h-2.5 w-full bg-slate-950 border border-slate-900 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-amber-500 to-amber-600 rounded-full shadow-inner transition-all duration-500" 
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Quick Admin Actions Panel */}
              <div className="p-8 rounded-3xl bg-slate-900/30 border border-slate-900 flex flex-col justify-between space-y-6">
                <h3 className="text-xl font-bold">Ыкчам аракеттер</h3>
                
                <div className="space-y-3">
                  <button className="w-full flex items-center justify-center gap-2.5 py-3.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-bold rounded-2xl shadow-lg transition-all duration-300">
                    <Plus className="w-5 h-5 shrink-0" />
                    Жаңы жатакана кошуу
                  </button>
                  <button className="w-full flex items-center justify-center gap-2.5 py-3.5 bg-slate-950 hover:bg-slate-900 border border-slate-800 text-slate-300 font-semibold rounded-2xl transition-all duration-300">
                    <Users className="w-5 h-5 shrink-0" />
                    Комендант каттоо
                  </button>
                  <button className="w-full flex items-center justify-center gap-2.5 py-3.5 bg-slate-950 hover:bg-slate-900 border border-slate-800 text-slate-300 font-semibold rounded-2xl transition-all duration-300">
                    <Settings className="w-5 h-5 shrink-0" />
                    Университет жөндөөлөрү
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
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 bg-slate-900/30 border border-slate-900 rounded-2xl">
              <div className="relative w-full sm:w-80">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input 
                  type="text" 
                  placeholder="Студенттин ФИОсу..." 
                  className="w-full bg-slate-950 border border-slate-800 text-white rounded-xl py-2 pl-9 pr-4 text-sm focus:outline-none focus:ring-1 focus:ring-amber-500 focus:border-amber-500 transition-all"
                />
              </div>
              
              <div className="flex gap-2 w-full sm:w-auto">
                <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs font-semibold hover:bg-slate-900">
                  <Filter className="w-3.5 h-3.5 text-amber-500" />
                  Фильтрлөө
                </button>
              </div>
            </div>

            {/* Applications Table */}
            <div className="bg-slate-900/30 border border-slate-900 rounded-3xl overflow-hidden shadow-lg">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-950/60 border-b border-slate-900 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                      <th className="py-4.5 px-6">Студент</th>
                      <th className="py-4.5 px-6">Имарат</th>
                      <th className="py-4.5 px-6">Дата</th>
                      <th className="py-4.5 px-6">Статус</th>
                      <th className="py-4.5 px-6 text-right">Чечим</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-900/80 text-sm">
                    {applications.map(app => (
                      <tr key={app.id} className="hover:bg-slate-900/10 transition-colors">
                        <td className="py-4 px-6">
                          <div className="font-bold">{app.student}</div>
                          <div className="text-xs text-slate-500">{app.email}</div>
                        </td>
                        <td className="py-4 px-6 font-semibold text-slate-300">{app.dorm}</td>
                        <td className="py-4 px-6 text-slate-450">{app.date}</td>
                        <td className="py-4 px-6">
                          {app.status === 'pending' && (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-bold rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-500">
                              Каралууда
                            </span>
                          )}
                          {app.status === 'approved' && (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-bold rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-450">
                              Кабыл алынды
                            </span>
                          )}
                          {app.status === 'rejected' && (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-bold rounded-full bg-red-500/10 border border-red-500/20 text-red-400">
                              Четке кагылды
                            </span>
                          )}
                        </td>
                        <td className="py-4 px-6 text-right">
                          {app.status === 'pending' ? (
                            <div className="flex justify-end gap-2">
                              <button 
                                onClick={() => updateAppStatus(app.id, 'approved')}
                                className="p-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20 text-emerald-450 transition-colors"
                                title="Жакшыктоо"
                              >
                                <CheckCircle className="w-4 h-4" />
                              </button>
                              <button 
                                onClick={() => updateAppStatus(app.id, 'rejected')}
                                className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 transition-colors"
                                title="Четке кагуу"
                              >
                                <XCircle className="w-4 h-4" />
                              </button>
                            </div>
                          ) : (
                            <span className="text-xs text-slate-500 font-semibold italic">Чечим чыгарылган</span>
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
            {/* Header / Search */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <h3 className="text-xl font-bold">ОшМУ житаканаларынын базасы</h3>
              <button className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-bold rounded-xl shadow-lg transition-all duration-300">
                <Plus className="w-4 h-4" />
                Жаңы жатакана кошуу
              </button>
            </div>

            {/* Dormitories Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {dormitories.map(dorm => {
                const percentage = Math.round((dorm.occupied / dorm.beds) * 100)
                return (
                  <div key={dorm.id} className="p-6 rounded-3xl bg-slate-900/30 border border-slate-900 flex flex-col justify-between space-y-6">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className={`px-2.5 py-1 text-2xs font-extrabold rounded-full ${dorm.status === 'Активдүү' ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-450' : 'bg-red-500/10 border border-red-500/20 text-red-400'}`}>
                          {dorm.status}
                        </span>
                        <span className="text-xs text-slate-500 font-semibold">{dorm.rooms} бөлмө</span>
                      </div>
                      
                      <h4 className="text-lg font-bold">{dorm.name}</h4>
                      <p className="text-xs text-slate-400">{dorm.address}</p>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-xs font-semibold">
                        <span className="text-slate-400">Орундардын саны</span>
                        <span>{dorm.occupied}/{dorm.beds} ({percentage}%)</span>
                      </div>
                      <div className="h-2 w-full bg-slate-950 rounded-full overflow-hidden border border-slate-900">
                        <div 
                          className="h-full bg-gradient-to-r from-amber-500 to-amber-600 rounded-full" 
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
          <div className="p-12 rounded-3xl bg-slate-900/20 border border-slate-900 text-center space-y-4 animate-fadeIn">
            <Users className="w-12 h-12 text-amber-500 mx-auto opacity-70" />
            <h3 className="text-xl font-bold">Колдонуучуларды башкаруу</h3>
            <p className="text-sm text-slate-400 max-w-md mx-auto leading-relaxed">
              Бул бөлүмдө сиз коменданттарды дайындап, студенттердин профилдерин өзгөртө аласыз. Маалыматтар базасы Supabase менен синхрондуу иштейт.
            </p>
            <button className="px-5 py-2.5 bg-slate-900 hover:bg-slate-850 border border-slate-850 text-xs font-bold rounded-xl transition-all">
              Кызматкерлердин тизмеси
            </button>
          </div>
        )}
      </main>
    </div>
  )
}
