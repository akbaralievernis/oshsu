'use client'

import Link from 'next/link'
import { useLanguageAndTheme } from './LanguageAndThemeContext'
import { dictionaries } from '@/utils/dictionaries'
import { 
  Shield, ArrowRight, CheckCircle2, MapPin, Users, Zap, HelpCircle, 
  Landmark, Sun, Moon, Globe, Calculator, Phone, Mail, ChevronDown, 
  ChevronUp, Sparkles, Send, Clock, Printer, FileText, BadgeCheck
} from 'lucide-react'
import { useState } from 'react'

export default function Home() {
  const { language, setLanguage, theme, toggleTheme } = useLanguageAndTheme()
  const d = dictionaries[language]
  const [langMenuOpen, setLangMenuOpen] = useState(false)
  const [calcMonths, setCalcMonths] = useState(10)
  const [openFaq, setOpenFaq] = useState<number | null>(null)
  const [contactName, setContactName] = useState('')
  const [contactText, setContactText] = useState('')
  const [contactSuccess, setContactSuccess] = useState(false)
  const [submittingContact, setSubmittingContact] = useState(false)

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
    <div className="relative min-h-screen transition-colors duration-300 dark:bg-slate-950 bg-slate-50 dark:text-white text-slate-900 font-sans overflow-x-hidden selection:bg-rose-500 selection:text-white">
      {/* Background Decorative Gradients */}
      <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[50%] rounded-full dark:bg-slate-900/40 bg-rose-100/50 blur-[180px] opacity-75 pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[50%] rounded-full dark:bg-violet-950/20 bg-violet-100/40 blur-[180px] opacity-60 pointer-events-none" />

      {/* Sticky Header */}
      <header className="sticky top-0 z-50 transition-colors duration-300 dark:bg-slate-950/70 bg-white/70 backdrop-blur-xl border-b dark:border-slate-900/80 border-slate-200 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-gradient-to-br dark:from-slate-900 dark:to-slate-800 from-slate-100 to-slate-50 border dark:border-slate-800 border-slate-200 shadow-md">
              <Shield className="w-6 h-6 text-rose-500" />
            </div>
            <span className="text-xl font-black tracking-tight dark:bg-gradient-to-r dark:from-white dark:to-slate-200 bg-gradient-to-r from-slate-950 to-slate-855 bg-clip-text text-transparent">
              {d.oshsu} <span className="bg-gradient-to-r from-rose-500 to-violet-600 bg-clip-text text-transparent">{d.dormitorySystem}</span>
            </span>
          </div>

          {/* Quick Actions, i18n & Theme switches */}
          <div className="flex items-center gap-3">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-xl dark:bg-slate-900 bg-white border dark:border-slate-800 border-slate-200 hover:border-rose-500/30 transition-all shadow-sm cursor-pointer"
              title="Темный / Светлый режим"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-500 animate-pulse" /> : <Moon className="w-4 h-4 text-slate-700" />}
            </button>

            {/* Language Switcher Dropdown */}
            <div className="relative">
              <button
                onClick={() => setLangMenuOpen(!langMenuOpen)}
                className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl dark:bg-slate-900 bg-white border dark:border-slate-800 border-slate-200 hover:border-rose-500/30 transition-all text-xs font-bold shadow-sm cursor-pointer"
              >
                <Globe className="w-4 h-4 text-rose-500" />
                <span className="uppercase">{language}</span>
              </button>

              {langMenuOpen && (
                <div className="absolute right-0 mt-2 w-32 rounded-2xl dark:bg-slate-900 bg-white border dark:border-slate-800 border-slate-200 shadow-xl overflow-hidden animate-fadeIn z-50">
                  <button
                    onClick={() => { setLanguage('kg'); setLangMenuOpen(false); }}
                    className={`w-full px-4 py-3 text-left text-xs font-bold hover:bg-rose-500/10 transition-colors cursor-pointer ${language === 'kg' ? 'text-rose-500' : ''}`}
                  >
                    Кыргызча (KG)
                  </button>
                  <button
                    onClick={() => { setLanguage('ru'); setLangMenuOpen(false); }}
                    className={`w-full px-4 py-3 text-left text-xs font-bold hover:bg-rose-500/10 transition-colors cursor-pointer ${language === 'ru' ? 'text-rose-500' : ''}`}
                  >
                    Русский (RU)
                  </button>
                  <button
                    onClick={() => { setLanguage('en'); setLangMenuOpen(false); }}
                    className={`w-full px-4 py-3 text-left text-xs font-bold hover:bg-rose-500/10 transition-colors cursor-pointer ${language === 'en' ? 'text-rose-500' : ''}`}
                  >
                    English (EN)
                  </button>
                </div>
              )}
            </div>

            <Link
              href="/login"
              className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-rose-500 to-violet-600 hover:brightness-110 text-white text-sm font-bold rounded-xl transition-all duration-300 shadow-lg shadow-rose-550/10"
            >
              {d.login}
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative px-6 pt-20 pb-24 md:pt-28 md:pb-32 max-w-7xl mx-auto text-center z-10 animate-fadeIn">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-500 dark:text-rose-400 text-xs font-bold uppercase tracking-wider mb-6">
          <CheckCircle2 className="w-4 h-4" />
          {d.newDigitalPlatform}
        </div>

        <h1 className="text-4xl md:text-6xl font-black tracking-tight leading-[1.15] max-w-4xl mx-auto">
          {d.landingTitle} <br />
          <span className="bg-gradient-to-r from-rose-500 via-pink-500 to-violet-600 bg-clip-text text-transparent drop-shadow-sm">
            {d.landingTitleSub}
          </span>
        </h1>

        <p className="mt-6 text-base md:text-lg dark:text-slate-400 text-slate-655 max-w-2xl mx-auto leading-relaxed">
          {d.landingHeroDesc}
        </p>

        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/login"
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-rose-500 to-violet-650 hover:brightness-110 text-white font-bold rounded-2xl shadow-xl shadow-rose-500/10 transition-all duration-300 transform hover:scale-[1.02]"
          >
            {d.registerNowBtn}
            <ArrowRight className="w-5 h-5" />
          </Link>
          <a
            href="#dormitories"
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 dark:bg-slate-900/80 bg-white hover:bg-slate-100 border dark:border-slate-800 border-slate-200 hover:border-slate-350 text-sm font-semibold rounded-2xl transition-all duration-300 shadow-sm"
          >
            {d.dormCatalogBtn}
          </a>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl mx-auto mt-20 p-8 rounded-3xl dark:bg-slate-900/40 bg-white border dark:border-slate-900 border-slate-200 shadow-xl">
          {stats.map((stat, idx) => (
            <div key={idx} className="text-center space-y-1">
              <div className="text-3xl md:text-4xl font-extrabold bg-gradient-to-r from-rose-500 to-violet-600 bg-clip-text text-transparent">{stat.value}</div>
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
                className="group p-6 rounded-2xl dark:bg-slate-900/30 bg-white border dark:border-slate-900 border-slate-200 hover:border-rose-500/30 transition-all duration-300 hover:shadow-lg"
              >
                <div className="inline-flex p-3 rounded-xl dark:bg-slate-950 bg-slate-100 border dark:border-slate-800 border-slate-200 text-rose-500 group-hover:border-rose-500/20 transition-all duration-300 mb-4 shadow-inner">
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
                className="flex flex-col justify-between p-8 rounded-3xl dark:bg-slate-900/30 bg-white border dark:border-slate-900 border-slate-200 hover:border-rose-500/20 hover:shadow-xl transition-all duration-300"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-500 dark:text-rose-455 text-xs font-bold uppercase tracking-wider">
                      {dorm.gender}
                    </span>
                    <span className="text-xs dark:text-slate-500 text-slate-400 font-semibold">{dorm.capacity}</span>
                  </div>

                  <h3 className="text-xl font-bold">{dorm.name}</h3>

                  <div className="flex items-center gap-1.5 text-xs dark:text-slate-400 text-slate-500">
                    <MapPin className="w-4 h-4 text-rose-500 shrink-0" />
                    <span>{dorm.address}</span>
                  </div>

                  <div className="h-px dark:bg-slate-900 bg-slate-200 my-4" />

                  <div className="space-y-2">
                    <div className="text-xs font-semibold dark:text-slate-500 text-slate-400 uppercase tracking-wide">{d.amenitiesLabel}</div>
                    <ul className="grid grid-cols-2 gap-2 text-xs dark:text-slate-300 text-slate-655">
                      {dorm.features.map((feat, i) => (
                        <li key={i} className="flex items-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                          <span className="truncate">{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 mt-8">
                  <Link
                    href={`/dormitory/${dorm.id}`}
                    className="w-full flex items-center justify-center gap-1.5 py-3 dark:bg-slate-900 bg-white hover:bg-slate-100 dark:hover:bg-slate-800 border dark:border-slate-800 border-slate-200 text-xs font-bold rounded-xl transition-all duration-300 cursor-pointer"
                  >
                    {language === 'kg' ? 'Кененирээк' : language === 'ru' ? 'Подробнее' : 'Details'}
                  </Link>

                  <Link
                    href="/login"
                    className="w-full flex items-center justify-center gap-1.5 py-3 bg-gradient-to-r from-rose-500 to-violet-650 hover:brightness-110 text-white text-xs font-bold rounded-xl transition-all duration-300 cursor-pointer shadow-md shadow-rose-500/10"
                  >
                    {d.applyDorm}
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 1. Step-by-Step Guide */}
      <section className="relative px-6 py-20 z-10 border-t dark:border-slate-900 border-slate-200 bg-slate-50/50 dark:bg-slate-900/10">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center space-y-3">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-500 text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              {language === 'kg' ? 'Оңой процесс' : language === 'ru' ? 'Простой процесс' : 'Easy Process'}
            </div>
            <h2 className="text-3xl font-extrabold tracking-tight">
              {language === 'kg' ? 'Жатаканага жайгашуу кадамдары' : language === 'ru' ? 'Как заселиться в общежитие' : 'Dormitory Assignment Steps'}
            </h2>
            <p className="dark:text-slate-400 text-slate-500 max-w-xl mx-auto text-sm">
              {language === 'kg' ? 'Студент үчүн каттоодон өтүү жана бөлмө алуу толугу менен санариптештирилген' : language === 'ru' ? 'Процесс регистрации и получения комнаты полностью оцифрован' : 'The process of registration and room key assignment is 100% digital'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative">
            {[
              {
                num: '01',
                icon: FileText,
                title: language === 'kg' ? 'Катталуу жана арыз толтуруу' : language === 'ru' ? 'Онлайн-регистрация' : 'Online Registration',
                desc: language === 'kg' ? 'Анкетаны толтуруп, керектүү документтерди санариптик түрдө жүктөйсүз.' : language === 'ru' ? 'Заполните анкету и прикрепите фото и справки в личном кабинете.' : 'Fill out the form and upload your photos and files instantly.'
              },
              {
                num: '02',
                icon: Sparkles,
                title: language === 'kg' ? 'ИИ аркылуу чекти сканерлөө' : language === 'ru' ? 'ИИ-проверка оплаты' : 'AI Payment Scanner',
                desc: language === 'kg' ? 'МБанк же Элкарт чегин жүктөйсүз, биздин ИИ аны дароо таап, тастыктайт.' : language === 'ru' ? 'Загрузите чек MBank/Элкарт. Наш ИИ мгновенно проверит реквизиты.' : 'Upload your MBank receipt. Our AI scanner instantly verifies it.'
              },
              {
                num: '03',
                icon: Users,
                title: language === 'kg' ? 'Бөлмө алуу' : language === 'ru' ? 'Получение комнаты' : 'Room Assignment',
                desc: language === 'kg' ? 'Комендант бош орундарды карап, сизге интерактивдүү бөлмө дайындайт.' : language === 'ru' ? 'Комендант рассмотрит заявку и выделит удобное место на схеме.' : 'The commandant reviews vacancy and assigns a cozy bed on the layout.'
              },
              {
                num: '04',
                icon: Printer,
                title: language === 'kg' ? 'Келишимди жүктөө' : language === 'ru' ? 'Печать договора' : 'Print Agreement',
                desc: language === 'kg' ? 'Эки тараптуу расмий келишимди басып чыгарып, бөлмө ачкычын аласыз.' : language === 'ru' ? 'Скачайте готовый юридический договор в PDF и заберите ключи.' : 'Download your legal PDF contract in one click and get your keys.'
              }
            ].map((step, idx) => (
              <div key={idx} className="group relative p-6 rounded-2xl dark:bg-slate-900 bg-white border dark:border-slate-800 border-slate-200 hover:border-rose-500/30 transition-all duration-300 shadow-sm flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-bold text-rose-500/40 group-hover:text-rose-500/70 transition-colors tracking-widest uppercase">{language === 'kg' ? 'Кадам' : language === 'ru' ? 'Шаг' : 'Step'} {step.num}</span>
                    <div className="p-2 rounded-xl dark:bg-slate-950 bg-slate-100 dark:text-slate-400 text-slate-500 group-hover:text-rose-500 transition-colors shadow-inner">
                      <step.icon className="w-5 h-5" />
                    </div>
                  </div>
                  <h3 className="text-base font-bold mb-2 group-hover:text-rose-500 transition-colors">{step.title}</h3>
                  <p className="text-xs dark:text-slate-400 text-slate-500 leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 2. Interactive Calculator */}
      <section className="relative px-6 py-20 z-10 border-t dark:border-slate-900 border-slate-200">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center space-y-3">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-500 text-xs font-bold uppercase tracking-wider">
              <Calculator className="w-3.5 h-3.5" />
              {language === 'kg' ? 'Пайдалуу эсептөө' : language === 'ru' ? 'Выгодный расчет' : 'Savings Calculator'}
            </div>
            <h2 className="text-3xl font-extrabold tracking-tight">
              {language === 'kg' ? 'Ижара акысын салыштыруу' : language === 'ru' ? 'Калькулятор экономии студента' : 'Housing Cost Comparison'}
            </h2>
            <p className="dark:text-slate-400 text-slate-500 max-w-xl mx-auto text-sm">
              {language === 'kg' ? 'Батир жалдаганга караганда ОшМУ жатаканасында жашап канча каражат үнөмдөйсүз?' : language === 'ru' ? 'Узнайте, сколько вы сэкономите, выбрав общежитие ОшГУ вместо аренды квартиры в Оше' : 'Calculate how much money you save by choosing OshSU dorm over renting a flat in Osh'}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center max-w-5xl mx-auto dark:bg-slate-900/30 bg-white border dark:border-slate-900 border-slate-200 p-8 rounded-3xl shadow-xl">
            <div className="lg:col-span-7 space-y-6">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm font-semibold">
                  <span>{language === 'kg' ? 'Проживание убактысы (ай):' : language === 'ru' ? 'Срок проживания (месяцев):' : 'Duration of stay (months):'}</span>
                  <span className="text-rose-500 text-lg font-bold">{calcMonths} {language === 'kg' ? 'ай' : language === 'ru' ? 'мес' : 'mos'}</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="12"
                  value={calcMonths}
                  onChange={(e) => setCalcMonths(parseInt(e.target.value))}
                  className="w-full h-2 rounded-lg appearance-none cursor-pointer bg-slate-200 dark:bg-slate-800 accent-rose-500"
                />
                <div className="flex justify-between text-xs dark:text-slate-500 text-slate-400 font-bold">
                  <span>1 {language === 'kg' ? 'ай' : language === 'ru' ? 'мес' : 'mo'}</span>
                  <span>6 {language === 'kg' ? 'ай' : language === 'ru' ? 'мес' : 'mos'}</span>
                  <span>10 {language === 'kg' ? 'ай (окуу жылы)' : language === 'ru' ? 'мес (учебный год)' : 'mos (academic year)'}</span>
                  <span>12 {language === 'kg' ? 'ай' : language === 'ru' ? 'мес' : 'mos'}</span>
                </div>
              </div>

              <div className="space-y-4 pt-2">
                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-bold uppercase tracking-wider">
                    <span>🏢 {language === 'kg' ? 'ОшМУ Жатаканасы' : language === 'ru' ? 'Общежитие ОшГУ' : 'OshSU Dormitory'}</span>
                    <span className="dark:text-emerald-400 text-emerald-600 font-extrabold">{calcMonths * 1200} KGS</span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-950 rounded-full h-3.5 overflow-hidden border dark:border-slate-800 border-slate-200">
                    <div
                      className="bg-emerald-500 h-full rounded-full transition-all duration-300"
                      style={{ width: `${Math.min(100, ((calcMonths * 1200) / (12 * 15000)) * 100)}%` }}
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-bold uppercase tracking-wider">
                    <span>🏠 {language === 'kg' ? 'Ош шаарында батир ижарасы' : language === 'ru' ? 'Аренда квартиры в г. Ош' : 'Flat Rent in Osh'}</span>
                    <span className="text-rose-500 font-extrabold">{calcMonths * 15000} KGS</span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-950 rounded-full h-3.5 overflow-hidden border dark:border-slate-800 border-slate-200">
                    <div
                      className="bg-rose-500 h-full rounded-full transition-all duration-300"
                      style={{ width: `${Math.min(100, ((calcMonths * 15000) / (12 * 15000)) * 100)}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 flex flex-col items-center justify-center p-6 rounded-2xl bg-gradient-to-br dark:from-slate-900 dark:to-slate-950 from-slate-100 to-slate-50 border dark:border-slate-800 border-slate-200 shadow-inner text-center space-y-4 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 dark:bg-rose-500/5 bg-rose-500/10 rounded-full blur-2xl pointer-events-none" />
              <div className="p-3 rounded-full bg-rose-500/10 text-rose-500">
                <Sparkles className="w-8 h-8 animate-bounce" />
              </div>
              <div className="space-y-1">
                <span className="text-xs uppercase font-extrabold tracking-widest text-slate-500">{language === 'kg' ? 'Сиздин үнөмдөөңүз' : language === 'ru' ? 'Ваша экономия' : 'Your Net Savings'}</span>
                <div className="text-3xl md:text-4xl font-black bg-gradient-to-r from-rose-500 to-violet-650 bg-clip-text text-transparent">
                  {calcMonths * 13800} KGS
                </div>
              </div>
              <p className="text-xs dark:text-slate-400 text-slate-500 max-w-[240px]">
                {language === 'kg' 
                  ? 'Үнөмдөлгөн каражатты китептерге, тил курстарына же жеке өнүгүүңүзгө жумшасаңыз болот!' 
                  : language === 'ru' 
                  ? 'Сэкономленные средства можно потратить на обучение, книги, языковые курсы или развитие!'
                  : 'You can spend the saved money on extra courses, quality books, or personal development!'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. FAQ Accordion */}
      <section className="relative px-6 py-20 z-10 border-t dark:border-slate-900 border-slate-200 bg-slate-50/50 dark:bg-slate-900/10">
        <div className="max-w-4xl mx-auto space-y-12">
          <div className="text-center space-y-3">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-500 text-xs font-bold uppercase tracking-wider">
              <HelpCircle className="w-3.5 h-3.5" />
              FAQ
            </div>
            <h2 className="text-3xl font-extrabold tracking-tight">
              {language === 'kg' ? 'Көп берилүүчү суроолор' : language === 'ru' ? 'Вопросы и ответы' : 'Frequently Asked Questions'}
            </h2>
            <p className="dark:text-slate-400 text-slate-500 max-w-xl mx-auto text-sm">
              {language === 'kg' ? 'Жатакана тууралуу эң негизги суроолорго тез жана так жооп алыңыз' : language === 'ru' ? 'Быстрые ответы на самые частые вопросы студентов об условиях и правилах' : 'Quick answers to the most common questions about accommodation rules'}
            </p>
          </div>

          <div className="space-y-4">
            {[
              {
                q: {
                  kg: 'Жатаканага жайгашуу үчүн кандай документтер талап кылынат?',
                  ru: 'Какие документы нужны для заселения в общежитие?',
                  en: 'What documents are required for dormitory registration?'
                },
                a: {
                  kg: 'Сизге паспорттун көчүрмөсү, флюорографиянын справкасы, 3х4 форматтагы 2 сүрөт жана ижара акысынын төлөнгөн дүмүрчөгү керек. Документтерди жеке кабинет аркылуу онлайн жүктөйсүз.',
                  ru: 'Вам понадобятся: копия паспорта, справка о флюорографии, 2 фотографии формата 3x4 и чек об оплате проживания. Все эти документы загружаются онлайн через личный кабинет.',
                  en: 'You will need: passport copy, fluorography certificate, 2 photos of size 3x4, and the housing deposit receipt. All files are uploaded digitally via your personal student account.'
                }
              },
              {
                q: {
                  kg: 'Ижара акысын бөлүп төлөсө болобу?',
                  ru: 'Можно ли оплачивать проживание частями?',
                  en: 'Is it possible to pay the rent in installments?'
                },
                a: {
                  kg: 'Ооба, төлөмдү эки семестрге бөлүп төлөөгө уруксат берилет. Төлөгөндөн кийин чек дароо жеке кабинетте биздин ИИ сканери аркылуу текшерилет.',
                  ru: 'Да, оплату за проживание можно разделить на два семестра. После совершения платежа просто загрузите чек в кабинет, и ИИ-сканер моментально его проверит.',
                  en: 'Yes, housing payments can be divided into two semesters. Once the payment is done, upload the receipt into your cabinet, and our AI scanner will verify it instantly.'
                }
              },
              {
                q: {
                  kg: 'Жатакананын кирүү-чыгуу убактысы кандай эрежеге баш ийет?',
                  ru: 'Какой режим работы общежития (время закрытия)?',
                  en: 'What are the dormitory opening and closing hours?'
                },
                a: {
                  kg: 'Студенттердин коопсуздугу үчүн жатакана имараттары күн сайын саат 06:00дөн 22:00гө чейин ачык болот. Ишемби жана жекшемби күндөрү дагы ушул тартип колдонулат.',
                  ru: 'В целях обеспечения безопасности студентов общежития открыты ежедневно с 06:00 до 22:00. Этот регламент действует как в будни, так и в выходные дни.',
                  en: 'For safety reasons, dormitory gates remain open daily from 06:00 to 22:00. This rule applies equally to both weekdays and weekends.'
                }
              },
              {
                q: {
                  kg: 'Бөлмөдө кандайдыр бир мүчүлүштүк болсо кимге кайрылам?',
                  ru: 'Что делать, если в комнате что-то сломалось?',
                  en: 'What should I do if something in my room is broken?'
                },
                a: {
                  kg: 'Жеке кабинетиңиздеги "Комендантка кайрылуу" (Help Desk) баскычы аркылуу билдирүү жөнөтүңүз. Ал дароо коменданттын башкаруу панелине түшөт жана тиешелүү оңдоо иштери аткарылат.',
                  ru: 'Отправьте заявку через цифровой Help Desk в своем личном кабинете. Жалоба моментально поступит на панель коменданта, и мастер придет для устранения поломки.',
                  en: 'Submit a ticket using the Digital Help Desk inside your student dashboard. The issue is instantly routed to the commandant, and technical staff will resolve it.'
                }
              }
            ].map((faq, idx) => {
              const isOpen = openFaq === idx
              const qText = language === 'kg' ? faq.q.kg : language === 'ru' ? faq.q.ru : faq.q.en
              const aText = language === 'kg' ? faq.a.kg : language === 'ru' ? faq.a.ru : faq.a.en
              return (
                <div
                  key={idx}
                  className="rounded-2xl dark:bg-slate-900 bg-white border dark:border-slate-800 border-slate-200 overflow-hidden transition-all duration-300"
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="w-full flex items-center justify-between p-5 text-left font-bold text-sm md:text-base cursor-pointer hover:text-rose-500 transition-colors"
                  >
                    <span>{qText}</span>
                    {isOpen ? <ChevronUp className="w-5 h-5 text-rose-500 shrink-0" /> : <ChevronDown className="w-5 h-5 dark:text-slate-500 text-slate-400 shrink-0" />}
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-5 pt-1 text-xs md:text-sm dark:text-slate-400 text-slate-500 leading-relaxed border-t dark:border-slate-800/50 border-slate-100 animate-fadeIn">
                      {aText}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* 4. Contact & Feedback Form */}
      <section className="relative px-6 py-20 z-10 border-t dark:border-slate-900 border-slate-200">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center space-y-3">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-500 text-xs font-bold uppercase tracking-wider">
              <Phone className="w-3.5 h-3.5" />
              {language === 'kg' ? 'Байланышуу' : language === 'ru' ? 'Контакты' : 'Contact Us'}
            </div>
            <h2 className="text-3xl font-extrabold tracking-tight">
              {language === 'kg' ? 'Суроолоруңуз калдыбы? Байланышыңыз' : language === 'ru' ? 'Остались вопросы? Мы на связи!' : 'Have Questions? Contact Us'}
            </h2>
            <p className="dark:text-slate-400 text-slate-500 max-w-xl mx-auto text-sm">
              {language === 'kg' ? 'Жатакана суроолору боюнча дирекция менен түз байланышуу формасы' : language === 'ru' ? 'Напишите нам напрямую, или позвоните по указанным контактам' : 'Write to our support desk or call us directly during working hours'}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch max-w-5xl mx-auto">
            <div className="lg:col-span-5 dark:bg-slate-900 bg-white border dark:border-slate-800 border-slate-200 p-8 rounded-3xl shadow-sm flex flex-col justify-between space-y-8">
              <div className="space-y-6">
                <h3 className="text-xl font-bold">{language === 'kg' ? 'Студенттик шаарчанын дирекциясы' : language === 'ru' ? 'Дирекция студенческого городка' : 'Student Housing Administration'}</h3>
                
                <div className="space-y-4">
                  <div className="flex items-start gap-3 text-xs md:text-sm">
                    <div className="p-2 rounded-xl dark:bg-slate-950 bg-slate-100 text-rose-500 shadow-inner mt-0.5">
                      <MapPin className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-bold">{language === 'kg' ? 'Дарегибиз:' : language === 'ru' ? 'Наш адрес:' : 'Our Address:'}</div>
                      <div className="dark:text-slate-400 text-slate-500">{language === 'kg' ? 'Ош шаары, Ленин көчөсү 331, Башкы корпус' : language === 'ru' ? 'г. Ош, ул. Ленина 331, Главный корпус' : 'Osh city, Lenin street 331, Main Campus'}</div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 text-xs md:text-sm">
                    <div className="p-2 rounded-xl dark:bg-slate-950 bg-slate-100 text-rose-500 shadow-inner mt-0.5">
                      <Phone className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-bold">{language === 'kg' ? 'Тел. номерибиз:' : language === 'ru' ? 'Телефоны:' : 'Helplines:'}</div>
                      <div className="dark:text-slate-400 text-slate-500">+996 (555) 12-34-56 (Колл-центр)</div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 text-xs md:text-sm">
                    <div className="p-2 rounded-xl dark:bg-slate-950 bg-slate-100 text-rose-500 shadow-inner mt-0.5">
                      <Mail className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-bold">Email:</div>
                      <div className="dark:text-slate-400 text-slate-500">dormitory@oshsu.kg</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-2xl dark:bg-slate-950 bg-slate-50 border dark:border-slate-900 border-slate-100 flex items-center gap-3 text-xs">
                <Clock className="w-5 h-5 text-rose-500 shrink-0" />
                <div>
                  <span className="font-bold block">{language === 'kg' ? 'Иштөө убактысы:' : language === 'ru' ? 'Время работы:' : 'Working Hours:'}</span>
                  <span className="dark:text-slate-400 text-slate-500">{language === 'kg' ? 'Дүйшөмбү - Жума: 09:00 - 17:00' : language === 'ru' ? 'Понедельник - Пятница: 09:00 - 17:00' : 'Monday - Friday: 09:00 - 17:00'}</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-7 dark:bg-slate-900 bg-white border dark:border-slate-800 border-slate-200 p-8 rounded-3xl shadow-sm">
              <form onSubmit={async (e) => {
                e.preventDefault()
                if (!contactName || !contactText) return
                setSubmittingContact(true)
                await new Promise((resolve) => setTimeout(resolve, 1200))
                setSubmittingContact(false)
                setContactSuccess(true)
                setContactName('')
                setContactText('')
                setTimeout(() => setContactSuccess(false), 3050)
              }} className="space-y-4">
                <h3 className="text-xl font-bold">{language === 'kg' ? 'Дирекцияга кат жазуу' : language === 'ru' ? 'Написать в дирекцию' : 'Send a Message'}</h3>
                
                {contactSuccess && (
                  <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-xs font-bold animate-fadeIn">
                    ✓ {language === 'kg' ? 'Билдирүү ийгиликтүү жөнөтүлдү! Сизге электрондук почта аркылуу жооп беришет.' : language === 'ru' ? 'Ваш вопрос доставлен! Ответ будет отправлен на вашу почту.' : 'Message delivered! Support will reach you via email.'}
                  </div>
                )}

                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase tracking-wider dark:text-slate-400 text-slate-500">{language === 'kg' ? 'Атыңыз' : language === 'ru' ? 'Ваше имя' : 'Your Name'}</label>
                  <input
                    type="text"
                    required
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    placeholder={language === 'kg' ? 'Алиева Айдай' : language === 'ru' ? 'Алиева Айдай' : 'Alieva Aiday'}
                    className="w-full px-4 py-3 rounded-xl dark:bg-slate-950 bg-slate-50 border dark:border-slate-800 border-slate-200 dark:focus:border-rose-500/50 focus:border-rose-500 focus:outline-none text-sm transition-all"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase tracking-wider dark:text-slate-400 text-slate-500">{language === 'kg' ? 'Сурооңуз' : language === 'ru' ? 'Текст обращения' : 'Your Message'}</label>
                  <textarea
                    required
                    rows={4}
                    value={contactText}
                    onChange={(e) => setContactText(e.target.value)}
                    placeholder={language === 'kg' ? 'Жатаканага каттоо мөөнөтү жөнүндө суроом бар эле...' : language === 'ru' ? 'У меня вопрос насчет сроков регистрации...' : 'I have a question regarding registration timeline...'}
                    className="w-full px-4 py-3 rounded-xl dark:bg-slate-950 bg-slate-50 border dark:border-slate-800 border-slate-200 dark:focus:border-rose-500/50 focus:border-rose-500 focus:outline-none text-sm transition-all resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submittingContact}
                  className="w-full flex items-center justify-center gap-2 py-3.5 bg-gradient-to-r from-rose-500 to-violet-650 text-white text-sm font-bold rounded-xl hover:brightness-110 disabled:brightness-90 transition-all duration-300 cursor-pointer shadow-md shadow-rose-550/10"
                >
                  {submittingContact ? (
                    <span>{language === 'kg' ? 'Жөнөтүлүүдө...' : language === 'ru' ? 'Отправка...' : 'Sending...'}</span>
                  ) : (
                    <>
                      <span>{language === 'kg' ? 'Билдирүү жөнөтүү' : language === 'ru' ? 'Отправить вопрос' : 'Send Message'}</span>
                      <Send className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative px-6 py-12 z-10 border-t dark:border-slate-900 border-slate-200 bg-white dark:bg-slate-950 transition-colors">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-sm dark:text-slate-500 text-slate-450">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-rose-500" />
            <span className="font-bold dark:text-white text-slate-900">{d.oshsu} {d.dormitorySystem}</span>
          </div>
          <p>© {new Date().getFullYear()} {d.copyright}</p>
          <div className="flex items-center gap-6">
            <a href="https://oshsu.kg" target="_blank" rel="noopener noreferrer" className="hover:text-rose-500 transition-colors">ОшМУ расмий сайты</a>
          </div>
        </div>
      </footer>
    </div>
  )
}
