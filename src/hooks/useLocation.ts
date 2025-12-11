'use client'

import { useState, useEffect, useCallback } from 'react'
import {
  getLocation,
  isLocationError,
  UserLocation,
  LocationError,
  checkLocationPermission,
  requestLocationPermission,
  getNearbyTargets,
  calculateDistanceScore
} from '@/lib/geolocation'

interface UseLocationReturn {
  location: UserLocation | null
  error: LocationError | null
  loading: boolean
  permissionStatus: 'granted' | 'denied' | 'prompt' | 'unknown'
  refresh: () => Promise<void>
  requestPermission: () => Promise<boolean>
  nearbyTargets: string[]
  getItemScore: (itemCity: string | undefined) => number
}

export function useLocation(autoFetch: boolean = true): UseLocationReturn {
  const [location, setLocation] = useState<UserLocation | null>(null)
  const [error, setError] = useState<LocationError | null>(null)
  const [loading, setLoading] = useState(false)
  const [permissionStatus, setPermissionStatus] = useState<'granted' | 'denied' | 'prompt' | 'unknown'>('unknown')
  const [nearbyTargets, setNearbyTargets] = useState<string[]>([])

  // İzin durumunu kontrol et
  const checkPermission = useCallback(async () => {
    const status = await checkLocationPermission()
    setPermissionStatus(status)
    return status
  }, [])

  // Konum al
  const fetchLocation = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const result = await getLocation()

      if (isLocationError(result)) {
        setError(result)
        setLocation(null)
        if (result.code === 'PERMISSION_DENIED') {
          setPermissionStatus('denied')
        }
      } else {
        setLocation(result)
        setError(null)
        setPermissionStatus('granted')
        
        // Yakın şehirleri hesapla
        const nearby = getNearbyTargets(result.latitude, result.longitude, 150)
        setNearbyTargets(nearby)
      }
    } catch {
      setError({
        code: 'UNKNOWN',
        message: 'Konum alınırken beklenmeyen bir hata oluştu.'
      })
    } finally {
      setLoading(false)
    }
  }, [])

  // İzin iste
  const requestPermissionHandler = useCallback(async (): Promise<boolean> => {
    const granted = await requestLocationPermission()
    if (granted) {
      setPermissionStatus('granted')
      await fetchLocation()
    } else {
      setPermissionStatus('denied')
    }
    return granted
  }, [fetchLocation])

  // Konum bazlı skor hesapla
  const getItemScore = useCallback((itemCity: string | undefined): number => {
    if (!location) return 5
    return calculateDistanceScore(location.latitude, location.longitude, itemCity)
  }, [location])

  // İlk yüklemede izin durumunu kontrol et
  useEffect(() => {
    checkPermission()
  }, [checkPermission])

  // Auto fetch etkinse ve izin varsa konum al
  useEffect(() => {
    if (autoFetch && permissionStatus === 'granted') {
      fetchLocation()
    }
  }, [autoFetch, permissionStatus, fetchLocation])

  return {
    location,
    error,
    loading,
    permissionStatus,
    refresh: fetchLocation,
    requestPermission: requestPermissionHandler,
    nearbyTargets,
    getItemScore
  }
}

export default useLocation
