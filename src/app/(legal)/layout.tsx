'use client'

import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default function LegalLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md shadow-sm border-b border-white/20">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center gap-4">
          <Link 
            href="/login" 
            className="p-2 hover:bg-gray-100 rounded-full transition-colors flex items-center gap-2 text-gray-600 hover:text-gray-800"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="hidden sm:inline">Geri Dön</span>
          </Link>
          <h1 className="text-lg font-semibold text-gray-800">Yasal Belgeler</h1>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6 md:p-8">
          <div className="prose prose-gray max-w-none prose-headings:text-gray-800 prose-p:text-gray-700 prose-ul:text-gray-700 prose-ol:text-gray-700">
            {children}
          </div>
        </div>
      </main>

      {/* Footer spacer */}
      <div className="h-16"></div>
    </div>
  )
}