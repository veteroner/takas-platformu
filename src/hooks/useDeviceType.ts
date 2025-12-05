'use client'

import { useState, useEffect } from 'react'

interface DeviceType {
  isMobile: boolean
  isTablet: boolean
  isDesktop: boolean
  width: number
}

export function useDeviceType(): DeviceType {
  const [deviceType, setDeviceType] = useState<DeviceType>({
    isMobile: false,
    isTablet: false,
    isDesktop: true,
    width: 1024
  })

  useEffect(() => {
    const checkDevice = () => {
      const width = window.innerWidth
      setDeviceType({
        isMobile: width < 768,
        isTablet: width >= 768 && width < 1024,
        isDesktop: width >= 1024,
        width
      })
    }
    
    // İlk kontrol
    checkDevice()
    
    // Resize dinleyicisi
    window.addEventListener('resize', checkDevice)
    return () => window.removeEventListener('resize', checkDevice)
  }, [])

  return deviceType
}
