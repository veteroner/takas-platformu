'use client'

import Link from 'next/link'
import { ArrowLeft, FileText } from 'lucide-react'

export default function LegalLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-black/20 backdrop-blur-lg border-b border-white/10">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center gap-4">
          <Link 
            href="/" 
            className="p-2 hover:bg-white/10 rounded-full transition-colors flex items-center gap-2 text-white"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-white" />
            <h1 className="text-lg font-semibold text-white">Yasal Belgeler</h1>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-4 py-6">
        <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6 md:p-8">
          <div className="prose prose-gray max-w-none 
            prose-headings:text-gray-800 prose-headings:font-bold
            prose-h1:text-2xl prose-h1:text-transparent prose-h1:bg-clip-text prose-h1:bg-gradient-to-r prose-h1:from-purple-600 prose-h1:to-pink-500 prose-h1:mb-4
            prose-h2:text-xl prose-h2:text-purple-700 prose-h2:border-b prose-h2:border-purple-200 prose-h2:pb-2 prose-h2:mt-8
            prose-h3:text-lg prose-h3:text-pink-600
            prose-p:text-gray-700 prose-p:leading-relaxed
            prose-ul:text-gray-700 prose-ol:text-gray-700
            prose-li:marker:text-purple-500
            prose-strong:text-gray-900
            prose-a:text-purple-600 prose-a:no-underline hover:prose-a:underline">
            {children}
          </div>
        </div>
        
        {/* Footer Links */}
        <div className="mt-6 flex flex-wrap justify-center gap-4 text-sm">
          <Link href="/kvkk-aydinlatma" className="text-white/80 hover:text-white transition-colors">KVKK</Link>
          <span className="text-white/40">•</span>
          <Link href="/gizlilik-politikasi" className="text-white/80 hover:text-white transition-colors">Gizlilik</Link>
          <span className="text-white/40">•</span>
          <Link href="/uyelik-sozlesmesi" className="text-white/80 hover:text-white transition-colors">Kullanım Şartları</Link>
          <span className="text-white/40">•</span>
          <Link href="/cerez-politikasi" className="text-white/80 hover:text-white transition-colors">Çerezler</Link>
          <span className="text-white/40">•</span>
          <Link href="/acik-riza" className="text-white/80 hover:text-white transition-colors">Açık Rıza</Link>
        </div>
      </main>

      {/* Footer spacer */}
      <div className="h-8"></div>
    </div>
  )
}