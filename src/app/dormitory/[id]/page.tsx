'use client'

import React, { useState, use } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useLanguageAndTheme } from '../../LanguageAndThemeContext'
import { dictionaries } from '@/utils/dictionaries'
import { 
  Shield, ArrowLeft, Star, MapPin, Users, Phone, Mail, Clock, 
  Sparkles, CheckCircle2, Video, Image, Box, Send, MessageSquare, 
  ChevronRight, Heart, HeartOff
} from 'lucide-react'

// Custom data for individual dormitories
const dormDetailsData = {
  '1': {
    kg: {
      tag: 'Башкы корпус',
      name: '№1 Жатакана (Башкы корпус)',
      desc: 'ОшМУнун эң байыркы жана тарыхый жатаканасы. Имарат толугу менен жаңыланып, окуу залы жана заманбап китепкана менен жабдылган. Башкы окуу имараттарына жакын жайгашкан.',
      commandantName: 'Алиева Назира Бакытовна',
      rating: '4.8',
      reviewsCount: 38,
      address: 'Ош шаары, Ленин көчөсү, 331',
      phone: '+996 (555) 11-22-33',
      capacity: '450 орун',
      roomsCount: '120 бөлмө',
      floors: '4 кабат',
      yearBuilt: '1978 (Реконструкция: 2023)',
      amenities: ['Ыкчам Wi-Fi', 'Жылуулук тутуму', 'Кир жуучу бөлмө', 'Окуу залы', 'Спорт аянтчасы', 'Коопсуздук камералары'],
    },
    ru: {
      tag: 'Главный корпус',
      name: 'Общежитие №1 (Главный корпус)',
      desc: 'Самое историческое общежитие ОшГУ. Здание полностью реконструировано, оборудовано читальным залом и современной библиотекой. Расположено в шаговой доступности от главных учебных корпусов.',
      commandantName: 'Алиева Назира Бакытовна',
      rating: '4.8',
      reviewsCount: 38,
      address: 'г. Ош, ул. Ленина, 331',
      phone: '+996 (555) 11-22-33',
      capacity: '450 мест',
      roomsCount: '120 комнат',
      floors: '4 этажа',
      yearBuilt: '1978 (Реконструкция: 2023)',
      amenities: ['Быстрый Wi-Fi', 'Отопление', 'Прачечная', 'Читальный зал', 'Спортплощадка', 'Камеры безопасности'],
    },
    en: {
      tag: 'Main Campus',
      name: 'Dormitory №1 (Main Campus)',
      desc: 'The most historical dormitory of OshSU. Fully reconstructed and equipped with study halls and modern library access. Situated in short walking distance from the main university campus.',
      commandantName: 'Alieva Nazira Bakytovna',
      rating: '4.8',
      reviewsCount: 38,
      address: 'Osh city, Lenin street, 331',
      phone: '+996 (555) 11-22-33',
      capacity: '450 beds',
      roomsCount: '120 rooms',
      floors: '4 floors',
      yearBuilt: '1978 (Reconstructed: 2023)',
      amenities: ['Fast Wi-Fi', 'Central heating', 'Laundry Room', 'Study Room', 'Sports Ground', 'Security Cameras'],
    }
  },
  '2': {
    kg: {
      tag: 'Эл аралык',
      name: '№2 Жатакана (Эл аралык)',
      desc: 'Дүйнөнүн ар кыл өлкөлөрүнөн келген эл аралык студенттердин борбору. Имаратта англис тилинде сүйлөгөн кызматкерлер иштейт, коопсуздуктун эң жогорку тартиби орнотулган жана атайын ашканасы бар.',
      commandantName: 'Осмонов Бакытбек Садыкович',
      rating: '4.9',
      reviewsCount: 52,
      address: 'Ош шаары, Исанов көчөсү, 73',
      phone: '+996 (777) 44-55-66',
      capacity: '600 орун',
      roomsCount: '150 бөлмө',
      floors: '5 кабат',
      yearBuilt: '2015',
      amenities: ['Эл аралык ашкана', 'Спорт залы', 'Сүйлөшүү залы', 'Кабельдик ТВ', 'Лифт', 'Күн тартиби 24/7'],
    },
    ru: {
      tag: 'Международное',
      name: 'Общежитие №2 (Международное)',
      desc: 'Эпицентр международной студенческой жизни. В здании работает англоязычный персонал, установлены самые строгие стандарты безопасности, работает интернациональная столовая.',
      commandantName: 'Осмонов Бакытбек Садыкович',
      rating: '4.9',
      reviewsCount: 52,
      address: 'г. Ош, ул. Исанова, 73',
      phone: '+996 (777) 44-55-66',
      capacity: '600 мест',
      roomsCount: '150 комнат',
      floors: '5 этажей',
      yearBuilt: '2015',
      amenities: ['Интернациональная кухня', 'Спортзал', 'Зона отдыха', 'Кабельное ТВ', 'Лифт', 'Охрана 24/7'],
    },
    en: {
      tag: 'International',
      name: 'Dormitory №2 (International)',
      desc: 'The epicentre of international student life. English-speaking staff members, the highest standards of safety, and a cozy international cafeteria are available inside the building.',
      commandantName: 'Osmonov Bakytbek Sadykovich',
      rating: '4.9',
      reviewsCount: 52,
      address: 'Osh city, Isanov street, 73',
      phone: '+996 (777) 44-55-66',
      capacity: '600 beds',
      roomsCount: '150 rooms',
      floors: '5 floors',
      yearBuilt: '2015',
      amenities: ['International Cafe', 'Gym', 'Lounge Zone', 'Cable TV', 'Elevator', 'Security 24/7'],
    }
  },
  '3': {
    kg: {
      tag: 'Жаңы конуш',
      name: '№3 Жатакана (Жаңы конуш)',
      desc: 'ОшМУнун эң заманбап жана жаңы курулган жатаканаларынын бири. Бул жерде студенттер үчүн атайын коворкинг аянтчасы, парк аймагы жана жашыл бакча уюштурулган.',
      commandantName: 'Рахманова Динара Асановна',
      rating: '4.7',
      reviewsCount: 29,
      address: 'Ош шаары, Г. Айтиев көчөсү, 12',
      phone: '+996 (500) 77-88-99',
      capacity: '800 орун',
      roomsCount: '200 бөлмө',
      floors: '6 кабат',
      yearBuilt: '2021',
      amenities: ['Коворкинг борбору', 'Парк зонасы', 'Эко-бакча', 'Ыкчам Wi-Fi', 'Лифт', 'Велосипед токтотуучу жай'],
    },
    ru: {
      tag: 'Новый городок',
      name: 'Общежитие №3 (Новый городок)',
      desc: 'Одно из самых современных и недавно построенных общежитий ОшГУ. Здесь организована просторная зона коворкинга, парковая зона для прогулок и экологический сад.',
      commandantName: 'Рахманова Динара Асановна',
      rating: '4.7',
      reviewsCount: 29,
      address: 'г. Ош, ул. Г. Айтиева, 12',
      phone: '+996 (500) 77-88-99',
      capacity: '800 мест',
      roomsCount: '200 комнат',
      floors: '6 этажей',
      yearBuilt: '2021',
      amenities: ['Коворкинг-центр', 'Парковая зона', 'Эко-сад', 'Быстрый Wi-Fi', 'Лифт', 'Велопарковка'],
    },
    en: {
      tag: 'New Town',
      name: 'Dormitory №3 (New Town)',
      desc: 'One of the newest and most advanced student dormitories of OshSU. Features a premium coworking space for group projects, a green park zone for walks, and eco-friendly structures.',
      commandantName: 'Rakhmanova Dinara Asanovna',
      rating: '4.7',
      reviewsCount: 29,
      address: 'Osh city, G. Aitiev street, 12',
      phone: '+996 (500) 77-88-99',
      capacity: '800 beds',
      roomsCount: '200 rooms',
      floors: '6 floors',
      yearBuilt: '2021',
      amenities: ['Coworking Hub', 'Park Area', 'Eco-Garden', 'Fast Wi-Fi', 'Elevators', 'Bicycle Parking'],
    }
  }
} as const

// Initial reviews
const initialReviews = [
  {
    id: 1,
    name: 'Асель Маратова',
    role: 'Студент (3 курс)',
    rating: 5,
    date: '12.05.2026',
    comment: {
      kg: 'Абдан таза жана тынч жатакана! Интернет абдан тез иштейт, коворкинг залында сабак окуганга сонун шарт түзүлгөн. Комендант дагы абдан сылык адам.',
      ru: 'Очень чистое и тихое общежитие! Интернет работает невероятно быстро, в коворкинг-зале созданы отличные условия для учебы. Комендант тоже очень вежливая.',
      en: 'Very clean and quiet dormitory! The Wi-Fi is exceptionally fast, and the coworking study area is perfect. The commandant is very polite and helpful.'
    }
  },
  {
    id: 2,
    name: 'Мухаммед Али',
    role: 'Студент (2 курс)',
    rating: 4,
    date: '04.04.2026',
    comment: {
      kg: 'Мага бөлмөлөрдүн түзүлүшү жакты. Бирок кээде кир жуучу машинада кезек көп болуп калат. Жалпысынан 9/10 бермекмин!',
      ru: 'Мне понравилась планировка комнат. Но иногда в прачечной бывают очереди. В целом поставил бы 9/10!',
      en: 'I like the room layout. Sometimes there are queues in the laundry room, but overall it is a solid 9/10 experience!'
    }
  }
]

export default function DormitoryDetails({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter()
  const { language, theme, toggleTheme } = useLanguageAndTheme()
  const d = dictionaries[language]
  
  // Resolve params
  const { id } = use(params)
  const dormId = id === '2' || id === '3' ? id : '1'
  const details = dormDetailsData[dormId as '1' | '2' | '3'][language]
  
  // States
  const [activeTab, setActiveTab] = useState<'photo' | 'video' | 'layout'>('photo')
  const [liked, setLiked] = useState(false)
  const [reviews, setReviews] = useState(initialReviews)
  const [reviewName, setReviewName] = useState('')
  const [reviewRating, setReviewRating] = useState(5)
  const [reviewText, setReviewText] = useState('')
  const [reviewSuccess, setReviewSuccess] = useState(false)
  const [activePhoto, setActivePhoto] = useState(0)

  // Photos
  const photos = [
    'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=800&q=80'
  ]

  // Submit Review
  const handleAddReview = (e: React.FormEvent) => {
    e.preventDefault()
    if (!reviewName || !reviewText) return

    const newReview = {
      id: Date.now(),
      name: reviewName,
      role: language === 'kg' ? 'Студент' : language === 'ru' ? 'Студент' : 'Student',
      rating: reviewRating,
      date: new Date().toLocaleDateString(),
      comment: {
        kg: reviewText,
        ru: reviewText,
        en: reviewText
      }
    }

    setReviews([newReview, ...reviews])
    setReviewName('')
    setReviewText('')
    setReviewSuccess(true)
    setTimeout(() => setReviewSuccess(false), 3000)
  }

  return (
    <div className="relative min-h-screen transition-colors duration-300 dark:bg-slate-950 bg-slate-50 dark:text-white text-slate-900 font-sans overflow-x-hidden">
      {/* Gradients */}
      <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[50%] rounded-full dark:bg-slate-900/40 bg-rose-100/50 blur-[180px] opacity-75 pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[50%] rounded-full dark:bg-violet-950/20 bg-violet-100/40 blur-[180px] opacity-60 pointer-events-none" />

      {/* Header */}
      <header className="sticky top-0 z-50 transition-colors duration-300 dark:bg-slate-950/70 bg-white/70 backdrop-blur-xl border-b dark:border-slate-900/80 border-slate-200 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-rose-500 hover:text-rose-600 transition-colors font-bold text-sm">
            <ArrowLeft className="w-4 h-4" />
            <span>{language === 'kg' ? 'Башкы бетке' : language === 'ru' ? 'На главную' : 'Back to Home'}</span>
          </Link>

          <div className="flex items-center gap-2.5">
            <Shield className="w-5 h-5 text-rose-500" />
            <span className="text-sm font-black uppercase tracking-wider">{d.oshsu} {d.dormitorySystem}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg dark:bg-slate-900 bg-white border dark:border-slate-800 border-slate-200 text-xs shadow-sm cursor-pointer"
            >
              {theme === 'dark' ? '☀️' : '🌙'}
            </button>
            <Link
              href="/login"
              className="px-4 py-2 bg-gradient-to-r from-rose-500 to-violet-600 text-white text-xs font-bold rounded-xl transition-all shadow-md shadow-rose-500/10"
            >
              {d.login}
            </Link>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-6 py-10 z-10 relative space-y-12">
        
        {/* Hero Section */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Visual Tab System */}
          <div className="lg:col-span-7 space-y-4">
            
            {/* Visual Screen Container */}
            <div className="relative aspect-[16/10] rounded-3xl overflow-hidden border dark:border-slate-800 border-slate-200 shadow-xl bg-slate-100 dark:bg-slate-900">
              
              {/* Photo View */}
              {activeTab === 'photo' && (
                <div className="w-full h-full relative">
                  <img 
                    src={photos[activePhoto]} 
                    alt="Dormitory Inside" 
                    className="w-full h-full object-cover animate-fadeIn"
                  />
                  <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center bg-black/40 backdrop-blur-md p-3 rounded-2xl text-white text-xs">
                    <span>{language === 'kg' ? 'ОшМУ Студенттик шаарчасы' : language === 'ru' ? 'Студенческий городок ОшГУ' : 'OshSU Student Housing'}</span>
                    <div className="flex gap-1.5">
                      {photos.map((_, i) => (
                        <button
                          key={i}
                          onClick={() => setActivePhoto(i)}
                          className={`w-2 h-2 rounded-full transition-all ${i === activePhoto ? 'bg-rose-500 w-4' : 'bg-white/50'}`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Video Tour */}
              {activeTab === 'video' && (
                <div className="w-full h-full relative flex items-center justify-center bg-slate-950 text-white">
                  <img 
                    src={photos[1]} 
                    alt="Video Cover" 
                    className="w-full h-full object-cover opacity-35 absolute"
                  />
                  <div className="z-10 text-center space-y-4">
                    <button className="p-5 rounded-full bg-rose-500 text-white hover:scale-110 transition-all duration-300 shadow-lg shadow-rose-500/25 animate-pulse cursor-pointer">
                      <Video className="w-8 h-8 fill-current" />
                    </button>
                    <div className="space-y-1">
                      <span className="text-xs uppercase font-extrabold tracking-widest text-slate-400">{language === 'kg' ? 'Видео-турду баштоо' : language === 'ru' ? 'Запустить видео-экскурсию' : 'Start Video Presentation'}</span>
                      <span className="text-[10px] block text-slate-500">Duration: 2:45 mins</span>
                    </div>
                  </div>
                </div>
              )}

              {/* 3D Layout Planner */}
              {activeTab === 'layout' && (
                <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center space-y-4 dark:bg-slate-900 bg-white">
                  <div className="p-3 rounded-full bg-rose-500/10 text-rose-500">
                    <Box className="w-10 h-10 animate-spin" style={{ animationDuration: '10s' }} />
                  </div>
                  <div className="space-y-2 max-w-sm">
                    <h4 className="text-base font-bold">{language === 'kg' ? 'Интерактивдүү 3D Бөлмө Түзүүчү' : language === 'ru' ? 'Интерактивный 3D-планировщик' : 'Interactive 3D Room Planner'}</h4>
                    <p className="text-xs dark:text-slate-400 text-slate-500 leading-relaxed">
                      {language === 'kg' ? 'Бул бөлмө тибиндеги керебеттердин жайгашуусун, коворкинг жана ашкана бөлмөлөрүн интерактивдүү форматта көрө аласыз.' : language === 'ru' ? 'Позволяет в трехмерном пространстве рассмотреть расстановку кроватей, шкафов и рабочих зон.' : 'Allows you to dynamically inspect the room beds arrangement, tables, and private zones in 3D.'}
                    </p>
                  </div>
                  <button className="px-5 py-2.5 bg-gradient-to-r from-rose-500 to-violet-650 text-white text-xs font-bold rounded-xl hover:brightness-110 transition-all shadow-md">
                    {language === 'kg' ? '3D Моделди жүктөө' : language === 'ru' ? 'Загрузить 3D модель' : 'Load 3D Layout'}
                  </button>
                </div>
              )}
            </div>

            {/* Tab Switches */}
            <div className="grid grid-cols-3 gap-3">
              {[
                { type: 'photo', label: language === 'kg' ? 'Галерея' : language === 'ru' ? 'Галерея' : 'Photos', icon: Image },
                { type: 'video', label: language === 'kg' ? 'Видеотур' : language === 'ru' ? 'Видеотур' : 'Video Tour', icon: Video },
                { type: 'layout', label: language === 'kg' ? '3D План' : language === 'ru' ? '3D План' : '3D Planner', icon: Box }
              ].map((tab) => (
                <button
                  key={tab.type}
                  onClick={() => setActiveTab(tab.type as any)}
                  className={`flex items-center justify-center gap-2 py-3 rounded-2xl border text-xs font-bold transition-all cursor-pointer ${activeTab === tab.type ? 'dark:bg-slate-900 bg-white dark:border-rose-500/40 border-rose-500 text-rose-500 shadow-sm' : 'dark:bg-slate-900/40 bg-slate-100 dark:border-slate-800/80 border-slate-200 dark:hover:border-slate-700 hover:border-slate-300'}`}
                >
                  <tab.icon className="w-4 h-4 shrink-0" />
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Right Information Desk */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Header badges */}
            <div className="flex items-center justify-between">
              <span className="px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-500 text-xs font-bold uppercase tracking-wider">
                {details.tag}
              </span>
              <button 
                onClick={() => setLiked(!liked)} 
                className="p-2.5 rounded-xl border dark:border-slate-800 border-slate-200 dark:bg-slate-900 bg-white hover:border-rose-500/40 transition-colors shadow-sm"
              >
                {liked ? <Heart className="w-4 h-4 text-rose-500 fill-current" /> : <HeartOff className="w-4 h-4 text-slate-400" />}
              </button>
            </div>

            {/* Title & Desc */}
            <div className="space-y-3">
              <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">{details.name}</h1>
              <div className="flex items-center gap-1 text-xs dark:text-slate-400 text-slate-500">
                <MapPin className="w-4 h-4 text-rose-500 shrink-0" />
                <span>{details.address}</span>
              </div>
              <p className="text-sm dark:text-slate-400 text-slate-500 leading-relaxed pt-2">
                {details.desc}
              </p>
            </div>

            {/* Spec Sheet Card */}
            <div className="p-6 rounded-2xl dark:bg-slate-900 bg-white border dark:border-slate-800 border-slate-200 shadow-sm space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-rose-500">{language === 'kg' ? 'Техникалык мүнөздөмөсү' : language === 'ru' ? 'Технические характеристики' : 'Technical Specifications'}</h3>
              <div className="grid grid-cols-2 gap-4 text-xs md:text-sm">
                <div>
                  <span className="dark:text-slate-500 text-slate-400 block">{language === 'kg' ? 'Батырылышы:' : language === 'ru' ? 'Вместимость:' : 'Total Capacity:'}</span>
                  <span className="font-bold">{details.capacity}</span>
                </div>
                <div>
                  <span className="dark:text-slate-500 text-slate-400 block">{language === 'kg' ? 'Бөлмөлөр:' : language === 'ru' ? 'Количество комнат:' : 'Total Rooms:'}</span>
                  <span className="font-bold">{details.roomsCount}</span>
                </div>
                <div>
                  <span className="dark:text-slate-500 text-slate-400 block">{language === 'kg' ? 'Кабаттар:' : language === 'ru' ? 'Этажность:' : 'Total Floors:'}</span>
                  <span className="font-bold">{details.floors}</span>
                </div>
                <div>
                  <span className="dark:text-slate-500 text-slate-400 block">{language === 'kg' ? 'Курулган жылы:' : language === 'ru' ? 'Год постройки:' : 'Year Built:'}</span>
                  <span className="font-bold">{details.yearBuilt}</span>
                </div>
              </div>
            </div>

            {/* Call Action */}
            <div className="flex gap-3">
              <Link
                href="/login"
                className="flex-1 flex items-center justify-center gap-2 py-4 bg-gradient-to-r from-rose-500 to-violet-650 hover:brightness-110 text-white font-bold rounded-2xl shadow-lg transition-all duration-300 transform hover:scale-[1.01]"
              >
                <span>{language === 'kg' ? 'Бөлмөгө арыз берүү' : language === 'ru' ? 'Подать заявку на комнату' : 'Apply for a Room'}</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>

        {/* Features Checklist */}
        <section className="p-8 rounded-3xl dark:bg-slate-900/30 bg-white border dark:border-slate-900 border-slate-200 shadow-xl space-y-6">
          <h2 className="text-xl md:text-2xl font-bold">{language === 'kg' ? 'Жатакананын ыңгайлуулуктары' : language === 'ru' ? 'Удобства и сервисы в общежитии' : 'Available Amenities & Services'}</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 text-xs md:text-sm">
            {details.amenities.map((amenity, i) => (
              <div key={i} className="flex items-center gap-2 p-3.5 rounded-xl dark:bg-slate-950 bg-slate-50 border dark:border-slate-900 border-slate-100 shadow-inner">
                <CheckCircle2 className="w-4.5 h-4.5 text-rose-500 shrink-0" />
                <span className="font-medium">{amenity}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Meet the Commandant & Staff */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Left staff card */}
          <div className="lg:col-span-5 dark:bg-slate-900 bg-white border dark:border-slate-800 border-slate-200 p-8 rounded-3xl shadow-sm flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="inline-flex px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-500 text-xs font-bold uppercase tracking-wider">
                {language === 'kg' ? 'Башкы комендант' : language === 'ru' ? 'Главный комендант' : 'Dormitory Commandant'}
              </div>
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-rose-500 to-violet-650 flex items-center justify-center text-white text-xl font-bold shadow-md uppercase">
                  {details.commandantName.split(' ')[0][0]}{details.commandantName.split(' ')[1] ? details.commandantName.split(' ')[1][0] : ''}
                </div>
                <div>
                  <h3 className="text-lg font-bold">{details.commandantName}</h3>
                  <span className="text-xs dark:text-slate-500 text-slate-400 font-semibold">{language === 'kg' ? 'Жатакана координатору' : language === 'ru' ? 'Координатор общежития' : 'Dormitory Coordinator'}</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-3 text-xs md:text-sm">
                <Phone className="w-4 h-4 text-rose-500" />
                <span>{details.phone}</span>
              </div>
              <div className="flex items-center gap-3 text-xs md:text-sm">
                <Mail className="w-4 h-4 text-rose-500" />
                <span>dormitory{dormId}@oshsu.kg</span>
              </div>
              <div className="flex items-center gap-3 text-xs md:text-sm">
                <Clock className="w-4 h-4 text-rose-500" />
                <span>09:00 - 18:00 (Дш - Жм / Пн - Пт)</span>
              </div>
            </div>

            <a
              href={`https://wa.me/${details.phone.replace(/[^0-9]/g, '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 py-3 dark:bg-slate-950 bg-slate-100 hover:bg-slate-200 dark:hover:bg-slate-900 border dark:border-slate-800 border-slate-200 hover:border-rose-500/35 text-xs font-bold rounded-xl transition-all cursor-pointer"
            >
              <MessageSquare className="w-4 h-4 text-rose-500" />
              <span>{language === 'kg' ? 'Комендантка жазуу (WhatsApp)' : language === 'ru' ? 'Написать коменданту (WhatsApp)' : 'Message Commandant (WhatsApp)'}</span>
            </a>
          </div>

          {/* Right reviews manager */}
          <div className="lg:col-span-7 dark:bg-slate-900 bg-white border dark:border-slate-800 border-slate-200 p-8 rounded-3xl shadow-sm space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold">{language === 'kg' ? 'Студенттердин пикирлери' : language === 'ru' ? 'Отзывы студентов' : 'Student Reviews'}</h2>
              <div className="flex items-center gap-1 text-sm font-bold">
                <Star className="w-4 h-4 text-amber-500 fill-current" />
                <span>{details.rating} / 5.0 ({details.reviewsCount} {language === 'kg' ? 'пикир' : language === 'ru' ? 'отзывов' : 'reviews'})</span>
              </div>
            </div>

            {/* Leave Review Form */}
            <form onSubmit={handleAddReview} className="p-4 rounded-2xl dark:bg-slate-950 bg-slate-50 border dark:border-slate-850 border-slate-200 space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-rose-500">{language === 'kg' ? 'Пикир калтыруу' : language === 'ru' ? 'Оставить отзыв' : 'Leave a Review'}</h3>
              
              {reviewSuccess && (
                <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-xs font-bold animate-fadeIn">
                  ✓ {language === 'kg' ? 'Пикириңиз ийгиликтүү кошулду!' : language === 'ru' ? 'Ваш отзыв успешно добавлен!' : 'Your review was successfully added!'}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <input
                  type="text"
                  required
                  value={reviewName}
                  onChange={(e) => setReviewName(e.target.value)}
                  placeholder={language === 'kg' ? 'Сиздин атыңыз...' : language === 'ru' ? 'Ваше имя...' : 'Your name...'}
                  className="px-3 py-2 rounded-xl dark:bg-slate-900 bg-white border dark:border-slate-800 border-slate-200 text-xs focus:outline-none focus:border-rose-500 transition-colors"
                />
                
                {/* Rating Select */}
                <div className="flex items-center gap-1 justify-between px-3 py-2 rounded-xl dark:bg-slate-900 bg-white border dark:border-slate-800 border-slate-200 text-xs">
                  <span>Rating:</span>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setReviewRating(star)}
                        className={`text-sm cursor-pointer ${star <= reviewRating ? 'text-amber-500' : 'text-slate-350'}`}
                      >
                        ★
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <textarea
                required
                rows={2}
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                placeholder={language === 'kg' ? 'Жатакана жөнүндө оюңуз менен бөлүшүңүз...' : language === 'ru' ? 'Поделитесь вашим впечатлением о проживании...' : 'Share your honest feedback about this dormitory...'}
                className="w-full px-3 py-2 rounded-xl dark:bg-slate-900 bg-white border dark:border-slate-800 border-slate-200 text-xs focus:outline-none focus:border-rose-500 transition-colors resize-none"
              />

              <button
                type="submit"
                className="w-full flex items-center justify-center gap-1.5 py-2.5 bg-gradient-to-r from-rose-500 to-violet-650 text-white text-xs font-bold rounded-xl hover:brightness-110 transition-all cursor-pointer shadow-md"
              >
                <span>{language === 'kg' ? 'Пикирди кошуу' : language === 'ru' ? 'Добавить отзыв' : 'Add Review'}</span>
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>

            {/* Reviews List */}
            <div className="space-y-4 max-h-[300px] overflow-y-auto pr-1">
              {reviews.map((rev) => (
                <div key={rev.id} className="p-4 rounded-2xl dark:bg-slate-950 bg-slate-50 border dark:border-slate-900 border-slate-100 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <div>
                      <span className="font-bold block">{rev.name}</span>
                      <span className="dark:text-slate-500 text-slate-450 font-semibold">{rev.role}</span>
                    </div>
                    <div className="text-right">
                      <div className="flex gap-0.5 justify-end text-amber-500 text-xs">
                        {Array.from({ length: rev.rating }).map((_, i) => (
                          <span key={i}>★</span>
                        ))}
                      </div>
                      <span className="dark:text-slate-600 text-slate-400 block text-[10px]">{rev.date}</span>
                    </div>
                  </div>
                  <p className="text-xs dark:text-slate-400 text-slate-500 leading-relaxed">
                    {language === 'kg' ? rev.comment.kg : language === 'ru' ? rev.comment.ru : rev.comment.en}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

      </main>

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
