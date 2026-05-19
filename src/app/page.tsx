import Link from 'next/link'
import { Shield, ArrowRight, CheckCircle2, MapPin, Users, Zap, HelpCircle, FileText, Landmark } from 'lucide-react'

export default function Home() {
  const stats = [
    { value: '5+', label: 'Заманбап жатакана' },
    { value: '2500+', label: 'Студенттик орун' },
    { value: '100%', label: 'Санариптештирүү' },
    { value: '5 мүн', label: 'Каттоо убактысы' },
  ]

  const dormitories = [
    {
      id: 1,
      name: '№1 Жатакана (Башкы корпус)',
      address: 'Ленин көчөсү, 331',
      capacity: '450 орун',
      gender: 'Кыздар үчүн',
      features: ['Акысыз Wi-Fi', 'Окуу залы', 'Кир жуучу бөлмө'],
    },
    {
      id: 2,
      name: '№2 Жатакана (Эл аралык медициналык)',
      address: 'Исанов көчөсү, 73',
      capacity: '600 орун',
      gender: 'Эл аралык студенттер үчүн',
      features: ['Спорт зал', 'Ашкана', 'Коопсуздук 24/7'],
    },
    {
      id: 3,
      name: '№3 Жатакана (Жаңы конуш)',
      address: 'Г. Айтиев көчөсү, 12',
      capacity: '800 орун',
      gender: 'Аралаш типтеги',
      features: ['Заманбап коворкинг', 'Парк аймагы', 'Ашкана'],
    },
  ]

  const features = [
    {
      icon: Zap,
      title: 'Ыкчам онлайн каттоо',
      description: 'Жатаканага жайгашуу үчүн арызды үйдөн чыкпай эле 5 мүнөттүн ичинде тапшырыңыз.',
    },
    {
      icon: Users,
      title: 'Интерактивдүү орун тандоо',
      description: 'Комнаталардын жайгашуусун көрүп, кошуналарыңызды жана бош орундарды тандаңыз.',
    },
    {
      icon: Landmark,
      title: 'Ачык-айкын төлөмдөр',
      description: 'Төлөмдөрдүн статусун көзөмөлдөп, дүмүрчөктөрдү тиркеме аркылуу жүктөңүз.',
    },
    {
      icon: HelpCircle,
      title: 'Санариптик Help Desk',
      description: 'Бөлмөдөгү мүчүлүштүктөр же оңдоо иштери боюнча комендантка тез арада арыз жөнөтүңүз.',
    },
  ]

  return (
    <div className="relative min-h-screen bg-slate-950 text-white font-sans overflow-x-hidden selection:bg-amber-500 selection:text-slate-950">
      {/* Background Decorative Gradients */}
      <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[50%] rounded-full bg-slate-900 blur-[180px] opacity-75 pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[50%] rounded-full bg-amber-950/20 blur-[180px] opacity-60 pointer-events-none" />

      {/* Sticky Header */}
      <header className="sticky top-0 z-50 bg-slate-950/70 backdrop-blur-xl border-b border-slate-900/80 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-gradient-to-br from-slate-900 to-slate-800 border border-slate-800 shadow-md">
              <Shield className="w-6 h-6 text-amber-500" />
            </div>
            <span className="text-xl font-black tracking-tight bg-gradient-to-r from-white to-slate-200 bg-clip-text text-transparent">
              ОшМУ <span className="text-amber-500">Жатакана</span>
            </span>
          </div>

          <Link
            href="/login"
            className="flex items-center gap-2 px-5 py-2.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-sm font-semibold rounded-xl transition-all duration-300 hover:border-amber-500/30"
          >
            Системага кирүү
            <ArrowRight className="w-4 h-4 text-amber-500" />
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative px-6 pt-20 pb-24 md:pt-28 md:pb-32 max-w-7xl mx-auto text-center z-10">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-500 text-xs font-bold uppercase tracking-wider mb-6 animate-pulse">
          <CheckCircle2 className="w-4 h-4" />
          Жаңы Санарип Платформа
        </div>

        <h1 className="text-4xl md:text-6xl font-black tracking-tight leading-[1.15] max-w-4xl mx-auto">
          ОшМУ студенттик жатаканаларынын <br />
          <span className="bg-gradient-to-r from-amber-400 via-amber-500 to-yellow-500 bg-clip-text text-transparent drop-shadow-sm">
            Бирдиктүү Санариптик Системасы
          </span>
        </h1>

        <p className="mt-6 text-base md:text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
          Заманбап, коопсуз жана ачык-айкын турак-жай тутуму. Жатаканага катталуу, комната тандоо жана арыз жазуу иштерин толугу менен санариптик форматта жүргүзүңүз.
        </p>

        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/login"
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-bold rounded-2xl shadow-xl shadow-amber-500/5 transition-all duration-300 transform hover:scale-[1.02]"
          >
            Каттоодон өтүү
            <ArrowRight className="w-5 h-5" />
          </Link>
          <a
            href="#dormitories"
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 bg-slate-900/80 hover:bg-slate-800/80 border border-slate-800 hover:border-slate-700 text-sm font-semibold rounded-2xl transition-all duration-300"
          >
            Жатаканалар каталогу
          </a>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl mx-auto mt-20 p-8 rounded-3xl bg-slate-900/40 backdrop-blur-md border border-slate-900/80">
          {stats.map((stat, idx) => (
            <div key={idx} className="text-center space-y-1">
              <div className="text-3xl md:text-4xl font-extrabold text-amber-500">{stat.value}</div>
              <div className="text-xs md:text-sm text-slate-400 font-medium">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features Grid */}
      <section className="relative px-6 py-20 bg-slate-950 z-10 border-t border-slate-900">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center space-y-3">
            <h2 className="text-3xl font-extrabold tracking-tight">Эмне үчүн биздин платформа?</h2>
            <p className="text-slate-400 max-w-xl mx-auto text-sm">
              Студенттердин жана коменданттардын ыңгайлуулугу үчүн иштелип чыккан эң заманбап функциялар
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, idx) => (
              <div
                key={idx}
                className="group p-6 rounded-2xl bg-slate-900/30 border border-slate-900 hover:border-slate-800/80 transition-all duration-300 hover:bg-slate-900/50"
              >
                <div className="inline-flex p-3 rounded-xl bg-slate-950 border border-slate-800 text-amber-500 group-hover:text-amber-400 group-hover:border-amber-500/20 transition-all duration-300 mb-4 shadow-inner">
                  <feature.icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{feature.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Dormitories List */}
      <section id="dormitories" className="relative px-6 py-20 bg-slate-950 z-10 border-t border-slate-900">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center space-y-3">
            <h2 className="text-3xl font-extrabold tracking-tight">Жатаканалардын тизмеси</h2>
            <p className="text-slate-400 max-w-xl mx-auto text-sm">
              ОшМУнун учурдагы активдүү жатаканалары жана алардын кыскача маалыматы
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {dormitories.map((dorm) => (
              <div
                key={dorm.id}
                className="flex flex-col justify-between p-8 rounded-3xl bg-slate-900/30 border border-slate-900 hover:border-slate-800 transition-all duration-300 hover:shadow-xl hover:shadow-amber-500/[0.01]"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-500 text-xs font-bold uppercase tracking-wider">
                      {dorm.gender}
                    </span>
                    <span className="text-xs text-slate-500 font-semibold">{dorm.capacity}</span>
                  </div>

                  <h3 className="text-xl font-bold">{dorm.name}</h3>

                  <div className="flex items-center gap-1.5 text-xs text-slate-400">
                    <MapPin className="w-4 h-4 text-amber-500 shrink-0" />
                    <span>{dorm.address}</span>
                  </div>

                  <div className="h-px bg-slate-900/80 my-4" />

                  <div className="space-y-2">
                    <div className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Шарттары:</div>
                    <ul className="grid grid-cols-2 gap-2 text-xs text-slate-300">
                      {dorm.features.map((feat, i) => (
                        <li key={i} className="flex items-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                          <span className="truncate">{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="mt-8">
                  <Link
                    href="/login"
                    className="w-full flex items-center justify-center gap-2 py-3 bg-slate-950 hover:bg-slate-900 border border-slate-800 hover:border-amber-500/30 text-xs font-bold rounded-xl transition-all duration-300"
                  >
                    Арыз берүү
                    <ArrowRight className="w-3.5 h-3.5 text-amber-500" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative px-6 py-12 bg-slate-950 z-10 border-t border-slate-900/80">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-sm text-slate-500">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-amber-500" />
            <span className="font-bold text-white">ОшМУ Жатакана</span>
          </div>
          <p>© {new Date().getFullYear()} Ош мамлекеттик университети. Бардык укуктар корголгон.</p>
          <div className="flex items-center gap-6">
            <a href="https://oshsu.kg" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">ОшМУ расмий сайты</a>
          </div>
        </div>
      </footer>
    </div>
  )
}
