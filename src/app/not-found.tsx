export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center p-6">
      <h1 className="text-3xl font-bold mb-2">Sayfa bulunamadı</h1>
      <p className="text-gray-600 mb-6">Aradığınız sayfa taşınmış veya hiç var olmamış olabilir.</p>
      <a href="/" className="px-4 py-2 rounded-lg bg-pink-600 text-white font-medium hover:bg-pink-500 transition">
        Anasayfaya dön
      </a>
    </div>
  )
}
