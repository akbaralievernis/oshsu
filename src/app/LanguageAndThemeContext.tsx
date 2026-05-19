'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'

export type LanguageType = 'kg' | 'ru' | 'en'
export type ThemeType = 'dark' | 'light'

interface LanguageAndThemeContextProps {
  language: LanguageType
  setLanguage: (lang: LanguageType) => void
  theme: ThemeType
  toggleTheme: () => void
}

const LanguageAndThemeContext = createContext<LanguageAndThemeContextProps | undefined>(undefined)

export function LanguageAndThemeContextProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<LanguageType>('kg')
  const [theme, setThemeState] = useState<ThemeType>('dark')

  // Load from localStorage on mount safely
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedLang = localStorage.getItem('oshsu_lang') as LanguageType
      if (savedLang && ['kg', 'ru', 'en'].includes(savedLang)) {
        setLanguageState(savedLang)
      }

      const savedTheme = localStorage.getItem('oshsu_theme') as ThemeType
      if (savedTheme && ['dark', 'light'].includes(savedTheme)) {
        setThemeState(savedTheme)
        if (savedTheme === 'dark') {
          document.documentElement.classList.add('dark')
        } else {
          document.documentElement.classList.remove('dark')
        }
      } else {
        // Default is dark mode
        document.documentElement.classList.add('dark')
      }
    }
  }, [])

  const setLanguage = (lang: LanguageType) => {
    setLanguageState(lang)
    if (typeof window !== 'undefined') {
      localStorage.setItem('oshsu_lang', lang)
    }
  }

  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark'
    setThemeState(nextTheme)
    
    if (typeof window !== 'undefined') {
      localStorage.setItem('oshsu_theme', nextTheme)
      if (nextTheme === 'dark') {
        document.documentElement.classList.add('dark')
      } else {
        document.documentElement.classList.remove('dark')
      }
    }
  }

  return (
    <LanguageAndThemeContext.Provider value={{ language, setLanguage, theme, toggleTheme }}>
      {children}
    </LanguageAndThemeContext.Provider>
  )
}

export function useLanguageAndTheme() {
  const context = useContext(LanguageAndThemeContext)
  if (!context) {
    throw new Error('useLanguageAndTheme must be used within a LanguageAndThemeContextProvider')
  }
  return context
}
