 'use client'

import Link from 'next/link'
import { useTranslation } from 'react-i18next'

export default function NotFound() {
  const { t } = useTranslation('common')

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center p-6">
      <h1 className="text-3xl font-bold mb-2">{t('notFound.title')}</h1>
      <p className="text-gray-600 mb-6">{t('notFound.description')}</p>
      <Link href="/" className="px-4 py-2 rounded-lg bg-pink-600 text-white font-medium hover:bg-pink-500 transition">
        {t('notFound.backHome')}
      </Link>
    </div>
  )
}
