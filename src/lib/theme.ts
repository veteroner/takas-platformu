'use client'

import { useEffect } from 'react'

export type Theme = 'light' | 'dark' | 'system'

/**
 * Tema değişikliklerini uygula
 */
export function applyTheme(theme: Theme) {
  if (typeof window === 'undefined') return

  const root = document.documentElement
  
  if (theme === 'system') {
    // Sistem tercihini kullan
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    root.classList.toggle('dark', systemPrefersDark)
  } else {
    // Manuel tema
    root.classList.toggle('dark', theme === 'dark')
  }
}

/**
 * Sistem tema değişikliklerini dinle
 */
export function useThemeListener(theme: Theme) {
  useEffect(() => {
    if (theme !== 'system') return

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    
    const handleChange = () => {
      applyTheme('system')
    }

    // Modern tarayıcılar
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleChange)
      return () => mediaQuery.removeEventListener('change', handleChange)
    } 
    // Eski tarayıcılar
    else if (mediaQuery.addListener) {
      mediaQuery.addListener(handleChange)
      return () => mediaQuery.removeListener(handleChange)
    }
  }, [theme])
}

/**
 * localStorage'dan temayı al
 */
export function getSavedTheme(): Theme {
  if (typeof window === 'undefined') return 'system'
  
  try {
    const saved = localStorage.getItem('userPreferences')
    if (saved) {
      const prefs = JSON.parse(saved)
      return prefs.theme || 'system'
    }
  } catch {
    // Ignore
  }
  
  return 'system'
}

/**
 * Temayı localStorage'a kaydet
 */
export function saveTheme(theme: Theme) {
  if (typeof window === 'undefined') return
  
  try {
    const saved = localStorage.getItem('userPreferences')
    let prefs = { theme }
    
    if (saved) {
      prefs = { ...JSON.parse(saved), theme }
    }
    
    localStorage.setItem('userPreferences', JSON.stringify(prefs))
  } catch {
    // Ignore
  }
}
