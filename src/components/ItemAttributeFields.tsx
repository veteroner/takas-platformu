'use client'

import { 
  ClothingSizeText, 
  GenderType, 
  Season, 
  Style, 
  ToyType, 
  ToyGender,
  BookAgeGroup,
  TOY_AGE_RANGES,
  DbCategory
} from '@/types/matching'

interface ItemAttributeFieldsProps {
  category: DbCategory | ''
  attributes: {
    sizeText: ClothingSizeText | ''
    gender: GenderType | ''
    season: Season | ''
    style: Style | ''
    brand: string
    color: string
    toyAgeRange: string
    toyType: ToyType | ''
    toyGender: ToyGender | ''
    bookGenre: string
    bookLanguage: string
    bookAgeGroup: BookAgeGroup | ''
    conditionScore: number
  }
  onChange: (field: string, value: string | number | boolean) => void
}

const sizes: ClothingSizeText[] = ['XS', 'S', 'M', 'L', 'XL', 'XXL']
const genders: { value: GenderType; label: string }[] = [
  { value: 'male', label: 'Erkek' },
  { value: 'female', label: 'Kadın' },
  { value: 'unisex', label: 'Unisex' },
  { value: 'kids_boy', label: 'Erkek Çocuk' },
  { value: 'kids_girl', label: 'Kız Çocuk' },
  { value: 'baby', label: 'Bebek' },
]
const seasons: { value: Season; label: string }[] = [
  { value: 'spring', label: '🌸 İlkbahar' },
  { value: 'summer', label: '☀️ Yaz' },
  { value: 'fall', label: '🍂 Sonbahar' },
  { value: 'winter', label: '❄️ Kış' },
  { value: 'all_season', label: '🔄 4 Mevsim' },
]
const styles: { value: Style; label: string }[] = [
  { value: 'casual', label: 'Günlük' },
  { value: 'sport', label: 'Spor' },
  { value: 'elegant', label: 'Şık' },
  { value: 'vintage', label: 'Vintage' },
  { value: 'streetwear', label: 'Sokak Stili' },
  { value: 'classic', label: 'Klasik' },
]
const toyTypes: { value: ToyType; label: string }[] = [
  { value: 'educational', label: '📚 Eğitici' },
  { value: 'activity', label: '🎯 Aktivite' },
  { value: 'plush', label: '🧸 Peluş' },
  { value: 'building', label: '🧱 Yapı/Lego' },
  { value: 'electronic', label: '🎮 Elektronik' },
  { value: 'outdoor', label: '🏃 Dış Mekan' },
  { value: 'puzzle', label: '🧩 Puzzle' },
  { value: 'board_game', label: '🎲 Kutu Oyunu' },
  { value: 'vehicle', label: '🚗 Araç' },
  { value: 'doll', label: '👶 Bebek/Oyuncak' },
  { value: 'action_figure', label: '🦸 Aksiyon Figür' },
]
const toyGenders: { value: ToyGender; label: string }[] = [
  { value: 'boys', label: 'Erkek' },
  { value: 'girls', label: 'Kız' },
  { value: 'unisex', label: 'Unisex' },
]
const bookAgeGroups: { value: BookAgeGroup; label: string }[] = [
  { value: 'children', label: 'Çocuk' },
  { value: 'young_adult', label: 'Genç' },
  { value: 'adult', label: 'Yetişkin' },
]
const bookGenres = [
  'Roman', 'Bilim Kurgu', 'Fantastik', 'Polisiye', 'Tarih', 
  'Biyografi', 'Kişisel Gelişim', 'Çocuk Hikaye', 'Eğitim', 'Diğer'
]

export default function ItemAttributeFields({ category, attributes, onChange }: ItemAttributeFieldsProps) {
  if (!category) return null

  const selectClass = "w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent bg-white/80"
  const labelClass = "block text-sm font-medium text-gray-700 mb-2"

  // Kıyafet alanları
  if (category === 'clothing') {
    return (
      <div className="space-y-4 p-4 bg-pink-50/50 rounded-xl border border-pink-100">
        <h4 className="font-semibold text-gray-800 flex items-center gap-2">
          👕 Kıyafet Bilgileri
          <span className="text-xs text-pink-600 bg-pink-100 px-2 py-0.5 rounded-full">Eşleştirme için önemli</span>
        </h4>
        
        <div className="grid grid-cols-2 gap-4">
          {/* Beden */}
          <div>
            <label className={labelClass}>Beden *</label>
            <select
              value={attributes.sizeText}
              onChange={(e) => onChange('sizeText', e.target.value)}
              className={selectClass}
            >
              <option value="">Seçin</option>
              {sizes.map(size => (
                <option key={size} value={size}>{size}</option>
              ))}
            </select>
          </div>

          {/* Cinsiyet */}
          <div>
            <label className={labelClass}>Cinsiyet</label>
            <select
              value={attributes.gender}
              onChange={(e) => onChange('gender', e.target.value)}
              className={selectClass}
            >
              <option value="">Seçin</option>
              {genders.map(g => (
                <option key={g.value} value={g.value}>{g.label}</option>
              ))}
            </select>
          </div>

          {/* Sezon */}
          <div>
            <label className={labelClass}>Sezon</label>
            <select
              value={attributes.season}
              onChange={(e) => onChange('season', e.target.value)}
              className={selectClass}
            >
              <option value="">Seçin</option>
              {seasons.map(s => (
                <option key={s.value} value={s.value}>{s.label}</option>
              ))}
            </select>
          </div>

          {/* Stil */}
          <div>
            <label className={labelClass}>Stil</label>
            <select
              value={attributes.style}
              onChange={(e) => onChange('style', e.target.value)}
              className={selectClass}
            >
              <option value="">Seçin</option>
              {styles.map(s => (
                <option key={s.value} value={s.value}>{s.label}</option>
              ))}
            </select>
          </div>

          {/* Renk */}
          <div>
            <label className={labelClass}>Renk</label>
            <input
              type="text"
              value={attributes.color}
              onChange={(e) => onChange('color', e.target.value)}
              placeholder="örn: Siyah, Mavi"
              className={selectClass}
            />
          </div>

          {/* Marka */}
          <div>
            <label className={labelClass}>Marka</label>
            <input
              type="text"
              value={attributes.brand}
              onChange={(e) => onChange('brand', e.target.value)}
              placeholder="örn: Zara, H&M"
              className={selectClass}
            />
          </div>
        </div>
      </div>
    )
  }

  // Oyuncak alanları
  if (category === 'toys') {
    return (
      <div className="space-y-4 p-4 bg-purple-50/50 rounded-xl border border-purple-100">
        <h4 className="font-semibold text-gray-800 flex items-center gap-2">
          🧸 Oyuncak Bilgileri
          <span className="text-xs text-purple-600 bg-purple-100 px-2 py-0.5 rounded-full">Yaş eşleştirmesi için</span>
        </h4>
        
        <div className="grid grid-cols-2 gap-4">
          {/* Yaş Aralığı */}
          <div className="col-span-2">
            <label className={labelClass}>Uygun Yaş Aralığı *</label>
            <select
              value={attributes.toyAgeRange}
              onChange={(e) => onChange('toyAgeRange', e.target.value)}
              className={selectClass}
            >
              <option value="">Seçin</option>
              {Object.entries(TOY_AGE_RANGES).map(([key, val]) => (
                <option key={key} value={key}>{val.label}</option>
              ))}
            </select>
          </div>

          {/* Oyuncak Türü */}
          <div>
            <label className={labelClass}>Oyuncak Türü</label>
            <select
              value={attributes.toyType}
              onChange={(e) => onChange('toyType', e.target.value)}
              className={selectClass}
            >
              <option value="">Seçin</option>
              {toyTypes.map(t => (
                <option key={t.value} value={t.value}>{t.label}</option>
              ))}
            </select>
          </div>

          {/* Cinsiyet */}
          <div>
            <label className={labelClass}>Hedef Cinsiyet</label>
            <select
              value={attributes.toyGender}
              onChange={(e) => onChange('toyGender', e.target.value)}
              className={selectClass}
            >
              <option value="">Seçin</option>
              {toyGenders.map(g => (
                <option key={g.value} value={g.value}>{g.label}</option>
              ))}
            </select>
          </div>

          {/* Marka */}
          <div className="col-span-2">
            <label className={labelClass}>Marka</label>
            <input
              type="text"
              value={attributes.brand}
              onChange={(e) => onChange('brand', e.target.value)}
              placeholder="örn: Lego, Fisher-Price"
              className={selectClass}
            />
          </div>
        </div>
      </div>
    )
  }

  // Kitap alanları
  if (category === 'books') {
    return (
      <div className="space-y-4 p-4 bg-indigo-50/50 rounded-xl border border-indigo-100">
        <h4 className="font-semibold text-gray-800 flex items-center gap-2">
          📚 Kitap Bilgileri
        </h4>
        
        <div className="grid grid-cols-2 gap-4">
          {/* Tür */}
          <div>
            <label className={labelClass}>Tür</label>
            <select
              value={attributes.bookGenre}
              onChange={(e) => onChange('bookGenre', e.target.value)}
              className={selectClass}
            >
              <option value="">Seçin</option>
              {bookGenres.map(g => (
                <option key={g} value={g}>{g}</option>
              ))}
            </select>
          </div>

          {/* Yaş Grubu */}
          <div>
            <label className={labelClass}>Yaş Grubu</label>
            <select
              value={attributes.bookAgeGroup}
              onChange={(e) => onChange('bookAgeGroup', e.target.value)}
              className={selectClass}
            >
              <option value="">Seçin</option>
              {bookAgeGroups.map(g => (
                <option key={g.value} value={g.value}>{g.label}</option>
              ))}
            </select>
          </div>

          {/* Dil */}
          <div>
            <label className={labelClass}>Dil</label>
            <select
              value={attributes.bookLanguage}
              onChange={(e) => onChange('bookLanguage', e.target.value)}
              className={selectClass}
            >
              <option value="tr">Türkçe</option>
              <option value="en">İngilizce</option>
              <option value="de">Almanca</option>
              <option value="fr">Fransızca</option>
              <option value="other">Diğer</option>
            </select>
          </div>
        </div>
      </div>
    )
  }

  // Diğer kategoriler için durum skoru
  return (
    <div className="space-y-4 p-4 bg-gray-50/50 rounded-xl border border-gray-100">
      <h4 className="font-semibold text-gray-800">📊 Ürün Durumu Detayı</h4>
      <div>
        <label className={labelClass}>
          Durum Puanı: <span className="text-pink-600 font-bold">{attributes.conditionScore}/10</span>
        </label>
        <input
          type="range"
          min="1"
          max="10"
          value={attributes.conditionScore}
          onChange={(e) => onChange('conditionScore', parseInt(e.target.value))}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-pink-500"
        />
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>Kötü</span>
          <span>Orta</span>
          <span>Mükemmel</span>
        </div>
      </div>
    </div>
  )
}
