'use client'

import { useState, useEffect, useRef } from 'react'
import { MessageSquare, X, Send, Bot, Sparkles, AlertCircle } from 'lucide-react'
import { useLanguageAndTheme } from '../app/LanguageAndThemeContext'

interface Message {
  sender: 'user' | 'ai'
  text: string
  timestamp: string
}

export default function AIAssistant() {
  const { language, theme } = useLanguageAndTheme()
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [inputText, setInputText] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isTyping])

  // Setup welcome message based on language on open or change
  useEffect(() => {
    const welcomeText = 
      language === 'kg' 
        ? 'Салам! ОшМУнун жатаканалар боюнча AI ассистентине кош келиңиз. Сизге кандай жардам бере алам?' 
        : language === 'ru'
        ? 'Привет! Добро пожаловать к AI-ассистенту общежитий ОшГУ. Чем я могу помочь вам сегодня?'
        : 'Hello! Welcome to OshSU Dormitory AI Assistant. How can I help you today?'

    setMessages([
      {
        sender: 'ai',
        text: welcomeText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ])
  }, [language])

  // Pre-seeded Smart Questions & Answers
  const presetQuestions = [
    {
      kg: 'Жатакананын акысы канча?',
      ru: 'Сколько стоит проживание?',
      en: 'How much does it cost?',
      answer: {
        kg: 'ОшМУнун жатаканаларында бир окуу жылына проживание акысы орточо эсеп менен 12,000 сомду түзөт. Студенттер төлөмдү банк же MBank аркылуу каалаган убакта жүргүзө алышат.',
        ru: 'Стоимость проживания в общежитиях ОшГУ составляет в среднем 12 000 сомов за один учебный год. Оплату можно произвести частями через любой банк или мобильное приложение MBank.',
        en: 'The dormitory fee at OshSU averages around 12,000 KGS per academic year. Payments can be easily made via bank transfer or the MBank mobile application.'
      }
    },
    {
      kg: 'Кандай эрежелер бар?',
      ru: 'Какие правила проживания?',
      en: 'What are the housing rules?',
      answer: {
        kg: 'Жатакана күн сайын саат 06:00дөн 22:00гө чейин ачык. Бөлмөлөрдө тазалыкты сактоо, спирт ичимдиктерин ичпөө жана коопсуздук эрежелерин бузбоо милдеттүү.',
        ru: 'Общежитие открыто ежедневно с 06:00 до 22:00. Все жильцы обязаны поддерживать чистоту в комнатах, не курить, не распивать спиртные напитки и соблюдать правила пожарной безопасности.',
        en: 'The dormitory is open daily from 06:00 to 22:00. Residents must maintain room cleanliness, avoid smoking or drinking, and strictly adhere to fire safety guidelines.'
      }
    },
    {
      kg: 'Келишимди кантип алам?',
      ru: 'Как скачать договор?',
      en: 'How to get the agreement?',
      answer: {
        kg: 'Сиз комендант тарабынан бөлмө бөлүнгөндөн кийин, студенттик кабинетиңизден түз эле "Келишимди жүктөө (PDF)" баскычын басып, расмий эки тараптуу документти басып чыгара аласыз!',
        ru: 'После того как комендант выделит вам место, в вашем личном кабинете появится кнопка "Скачать Договор (PDF)". Вы сможете мгновенно сохранить официальный двусторонний договор!',
        en: 'Once the commandant assigns you a room, a "Download Contract (PDF)" button will instantly appear in your Student Dashboard. You can print or save the bilateral agreement in one click!'
      }
    },
    {
      kg: 'Байланыштар кандай?',
      ru: 'Как связаться с комендантом?',
      en: 'What are the contacts?',
      answer: {
        kg: 'Жатакана дирекциясынын түз байланыш номери: +996 (555) 12-34-56. Коменданттар күнү-түнү 24/7 жатакана аймагында студенттерге жардам берүүгө даяр.',
        ru: 'Прямой номер телефона дирекции студенческого городка ОшГУ: +996 (555) 12-34-56. Дежурные коменданты находятся в зданиях круглосуточно 24/7.',
        en: 'The direct phone number for the OshSU Student Housing Directorate is +996 (555) 12-34-56. Duty commandants are available on campus 24/7 to assist students.'
      }
    }
  ]

  // Parsing custom text answers based on keyword matching
  const getAIResponse = (userText: string): string => {
    const text = userText.toLowerCase()
    
    if (text.includes('баа') || text.includes('сом') || text.includes('акы') || text.includes('цена') || text.includes('стоимост') || text.includes('плат') || text.includes('money') || text.includes('cost') || text.includes('pay')) {
      return language === 'kg' 
        ? 'ОшМУнун жатаканаларында проживание баасы жылына 12,000 сомду түзөт. Жеңилдиктер бар студенттер дирекцияга кайрылса болот.'
        : language === 'ru'
        ? 'Стоимость проживания составляет 12 000 сомов в год. Студенты льготных категорий могут обратиться в дирекцию для получения скидок.'
        : 'The cost is 12,000 KGS per year. Discounted rates are available for students with special social status via the housing office.'
    }

    if (text.includes('эреж') || text.includes('убак') || text.includes('саат') || text.includes('правил') || text.includes('врем') || text.includes('когд') || text.includes('rule') || text.includes('time') || text.includes('close')) {
      return language === 'kg'
        ? 'Негизги эреже: жатакана кечинде саат 22:00дө жабылат. Түнкүсүн ызы-чуу салууга жана бөлмөлөрдө чоочун адамдарды калтырууга тыюу салынат.'
        : language === 'ru'
        ? 'Основное правило: двери общежития закрываются в 22:00. Строго запрещено шуметь в ночное время и оставлять посторонних лиц в комнатах без разрешения.'
        : 'Key rule: dormitory gates close at 22:00. Making noise at night or hosting unauthorized overnight guests is strictly prohibited.'
    }

    if (text.includes('комен') || text.includes('байла') || text.includes('ном') || text.includes('телефон') || text.includes('связ') || text.includes('contact') || text.includes('phone') || text.includes('number')) {
      return language === 'kg'
        ? 'Дирекция номери: +996 (555) 12-34-56. Кошумча суроолор болсо, бөлмөңүздүн комендантына түз кайрылыңыз.'
        : language === 'ru'
        ? 'Номер дирекции: +996 (555) 12-34-56. По срочным бытовым вопросам вы можете обращаться к дежурному коменданту на первом этаже.'
        : 'Housing Directorate phone: +996 (555) 12-34-56. For immediate room issues, please contact the duty commandant on the ground floor.'
    }

    if (text.includes('дого') || text.includes('доку') || text.includes('келиш') || text.includes('скача') || text.includes('жүкт') || text.includes('contract') || text.includes('pdf')) {
      return language === 'kg'
        ? 'Эгер бөлмөңүз бекитилген болсо, Студенттик кабинеттеги "Келишимди жүктөө (PDF)" кызгылт-кызыл баскычы аркылуу документти түз эле басып чыгара аласыз.'
        : language === 'ru'
        ? 'Если ваша комната уже утверждена, вы можете скачать свой договор найма прямо в Студенческом кабинете с помощью розовой кнопки "Скачать Договор (PDF)".'
        : 'If your room is approved, you can instantly print your housing agreement by clicking the pink "Download Contract (PDF)" button inside your Student Cabinet.'
    }

    return language === 'kg'
      ? 'Кечиресиз, сурооңузду түшүнө алган жокмун. Дагы бир жолу башка сөздөр менен жазып көрүңүз же жогорудагы даяр суроолорду тандаңыз.'
      : language === 'ru'
      ? 'Извините, я вас не совсем понял. Попробуйте сформулировать вопрос по-другому или воспользуйтесь готовыми кнопками вопросов выше.'
      : "I am sorry, I couldn't quite understand that. Please try rephrasing or click on one of the quick question chips above."
  }

  const handleSendMessage = (textToSend: string) => {
    if (!textToSend.trim()) return

    // 1. Add User Message
    const userMsg: Message = {
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
    setMessages(prev => [...prev, userMsg])
    setInputText('')

    // 2. Trigger Blinking Typewriter Simulation
    setIsTyping(true)

    setTimeout(() => {
      const responseText = getAIResponse(textToSend)
      const aiMsg: Message = {
        sender: 'ai',
        text: responseText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
      setMessages(prev => [...prev, aiMsg])
      setIsTyping(false)
    }, 1000)
  }

  return (
    <div className="fixed bottom-6 right-6 z-[100] font-sans text-slate-900 dark:text-white print:hidden">
      {/* Floating launcher button with glowing ambient aura */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="relative flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-r from-rose-500 to-violet-605 text-white shadow-xl shadow-rose-500/20 hover:scale-[1.08] hover:rotate-3 active:scale-95 transition-all duration-300 group cursor-pointer"
        >
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-rose-500 to-violet-605 blur-[12px] opacity-60 group-hover:opacity-80 transition-opacity pointer-events-none" />
          <MessageSquare className="w-6 h-6 animate-pulse" />
        </button>
      )}

      {/* Sleek chat panel */}
      {isOpen && (
        <div className="w-[360px] sm:w-[380px] h-[500px] flex flex-col rounded-3xl dark:bg-slate-900 bg-white border dark:border-slate-800 border-slate-200 shadow-2xl overflow-hidden animate-fadeIn">
          {/* Header */}
          <header className="px-5 py-4 bg-gradient-to-r from-rose-500 via-pink-500 to-violet-600 text-white flex items-center justify-between shadow-md">
            <div className="flex items-center gap-2.5">
              <div className="p-1.5 bg-white/10 rounded-lg backdrop-blur-md">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-black flex items-center gap-1.5">
                  OshSU AI Assistant
                  <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
                </h4>
                <div className="flex items-center gap-1 mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-450 animate-ping" />
                  <span className="text-[10px] text-rose-100 font-semibold tracking-wider uppercase">Online</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-lg hover:bg-white/15 transition-all cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </header>

          {/* Messages Container */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 dark:bg-slate-950/40 bg-slate-50/50">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex flex-col max-w-[80%] ${msg.sender === 'user' ? 'ml-auto items-end' : 'mr-auto items-start'}`}
              >
                <div
                  className={`px-4 py-3 rounded-2xl text-xs leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-gradient-to-br from-rose-500 to-violet-600 text-white shadow-md font-medium'
                      : 'dark:bg-slate-900 bg-white border dark:border-slate-800 border-slate-200 shadow-sm text-slate-800 dark:text-slate-100'
                  }`}
                >
                  {msg.text}
                </div>
                <span className="text-[9px] text-slate-400 font-semibold mt-1 px-1">
                  {msg.timestamp}
                </span>
              </div>
            ))}

            {/* Blinking typing simulation */}
            {isTyping && (
              <div className="flex items-center gap-1.5 mr-auto max-w-[80%] px-4 py-3 rounded-2xl dark:bg-slate-900 bg-white border dark:border-slate-800 border-slate-200 shadow-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-bounce delay-100" />
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-bounce delay-200" />
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-bounce delay-300" />
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick FAQ Selectors */}
          <div className="px-4 py-2 dark:bg-slate-955 bg-slate-100/50 border-t dark:border-slate-900 border-slate-200">
            <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
              {presetQuestions.map((q, idx) => {
                const text = language === 'kg' ? q.kg : language === 'ru' ? q.ru : q.en
                return (
                  <button
                    key={idx}
                    onClick={() => {
                      // 1. Send User message
                      const userMsg: Message = {
                        sender: 'user',
                        text: text,
                        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                      }
                      setMessages(prev => [...prev, userMsg])
                      
                      // 2. Trigger typing and answer
                      setIsTyping(true)
                      setTimeout(() => {
                        const answerText = language === 'kg' ? q.answer.kg : language === 'ru' ? q.answer.ru : q.answer.en
                        const aiMsg: Message = {
                          sender: 'ai',
                          text: answerText,
                          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                        }
                        setMessages(prev => [...prev, aiMsg])
                        setIsTyping(false)
                      }, 1000)
                    }}
                    className="shrink-0 px-3 py-1.5 dark:bg-slate-900 bg-white border dark:border-slate-800 border-slate-200 text-[10px] font-bold rounded-xl hover:border-rose-500/40 text-slate-500 hover:text-rose-500 dark:hover:text-white transition-all cursor-pointer shadow-sm"
                  >
                    {text}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Custom Input Form */}
          <form
            onSubmit={(e) => {
              e.preventDefault()
              handleSendMessage(inputText)
            }}
            className="p-3 border-t dark:border-slate-900 border-slate-200 dark:bg-slate-900 bg-white flex gap-2"
          >
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={
                language === 'kg' 
                  ? 'Сурооңузду жазыңыз...' 
                  : language === 'ru' 
                  ? 'Введите ваш вопрос...' 
                  : 'Type your question...'
              }
              className="flex-1 dark:bg-slate-950 bg-slate-100 border dark:border-slate-800 border-slate-200 text-xs rounded-xl px-3.5 py-2.5 focus:outline-none focus:ring-1 focus:ring-rose-500 focus:border-rose-500 transition-all dark:text-white text-slate-900"
            />
            <button
              type="submit"
              disabled={!inputText.trim()}
              className="p-2.5 rounded-xl bg-gradient-to-r from-rose-500 to-violet-605 text-white hover:brightness-110 shadow-md shadow-rose-500/10 disabled:opacity-50 disabled:cursor-not-allowed transition-all cursor-pointer shrink-0"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </div>
  )
}
