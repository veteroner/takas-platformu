// Akıllı Eşleştirme Servisi
import { supabase } from './supabase'
import type { 
  ItemAttributes, 
  UserMatchingPreferences, 
  MatchScore, 
  ClothingSizeText,
  DbCategory
} from '@/types/matching'

const SIZE_LIST: ClothingSizeText[] = ['XS', 'S', 'M', 'L', 'XL', 'XXL']

// Beden uyumluluk skoru hesapla
export function calculateSizeScore(
  userSize: ClothingSizeText | undefined,
  itemSize: ClothingSizeText | undefined,
  tolerance: number = 1
): number {
  if (!userSize || !itemSize) return 15 // Bilgi yoksa orta skor

  const userIdx = SIZE_LIST.indexOf(userSize)
  const itemIdx = SIZE_LIST.indexOf(itemSize)
  
  if (userIdx === -1 || itemIdx === -1) return 0

  const diff = Math.abs(userIdx - itemIdx)

  if (diff === 0) return 25      // Tam uyum
  if (diff <= tolerance) return 20  // Tolerans dahilinde
  if (diff === 2) return 10      // 2 beden fark
  return 0                        // Uyumsuz
}

// Yaş uyumluluk skoru hesapla (oyuncaklar için)
export function calculateAgeScore(
  childAge: number | undefined,
  toyAgeMin: number | undefined,
  toyAgeMax: number | undefined
): number {
  if (!childAge || toyAgeMin === undefined || toyAgeMax === undefined) return 10

  if (childAge >= toyAgeMin && childAge <= toyAgeMax) return 15 // Tam uyum
  if (childAge >= toyAgeMin - 1 && childAge <= toyAgeMax + 1) return 10 // Yakın
  return 0 // Uyumsuz
}

// Kategori uyumluluk skoru
export function calculateCategoryScore(
  itemCategory: DbCategory,
  preferredCategories: DbCategory[]
): number {
  if (!preferredCategories || preferredCategories.length === 0) return 15
  return preferredCategories.includes(itemCategory) ? 25 : 5
}

// Durum skoru
export function calculateConditionScore(
  itemConditionScore: number | undefined,
  minAccepted: number = 5
): number {
  if (!itemConditionScore) return 10
  if (itemConditionScore >= minAccepted) {
    return Math.min(15, itemConditionScore + 5)
  }
  return itemConditionScore
}

// Lokasyon skoru
export function calculateLocationScore(
  itemCity: string | undefined,
  preferredCity: string | undefined,
  acceptShipping: boolean = true
): number {
  if (!itemCity || !preferredCity) return 7
  
  if (itemCity.toLowerCase().includes(preferredCity.toLowerCase())) return 10
  if (acceptShipping) return 5
  return 0
}

// Toplam eşleşme skoru hesapla
export function calculateMatchScore(
  item: { category: DbCategory; location?: string },
  itemAttrs: Partial<ItemAttributes> | null,
  userPrefs: Partial<UserMatchingPreferences> | null
): MatchScore {
  const categoryScore = calculateCategoryScore(
    item.category, 
    userPrefs?.preferredCategories || []
  )

  let sizeScore = 15
  if (item.category === 'clothing' && itemAttrs?.sizeText) {
    sizeScore = calculateSizeScore(
      userPrefs?.mySizeText,
      itemAttrs.sizeText,
      userPrefs?.sizeTolerance || 1
    )
  }

  let ageScore = 10
  if (item.category === 'toys' && itemAttrs?.toyAgeMin !== undefined) {
    // En uygun çocuk yaşını bul
    if (userPrefs?.childrenInfo && userPrefs.childrenInfo.length > 0) {
      ageScore = Math.max(
        ...userPrefs.childrenInfo.map(child => 
          calculateAgeScore(child.age, itemAttrs.toyAgeMin, itemAttrs.toyAgeMax)
        )
      )
    } else if (userPrefs?.seekingToyAgeMin !== undefined) {
      // Aralık kontrolü
      if (itemAttrs.toyAgeMin! <= (userPrefs.seekingToyAgeMax || 99) && 
          (itemAttrs.toyAgeMax || 99) >= userPrefs.seekingToyAgeMin) {
        ageScore = 15
      }
    }
  }

  const conditionScore = calculateConditionScore(
    itemAttrs?.conditionScore,
    userPrefs?.minConditionScore || 5
  )

  const locationScore = calculateLocationScore(
    item.location,
    userPrefs?.preferredCity,
    userPrefs?.acceptShipping ?? true
  )

  const totalScore = categoryScore + sizeScore + ageScore + conditionScore + locationScore

  return {
    categoryScore,
    sizeScore,
    ageScore,
    conditionScore,
    locationScore,
    totalScore
  }
}

// Ürün özelliklerini kaydet
export async function saveItemAttributes(
  itemId: string,
  attrs: Partial<ItemAttributes>
): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('item_attributes')
      .upsert({
        item_id: itemId,
        size_eu: attrs.sizeEu,
        size_text: attrs.sizeText,
        gender: attrs.gender,
        age_group: attrs.ageGroup,
        season: attrs.season,
        style: attrs.style,
        color: attrs.color,
        brand: attrs.brand,
        toy_age_min: attrs.toyAgeMin,
        toy_age_max: attrs.toyAgeMax,
        toy_type: attrs.toyType,
        toy_gender: attrs.toyGender,
        book_genre: attrs.bookGenre,
        book_language: attrs.bookLanguage,
        book_age_group: attrs.bookAgeGroup,
        condition_score: attrs.conditionScore,
        updated_at: new Date().toISOString()
      }, { onConflict: 'item_id' })

    if (error) throw error
    return true
  } catch (err) {
    console.error('saveItemAttributes error:', err)
    return false
  }
}

// Ürün özelliklerini getir
export async function getItemAttributes(itemId: string): Promise<ItemAttributes | null> {
  try {
    const { data, error } = await supabase
      .from('item_attributes')
      .select('*')
      .eq('item_id', itemId)
      .single()

    if (error) throw error
    if (!data) return null

    return {
      id: data.id,
      itemId: data.item_id,
      sizeEu: data.size_eu,
      sizeText: data.size_text,
      gender: data.gender,
      ageGroup: data.age_group,
      season: data.season,
      style: data.style,
      color: data.color,
      brand: data.brand,
      toyAgeMin: data.toy_age_min,
      toyAgeMax: data.toy_age_max,
      toyType: data.toy_type,
      toyGender: data.toy_gender,
      bookGenre: data.book_genre,
      bookLanguage: data.book_language,
      bookAgeGroup: data.book_age_group,
      conditionScore: data.condition_score
    }
  } catch (err) {
    console.error('getItemAttributes error:', err)
    return null
  }
}

// Kullanıcı tercihlerini kaydet
export async function saveUserMatchingPreferences(
  userId: string,
  prefs: Partial<UserMatchingPreferences>
): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('user_matching_preferences')
      .upsert({
        user_id: userId,
        my_size_text: prefs.mySizeText,
        my_gender: prefs.myGender,
        has_children: prefs.hasChildren,
        children_info: prefs.childrenInfo || [],
        preferred_categories: prefs.preferredCategories || [],
        size_tolerance: prefs.sizeTolerance ?? 1,
        seeking_toy_age_min: prefs.seekingToyAgeMin,
        seeking_toy_age_max: prefs.seekingToyAgeMax,
        preferred_city: prefs.preferredCity,
        max_distance_km: prefs.maxDistanceKm ?? 50,
        accept_shipping: prefs.acceptShipping ?? true,
        min_condition_score: prefs.minConditionScore ?? 5,
        updated_at: new Date().toISOString()
      }, { onConflict: 'user_id' })

    if (error) throw error
    return true
  } catch (err) {
    console.error('saveUserMatchingPreferences error:', err)
    return false
  }
}

// Kullanıcı tercihlerini getir
export async function getUserMatchingPreferences(
  userId: string
): Promise<UserMatchingPreferences | null> {
  try {
    const { data, error } = await supabase
      .from('user_matching_preferences')
      .select('*')
      .eq('user_id', userId)
      .single()

    if (error && error.code !== 'PGRST116') throw error
    if (!data) return null

    return {
      userId: data.user_id,
      mySizeText: data.my_size_text,
      myGender: data.my_gender,
      hasChildren: data.has_children,
      childrenInfo: data.children_info || [],
      preferredCategories: data.preferred_categories || [],
      sizeTolerance: data.size_tolerance ?? 1,
      seekingToyAgeMin: data.seeking_toy_age_min,
      seekingToyAgeMax: data.seeking_toy_age_max,
      preferredCity: data.preferred_city,
      maxDistanceKm: data.max_distance_km ?? 50,
      acceptShipping: data.accept_shipping ?? true,
      minConditionScore: data.min_condition_score ?? 5
    }
  } catch (err) {
    console.error('getUserMatchingPreferences error:', err)
    return null
  }
}
