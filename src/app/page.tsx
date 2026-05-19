'use client'

import Link from 'next/link'
import { useLanguageAndTheme } from './LanguageAndThemeContext'
import { dictionaries } from '@/utils/dictionaries'
import { 
  Shield, ArrowRight, CheckCircle2, MapPin, Users, Zap, HelpCircle, 
  Landmark, Sun, Moon, Globe 
} from 'lucide-react'
import { useState } from 'react'

export default function Home() {
  const { language, setLanguage, theme, toggleTheme } = useLanguageAndTheme()
  const d = dictionaries[language]
  const [langMenuOpen, setLangMenuOpen] = useState(false)

  const stats = [
    { value: '5+', label: language === 'kg' ? 'Заманбап жатакана' : language === 'ru' ? 'Современных общежитий' : 'Modern Dorms' },
    { value: '2500+', label: language === 'kg' ? 'Студенттик орун' : language === 'ru' ? 'Студенческих мест' : 'Student Beds' },
    { value: '100%', label: language === 'kg' ? 'Санариптештирүү' : language === 'ru' ? 'Цифровизация' : 'Digitalization' },
    { value: '5 мүн', label: language === 'kg' ? 'Каттоо убактысы' : language === 'ru' ? 'Время регистрации' : 'Registration Time' },
  ]

  const dormitories = [
    {
      id: 1,
      name: language === 'kg' ? '№1 Жатакана (Башкы корпус)' : language === 'ru' ? 'Общежитие №1 (Главный корпус)' : 'Dormitory №1 (Main Campus)',
      address: language === 'kg' ? 'Ленин көчөсү, 331' : language === 'ru' ? 'ул. Ленина, 331' : 'Lenin street, 331',
      capacity: language === 'kg' ? '450 орун' : language === 'ru' ? '450 мест' : '450 beds',
      gender: language === 'kg' ? 'Кыздар үчүн' : language === 'ru' ? 'Для девочек' : 'Female only',
      features: language === 'kg' ? ['Акысыз Wi-Fi', 'Окуу залы', 'Кир жуучу бөлмө'] : language === 'ru' ? ['Бесплатный Wi-Fi', 'Читальный зал', 'Прачечная'] : ['Free Wi-Fi', 'Study Room', 'Laundry Room'],
    },
    {
      id: 2,
      name: language === 'kg' ? '№2 Жатакана (Эл аралык)' : language === 'ru' ? 'Общежитие №2 (Международное)' : 'Dormitory №2 (International)',
      address: language === 'kg' ? 'Исанов көчөсү, 73' : language === 'ru' ? 'ул. Исанова, 73' : 'Isanov street, 73',
      capacity: language === 'kg' ? '600 орун' : language === 'ru' ? '600 мест' : '600 beds',
      gender: language === 'kg' ? 'Эл аралык студенттер үчүн' : language === 'ru' ? 'Для иностранных студентов' : 'International students',
      features: language === 'kg' ? ['Спорт зал', 'Ашкана', 'Коопсуздук 24/7'] : language === 'ru' ? ['Спортзал', 'Столовая', 'Безопасность 24/7'] : ['Gym', 'Cafeteria', 'Security 24/7'],
    },
    {
      id: 3,
      name: language === 'kg' ? '№3 Жатакана (Жаңы конуш)' : language === 'ru' ? 'Общежитие №3 (Новый городок)' : 'Dormitory №3 (New Town)',
      address: language === 'kg' ? 'Г. Айтиев көчөсү, 12' : language === 'ru' ? 'ул. Г. Айтиева, 12' : 'G. Aitiev street, 12',
      capacity: language === 'kg' ? '800 орун' : language === 'ru' ? '800 мест' : '800 beds',
      gender: language === 'kg' ? 'Аралаш типтеги' : language === 'ru' ? 'Смешанного типа' : 'Mixed gender',
      features: language === 'kg' ? ['Заманбап коворкинг', 'Парк аймагы', 'Ашкана'] : language === 'ru' ? ['Коворкинг', 'Парковая зона', 'Кухня'] : ['Coworking space', 'Park zone', 'Kitchen'],
    },
  ]

  const featuresList = [
    {
      icon: Zap,
      title: d.features.reg.title,
      description: d.features.reg.desc,
    },
    {
      icon: Users,
      title: d.features.map.title,
      description: d.features.map.desc,
    },
    {
      icon: Landmark,
      title: d.features.payment.title,
      description: d.features.payment.desc,
    },
    {
      icon: HelpCircle,
      title: d.features.helpdesk.title,
      description: d.features.helpdesk.desc,
    },
  ]

  return (
    <div className="relative min-h-screen transition-colors duration-300 dark:bg-slate-950 bg-slate-50 dark:text-white text-slate-900 font-sans overflow-x-hidden selection:bg-red-500 selection:text-white">
      {/* Background Decorative Gradients */}
      <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[50%] rounded-full dark:bg-slate-900 bg-red-100/50 blur-[180px] opacity-75 pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[50%] rounded-full dark:bg-red-950/20 bg-rose-100/50 blur-[180px] opacity-60 pointer-events-none" />

      {/* Sticky Header */}
      <header className="sticky top-0 z-50 transition-colors duration-300 dark:bg-slate-950/70 bg-white/70 backdrop-blur-xl border-b dark:border-slate-900/80 border-slate-200 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-gradient-to-br dark:from-slate-900 dark:to-slate-800 from-slate-100 to-slate-50 border dark:border-slate-800 border-slate-200 shadow-md">
              <Shield className="w-6 h-6 text-red-600" />
            </div>
            <span className="text-xl font-black tracking-tight dark:bg-gradient-to-r dark:from-white dark:to-slate-200 bg-gradient-to-r from-slate-950 to-slate-855 bg-clip-text text-transparent">
              {d.oshsu} <span className="text-red-600">{d.dormitorySystem}</span>
            </span>
          </div>

          {/* Quick Actions, i18n & Theme switches */}
          <div className="flex items-center gap-3">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-xl dark:bg-slate-900 bg-white border dark:border-slate-800 border-slate-200 hover:border-red-500/30 transition-all shadow-sm"
              title="Темный / Светлый режим"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-500" /> : <Moon className="w-4 h-4 text-slate-700" />}
            </button>

            {/* Language Switcher Dropdown */}
            <div className="relative">
              <button
                onClick={() => setLangMenuOpen(!langMenuOpen)}
                className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl dark:bg-slate-900 bg-white border dark:border-slate-800 border-slate-200 hover:border-red-500/30 transition-all text-xs font-bold shadow-sm"
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
                    Кыргызча (KG)
                  </button>
                  <button
                    onClick={() => { setLanguage('ru'); setLangMenuOpen(false); }}
                    className={`w-full px-4 py-3 text-left text-xs font-bold hover:bg-red-500/10 transition-colors ${language === 'ru' ? 'text-red-600' : ''}`}
                  >
                    Русский (RU)
                  </button>
                  <button
                    onClick={() => { setLanguage('en'); setLangMenuOpen(false); }}
                    className={`w-full px-4 py-3 text-left text-xs font-bold hover:bg-red-500/10 transition-colors ${language === 'en' ? 'text-red-600' : ''}`}
                  >
                    English (EN)
                  </button>
                </div>
              )}
            </div>

            <Link
              href="/login"
              className="flex items-center gap-2 px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white text-sm font-bold rounded-xl transition-all duration-300 shadow-lg shadow-red-655/10"
            >
              {d.login}
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative px-6 pt-20 pb-24 md:pt-28 md:pb-32 max-w-7xl mx-auto text-center z-10">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-550/10 border border-red-500/20 text-red-600 dark:text-red-400 text-xs font-bold uppercase tracking-wider mb-6 animate-pulse">
          <CheckCircle2 className="w-4 h-4" />
          {d.newDigitalPlatform}
        </div>

        <h1 className="text-4xl md:text-6xl font-black tracking-tight leading-[1.15] max-w-4xl mx-auto">
          {d.landingTitle} <br />
          <span className="bg-gradient-to-r from-red-500 via-rose-600 to-red-700 bg-clip-text text-transparent drop-shadow-sm">
            {d.landingTitleSub}
          </span>
        </h1>

        <p className="mt-6 text-base md:text-lg dark:text-slate-400 text-slate-600 max-w-2xl mx-auto leading-relaxed">
          {d.landingHeroDesc}
        </p>

        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/login"
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-red-600 to-rose-700 hover:from-red-750 hover:to-rose-800 text-white font-bold rounded-2xl shadow-xl shadow-red-500/10 transition-all duration-300 transform hover:scale-[1.02]"
          >
            {d.registerNowBtn}
            <ArrowRight className="w-5 h-5" />
          </Link>
          <a
            href="#dormitories"
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 dark:bg-slate-900/80 bg-white hover:bg-slate-100 border dark:border-slate-800 border-slate-200 hover:border-slate-300 text-sm font-semibold rounded-2xl transition-all duration-300 shadow-sm"
          >
            {d.dormCatalogBtn}
          </a>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl mx-auto mt-20 p-8 rounded-3xl dark:bg-slate-900/40 bg-white/70 backdrop-blur-md border dark:border-slate-900 border-slate-200 shadow-xl">
          {stats.map((stat, idx) => (
            <div key={idx} className="text-center space-y-1">
              <div className="text-3xl md:text-4xl font-extrabold text-red-600">{stat.value}</div>
              <div className="text-xs md:text-sm dark:text-slate-400 text-slate-500 font-semibold uppercase tracking-wider">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features Grid */}
      <section className="relative px-6 py-20 z-10 border-t dark:border-slate-900 border-slate-200">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center space-y-3">
            <h2 className="text-3xl font-extrabold tracking-tight">{d.whyPlatform}</h2>
            <p className="dark:text-slate-400 text-slate-500 max-w-xl mx-auto text-sm">
              {d.platformDesc}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuresList.map((feature, idx) => (
              <div
                key={idx}
                className="group p-6 rounded-2xl dark:bg-slate-900/30 bg-white border dark:border-slate-900 border-slate-200 hover:border-red-500/30 transition-all duration-300 hover:shadow-lg"
              >
                <div className="inline-flex p-3 rounded-xl dark:bg-slate-950 bg-slate-100 border dark:border-slate-800 border-slate-200 text-red-600 group-hover:border-red-500/20 transition-all duration-300 mb-4 shadow-inner">
                  <feature.icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold mb-2">{feature.title}</h3>
                <p className="text-xs dark:text-slate-400 text-slate-500 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Dormitories List */}
      <section id="dormitories" className="relative px-6 py-20 z-10 border-t dark:border-slate-900 border-slate-200">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center space-y-3">
            <h2 className="text-3xl font-extrabold tracking-tight">{d.dormListTitle}</h2>
            <p className="dark:text-slate-400 text-slate-500 max-w-xl mx-auto text-sm">
              {d.dormListSub}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {dormitories.map((dorm) => (
              <div
                key={dorm.id}
                className="flex flex-col justify-between p-8 rounded-3xl dark:bg-slate-900/30 bg-white border dark:border-slate-900 border-slate-200 hover:border-red-500/20 hover:shadow-xl transition-all duration-300"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-xs font-bold uppercase tracking-wider">
                      {dorm.gender}
                    </span>
                    <span className="text-xs dark:text-slate-500 text-slate-400 font-semibold">{dorm.capacity}</span>
                  </div>

                  <h3 className="text-xl font-bold">{dorm.name}</h3>

                  <div className="flex items-center gap-1.5 text-xs dark:text-slate-400 text-slate-500">
                    <MapPin className="w-4 h-4 text-red-600 shrink-0" />
                    <span>{dorm.address}</span>
                  </div>

                  <div className="h-px dark:bg-slate-900 bg-slate-200 my-4" />

                  <div className="space-y-2">
                    <div className="text-xs font-semibold dark:text-slate-500 text-slate-400 uppercase tracking-wide">{d.amenitiesLabel}</div>
                    <ul className="grid grid-cols-2 gap-2 text-xs dark:text-slate-300 text-slate-655">
                      {dorm.features.map((feat, i) => (
                        <li key={i} className="flex items-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-red-600 shrink-0" />
                          <span className="truncate">{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="mt-8">
                  <Link
                    href="/login"
                    className="w-full flex items-center justify-center gap-2 py-3 dark:bg-slate-950 bg-slate-100 hover:bg-slate-200 dark:hover:bg-slate-900 border dark:border-slate-800 border-slate-200 hover:border-red-500/30 text-xs font-bold rounded-xl transition-all duration-300"
                  >
                    {d.applyDorm}
                    <ArrowRight className="w-3.5 h-3.5 text-red-600" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative px-6 py-12 z-10 border-t dark:border-slate-900 border-slate-200 bg-white dark:bg-slate-950 transition-colors">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-sm dark:text-slate-500 text-slate-400">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-red-600" />
            <span className="font-bold dark:text-white text-slate-900">{d.oshsu} {d.dormitorySystem}</span>
          </div>
          <p>© {new Date().getFullYear()} {d.copyright}</p>
          <div className="flex items-center gap-6">
            <a href="https://oshsu.kg" target="_blank" rel="noopener noreferrer" className="hover:text-red-600 transition-colors">ОшМУ расмий сайты</a>
          </div>
        </div>
      </footer>
    </div>
  )
}
