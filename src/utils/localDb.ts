'use client'

// Local Database Helper for OshSU Dormitory Booking System
// Stores state in localStorage to allow instant reactivity between student, commandant, and admin dashboards

export interface UserSession {
  email: string
  fullName: string
  role: 'student' | 'commandant' | 'admin'
}

export interface HousingApplication {
  id: string
  studentName: string
  studentEmail: string
  faculty: string
  course: string
  socialStatus: string
  dormId: string
  dormName: string
  status: 'pending' | 'approved' | 'rejected'
  date: string
}

export interface RoomBooking {
  id: string
  studentName: string
  studentEmail: string
  dormId: string
  dormName: string
  roomNumber: string
  bedNumber: string
  amount: string
  paymentType: string
  referenceId: string
  date: string
  status: 'pending' | 'approved'
}

// 7 Dormitories Static Data
export const SEVEN_DORMITORIES = [
  {
    id: '1',
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
  {
    id: '2',
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
  {
    id: '3',
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
  },
  {
    id: '4',
    kg: {
      tag: 'Медициналык',
      name: '№4 Жатакана (Медициналык)',
      desc: 'Медициналык факультеттин студенттери үчүн атайын кампус. Окуу лабораторияларына жана университеттин клиникаларына абдан жакын жайгашкан.',
      commandantName: 'Маматова Гүлнура Садыковна',
      rating: '4.6',
      reviewsCount: 42,
      address: 'Ош шаары, Курманжан Датка көчөсү, 204',
      phone: '+996 (702) 22-33-44',
      capacity: '500 орун',
      roomsCount: '130 бөлмө',
      floors: '5 кабат',
      yearBuilt: '1985 (Реконструкция: 2022)',
      amenities: ['Медициналык пункт', 'Окуу залы', 'Ыкчам Wi-Fi', 'Кир жуучу жай', 'Спорт аянтчасы', 'Коопсуздук 24/7'],
    },
    ru: {
      tag: 'Медицинское',
      name: 'Общежитие №4 (Медицинское)',
      desc: 'Специальный кампус для студентов медицинского факультета. Расположен в непосредственной близости от учебных лабораторий и клиник университета.',
      commandantName: 'Маматова Гүлнура Садыковна',
      rating: '4.6',
      reviewsCount: 42,
      address: 'г. Ош, ул. Курманжан Датки, 204',
      phone: '+996 (702) 22-33-44',
      capacity: '500 мест',
      roomsCount: '130 комнат',
      floors: '5 этажей',
      yearBuilt: '1985 (Реконструкция: 2022)',
      amenities: ['Медпункт', 'Читальный зал', 'Быстрый Wi-Fi', 'Прачечная', 'Спортплощадка', 'Охрана 24/7'],
    },
    en: {
      tag: 'Medical Campus',
      name: 'Dormitory №4 (Medical)',
      desc: 'Dedicated campus for students of the Medical Faculty. Situated in very close proximity to research laboratories and the university clinic.',
      commandantName: 'Mamatova Gulnura Sadykovna',
      rating: '4.6',
      reviewsCount: 42,
      address: 'Osh city, Kurmanjan Datka street, 204',
      phone: '+996 (702) 22-33-44',
      capacity: '500 beds',
      roomsCount: '130 rooms',
      floors: '5 floors',
      yearBuilt: '1985 (Reconstructed: 2022)',
      amenities: ['Medical Unit', 'Study Room', 'Fast Wi-Fi', 'Laundry Room', 'Sports Ground', 'Security 24/7'],
    }
  },
  {
    id: '5',
    kg: {
      tag: 'Педагогикалык',
      name: '№5 Жатакана (Педагогикалык)',
      desc: 'Педагогикалык багыттагы студенттер жашаган жайлуу жатакана. Чыгармачыл иш-чаралар жана сабак даярдоо үчүн мыкты шарттар түзүлгөн.',
      commandantName: 'Садыкова Назира Токтогуловна',
      rating: '4.5',
      reviewsCount: 18,
      address: 'Ош шаары, Г. Айтиев көчөсү, 8',
      phone: '+996 (550) 88-99-00',
      capacity: '350 орун',
      roomsCount: '90 бөлмө',
      floors: '4 кабат',
      yearBuilt: '1990',
      amenities: ['Музыка бөлмөсү', 'Китепкана', 'Ашкана', 'Ыкчам Wi-Fi', 'Кир жуучу жай', 'Коопсуздук камералары'],
    },
    ru: {
      tag: 'Педагогическое',
      name: 'Общежитие №5 (Педагогическое)',
      desc: 'Уютное общежитие, где в основном проживают будущие педагоги. Созданы прекрасные условия для творческих мероприятий и подготовки к занятиям.',
      commandantName: 'Садыкова Назира Токтогуловна',
      rating: '4.5',
      reviewsCount: 18,
      address: 'г. Ош, ул. Г. Айтиева, 8',
      phone: '+996 (550) 88-99-00',
      capacity: '350 мест',
      roomsCount: '90 комнат',
      floors: '4 этажа',
      yearBuilt: '1990',
      amenities: ['Музыкальная комната', 'Библиотека', 'Столовая', 'Быстрый Wi-Fi', 'Прачечная', 'Камеры наблюдения'],
    },
    en: {
      tag: 'Pedagogical',
      name: 'Dormitory №5 (Pedagogical)',
      desc: 'A cozy dormitory predominantly populated by students of pedagogical faculties. Excellent conditions are established for group study and activities.',
      commandantName: 'Sadykova Nazira Toktogulovna',
      rating: '4.5',
      reviewsCount: 18,
      address: 'Osh city, G. Aitiev street, 8',
      phone: '+996 (550) 88-99-00',
      capacity: '350 beds',
      roomsCount: '90 rooms',
      floors: '4 floors',
      yearBuilt: '1990',
      amenities: ['Music Room', 'Library', 'Cafeteria', 'Fast Wi-Fi', 'Laundry Room', 'Security Cameras'],
    }
  },
  {
    id: '6',
    kg: {
      tag: 'Техникалык',
      name: '№6 Жатакана (Техникалык)',
      desc: 'ИТ жана инженердик факультеттердин студенттери үчүн коворкинг аянтчалары жана 3D лабораториялары бар заманбап санариптик жатакана.',
      commandantName: 'Абдыкадыров Нурлан Токтосунович',
      rating: '4.8',
      reviewsCount: 31,
      address: 'Ош шаары, Ленин көчөсү, 287',
      phone: '+996 (709) 55-66-77',
      capacity: '400 орун',
      roomsCount: '100 бөлмө',
      floors: '5 кабат',
      yearBuilt: '2018',
      amenities: ['ИТ Коворкинг', '3D Принтер зонасы', 'Ыкчам Wi-Fi', 'Спорт зал', 'Эс алуу зонасы', 'Коопсуздук 24/7'],
    },
    ru: {
      tag: 'Техническое',
      name: 'Общежитие №6 (Техническое)',
      desc: 'Современное цифровое общежитие для студентов ИТ и инженерных специальностей, оборудованное зонами коворкинга и мини-лабораториями.',
      commandantName: 'Абдыкадыров Нурлан Токтосунович',
      rating: '4.8',
      reviewsCount: 31,
      address: 'г. Ош, ул. Ленина, 287',
      phone: '+996 (709) 55-66-77',
      capacity: '400 мест',
      roomsCount: '100 комнат',
      floors: '5 этажей',
      yearBuilt: '2018',
      amenities: ['IT Коворкинг', 'Зона 3D-печати', 'Быстрый Wi-Fi', 'Спортзал', 'Зона отдыха', 'Охрана 24/7'],
    },
    en: {
      tag: 'Technical',
      name: 'Dormitory №6 (Technical)',
      desc: 'Modern digital dormitory tailored for IT and Engineering students, equipped with study stations, fast optical link, and maker space layout.',
      commandantName: 'Abdykadyrov Nurlan Toktosunovich',
      rating: '4.8',
      reviewsCount: 31,
      address: 'Osh city, Lenin street, 287',
      phone: '+996 (709) 55-66-77',
      capacity: '400 beds',
      roomsCount: '100 rooms',
      floors: '5 floors',
      yearBuilt: '2018',
      amenities: ['IT Coworking', '3D Print Lab', 'Fast Wi-Fi', 'Gym', 'Lounge Area', 'Security 24/7'],
    }
  },
  {
    id: '7',
    kg: {
      tag: 'Спорттук',
      name: '№7 Жатакана (Спорттук)',
      desc: 'Дене тарбия жана спорт багытындагы студенттер үчүн толук жабдылган фитнес борбору жана ачык стадиону бар заманбап спорт жатаканасы.',
      commandantName: 'Асанов Руслан Кубанычбекович',
      rating: '4.7',
      reviewsCount: 25,
      address: 'Ош шаары, Исанов көчөсү, 89',
      phone: '+996 (770) 99-88-77',
      capacity: '300 орун',
      roomsCount: '80 бөлмө',
      floors: '4 кабат',
      yearBuilt: '2020',
      amenities: ['Кроссфит зал', 'Ачык стадион', 'Ыкчам Wi-Fi', 'Кир жуучу жай', 'Эко-буфет', 'Жылуулук системасы'],
    },
    ru: {
      tag: 'Спортивное',
      name: 'Общежитие №7 (Спортивное)',
      desc: 'Современное спортивное общежитие для студентов факультета физической культуры и спорта со встроенным кроссфит-залом и открытым стадионом.',
      commandantName: 'Асанов Руслан Кубанычбекович',
      rating: '4.7',
      reviewsCount: 25,
      address: 'г. Ош, ул. Исанова, 89',
      phone: '+996 (770) 99-88-77',
      capacity: '300 мест',
      roomsCount: '80 комнат',
      floors: '4 этажа',
      yearBuilt: '2020',
      amenities: ['Кроссфит-зал', 'Открытый стадион', 'Быстрый Wi-Fi', 'Прачечная', 'Эко-буфет', 'Отопление'],
    },
    en: {
      tag: 'Sports Campus',
      name: 'Dormitory №7 (Sports)',
      desc: 'State-of-the-art sports dormitory for Physical Culture and Sports students, complete with an indoor gym, crossfit zone, and access to the stadium.',
      commandantName: 'Asanov Ruslan Kubanychbekovich',
      rating: '4.7',
      reviewsCount: 25,
      address: 'Osh city, Isanov street, 89',
      phone: '+996 (770) 99-88-77',
      capacity: '300 beds',
      roomsCount: '80 rooms',
      floors: '4 floors',
      yearBuilt: '2020',
      amenities: ['Crossfit Gym', 'Outdoor Stadium', 'Fast Wi-Fi', 'Laundry Room', 'Eco-Buffet', 'Central Heating'],
    }
  }
]

// Seed Initial Data
const initializeLocalStorage = () => {
  if (typeof window === 'undefined') return

  // Seed applications
  if (!localStorage.getItem('oshsu_applications')) {
    const defaultApps: HousingApplication[] = [
      {
        id: '1',
        studentName: 'Асанов Алмаз Талантбекович',
        studentEmail: 'almaz.asanov@oshsu.kg',
        faculty: 'Эл аралык мамилелер',
        course: '2',
        socialStatus: 'Орто',
        dormId: '1',
        dormName: '№1 Жатакана (Башкы корпус)',
        status: 'pending',
        date: '19.05.2026'
      },
      {
        id: '2',
        studentName: 'Бакытова Айсулуу Кубанычбековна',
        studentEmail: 'aisuluu.b@oshsu.kg',
        faculty: 'Юридикалык',
        course: '3',
        socialStatus: 'Орто',
        dormId: '2',
        dormName: '№2 Жатакана (Эл аралык)',
        status: 'approved',
        date: '18.05.2026'
      },
      {
        id: '3',
        studentName: 'Жапаров Данияр Темирбекович',
        studentEmail: 'daniyar.j@oshsu.kg',
        faculty: 'Табигый илимдер',
        course: '1',
        socialStatus: 'Орто',
        dormId: '3',
        dormName: '№3 Жатакана (Жаңы конуш)',
        status: 'pending',
        date: '18.05.2026'
      }
    ]
    localStorage.setItem('oshsu_applications', JSON.stringify(defaultApps))
  }

  // Seed bookings
  if (!localStorage.getItem('oshsu_bookings')) {
    const defaultBookings: RoomBooking[] = [
      {
        id: 'b1',
        studentName: 'Бакытова Айсулуу Кубанычбековна',
        studentEmail: 'aisuluu.b@oshsu.kg',
        dormId: '2',
        dormName: '№2 Жатакана (Эл аралык)',
        roomNumber: '202',
        bedNumber: 'Орун №1',
        amount: '12,000 KGS',
        paymentType: 'MBank',
        referenceId: 'TXN-9821-OshSU',
        date: '18.05.2026',
        status: 'approved'
      },
      {
        id: 'b2',
        studentName: 'Кадыров Эрнис Бектурсунович',
        studentEmail: 'ernis.k@oshsu.kg',
        dormId: '3',
        dormName: '№3 Жатакана (Жаңы конуш)',
        roomNumber: '105',
        bedNumber: 'Орун №2',
        amount: '12,000 KGS',
        paymentType: 'Elcart',
        referenceId: 'TXN-3011-OshSU',
        date: '16.05.2026',
        status: 'approved'
      }
    ]
    localStorage.setItem('oshsu_bookings', JSON.stringify(defaultBookings))
  }
}

// Check on import
if (typeof window !== 'undefined') {
  initializeLocalStorage()
}

export const localDb = {
  // Session Manager
  getCurrentUser(): UserSession | null {
    if (typeof window === 'undefined') return null
    const raw = localStorage.getItem('oshsu_currentUser')
    return raw ? JSON.parse(raw) : null
  },

  setCurrentUser(user: UserSession) {
    if (typeof window === 'undefined') return
    localStorage.setItem('oshsu_currentUser', JSON.stringify(user))
  },

  clearCurrentUser() {
    if (typeof window === 'undefined') return
    localStorage.removeItem('oshsu_currentUser')
  },

  // Applications
  getApplications(): HousingApplication[] {
    if (typeof window === 'undefined') return []
    const raw = localStorage.getItem('oshsu_applications')
    return raw ? JSON.parse(raw) : []
  },

  submitApplication(app: Omit<HousingApplication, 'id' | 'date' | 'status'>): HousingApplication {
    const applications = this.getApplications()
    const newApp: HousingApplication = {
      ...app,
      id: Math.random().toString(36).substr(2, 9),
      status: 'pending',
      date: new Date().toLocaleDateString('ru-RU')
    }
    applications.unshift(newApp)
    localStorage.setItem('oshsu_applications', JSON.stringify(applications))
    return newApp
  },

  updateApplicationStatus(appId: string, status: 'approved' | 'rejected') {
    const applications = this.getApplications()
    const updated = applications.map(app => app.id === appId ? { ...app, status } : app)
    localStorage.setItem('oshsu_applications', JSON.stringify(updated))
  },

  // Bookings
  getBookings(): RoomBooking[] {
    if (typeof window === 'undefined') return []
    const raw = localStorage.getItem('oshsu_bookings')
    return raw ? JSON.parse(raw) : []
  },

  createBooking(booking: Omit<RoomBooking, 'id' | 'date' | 'status'>): RoomBooking {
    const bookings = this.getBookings()
    const newBooking: RoomBooking = {
      ...booking,
      id: 'b_' + Math.random().toString(36).substr(2, 9),
      status: 'approved',
      date: new Date().toLocaleDateString('ru-RU')
    }
    bookings.unshift(newBooking)
    localStorage.setItem('oshsu_bookings', JSON.stringify(bookings))
    return newBooking
  },

  // Database Reset
  resetDatabase() {
    if (typeof window === 'undefined') return
    localStorage.removeItem('oshsu_applications')
    localStorage.removeItem('oshsu_bookings')
    localStorage.removeItem('oshsu_currentUser')
    initializeLocalStorage()
  }
}
