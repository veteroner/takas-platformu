'use client'

import { useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import type { OneSignalPlugin } from '../types/onesignal'

declare global {
  interface Window { 
    OneSignal: any
  }
}

const ONESIGNAL_APP_ID = process.env.NEXT_PUBLIC_ONESIGNAL_APP_ID || 'f26d64d9-c8c9-48ee-a472-f12cc5c8b629'

export default function OneSignalInit() {
  useEffect(() => {
    // Kullanıcı authentication durumunu dinle
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        console.log('🔐 User signed in, setting External User ID:', session.user.id)
        await setExternalUserId(session.user.id)
      } else if (event === 'SIGNED_OUT') {
        console.log('🔓 User signed out, removing External User ID')
        await removeExternalUserId()
      }
    })

    // Capacitor native app'de OneSignal başlat
    if (typeof window !== 'undefined' && window.plugins?.OneSignal) {
      initOneSignalNative()
    }
    // Web'de OneSignal başlat (fallback)
    else if (typeof window !== 'undefined') {
      initOneSignalWeb()
    }

    return () => {
      authListener?.subscription.unsubscribe()
    }
  }, [])

  const setExternalUserId = async (userId: string) => {
    try {
      if (window.plugins?.OneSignal) {
        // Native
        await window.plugins.OneSignal.setExternalUserId(userId)
        console.log('✅ OneSignal External User ID set (Native):', userId)
      } else if (window.OneSignal) {
        // Web
        await window.OneSignal.setExternalUserId(userId)
        console.log('✅ OneSignal External User ID set (Web):', userId)
      }
    } catch (error) {
      console.error('❌ Failed to set External User ID:', error)
    }
  }

  const removeExternalUserId = async () => {
    try {
      if (window.plugins?.OneSignal) {
        // Native
        await window.plugins.OneSignal.removeExternalUserId()
        console.log('✅ OneSignal External User ID removed (Native)')
      } else if (window.OneSignal) {
        // Web
        await window.OneSignal.removeExternalUserId()
        console.log('✅ OneSignal External User ID removed (Web)')
      }
    } catch (error) {
      console.error('❌ Failed to remove External User ID:', error)
    }
  }

  const initOneSignalNative = async () => {
    try {
      console.log('Initializing OneSignal Native...')
      
      // OneSignal'ı başlat
      await window.plugins.OneSignal.setAppId({ appId: ONESIGNAL_APP_ID })
      
      // Push notification izni iste
      const response = await window.plugins.OneSignal.promptForPushNotificationsWithUserResponse()
      console.log('OneSignal permission:', response.accepted)

      // Foreground notification handler
      window.plugins.OneSignal.setNotificationWillShowInForegroundHandler((notification) => {
        console.log('Foreground notification:', notification)
        notification.complete(notification)
      })

      // Notification opened handler
      window.plugins.OneSignal.setNotificationOpenedHandler((notification) => {
        console.log('Notification opened:', notification)
      })

      // Device state al
      const deviceState = await window.plugins.OneSignal.getDeviceState()
      console.log('OneSignal Device State:', deviceState)

    } catch (error) {
      console.error('OneSignal Native initialization error:', error)
    }
  }

  const initOneSignalWeb = () => {
    // Web fallback için mevcut kod
    console.log('Initializing OneSignal Web...')
    
    if (!window.OneSignal) {
      const script = document.createElement('script')
      script.src = 'https://cdn.onesignal.com/sdks/OneSignalSDK.js'
      script.onload = () => {
        window.OneSignal = window.OneSignal || []
        window.OneSignal.push(function() {
          window.OneSignal.init({ 
            appId: ONESIGNAL_APP_ID,
            allowLocalhostAsSecureOrigin: true 
          })
        })
      }
      document.head.appendChild(script)
    }
  }

  return null
}


