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

export interface DormitoryRecord {
  id: string
  name: string
  address: string
  tag: string
  description: string
  commandantName: string
  commandantPhone: string
  rooms: number
  beds: number
  occupied: number
  floors: number
  yearBuilt: string
  status: string
  amenities: string[]
  photos: string[]
  videoUrl: string
}

export interface CommandantAccount {
  id: string
  fullName: string
  email: string
  password: string
  dormId: string
  dormName: string
  phone: string
  createdAt: string
}

// 7 Dormitories Static Data (real OshSU data)
export const SEVEN_DORMITORIES = [
  {
    id: '1',
    kg: {
      tag: 'Башкы корпус',
      name: '№1 Жатакана',
      desc: 'ОшМУнун студенттик жатаканасы 4 кабаттан турат. Жатаканада ысык жана муздак суу, кир жуучу машыналар, ашканада микроволновка жана газ плита бар. Ар бир этажда душ, ажааткана жана ашкана жайгашкан. Эс алуучу бөлмө, актовый зал жана спорт аянтчалары каралган. Алыскы райондордон келген студенттер кезексиз жайгашат.',
      commandantName: 'Парманова Жылдыз',
      rating: '4.8',
      reviewsCount: 38,
      address: 'Ош шаары, Курманжан-Датка көчөсү, 283',
      phone: '0773901993',
      capacity: '370 орун',
      roomsCount: '370 бөлмө',
      floors: '4 кабат',
      yearBuilt: '',
      amenities: ['Ысык/Муздак суу', 'Кир жуучу машыналар', 'Микроволновка', 'Газ плита', 'Эс алуучу бөлмө', 'Актовый зал', 'Спорт аянтчасы', 'Коопсуздук кызматы'],
    },
    ru: {
      tag: 'Главный корпус',
      name: 'Общежитие №1',
      desc: 'Студенческое общежитие ОшГУ на 4 этажа. В общежитии есть горячая и холодная вода, стиральные машины, микроволновка и газовая плита на кухне. На каждом этаже расположены душ, туалет и кухня. Предусмотрены комната отдыха, актовый зал и спортивные площадки. Студенты из отдалённых районов заселяются без очереди.',
      commandantName: 'Парманова Жылдыз',
      rating: '4.8',
      reviewsCount: 38,
      address: 'г. Ош, ул. Курманжан-Датка, 283',
      phone: '0773901993',
      capacity: '370 мест',
      roomsCount: '370 комнат',
      floors: '4 этажа',
      yearBuilt: '',
      amenities: ['Горячая/Холодная вода', 'Стиральные машины', 'Микроволновка', 'Газовая плита', 'Комната отдыха', 'Актовый зал', 'Спортплощадка', 'Служба безопасности'],
    },
    en: {
      tag: 'Main Building',
      name: 'Dormitory №1',
      desc: 'OshSU student dormitory with 4 floors. The dormitory has hot and cold water, washing machines, microwave and gas stove in the kitchen. Each floor has a shower, toilet and kitchen. Recreation room, assembly hall and sports grounds are available. Students from remote districts are admitted without queue.',
      commandantName: 'Parmanova Zhyldyz',
      rating: '4.8',
      reviewsCount: 38,
      address: 'Osh city, Kurmanjan-Datka street, 283',
      phone: '0773901993',
      capacity: '370 beds',
      roomsCount: '370 rooms',
      floors: '4 floors',
      yearBuilt: '',
      amenities: ['Hot/Cold Water', 'Washing Machines', 'Microwave', 'Gas Stove', 'Recreation Room', 'Assembly Hall', 'Sports Ground', 'Security Service'],
    }
  },
  {
    id: '2',
    kg: {
      tag: 'Заманбап корпус',
      name: '№2 Жатакана',
      desc: 'ОшМУнун заманбап жатаканасы. Бөлмөлөрдө уктоочу диван, сабак даярдоочу стол, кийим салганга шкаф, тумба жана урналар бар. Ар бир этажда душ, ажааткана жана ашкана жайгашкан. Коменданттар: Бекболот уулу Дастан (0556266793) жана Юлдашев Мырзахмет (0776568485). Россия, Өзбекстан, Казакстандан жана башка өлкөлөрдөн студенттер жашайт.',
      commandantName: 'Бекболот уулу Дастан',
      rating: '4.9',
      reviewsCount: 52,
      address: 'Ош шаары, Курманжан-Датка көчөсү, 283',
      phone: '0556266793',
      capacity: '484 орун',
      roomsCount: '332 бөлмө',
      floors: '4 кабат',
      yearBuilt: '',
      amenities: ['Ысык/Муздак суу', 'Кир жуучу машыналар', 'Заманбап эмеректер', 'Газ плита', 'Эс алуучу бөлмө', 'Спорт аянтчасы', 'Коопсуздук 24/7'],
    },
    ru: {
      tag: 'Современный корпус',
      name: 'Общежитие №2',
      desc: 'Современное общежитие ОшГУ. В комнатах есть спальный диван, стол для учёбы, шкаф для одежды, тумба и урны. На каждом этаже — душ, туалет и кухня. Коменданты: Бекболот уулу Дастан (0556266793) и Юлдашев Мырзахмет (0776568485). Проживают студенты из России, Узбекистана, Казахстана и других стран.',
      commandantName: 'Бекболот уулу Дастан',
      rating: '4.9',
      reviewsCount: 52,
      address: 'г. Ош, ул. Курманжан-Датка, 283',
      phone: '0556266793',
      capacity: '484 мест',
      roomsCount: '332 комнат',
      floors: '4 этажа',
      yearBuilt: '',
      amenities: ['Горячая/Холодная вода', 'Стиральные машины', 'Современная мебель', 'Газовая плита', 'Комната отдыха', 'Спортплощадка', 'Охрана 24/7'],
    },
    en: {
      tag: 'Modern Building',
      name: 'Dormitory №2',
      desc: 'Modern OshSU dormitory. Rooms have a sleeping sofa, study desk, wardrobe, cabinet and trash bin. Each floor has shower, toilet and kitchen. Commandants: Bekbolot uulu Dastan (0556266793) and Yuldashev Myrzakhmet (0776568485). Students from Russia, Uzbekistan, Kazakhstan and other countries reside here.',
      commandantName: 'Bekbolot uulu Dastan',
      rating: '4.9',
      reviewsCount: 52,
      address: 'Osh city, Kurmanjan-Datka street, 283',
      phone: '0556266793',
      capacity: '484 beds',
      roomsCount: '332 rooms',
      floors: '4 floors',
      yearBuilt: '',
      amenities: ['Hot/Cold Water', 'Washing Machines', 'Modern Furniture', 'Gas Stove', 'Recreation Room', 'Sports Ground', 'Security 24/7'],
    }
  },
  {
    id: '3',
    kg: {
      tag: 'Заманбап корпус',
      name: '№3 Жатакана',
      desc: 'ОшМУнун заманбап талапка жооп берген жатаканасы. Алыскы райондордон келген студенттер кезексиз жайгашат. Мүмкүнчүлүгү чектелген жана ата-энеси жок аярлуу катмардагы студенттер үчүн атайын орундар каралган. Ар бир этажда душ, ажааткана жана ашкана бар. Ар жылы капиталдык оңдоо иштери жүргүзүлөт.',
      commandantName: '',
      rating: '4.7',
      reviewsCount: 29,
      address: 'Ош шаары, Курманжан-Датка көчөсү, 283',
      phone: '',
      capacity: '300 орун',
      roomsCount: '200 бөлмө',
      floors: '4 кабат',
      yearBuilt: '',
      amenities: ['Ысык/Муздак суу', 'Кир жуучу машыналар', 'Газ плита', 'Атайын орундар (аярлуу катмар)', 'Спорт аянтчасы', 'Медициналык клиника'],
    },
    ru: {
      tag: 'Современный корпус',
      name: 'Общежитие №3',
      desc: 'Современное общежитие ОшГУ. Студенты из отдалённых районов заселяются без очереди. Для студентов с ограниченными возможностями и из уязвимых семей предусмотрены специальные места. На каждом этаже есть душ, туалет и кухня. Ежегодно проводится капитальный ремонт.',
      commandantName: '',
      rating: '4.7',
      reviewsCount: 29,
      address: 'г. Ош, ул. Курманжан-Датка, 283',
      phone: '',
      capacity: '300 мест',
      roomsCount: '200 комнат',
      floors: '4 этажа',
      yearBuilt: '',
      amenities: ['Горячая/Холодная вода', 'Стиральные машины', 'Газовая плита', 'Спецместа (льготники)', 'Спортплощадка', 'Медицинская клиника'],
    },
    en: {
      tag: 'Modern Building',
      name: 'Dormitory №3',
      desc: 'Modern OshSU dormitory. Students from remote districts are admitted without queue. Special places are provided for students with disabilities and from vulnerable families. Each floor has shower, toilet and kitchen. Annual capital renovation is carried out.',
      commandantName: '',
      rating: '4.7',
      reviewsCount: 29,
      address: 'Osh city, Kurmanjan-Datka street, 283',
      phone: '',
      capacity: '300 beds',
      roomsCount: '200 rooms',
      floors: '4 floors',
      yearBuilt: '',
      amenities: ['Hot/Cold Water', 'Washing Machines', 'Gas Stove', 'Special Places (льготники)', 'Sports Ground', 'Medical Clinic'],
    }
  },
  {
    id: '4',
    kg: {
      tag: 'Масалиева корпусу',
      name: '№4 Жатакана',
      desc: 'ОшМУнун студенттик жатаканасы. Жатаканада бардык коопсуздук эрежелери сакталган, тазалыкка жетиштүү көңүл бурулат. ОшМУнун коопсуздук кызматы, медициналык клиника жана декандын тарбия иштери боюнча орун басарлары иш алып барат. Студенттердин чыгармачылыгы жана спорту үчүн аянтчалар каралган.',
      commandantName: 'Эрлан',
      rating: '4.6',
      reviewsCount: 42,
      address: 'Ош шаары, Масалиева көчөсү, 93',
      phone: '0778937924',
      capacity: '233 орун',
      roomsCount: '233 бөлмө',
      floors: '4 кабат',
      yearBuilt: '',
      amenities: ['Ысык/Муздак суу', 'Кир жуучу машыналар', 'Газ плита', 'Медициналык клиника', 'Коопсуздук кызматы', 'Спорт аянтчасы'],
    },
    ru: {
      tag: 'Корпус Масалиева',
      name: 'Общежитие №4',
      desc: 'Студенческое общежитие ОшГУ. В общежитии строго соблюдаются все правила безопасности, поддерживается чистота. Работают служба безопасности ОшГУ, медицинская клиника и заместители деканов по воспитательной работе. Предусмотрены площадки для творчества и спорта студентов.',
      commandantName: 'Эрлан',
      rating: '4.6',
      reviewsCount: 42,
      address: 'г. Ош, ул. Масалиева, 93',
      phone: '0778937924',
      capacity: '233 мест',
      roomsCount: '233 комнат',
      floors: '4 этажа',
      yearBuilt: '',
      amenities: ['Горячая/Холодная вода', 'Стиральные машины', 'Газовая плита', 'Медицинская клиника', 'Служба безопасности', 'Спортплощадка'],
    },
    en: {
      tag: 'Masalieva Building',
      name: 'Dormitory №4',
      desc: 'OshSU student dormitory. Strict safety rules are observed, cleanliness is maintained. OshSU security service, medical clinic and vice-deans for educational work are available. Creative and sports facilities are provided for students.',
      commandantName: 'Erlan',
      rating: '4.6',
      reviewsCount: 42,
      address: 'Osh city, Masalieva street, 93',
      phone: '0778937924',
      capacity: '233 beds',
      roomsCount: '233 rooms',
      floors: '4 floors',
      yearBuilt: '',
      amenities: ['Hot/Cold Water', 'Washing Machines', 'Gas Stove', 'Medical Clinic', 'Security Service', 'Sports Ground'],
    }
  },
  {
    id: '5',
    kg: {
      tag: 'Мамалиева корпусу',
      name: '№5 Жатакана',
      desc: 'Студенттердин чыгармачылыгын өркүндөтүүсүнө, спорт менен айлануусуна жана тил курстарын окуп үйрөнүүсүнө шарт түзүлгөн жатакана. Ар бир этажда душ, ажааткана жана ашкана жайгашкан. Электр жабдыктарын колдонуу боюнча коменданттар тарабынан үнөмдөө эрежелери түшүндүрүлөт.',
      commandantName: 'Боронбаев Бакыт',
      rating: '4.5',
      reviewsCount: 18,
      address: 'Ош шаары, Мамалиева көчөсү, 93',
      phone: '0707540050',
      capacity: '307 орун',
      roomsCount: '307 бөлмө',
      floors: '4 кабат',
      yearBuilt: '',
      amenities: ['Ысык/Муздак суу', 'Кир жуучу машыналар', 'Тил курстары', 'Чыгармачылык бөлмөсү', 'Спорт аянтчасы', 'Коопсуздук камералары'],
    },
    ru: {
      tag: 'Корпус Мамалиева',
      name: 'Общежитие №5',
      desc: 'Общежитие создаёт условия для развития творчества студентов, занятий спортом и изучения языковых курсов. На каждом этаже есть душ, туалет и кухня. Комендант проводит инструктаж по экономному использованию электроприборов и воды.',
      commandantName: 'Боронбаев Бакыт',
      rating: '4.5',
      reviewsCount: 18,
      address: 'г. Ош, ул. Мамалиева, 93',
      phone: '0707540050',
      capacity: '307 мест',
      roomsCount: '307 комнат',
      floors: '4 этажа',
      yearBuilt: '',
      amenities: ['Горячая/Холодная вода', 'Стиральные машины', 'Языковые курсы', 'Творческая комната', 'Спортплощадка', 'Камеры наблюдения'],
    },
    en: {
      tag: 'Mamalieva Building',
      name: 'Dormitory №5',
      desc: 'The dormitory creates conditions for students to develop creativity, do sports and study language courses. Each floor has shower, toilet and kitchen. The commandant instructs on economical use of appliances and water.',
      commandantName: 'Boronbaev Bakyt',
      rating: '4.5',
      reviewsCount: 18,
      address: 'Osh city, Mamalieva street, 93',
      phone: '0707540050',
      capacity: '307 beds',
      roomsCount: '307 rooms',
      floors: '4 floors',
      yearBuilt: '',
      amenities: ['Hot/Cold Water', 'Washing Machines', 'Language Courses', 'Creative Room', 'Sports Ground', 'Security Cameras'],
    }
  },
  {
    id: '6',
    kg: {
      tag: 'Исанова корпусу',
      name: '№6 Жатакана',
      desc: 'ОшМУнун студенттик жатаканасы. Студенттердин коопсуздугу, ден-соолугу, тарбиясы жана билим алуусу үчүн ыңгайлуу шарттар камсыздалган. ОшМУнун коопсуздук кызматы, медициналык клиника жана жатаканалар боюнча тарбиячы жеткиликтүү иш алып барат. Байланыш: Сулайманова Айжан 0706686779.',
      commandantName: 'Маматов Нурбай',
      rating: '4.8',
      reviewsCount: 31,
      address: 'Ош шаары, Исанова көчөсү, 85А',
      phone: '0776619912',
      capacity: '200 орун',
      roomsCount: '144 бөлмө',
      floors: '4 кабат',
      yearBuilt: '',
      amenities: ['Ысык/Муздак суу', 'Кир жуучу машыналар', 'Газ плита', 'Медициналык клиника', 'Коопсуздук 24/7', 'Тарбиячы кызматы'],
    },
    ru: {
      tag: 'Корпус Исанова',
      name: 'Общежитие №6',
      desc: 'Студенческое общежитие ОшГУ. Обеспечены комфортные условия для безопасности, здоровья, воспитания и учёбы студентов. Работают служба безопасности ОшГУ, медицинская клиника и воспитатель по общежитиям. Контакт воспитателя: Сулайманова Айжан, 0706686779.',
      commandantName: 'Маматов Нурбай',
      rating: '4.8',
      reviewsCount: 31,
      address: 'г. Ош, ул. Исанова, 85А',
      phone: '0776619912',
      capacity: '200 мест',
      roomsCount: '144 комнат',
      floors: '4 этажа',
      yearBuilt: '',
      amenities: ['Горячая/Холодная вода', 'Стиральные машины', 'Газовая плита', 'Медицинская клиника', 'Охрана 24/7', 'Служба воспитателя'],
    },
    en: {
      tag: 'Isanova Building',
      name: 'Dormitory №6',
      desc: 'OshSU student dormitory. Comfortable conditions for safety, health, education and study of students are provided. OshSU security service, medical clinic and dormitory counselor work here. Counselor contact: Sulaimanova Aizhan, 0706686779.',
      commandantName: 'Mamatov Nurbay',
      rating: '4.8',
      reviewsCount: 31,
      address: 'Osh city, Isanova street, 85A',
      phone: '0776619912',
      capacity: '200 beds',
      roomsCount: '144 rooms',
      floors: '4 floors',
      yearBuilt: '',
      amenities: ['Hot/Cold Water', 'Washing Machines', 'Gas Stove', 'Medical Clinic', 'Security 24/7', 'Counselor Service'],
    }
  },
  {
    id: '7',
    kg: {
      tag: 'Монуева корпусу',
      name: '№7 Жатакана',
      desc: 'ОшМУнун заманбап талапка жооп берген жатаканаларынан бири. Бөлмөлөрдө уктоочу диван, сабак даярдоочу стол, кийим салганга шкаф жана тумба бар. Студенттер эс алууга кеткен убакыттан тартып ар жыл сайын капиталдык оңдоп-түзөө иштери жүргүзүлөт. Мобилдүүлүк программасынын студенттери жана эл аралык студенттер жашайт.',
      commandantName: 'Тойчуев Дилшат',
      rating: '4.7',
      reviewsCount: 25,
      address: 'Ош шаары, Монуева көчөсү, 35Б',
      phone: '0778734069',
      capacity: '102 орун',
      roomsCount: '40 бөлмө',
      floors: '4 кабат',
      yearBuilt: '',
      amenities: ['Ысык/Муздак суу', 'Кир жуучу машыналар', 'Заманбап эмеректер', 'Жыл сайын оңдоо', 'Эл аралык студенттер', 'Спорт аянтчасы'],
    },
    ru: {
      tag: 'Корпус Монуева',
      name: 'Общежитие №7',
      desc: 'Одно из современных общежитий ОшГУ. В комнатах есть спальный диван, стол для учёбы, шкаф для одежды и тумба. Ежегодно в период студенческих каникул проводится капитальный ремонт. Проживают студенты программ мобильности и иностранные студенты из России, Узбекистана, Казахстана, Турции, Чехии, Японии, Кореи.',
      commandantName: 'Тойчуев Дилшат',
      rating: '4.7',
      reviewsCount: 25,
      address: 'г. Ош, ул. Монуева, 35Б',
      phone: '0778734069',
      capacity: '102 мест',
      roomsCount: '40 комнат',
      floors: '4 этажа',
      yearBuilt: '',
      amenities: ['Горячая/Холодная вода', 'Стиральные машины', 'Современная мебель', 'Ежегодный ремонт', 'Иностранные студенты', 'Спортплощадка'],
    },
    en: {
      tag: 'Monueva Building',
      name: 'Dormitory №7',
      desc: 'One of the modern dormitories of OshSU. Rooms have a sleeping sofa, study desk, wardrobe and cabinet. Annual capital renovation is conducted during student holidays. Mobility program students and international students from Russia, Uzbekistan, Kazakhstan, Turkey, Czech Republic, Japan, Korea reside here.',
      commandantName: 'Toychuev Dilshat',
      rating: '4.7',
      reviewsCount: 25,
      address: 'Osh city, Monueva street, 35B',
      phone: '0778734069',
      capacity: '102 beds',
      roomsCount: '40 rooms',
      floors: '4 floors',
      yearBuilt: '',
      amenities: ['Hot/Cold Water', 'Washing Machines', 'Modern Furniture', 'Annual Renovation', 'International Students', 'Sports Ground'],
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

function getInitialDormitories(): DormitoryRecord[] {
  const commonAmenities = ['Ысык/Муздак суу', 'Кир жуучу машыналар', 'Микроволновка', 'Газ плита', 'Ашкана (ар бир этажда)', 'Душ жана ажааткана', 'Коопсуздук кызматы', 'Медициналык клиника']
  return [
    { id: '1', name: '№1 Жатакана', address: 'Ош шаары, Курманжан-Датка көчөсү, 283', tag: 'Башкы корпус', description: 'ОшМУнун студенттик жатаканасы 4 кабаттан турат. Жатаканада ысык/муздак суу, кир жуучу машыналар, ашканада микроволновка жана газ плита бар. Ар бир этажда душ, ажааткана жана ашкана жайгашкан. Эс алуучу бөлмө, актовый зал жана спорт аянтчалары каралган.', commandantName: 'Парманова Жылдыз', commandantPhone: '0773901993', rooms: 370, beds: 370, occupied: 320, floors: 4, yearBuilt: '', status: 'Активдүү', amenities: [...commonAmenities, 'Эс алуучу бөлмө', 'Актовый зал', 'Спорт аянтчасы'], photos: [], videoUrl: '' },
    { id: '2', name: '№2 Жатакана', address: 'Ош шаары, Курманжан-Датка көчөсү, 283', tag: 'Заманбап корпус', description: 'ОшМУнун заманбап жатаканаларынын бири. Бөлмөлөрдө уктоочу диван, сабак даярдоочу стол, кийим салганга шкаф, тумба жана урналар бар. Ар бир этажда душ, ажааткана жана ашкана жайгашкан. Коменданттар: Бекболот уулу Дастан (№152) жана Юлдашев Мырзахмет (№332).', commandantName: 'Бекболот уулу Дастан', commandantPhone: '0556266793', rooms: 332, beds: 484, occupied: 450, floors: 4, yearBuilt: '', status: 'Активдүү', amenities: [...commonAmenities, 'Заманбап эмеректер', 'Эс алуучу бөлмө', 'Спорт аянтчасы'], photos: [], videoUrl: '' },
    { id: '3', name: '№3 Жатакана', address: 'Ош шаары, Курманжан-Датка көчөсү, 283', tag: 'Заманбап корпус', description: 'ОшМУнун заманбап талапка жооп берген жатаканасы. Алыскы райондордон келген студенттер кезексиз жайгашат. Мүмкүнчүлүгү чектелген жана аярлуу катмардагы студенттер үчүн атайын орундар каралган. Ар бир этажда душ, ажааткана жана ашкана бар.', commandantName: '', commandantPhone: '', rooms: 200, beds: 300, occupied: 250, floors: 4, yearBuilt: '', status: 'Активдүү', amenities: [...commonAmenities, 'Атайын орундар (аярлуу катмар)', 'Спорт аянтчасы'], photos: [], videoUrl: '' },
    { id: '4', name: '№4 Жатакана', address: 'Ош шаары, Масалиева көчөсү, 93', tag: 'Масалиева корпусу', description: 'ОшМУнун студенттик жатаканасы. Жатаканада бардык коопсуздук эрежелери сакталган. Тазалыкка жетиштүү көңүл бурулат. Студенттик жатаканада ОшМУнун коопсуздук кызматы, медициналык клиника, декандын тарбия иштери боюнча орун басарлары иш алып барат.', commandantName: 'Эрлан', commandantPhone: '0778937924', rooms: 233, beds: 233, occupied: 200, floors: 4, yearBuilt: '', status: 'Активдүү', amenities: [...commonAmenities, 'Эс алуучу бөлмө', 'Спорт аянтчасы'], photos: [], videoUrl: '' },
    { id: '5', name: '№5 Жатакана', address: 'Ош шаары, Мамалиева көчөсү, 93', tag: 'Мамалиева корпусу', description: 'Студенттердин чыгармачылыгын өркүндөтүүсүнө, спорт менен айлануусуна жана тил курстарын окуп үйрөнүүсүнө шарт түзүлгөн жатакана. Ар бир этажда душ, ажааткана жана ашкана жайгашкан. Электр жабдыктарын колдонуу боюнча коменданттар тарабынан түшүндүрүү жүргүзүлөт.', commandantName: 'Боронбаев Бакыт', commandantPhone: '0707540050', rooms: 307, beds: 307, occupied: 270, floors: 4, yearBuilt: '', status: 'Активдүү', amenities: [...commonAmenities, 'Тил курстары', 'Чыгармачылык бөлмөсү', 'Спорт аянтчасы'], photos: [], videoUrl: '' },
    { id: '6', name: '№6 Жатакана', address: 'Ош шаары, Исанова көчөсү, 85А', tag: 'Исанова корпусу', description: 'ОшМУнун студенттик жатаканасы. Студенттердин коопсуздугу, ден-соолугу, тарбиясы жана билим алуусу үчүн ыңгайлуу шарттар камсыздалган. ОшМУнун коопсуздук кызматы, медициналык клиника жана тарбиячылар жеткиликтүү иш алып барат.', commandantName: 'Маматов Нурбай', commandantPhone: '0776619912', rooms: 144, beds: 200, occupied: 170, floors: 4, yearBuilt: '', status: 'Активдүү', amenities: [...commonAmenities, 'Эс алуучу бөлмө', 'Спорт аянтчасы', 'Коопсуздук 24/7'], photos: [], videoUrl: '' },
    { id: '7', name: '№7 Жатакана', address: 'Ош шаары, Монуева көчөсү, 35Б', tag: 'Заманбап корпус', description: 'ОшМУнун заманбап талапка жооп берген жатаканаларынан бири. Бөлмөлөрдө уктоочу диван, сабак даярдоочу стол, кийим салганга шкаф жана тумба бар. Ар бир жылы капиталдык оңдоп-түзөө иштери жүргүзүлөт. Россия, Өзбекстан, Казакстан жана башка өлкөлөрдөн келген студенттер жашайт.', commandantName: 'Тойчуев Дилшат', commandantPhone: '0778734069', rooms: 40, beds: 102, occupied: 80, floors: 4, yearBuilt: '', status: 'Активдүү', amenities: [...commonAmenities, 'Эл аралык студенттер', 'Жыл сайын оңдоо', 'Спорт аянтчасы'], photos: [], videoUrl: '' },
  ]
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

  // Dormitories
  getDormitories(): DormitoryRecord[] {
    if (typeof window === 'undefined') return getInitialDormitories()
    const raw = localStorage.getItem('oshsu_dormitories')
    if (!raw) {
      const initial = getInitialDormitories()
      localStorage.setItem('oshsu_dormitories', JSON.stringify(initial))
      return initial
    }
    return JSON.parse(raw)
  },

  getDormitory(id: string): DormitoryRecord | null {
    return this.getDormitories().find(d => d.id === id) || null
  },

  saveDormitories(dorms: DormitoryRecord[]) {
    if (typeof window === 'undefined') return
    localStorage.setItem('oshsu_dormitories', JSON.stringify(dorms))
  },

  addDormitory(data: Omit<DormitoryRecord, 'id'>): DormitoryRecord {
    const dorms = this.getDormitories()
    const entry: DormitoryRecord = { ...data, id: 'dorm_' + Math.random().toString(36).substr(2, 9) }
    dorms.push(entry)
    this.saveDormitories(dorms)
    return entry
  },

  updateDormitory(id: string, updates: Partial<DormitoryRecord>) {
    this.saveDormitories(this.getDormitories().map(d => d.id === id ? { ...d, ...updates } : d))
  },

  removeDormitory(id: string) {
    this.saveDormitories(this.getDormitories().filter(d => d.id !== id))
  },

  // Commandants
  getCommandants(): CommandantAccount[] {
    if (typeof window === 'undefined') return []
    const raw = localStorage.getItem('oshsu_commandants')
    return raw ? JSON.parse(raw) : []
  },

  addCommandant(data: Omit<CommandantAccount, 'id' | 'createdAt'>): CommandantAccount {
    const list = this.getCommandants()
    const entry: CommandantAccount = {
      ...data,
      id: 'comm_' + Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toLocaleDateString('ru-RU')
    }
    list.push(entry)
    localStorage.setItem('oshsu_commandants', JSON.stringify(list))
    return entry
  },

  updateCommandant(id: string, updates: Partial<Omit<CommandantAccount, 'id' | 'createdAt'>>) {
    const list = this.getCommandants()
    localStorage.setItem('oshsu_commandants', JSON.stringify(
      list.map(c => c.id === id ? { ...c, ...updates } : c)
    ))
  },

  removeCommandant(id: string) {
    const list = this.getCommandants()
    localStorage.setItem('oshsu_commandants', JSON.stringify(list.filter(c => c.id !== id)))
  },

  findCommandantByEmail(email: string): CommandantAccount | null {
    return this.getCommandants().find(c => c.email.toLowerCase() === email.toLowerCase()) || null
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
