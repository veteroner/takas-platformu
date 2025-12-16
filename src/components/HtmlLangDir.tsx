'use client'

import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'

function normalizeLang(raw: string | undefined | null): string {
  if (!raw) return 'tr'
  return raw.toLowerCase().split('-')[0] || 'tr'
}

export default function HtmlLangDir() {
  const { i18n } = useTranslation()

  useEffect(() => {
    const lang = normalizeLang(i18n.language)
    const dir = lang === 'ar' ? 'rtl' : 'ltr'

    document.documentElement.lang = lang
    document.documentElement.dir = dir
  }, [i18n.language])

  return null
}
