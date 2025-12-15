import { Geolocation, Position } from '@capacitor/geolocation'

export interface UserLocation {
  latitude: number
  longitude: number
  city?: string
  district?: string
  timestamp: number
}

export interface LocationError {
  code: 'PERMISSION_DENIED' | 'POSITION_UNAVAILABLE' | 'TIMEOUT' | 'UNKNOWN'
  message: string
}

// Türkiye'deki büyük şehirlerin koordinatları
const TURKEY_CITIES: Record<string, { lat: number; lng: number }> = {
  'istanbul': { lat: 41.0082, lng: 28.9784 },
  'ankara': { lat: 39.9334, lng: 32.8597 },
  'izmir': { lat: 38.4237, lng: 27.1428 },
  'bursa': { lat: 40.1885, lng: 29.0610 },
  'antalya': { lat: 36.8969, lng: 30.7133 },
  'adana': { lat: 37.0000, lng: 35.3213 },
  'konya': { lat: 37.8746, lng: 32.4932 },
  'gaziantep': { lat: 37.0662, lng: 37.3833 },
  'mersin': { lat: 36.8121, lng: 34.6415 },
  'diyarbakır': { lat: 37.9144, lng: 40.2306 },
  'kayseri': { lat: 38.7312, lng: 35.4787 },
  'eskişehir': { lat: 39.7767, lng: 30.5206 },
  'samsun': { lat: 41.2867, lng: 36.3300 },
  'denizli': { lat: 37.7765, lng: 29.0864 },
  'şanlıurfa': { lat: 37.1591, lng: 38.7969 },
  'trabzon': { lat: 41.0027, lng: 39.7168 },
  'malatya': { lat: 38.3552, lng: 38.3095 },
  'erzurum': { lat: 39.9055, lng: 41.2658 },
  'van': { lat: 38.4891, lng: 43.4089 },
  'batman': { lat: 37.8812, lng: 41.1351 },
  'elazığ': { lat: 38.6810, lng: 39.2264 },
  'manisa': { lat: 38.6191, lng: 27.4289 },
  'kocaeli': { lat: 40.8533, lng: 29.8815 },
  'balıkesir': { lat: 39.6484, lng: 27.8826 },
  'sakarya': { lat: 40.6940, lng: 30.4358 },
  'tekirdağ': { lat: 40.9781, lng: 27.5117 },
  'aydın': { lat: 37.8560, lng: 27.8416 },
  'muğla': { lat: 37.2153, lng: 28.3636 },
  'hatay': { lat: 36.2028, lng: 36.1596 },
  'kahramanmaraş': { lat: 37.5858, lng: 36.9371 },
}

// İki koordinat arasındaki mesafeyi km olarak hesapla (Haversine formülü)
export function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371 // Dünya'nın yarıçapı (km)
  const dLat = toRad(lat2 - lat1)
  const dLon = toRad(lon2 - lon1)
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

function toRad(deg: number): number {
  return deg * (Math.PI / 180)
}

// Konum iznini kontrol et
export async function checkLocationPermission(): Promise<'granted' | 'denied' | 'prompt'> {
  try {
    const status = await Geolocation.checkPermissions()
    return status.location === 'granted' ? 'granted' : 
           status.location === 'denied' ? 'denied' : 'prompt'
  } catch {
    return 'prompt'
  }
}

// Konum izni iste
export async function requestLocationPermission(): Promise<boolean> {
  try {
    const status = await Geolocation.requestPermissions()
    return status.location === 'granted'
  } catch {
    return false
  }
}

// Mevcut konumu al
export async function getCurrentLocation(): Promise<UserLocation | LocationError> {
  try {
    // Önce izin kontrolü
    const permission = await checkLocationPermission()
    
    if (permission === 'denied') {
      return {
        code: 'PERMISSION_DENIED',
        message: 'Konum izni reddedildi. Ayarlardan konum iznini etkinleştirin.'
      }
    }
    
    if (permission === 'prompt') {
      const granted = await requestLocationPermission()
      if (!granted) {
        return {
          code: 'PERMISSION_DENIED',
          message: 'Konum izni verilmedi.'
        }
      }
    }

    const position: Position = await Geolocation.getCurrentPosition({
      enableHighAccuracy: false, // Şehir seviyesi yeterli, batarya dostu
      timeout: 5000, // 5 saniye yeterli
      maximumAge: 60000 // 1 dakika cache
    })

    const location: UserLocation = {
      latitude: position.coords.latitude,
      longitude: position.coords.longitude,
      timestamp: position.timestamp
    }

    // Koordinatlardan en yakın şehri bul
    const nearestCity = findNearestCity(location.latitude, location.longitude)
    if (nearestCity) {
      location.city = nearestCity
    }

    return location
  } catch (error: unknown) {
    const err = error as { code?: number; message?: string }
    if (err.code === 1) {
      return { code: 'PERMISSION_DENIED', message: 'Konum izni reddedildi.' }
    } else if (err.code === 2) {
      return { code: 'POSITION_UNAVAILABLE', message: 'Konum bilgisi alınamadı.' }
    } else if (err.code === 3) {
      return { code: 'TIMEOUT', message: 'Konum alınırken zaman aşımı.' }
    }
    return { code: 'UNKNOWN', message: err.message || 'Bilinmeyen hata' }
  }
}

// Koordinatlardan en yakın Türkiye şehrini bul
export function findNearestCity(lat: number, lng: number): string | null {
  let nearestCity: string | null = null
  let minDistance = Infinity

  for (const [city, coords] of Object.entries(TURKEY_CITIES)) {
    const distance = calculateDistance(lat, lng, coords.lat, coords.lng)
    if (distance < minDistance) {
      minDistance = distance
      nearestCity = city.charAt(0).toUpperCase() + city.slice(1)
    }
  }

  // 150km içinde şehir yoksa null döndür
  return minDistance <= 150 ? nearestCity : null
}

// Şehir adından koordinat al
export function getCityCoordinates(cityName: string): { lat: number; lng: number } | null {
  const normalizedCity = cityName.toLowerCase().trim()
  return TURKEY_CITIES[normalizedCity] || null
}

// İki şehir arasındaki mesafeyi hesapla
export function getDistanceBetweenCities(city1: string, city2: string): number | null {
  const coords1 = getCityCoordinates(city1)
  const coords2 = getCityCoordinates(city2)
  
  if (!coords1 || !coords2) return null
  
  return calculateDistance(coords1.lat, coords1.lng, coords2.lat, coords2.lng)
}

// Kullanıcının konumuna göre yakındaki şehirleri bul
export function getNearbyTargets(
  userLat: number,
  userLng: number,
  maxDistanceKm: number = 100
): string[] {
  const nearby: { city: string; distance: number }[] = []

  for (const [city, coords] of Object.entries(TURKEY_CITIES)) {
    const distance = calculateDistance(userLat, userLng, coords.lat, coords.lng)
    if (distance <= maxDistanceKm) {
      nearby.push({
        city: city.charAt(0).toUpperCase() + city.slice(1),
        distance
      })
    }
  }

  // Mesafeye göre sırala
  return nearby.sort((a, b) => a.distance - b.distance).map(n => n.city)
}

// Konum bazlı skor hesapla (matchingService için)
export function calculateDistanceScore(
  userLat: number,
  userLng: number,
  itemCity: string | undefined
): number {
  if (!itemCity) return 5 // Konum belirtilmemiş

  const itemCoords = getCityCoordinates(itemCity)
  if (!itemCoords) return 5

  const distance = calculateDistance(userLat, userLng, itemCoords.lat, itemCoords.lng)

  // Mesafeye göre skor (0-15 arası)
  if (distance <= 20) return 15 // Aynı şehir/çok yakın
  if (distance <= 50) return 12 // Yakın
  if (distance <= 100) return 10 // Orta mesafe
  if (distance <= 200) return 7 // Uzak
  if (distance <= 400) return 4 // Çok uzak
  return 2 // Türkiye'nin diğer ucu
}

// LocalStorage'da konum cache'le
const LOCATION_CACHE_KEY = 'user_location_cache'
const CACHE_DURATION = 30 * 60 * 1000 // 30 dakika

export function getCachedLocation(): UserLocation | null {
  if (typeof window === 'undefined') return null
  
  try {
    const cached = localStorage.getItem(LOCATION_CACHE_KEY)
    if (!cached) return null
    
    const location: UserLocation = JSON.parse(cached)
    const now = Date.now()
    
    // Cache süresi dolmuş mu?
    if (now - location.timestamp > CACHE_DURATION) {
      localStorage.removeItem(LOCATION_CACHE_KEY)
      return null
    }
    
    return location
  } catch {
    return null
  }
}

export function setCachedLocation(location: UserLocation): void {
  if (typeof window === 'undefined') return
  
  try {
    localStorage.setItem(LOCATION_CACHE_KEY, JSON.stringify(location))
  } catch {
    // Storage full veya başka hata - ignore
  }
}

// Konum al (önce cache'den, yoksa GPS'den)
export async function getLocation(): Promise<UserLocation | LocationError> {
  // Önce cache kontrol et
  const cached = getCachedLocation()
  if (cached) {
    return cached
  }
  
  // GPS'den al
  const location = await getCurrentLocation()
  
  // Başarılıysa cache'le
  if ('latitude' in location) {
    setCachedLocation(location)
  }
  
  return location
}

// Hata mı kontrol et
export function isLocationError(result: UserLocation | LocationError): result is LocationError {
  return 'code' in result && 'message' in result
}
