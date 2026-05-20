'use client'

import React, { useState, useEffect, use } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useLanguageAndTheme } from '../../LanguageAndThemeContext'
import { dictionaries } from '@/utils/dictionaries'
import { 
  Shield, ArrowLeft, Star, MapPin, Users, Phone, Mail, Clock, 
  Sparkles, CheckCircle2, Video, Image, Box, Send, MessageSquare, 
  ChevronRight, Heart, HeartOff, Landmark, CreditCard, Wrench, ShieldAlert,
  UploadCloud, CheckCircle, Eye, QrCode, ClipboardList, ShieldCheck, X
} from 'lucide-react'
import { localDb, SEVEN_DORMITORIES } from '@/utils/localDb'

// Initial reviews mock data
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
  
  // Find correct dormitory from central list
  const activeDorm = SEVEN_DORMITORIES.find(item => item.id === id) || SEVEN_DORMITORIES[0]
  const details = activeDorm[language]

  // States
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [activeTab, setActiveTab] = useState<'photo' | 'video' | 'layout'>('photo')
  const [liked, setLiked] = useState(false)
  const [reviews, setReviews] = useState(initialReviews)
  const [reviewName, setReviewName] = useState('')
  const [reviewRating, setReviewRating] = useState(5)
  const [reviewText, setReviewText] = useState('')
  const [reviewSuccess, setReviewSuccess] = useState(false)
  const [activePhoto, setActivePhoto] = useState(0)

  // Real-time localDb synchronization states
  const [myApplication, setMyApplication] = useState<any>(null)
  const [myBooking, setMyBooking] = useState<any>(null)

  // Application submission form states
  const [faculty, setFaculty] = useState('Информатика жана ИТ')
  const [course, setCourse] = useState('1')
  const [socialStatus, setSocialStatus] = useState('Орто')
  const [studentCardFile, setStudentCardFile] = useState<any>(null)
  const [submittingApp, setSubmittingApp] = useState(false)
  const [appAlert, setAppAlert] = useState<{ type: 'success' | 'error', text: string } | null>(null)

  // Booking details & AI payment scanner states
  const [selectedRoomToBook, setSelectedRoomToBook] = useState<any>(null)
  const [payModalOpen, setPayModalOpen] = useState(false)
  const [receiptFileName, setReceiptFileName] = useState('')
  const [ocrScanning, setOcrScanning] = useState(false)
  const [ocrStatus, setOcrStatus] = useState('')
  const [ocrSuccess, setOcrSuccess] = useState(false)

  // Photos
  const photos = [
    'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=800&q=80'
  ]

  // Available room options mock database for this dormitory
  const [roomsCatalog, setRoomsCatalog] = useState([
    { number: '101', beds: 3, occupied: 3, type: 'girls', size: '20 кв. м', photo: 'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=300&q=80' },
    { number: '102', beds: 3, occupied: 2, type: 'girls', size: '20 кв. м', photo: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=300&q=80' },
    { number: '201', beds: 3, occupied: 1, type: 'boys', size: '22 кв. м', photo: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=300&q=80' },
    { number: '202', beds: 3, occupied: 3, type: 'boys', size: '22 кв. м', photo: 'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?auto=format&fit=crop&w=300&q=80' },
    { number: '301', beds: 4, occupied: 2, type: 'boys', size: '25 кв. м', photo: 'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=300&q=80' },
    { number: '302', beds: 4, occupied: 0, type: 'empty', size: '25 кв. м', photo: 'https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=300&q=80' },
  ])

  // Guard routing & sync
  useEffect(() => {
    const user = localDb.getCurrentUser()
    if (!user) {
      router.push('/login')
      return
    }
    setCurrentUser(user)

    // Load active student application and booking from DB
    const allApps = localDb.getApplications()
    const allBookings = localDb.getBookings()

    const userApp = allApps.find(app => app.studentEmail === user.email)
    const userBooking = allBookings.find(b => b.studentEmail === user.email)

    setMyApplication(userApp || null)
    setMyBooking(userBooking || null)

    // If student is already assigned to a room, reflect that in our local rooms catalog status
    if (userBooking && userBooking.dormId === id) {
      setRoomsCatalog(prev =>
        prev.map(r => r.number === userBooking.roomNumber ? { ...r, occupied: Math.min(r.beds, r.occupied + 1) } : r)
      )
    }
  }, [id])

  // Submit housing application logic
  const handleApply = (e: React.FormEvent) => {
    e.preventDefault()
    if (!currentUser) return

    setSubmittingApp(true)
    setAppAlert(null)

    setTimeout(() => {
      try {
        const newApp = localDb.submitApplication({
          studentName: currentUser.fullName,
          studentEmail: currentUser.email,
          faculty,
          course,
          socialStatus,
          dormId: activeDorm.id,
          dormName: activeDorm[language].name
        })
        
        setMyApplication(newApp)
        setSubmittingApp(false)
        setAppAlert({
          type: 'success',
          text: language === 'kg' 
            ? 'Арызыңыз ийгиликтүү кошулду! Эми коменданттын бекитүүсүн күтүңүз.' 
            : language === 'ru'
            ? 'Ваша заявка успешно отправлена! Ожидайте одобрения коменданта.'
            : 'Application submitted successfully! Please await commandant approval.'
        })
        
        // Clear message alert after 5s
        setTimeout(() => setAppAlert(null), 5000)
      } catch (err) {
        setSubmittingApp(false)
        setAppAlert({
          type: 'error',
          text: 'Error submitting application. Please try again.'
        })
      }
    }, 1500)
  }

  // Handle Book click action with routing constraints
  const handleBookClick = (room: any) => {
    if (!myApplication) {
      alert(d.submitAppAlert || "Сураныч, арыз тапшырыңыз!")
      // Smooth scroll to application form
      const formEl = document.getElementById('apply-form-section')
      if (formEl) {
        formEl.scrollIntoView({ behavior: 'smooth' })
      }
      return
    }

    if (myApplication.status === 'pending') {
      alert(d.appUnderReviewAlert || "Арызыңыз каралууда!")
      return
    }

    if (myApplication.status === 'rejected') {
      alert(d.appRejectedAlert || "Сиздин арызыңыз четке кагылды.")
      return
    }

    if (myBooking) {
      alert(language === 'kg' ? "Сизде бөлмө ээленген!" : language === 'ru' ? "У вас уже забронирована комната!" : "You have already booked a room!")
      return
    }

    // Unlocks payment scanner modal
    setSelectedRoomToBook(room)
    setPayModalOpen(true)
  }

  // Simulated AI payment scanner upload
  const handleReceiptUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    
    setReceiptFileName(file.name)
    setOcrScanning(true)
    setOcrSuccess(false)
    
    setOcrStatus(language === 'kg' ? 'Чек окулуудо (ИИ сканер)...' : language === 'ru' ? 'Чтение чека (ИИ сканер)...' : 'Reading receipt (AI scanner)...')
    
    setTimeout(() => {
      setOcrStatus(language === 'kg' ? 'ОшМУ реквизиттери текшерилүүдө...' : language === 'ru' ? 'Проверка реквизитов ОшГУ...' : 'Verifying OshSU details...')
      
      setTimeout(() => {
        setOcrStatus(language === 'kg' ? 'Сумма ырасталууда (12,000 KGS)...' : language === 'ru' ? 'Сопоставление суммы (12,000 сом)...' : 'Matching amount (12,000 KGS)...')
        
        setTimeout(() => {
          setOcrScanning(false)
          setOcrSuccess(true)

          // Save booking in local database
          if (currentUser && selectedRoomToBook) {
            const newBooking = localDb.createBooking({
              studentName: currentUser.fullName,
              studentEmail: currentUser.email,
              dormId: activeDorm.id,
              dormName: activeDorm[language].name,
              roomNumber: selectedRoomToBook.number,
              bedNumber: `Орун №${selectedRoomToBook.occupied + 1}`,
              amount: '12,000 KGS',
              paymentType: 'MBank (AI Scan)',
              referenceId: `TXN-${Math.floor(100000 + Math.random() * 900000)}-OshSU`
            })
            setMyBooking(newBooking)
            
            // Increment room capacity
            setRoomsCatalog(prev =>
              prev.map(r => r.number === selectedRoomToBook.number ? { ...r, occupied: r.occupied + 1 } : r)
            )

            // Auto-redirect to dashboard after 3s
            setTimeout(() => {
              setPayModalOpen(false)
              router.push('/dashboard')
            }, 3000)
          }
        }, 1200)
      }, 1200)
    }, 1200)
  }

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

  // Handle logout
  const handleLogout = () => {
    document.cookie = "oshsu_role=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;"
    localDb.clearCurrentUser()
    router.push('/login')
  }

  return (
    <div className="relative min-h-screen transition-colors duration-300 dark:bg-slate-950 bg-slate-50 dark:text-white text-slate-900 font-sans overflow-x-hidden">
      {/* Dynamic Aesthetic Background Gradients */}
      <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[50%] rounded-full dark:bg-slate-900/40 bg-rose-100/50 blur-[180px] opacity-75 pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[50%] rounded-full dark:bg-violet-950/20 bg-violet-100/40 blur-[180px] opacity-60 pointer-events-none" />

      {/* Premium Navigation Header */}
      <header className="sticky top-0 z-50 transition-colors duration-300 dark:bg-slate-950/70 bg-white/70 backdrop-blur-xl border-b dark:border-slate-900/80 border-slate-200 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center gap-2 text-rose-500 hover:text-rose-600 transition-colors font-bold text-sm">
            <ArrowLeft className="w-4 h-4" />
            <span>{language === 'kg' ? 'Жеке кабинетке' : language === 'ru' ? 'В кабинет' : 'Back to Dashboard'}</span>
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
            {currentUser ? (
              <button
                onClick={handleLogout}
                className="px-4 py-2 border border-rose-500/20 bg-rose-500/10 text-rose-505 dark:text-rose-400 text-xs font-bold rounded-xl hover:bg-rose-500/25 transition-all shadow-md cursor-pointer"
              >
                {d.logout}
              </button>
            ) : (
              <Link
                href="/login"
                className="px-4 py-2 bg-gradient-to-r from-rose-500 to-violet-600 text-white text-xs font-bold rounded-xl transition-all shadow-md shadow-rose-500/10"
              >
                {d.login}
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-6 py-10 z-10 relative space-y-16">
        
        {/* SECTION 1: General Info & Map */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Media Tab System (Gallery, Video, 3D Plan) */}
          <div className="lg:col-span-7 space-y-4">
            
            {/* Visual Container Screen */}
            <div className="relative aspect-[16/10] rounded-3xl overflow-hidden border dark:border-slate-800 border-slate-200 shadow-xl bg-slate-100 dark:bg-slate-900">
              
              {/* Photo Viewer */}
              {activeTab === 'photo' && (
                <div className="w-full h-full relative">
                  <img 
                    src={photos[activePhoto]} 
                    alt={details.name} 
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

              {/* Video Tour Viewer */}
              {activeTab === 'video' && (
                <div className="w-full h-full relative flex items-center justify-center bg-slate-955 text-white">
                  <img 
                    src={photos[1]} 
                    alt="Video Tour Cover" 
                    className="w-full h-full object-cover opacity-30 absolute"
                  />
                  <div className="z-10 text-center space-y-4">
                    <button className="p-5 rounded-full bg-rose-500 text-white hover:scale-110 transition-all duration-300 shadow-lg shadow-rose-500/25 animate-pulse cursor-pointer">
                      <Video className="w-8 h-8 fill-current" />
                    </button>
                    <div className="space-y-1">
                      <span className="text-xs uppercase font-extrabold tracking-widest text-slate-450">{language === 'kg' ? 'Видео-турду баштоо' : language === 'ru' ? 'Запустить видео-экскурсию' : 'Start Video Presentation'}</span>
                      <span className="text-[10px] block text-slate-500">Duration: 2:45 mins</span>
                    </div>
                  </div>
                </div>
              )}

              {/* 3D Planner Viewer */}
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
                  <button className="px-5 py-2.5 bg-gradient-to-r from-rose-500 to-violet-600 text-white text-xs font-bold rounded-xl hover:brightness-110 transition-all shadow-md">
                    {language === 'kg' ? '3D Моделди жүктөө' : language === 'ru' ? 'Загрузить 3D модель' : 'Load 3D Layout'}
                  </button>
                </div>
              )}
            </div>

            {/* Media Tab Triggers */}
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

          {/* Right Information Details Desk */}
          <div className="lg:col-span-5 space-y-6">
            <div className="flex items-center justify-between">
              <span className="px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-500 text-xs font-bold uppercase tracking-wider">
                {details.tag}
              </span>
              <button 
                onClick={() => setLiked(!liked)} 
                className="p-2.5 rounded-xl border dark:border-slate-800 border-slate-200 dark:bg-slate-900 bg-white hover:border-rose-500/40 transition-colors shadow-sm"
              >
                {liked ? <Heart className="w-4 h-4 text-rose-505 fill-current" /> : <HeartOff className="w-4 h-4 text-slate-400" />}
              </button>
            </div>

            <div className="space-y-3">
              <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">{details.name}</h1>
              <div className="flex items-center gap-1.5 text-xs dark:text-slate-400 text-slate-500">
                <MapPin className="w-4 h-4 text-rose-550 shrink-0" />
                <span>{details.address}</span>
              </div>
              <p className="text-sm dark:text-slate-400 text-slate-505 leading-relaxed pt-2">
                {details.desc}
              </p>
            </div>

            {/* General Spec Sheet Card */}
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

            {/* Quick Action Navigation links */}
            <div className="flex gap-3">
              <a
                href="#rooms-catalog-section"
                className="flex-1 flex items-center justify-center gap-2 py-4 bg-gradient-to-r from-rose-500 to-violet-600 hover:brightness-110 text-white font-bold rounded-2xl shadow-lg transition-all duration-300 transform hover:scale-[1.01]"
              >
                <Landmark className="w-4.5 h-4.5" />
                <span>{language === 'kg' ? 'Бөлмөлөр каталогу' : language === 'ru' ? 'Каталог комнат' : 'Rooms Catalog'}</span>
              </a>
            </div>
          </div>
        </section>

        {/* Section 1 Map Sub-block */}
        <section className="space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-455">{language === 'kg' ? 'Имараттын картадагы орду' : language === 'ru' ? 'Местоположение корпуса' : 'Building Map Location'}</h3>
          <div className="w-full h-80 rounded-3xl overflow-hidden border dark:border-slate-800 border-slate-200 shadow-lg">
            <iframe
              src={`https://maps.google.com/maps?q=Osh%20${encodeURIComponent(details.address)}&t=&z=15&ie=UTF8&iwloc=&output=embed`}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen={false}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </section>

        {/* SECTION 2: Rooms Catalog */}
        <section id="rooms-catalog-section" className="space-y-6 pt-6 border-t dark:border-slate-900 border-slate-250">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-black">{language === 'kg' ? 'Бөлмөлөр жана баалары' : language === 'ru' ? 'Свободные комнаты и бронь' : 'Available Rooms & Booking'}</h2>
              <p className="text-xs text-slate-500 mt-1">
                {language === 'kg' 
                  ? '* Бөлмөнү ээлөө коменданттын арызды жактыруусунан кийин гана жеткиликтүү болот.' 
                  : language === 'ru'
                  ? '* Бронирование разблокируется только после одобрения поданной заявки комендантом.'
                  : '* Room booking unlocks only after your housing application gets approved by the commandant.'}
              </p>
            </div>

            {myApplication && (
              <span className={`px-4 py-2 rounded-2xl border text-xs font-black flex items-center gap-1.5 ${
                myApplication.status === 'approved' 
                  ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-600 dark:text-emerald-450 animate-pulse'
                  : 'bg-amber-500/10 border-amber-500/20 text-amber-600'
              }`}>
                <ClipboardList className="w-4.5 h-4.5 shrink-0" />
                {language === 'kg' ? 'Арыздын статусу: ' : language === 'ru' ? 'Статус заявки: ' : 'App Status: '}
                <span className="uppercase">{myApplication.status}</span>
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {roomsCatalog.map((room) => {
              const bedsAvailable = room.beds - room.occupied
              const isFull = bedsAvailable <= 0
              
              return (
                <div 
                  key={room.number} 
                  className={`group rounded-3xl dark:bg-slate-900/40 bg-white border dark:border-slate-900 border-slate-250 overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 ${
                    myBooking?.roomNumber === room.number ? 'ring-2 ring-rose-500' : ''
                  }`}
                >
                  <div className="relative aspect-video overflow-hidden">
                    <img 
                      src={room.photo} 
                      alt={`Room ${room.number}`} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3 px-2.5 py-1 text-[9px] font-black rounded-lg bg-black/40 backdrop-blur-md text-white uppercase tracking-wider">
                      {room.size}
                    </div>
                    <div className="absolute top-3 right-3 px-2.5 py-1 text-[9px] font-black rounded-lg bg-rose-500 text-white uppercase tracking-wider">
                      {room.type === 'girls' ? (language === 'kg' ? 'Кыздарга' : 'Девушкам') : room.type === 'boys' ? (language === 'kg' ? 'Балдарга' : 'Юношам') : (language === 'kg' ? 'Бош' : 'Свободно')}
                    </div>
                  </div>

                  <div className="p-6 space-y-4">
                    <div className="flex justify-between items-center">
                      <h4 className="text-base font-extrabold">{room.number}-бөлмө</h4>
                      <span className={`px-2 py-0.5 rounded-full text-2xs font-extrabold border ${
                        isFull 
                          ? 'bg-red-500/10 border-red-500/20 text-red-500' 
                          : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-600 dark:text-emerald-450'
                      }`}>
                        {isFull ? (language === 'kg' ? 'Орун жок' : 'Мест нет') : (language === 'kg' ? `${bedsAvailable} орун бош` : `${bedsAvailable} мест свободно`)}
                      </span>
                    </div>

                    <div className="text-2xs text-slate-400 space-y-1">
                      <div>🏢 {language === 'kg' ? 'Кабат: ' : 'Этаж: '} {room.number[0]}</div>
                      <div>👥 {language === 'kg' ? 'Жалпы койко-орундар: ' : 'Койко-места: '} {room.beds}</div>
                    </div>

                    <div className="flex items-center justify-between border-t dark:border-slate-850 border-slate-200 pt-4 mt-2">
                      <div>
                        <span className="text-[10px] text-slate-500 block uppercase font-bold">{language === 'kg' ? 'Жарым жылдык төлөм:' : 'Плата за семестр:'}</span>
                        <span className="text-sm font-black text-rose-550">12,000 KGS</span>
                      </div>

                      <button
                        onClick={() => handleBookClick(room)}
                        disabled={isFull && myBooking?.roomNumber !== room.number}
                        className={`px-4.5 py-2.5 rounded-xl text-2xs font-extrabold transition-all duration-300 flex items-center gap-1.5 cursor-pointer ${
                          myBooking?.roomNumber === room.number
                            ? 'bg-emerald-500 text-white shadow-md'
                            : isFull
                            ? 'bg-slate-200 text-slate-400 cursor-not-allowed border border-slate-300'
                            : 'bg-gradient-to-r from-rose-500 to-violet-605 text-white shadow-lg hover:brightness-110 shadow-rose-550/10'
                        }`}
                      >
                        <CreditCard className="w-4 h-4" />
                        {myBooking?.roomNumber === room.number 
                          ? (language === 'kg' ? 'Сиздин бөлмө' : 'Ваша комната')
                          : (language === 'kg' ? 'Ээлөө (Book)' : 'Забронировать')}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* SECTION 3: Staff List */}
        <section className="space-y-6 pt-6 border-t dark:border-slate-900 border-slate-250">
          <div>
            <h2 className="text-2xl font-black">{language === 'kg' ? 'Жатакана администрациясы' : 'Служба управления и персонал'}</h2>
            <p className="text-xs text-slate-500 mt-1">{language === 'kg' ? 'Бардык кызматкерлер жана суроолор боюнча байланыш маалыматы' : 'Контакты коменданта и технического персонала общежития'}</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Commandant */}
            <div className="p-6 rounded-3xl dark:bg-slate-900 bg-white border dark:border-slate-800 border-slate-200 shadow-sm flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <span className="px-2.5 py-1 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-500 text-[10px] font-black uppercase tracking-wider inline-block">
                  {language === 'kg' ? 'Башкы комендант' : 'Главный комендант'}
                </span>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-rose-500 to-violet-600 flex items-center justify-center text-white text-base font-bold shadow-md uppercase">
                    {details.commandantName.split(' ')[0][0]}{details.commandantName.split(' ')[1] ? details.commandantName.split(' ')[1][0] : ''}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold">{details.commandantName}</h4>
                    <span className="text-[10px] dark:text-slate-550 text-slate-400 font-semibold">{language === 'kg' ? 'Студенттик координатор' : 'Координатор корпуса'}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2.5 text-2xs text-slate-500">
                <div className="flex items-center gap-2">📞 {details.phone}</div>
                <div className="flex items-center gap-2">✉️ commandant{activeDorm.id}@oshsu.kg</div>
                <div className="flex items-center gap-2">🕒 09:00 - 18:00 (Пн-Пт)</div>
              </div>

              <a 
                href={`https://wa.me/${details.phone.replace(/[^0-9]/g, '')}`}
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-full flex items-center justify-center gap-1.5 py-2.5 dark:bg-slate-950 bg-slate-100 hover:bg-slate-200 dark:hover:bg-slate-900 border dark:border-slate-800 border-slate-250 text-2xs font-extrabold rounded-xl transition-all cursor-pointer"
              >
                <MessageSquare className="w-3.5 h-3.5 text-rose-500" />
                <span>WhatsApp</span>
              </a>
            </div>

            {/* Janitor */}
            <div className="p-6 rounded-3xl dark:bg-slate-900 bg-white border dark:border-slate-800 border-slate-200 shadow-sm flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <span className="px-2.5 py-1 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-500 text-[10px] font-black uppercase tracking-wider inline-block">
                  {language === 'kg' ? 'Тазалык кызматкери' : 'Техслужащая / Уборка'}
                </span>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-950 flex items-center justify-center text-rose-500 border dark:border-slate-800 border-slate-200 text-base font-bold shadow-sm uppercase">
                    МБ
                  </div>
                  <div>
                    <h4 className="text-sm font-bold">Мамытова Бурул</h4>
                    <span className="text-[10px] dark:text-slate-550 text-slate-400 font-semibold">{language === 'kg' ? 'Тазалык жана гигиена' : 'Старшая по клинингу'}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2.5 text-2xs text-slate-500">
                <div className="flex items-center gap-2">📞 +996 (700) 12-34-56</div>
                <div className="flex items-center gap-2">🕒 08:00 - 17:00 (Пн-Сб)</div>
              </div>

              <a href="https://wa.me/996700123456" target="_blank" rel="noopener noreferrer" className="w-full flex items-center justify-center gap-1.5 py-2.5 dark:bg-slate-950 bg-slate-100 border dark:border-slate-800 border-slate-250 text-2xs font-extrabold rounded-xl cursor-pointer">
                <MessageSquare className="w-3.5 h-3.5 text-rose-550" />
                <span>WhatsApp</span>
              </a>
            </div>

            {/* Security */}
            <div className="p-6 rounded-3xl dark:bg-slate-900 bg-white border dark:border-slate-800 border-slate-200 shadow-sm flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <span className="px-2.5 py-1 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-500 text-[10px] font-black uppercase tracking-wider inline-block">
                  {language === 'kg' ? 'Күзөт кызматы' : 'Сотрудник охраны'}
                </span>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-950 flex items-center justify-center text-rose-500 border dark:border-slate-800 border-slate-200 text-base font-bold shadow-sm uppercase">
                    ТБ
                  </div>
                  <div>
                    <h4 className="text-sm font-bold">Токтосунов Бакыт</h4>
                    <span className="text-[10px] dark:text-slate-550 text-slate-400 font-semibold">{language === 'kg' ? 'Кароол кызматкери' : 'Дежурный охранник'}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2.5 text-2xs text-slate-500">
                <div className="flex items-center gap-2">📞 +996 (555) 98-76-54</div>
                <div className="flex items-center gap-2">🕒 Күн тартиби 24/7</div>
              </div>

              <a href="https://wa.me/996555987654" target="_blank" rel="noopener noreferrer" className="w-full flex items-center justify-center gap-1.5 py-2.5 dark:bg-slate-950 bg-slate-100 border dark:border-slate-800 border-slate-250 text-2xs font-extrabold rounded-xl cursor-pointer">
                <MessageSquare className="w-3.5 h-3.5 text-rose-550" />
                <span>WhatsApp</span>
              </a>
            </div>

            {/* Electrician */}
            <div className="p-6 rounded-3xl dark:bg-slate-900 bg-white border dark:border-slate-800 border-slate-200 shadow-sm flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <span className="px-2.5 py-1 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-500 text-[10px] font-black uppercase tracking-wider inline-block">
                  {language === 'kg' ? 'Техникалык кызматкер' : 'Электрик / Сантехник'}
                </span>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-950 flex items-center justify-center text-rose-500 border dark:border-slate-800 border-slate-200 text-base font-bold shadow-sm uppercase">
                    АК
                  </div>
                  <div>
                    <h4 className="text-sm font-bold">Алиев Канат</h4>
                    <span className="text-[10px] dark:text-slate-550 text-slate-400 font-semibold">{language === 'kg' ? 'Электрик-слесарь' : 'Техник-инженер'}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2.5 text-2xs text-slate-500">
                <div className="flex items-center gap-2">📞 +996 (702) 65-43-21</div>
                <div className="flex items-center gap-2">🕒 Иштөө убактысы чакыруу менен</div>
              </div>

              <a href="https://wa.me/996702654321" target="_blank" rel="noopener noreferrer" className="w-full flex items-center justify-center gap-1.5 py-2.5 dark:bg-slate-950 bg-slate-100 border dark:border-slate-800 border-slate-250 text-2xs font-extrabold rounded-xl cursor-pointer">
                <MessageSquare className="w-3.5 h-3.5 text-rose-550" />
                <span>WhatsApp</span>
              </a>
            </div>
          </div>
        </section>

        {/* SECTION 4: Infrastructure Grid */}
        <section className="p-8 rounded-3xl dark:bg-slate-900/30 bg-white border dark:border-slate-900 border-slate-200 shadow-xl space-y-6">
          <h2 className="text-xl md:text-2xl font-bold">{language === 'kg' ? 'Жатакананын ыңгайлуулуктары' : 'Удобства и инфраструктура корпуса'}</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 text-xs md:text-sm">
            {details.amenities.map((amenity, i) => (
              <div key={i} className="flex items-center gap-2 p-3.5 rounded-xl dark:bg-slate-950 bg-slate-50 border dark:border-slate-900 border-slate-100 shadow-inner">
                <CheckCircle2 className="w-4.5 h-4.5 text-rose-500 shrink-0" />
                <span className="font-medium">{amenity}</span>
              </div>
            ))}
          </div>
        </section>

        {/* SECTION 5: Submit Application */}
        <section id="apply-form-section" className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch pt-6 border-t dark:border-slate-900 border-slate-250">
          
          {/* Left instructions block */}
          <div className="lg:col-span-5 flex flex-col justify-between p-8 rounded-3xl dark:bg-slate-900/50 bg-white border dark:border-slate-900 border-slate-200 shadow-sm space-y-6">
            <div className="space-y-4">
              <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-500 w-fit">
                <ClipboardList className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold">{language === 'kg' ? 'Арыз тапшыруу эрежеси' : 'Правила подачи заявления'}</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                {language === 'kg' 
                  ? 'Окуу жатаканасына орун алуу үчүн тийиштүү анкетаны толтуруп, студенттик күбөлүктү же паспортту тиркеңиз. Комендант маалыматты текшерип, чечим кабыл алат.' 
                  : language === 'ru'
                  ? 'Для бронирования койко-места необходимо заполнить цифровую анкету и прикрепить фото студенческого билета/паспорта. После верификации комендантом вы получите доступ к оплате.'
                  : 'To book a bed, fill out the digital questionnaire and attach a photo of your student card or passport. Access to booking unlocks once validated.'}
              </p>
            </div>

            <div className="space-y-3.5 border-t dark:border-slate-850 border-slate-200 pt-5 text-2xs text-slate-400">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                <span>{language === 'kg' ? 'Маалыматтардын жашыруундуулугу корголот' : 'Конфиденциальность данных защищена'}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-rose-500" />
                <span>{language === 'kg' ? 'Кароо убактысы: 1 жумушчу күн' : 'Время рассмотрения: до 24 часов'}</span>
              </div>
            </div>
          </div>

          {/* Right Application Form */}
          <div className="lg:col-span-7 dark:bg-slate-900 bg-white border dark:border-slate-800 border-slate-200 p-8 rounded-3xl shadow-sm space-y-6">
            <h3 className="text-lg font-bold">{language === 'kg' ? 'Турак жай алуу арызы' : 'Анкета на заселение в общежитие'}</h3>
            
            {appAlert && (
              <div className={`p-4 rounded-xl border flex items-start gap-2.5 text-xs animate-fadeIn ${
                appAlert.type === 'success' 
                  ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-600 dark:text-emerald-450 font-semibold' 
                  : 'bg-red-500/10 border-red-500/20 text-red-505'
              }`}>
                <CheckCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{appAlert.text}</span>
              </div>
            )}

            {myApplication ? (
              <div className="p-6 rounded-2xl dark:bg-slate-950 bg-slate-100 border dark:border-slate-900 border-slate-200 space-y-4 animate-fadeIn">
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-xl border ${
                    myApplication.status === 'approved' 
                      ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-600 dark:text-emerald-450 animate-pulse'
                      : myApplication.status === 'rejected'
                      ? 'bg-red-500/10 border-red-500/20 text-red-500'
                      : 'bg-rose-500/10 border-rose-500/20 text-rose-500'
                  }`}>
                    <ClipboardList className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold">
                      {myApplication.status === 'approved' 
                        ? d.appApprovedMsg 
                        : myApplication.status === 'rejected'
                        ? (language === 'kg' ? 'Сиздин арыз четке кагылды' : 'Ваша заявка отклонена')
                        : d.appPendingMsg}
                    </h4>
                    <span className="text-[10px] text-slate-500 font-semibold">Submitted on {myApplication.date}</span>
                  </div>
                </div>

                <p className="text-xs text-slate-400 leading-relaxed border-t dark:border-slate-850 border-slate-200 pt-3">
                  {myApplication.status === 'approved' 
                    ? (language === 'kg' ? 'Куттуктайбыз! Арызыңыз кабыл алынды. Эми жогорудагы каталогдон каалаган бош бөлмөнү тандап, "Забронировать" басыңыз.' : 'Поздравляем! Заявка одобрена. Теперь выберите любую свободную комнату в каталоге выше и нажмите кнопку "Забронировать" для оплаты.')
                    : myApplication.status === 'rejected'
                    ? (language === 'kg' ? 'Арыз четке кагылды. Сураныч, комендант менен байланышып маселени тактаңыз.' : 'Заявка отклонена. Пожалуйста, свяжитесь с комендантом для прояснения деталей.')
                    : d.appPendingDesc}
                </p>
              </div>
            ) : (
              <form onSubmit={handleApply} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-2xs font-bold text-slate-500 uppercase tracking-wide">{language === 'kg' ? 'Факультет / Институтуңуз:' : 'Ваш факультет / институт:'}</label>
                    <select
                      value={faculty}
                      onChange={(e) => setFaculty(e.target.value)}
                      className="w-full dark:bg-slate-950 bg-slate-50 border dark:border-slate-850 border-slate-200 dark:text-white text-slate-900 rounded-xl py-3 px-4 text-xs focus:outline-none focus:ring-1 focus:ring-rose-500 transition-all cursor-pointer"
                    >
                      <option value="Информатика жана ИТ">Информатика жана ИТ</option>
                      <option value="Медициналык">Медицинский</option>
                      <option value="Педагогикалык">Педагогический</option>
                      <option value="Эл аралык мамилелер">Международных отношений</option>
                      <option value="Юридикалык">Юридический</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-2xs font-bold text-slate-500 uppercase tracking-wide">{language === 'kg' ? 'Окуу курсу:' : 'Курс обучения:'}</label>
                    <select
                      value={course}
                      onChange={(e) => setCourse(e.target.value)}
                      className="w-full dark:bg-slate-950 bg-slate-50 border dark:border-slate-850 border-slate-200 dark:text-white text-slate-900 rounded-xl py-3 px-4 text-xs focus:outline-none focus:ring-1 focus:ring-rose-500 transition-all cursor-pointer"
                    >
                      <option value="1">1-курс</option>
                      <option value="2">2-курс</option>
                      <option value="3">3-курс</option>
                      <option value="4">4-курс</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-2xs font-bold text-slate-500 uppercase tracking-wide">{language === 'kg' ? 'Социалдык статусуңуз:' : 'Социальный статус:'}</label>
                  <select
                    value={socialStatus}
                    onChange={(e) => setSocialStatus(e.target.value)}
                    className="w-full dark:bg-slate-950 bg-slate-50 border dark:border-slate-850 border-slate-200 dark:text-white text-slate-900 rounded-xl py-3 px-4 text-xs focus:outline-none focus:ring-1 focus:ring-rose-500 transition-all cursor-pointer"
                  >
                    <option value="Орто">Стандартный / Орто</option>
                    <option value="Аз камсыз болгон үй-бүлө">Аз камсыз болгон (Малообеспеченный)</option>
                    <option value="Тоголок жетим">Жетим студент (Сирота)</option>
                    <option value="Мүмкүнчүлүгү чектелген">Ден соолугу чектелген (ЛОВЗ)</option>
                  </select>
                </div>

                {/* Upload document box */}
                <div className="space-y-2">
                  <label className="text-2xs font-bold text-slate-500 uppercase tracking-wide">{language === 'kg' ? 'Паспорт же Студенттик күбөлүк сүрөтү:' : 'Фото паспорта или студенческого билета:'}</label>
                  <div className="border-2 border-dashed dark:border-slate-800 border-slate-200 hover:border-rose-500/50 dark:hover:border-rose-500/50 rounded-2xl p-6 text-center transition-colors relative cursor-pointer">
                    <input 
                      type="file" 
                      accept="image/*"
                      onChange={(e) => setStudentCardFile(e.target.files?.[0] || null)}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
                    />
                    <UploadCloud className="w-8 h-8 text-rose-500 mx-auto mb-2" />
                    {studentCardFile ? (
                      <span className="text-xs font-bold text-emerald-500 truncate block max-w-xs mx-auto">✓ {studentCardFile.name}</span>
                    ) : (
                      <>
                        <span className="text-xs font-bold block">{language === 'kg' ? 'Файлды сүйрөп келиңиз же басыңыз' : 'Перетащите файл или нажмите для выбора'}</span>
                        <span className="text-[10px] text-slate-400 mt-1 block">PNG, JPG up to 5MB</span>
                      </>
                    )}
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={submittingApp}
                  className="w-full flex items-center justify-center gap-2 py-3.5 bg-gradient-to-r from-rose-500 to-violet-605 hover:brightness-110 text-white font-bold rounded-2xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer shadow-lg shadow-rose-550/10 text-xs"
                >
                  {submittingApp ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>{language === 'kg' ? 'Арызды жөнөтүү' : 'Отправить заявление'}</span>
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </section>

        {/* Meet the Commandant & Staff Reviews */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Reviews list */}
          <div className="lg:col-span-12 dark:bg-slate-900 bg-white border dark:border-slate-800 border-slate-200 p-8 rounded-3xl shadow-sm space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold">{language === 'kg' ? 'Студенттердин пикирлери' : language === 'ru' ? 'Отзывы студентов' : 'Student Reviews'}</h2>
              <div className="flex items-center gap-1 text-sm font-bold">
                <Star className="w-4 h-4 text-amber-500 fill-current" />
                <span>{activeDorm.kg.rating} / 5.0 ({activeDorm.kg.reviewsCount} {language === 'kg' ? 'пикир' : language === 'ru' ? 'отзывов' : 'reviews'})</span>
              </div>
            </div>

            {/* Leave Review Form */}
            <form onSubmit={handleAddReview} className="p-4 rounded-2xl dark:bg-slate-950 bg-slate-55 border dark:border-slate-850 border-slate-200 space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-rose-500">{language === 'kg' ? 'Пикир калтыруу' : language === 'ru' ? 'Оставить отзыв' : 'Leave a Review'}</h3>
              
              {reviewSuccess && (
                <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 text-xs font-bold animate-fadeIn">
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
                className="w-full flex items-center justify-center gap-1.5 py-2.5 bg-gradient-to-r from-rose-500 to-violet-605 text-white text-xs font-bold rounded-xl hover:brightness-110 transition-all cursor-pointer shadow-md"
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

      {/* MBANK / ELCART INTERACTIVE PAYMENT SCANNER MODAL */}
      {payModalOpen && selectedRoomToBook && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-fadeIn" onClick={() => setPayModalOpen(false)}>
          <div 
            className="w-full max-w-lg dark:bg-slate-900 bg-white border dark:border-slate-800 border-slate-200 rounded-3xl p-8 shadow-2xl space-y-6 relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b dark:border-slate-850 border-slate-200 pb-4">
              <div>
                <h4 className="text-xl font-black">{language === 'kg' ? 'ОшМУ Төлөм Системасы' : language === 'ru' ? 'Платежный шлюз ОшГУ' : 'OshSU Payment Gateway'}</h4>
                <p className="text-xs text-slate-500 mt-0.5">{language === 'kg' ? 'Тез арада төлөмдү текшерүү жана бөлмөгө жайгашуу' : 'Мгновенная оплата и верификация бронирования'}</p>
              </div>
              <button 
                onClick={() => setPayModalOpen(false)}
                className="p-1.5 rounded-xl hover:bg-slate-500/10 transition-all cursor-pointer"
              >
                <X className="w-6 h-6 text-slate-400" />
              </button>
            </div>

            {/* Simulated OCR Scanner Screen */}
            <div className="space-y-4">
              <div className="p-4 rounded-2xl dark:bg-slate-950 bg-slate-50 border dark:border-slate-850 border-slate-200 text-xs space-y-2">
                <div className="flex justify-between font-semibold">
                  <span className="text-slate-400">Dormitory:</span>
                  <span className="font-bold">{activeDorm[language].name}</span>
                </div>
                <div className="flex justify-between font-semibold">
                  <span className="text-slate-400">Room to Book:</span>
                  <span className="text-rose-500 font-extrabold">{selectedRoomToBook.number}-бөлмө</span>
                </div>
                <div className="flex justify-between font-semibold">
                  <span className="text-slate-400">Bed Place:</span>
                  <span className="font-bold">Bed №{selectedRoomToBook.occupied + 1}</span>
                </div>
                <div className="flex justify-between font-semibold">
                  <span className="text-slate-400">Amount Due:</span>
                  <span className="font-extrabold text-emerald-500">12,000 KGS</span>
                </div>
              </div>

              {/* Interactive payment options QR Code */}
              <div className="flex items-center gap-4 p-4 rounded-2xl border dark:border-slate-850 border-slate-200 bg-slate-500/5">
                <div className="p-2 bg-white rounded-xl shadow-inner shrink-0">
                  <QrCode className="w-16 h-16 text-slate-950" />
                </div>
                <div className="text-2xs leading-relaxed text-slate-400">
                  <span className="font-bold text-slate-900 dark:text-white block mb-0.5">Реквизиты ОшГУ (MBank / Elcart)</span>
                  {language === 'kg' 
                    ? 'Жогорудагы QR кодду банк тиркемесинен сканерлеп төлөңүз, же МБанктан "Университеттер -> ОшМУ" тандап 12,000 сом жөнөтүңүз. Андан соң алынган дүмүрчөк сүрөтүн төмөнкү ИИ сканерине тиркеңиз.'
                    : 'Отсканируйте QR-код в приложении вашего банка или отправьте 12,000 сом в приложении МБанк по разделу "ВУЗы -> ОшГУ". Полученную квитанцию прикрепите ниже для проверки ИИ.'
                  }
                </div>
              </div>

              {/* Receipt File Uploader & OCR Status Indicator */}
              <div className="space-y-3">
                <label className="text-2xs font-black text-slate-400 uppercase tracking-wider block">{language === 'kg' ? 'МБанк чегин жүктөө (ИИ сканер)' : 'Загрузить чек МБанка (ИИ сканер)'}</label>
                
                {ocrScanning ? (
                  <div className="p-8 rounded-2xl dark:bg-slate-950 bg-slate-50 border dark:border-slate-850 border-slate-200 text-center space-y-4 animate-fadeIn">
                    <div className="w-8 h-8 border-3 border-rose-500 border-t-transparent rounded-full animate-spin mx-auto" />
                    <div className="space-y-1">
                      <div className="text-xs font-black text-rose-500">{ocrStatus}</div>
                      <div className="text-[10px] text-slate-400 animate-pulse">AI OCR is analyzing metadata...</div>
                    </div>
                  </div>
                ) : ocrSuccess ? (
                  <div className="p-8 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-center space-y-3.5 animate-fadeIn">
                    <CheckCircle className="w-10 h-10 text-emerald-500 mx-auto animate-bounce" />
                    <div className="space-y-1 text-xs">
                      <div className="font-black text-emerald-600 dark:text-emerald-450">✓ {language === 'kg' ? 'Төлөм Ийгиликтүү Кабыл Алынды!' : 'Транзакция Успешно Верифицирована!'}</div>
                      <div className="text-[10px] text-slate-500">
                        {language === 'kg' 
                          ? 'ИИ дүмүрчөктү окуп бүттү. Бөлмө сиз үчүн ээленди. Жеке кабинетке багыттоо жүрүүдө...' 
                          : 'ИИ распознал квитанцию. Бронь успешно создана. Перенаправление в кабинет...'
                        }
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="border-2 border-dashed dark:border-slate-800 border-slate-200 hover:border-rose-500/50 rounded-2xl p-8 text-center transition-colors relative cursor-pointer">
                    <input 
                      type="file" 
                      accept="image/*"
                      onChange={handleReceiptUpload}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
                    />
                    <UploadCloud className="w-8 h-8 text-rose-550 mx-auto mb-2" />
                    <span className="text-xs font-bold block">{language === 'kg' ? 'Төлөм чегин жүктөө' : 'Прикрепить скриншот чека'}</span>
                    <span className="text-[10px] text-slate-400 mt-1 block">Click to upload or drag receipt image</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="relative px-6 py-12 z-10 border-t dark:border-slate-900 border-slate-200 bg-white dark:bg-slate-950 transition-colors">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-sm dark:text-slate-550 text-slate-450">
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
