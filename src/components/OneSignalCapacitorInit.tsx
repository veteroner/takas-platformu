'use client'

import { useEffect } from 'react'
import { supabase } from '@/lib/supabase'

const ONESIGNAL_APP_ID = process.env.NEXT_PUBLIC_ONESIGNAL_APP_ID || ''

// Extend Window interface for Cordova
declare global {
  interface Window {
    cordova?: unknown
  }
}

export default function OneSignalCapacitorInit() {
  useEffect(() => {
    const initOneSignal = async () => {
      try {
        if (typeof window === 'undefined') return
        
        // Wait for deviceready event
        const waitForDevice = () => new Promise<void>((resolve) => {
          if (window.cordova) {
            resolve()
          } else {
            document.addEventListener('deviceready', () => resolve(), { once: true })
            setTimeout(resolve, 2000) // Fallback
          }
        })
        
        await waitForDevice()
        
        // Check OneSignal plugin - use unknown type for Cordova plugins
        const windowWithPlugins = window as unknown as {
          plugins?: {
            OneSignal?: {
              setAppId: (appId: string) => void
              promptForPushNotificationsWithUserResponse: () => void
              setExternalUserId: (userId: string) => void
              removeExternalUserId: () => void
            }
          }
        }
        
        if (windowWithPlugins.plugins?.OneSignal) {
          console.log('🔔 OneSignal Cordova başlatılıyor...')
          
          const OS = windowWithPlugins.plugins.OneSignal
          
          // Initialize (env üzerinden)
          if (ONESIGNAL_APP_ID) {
            OS.setAppId(ONESIGNAL_APP_ID)
            console.log('✅ OneSignal App ID set:', ONESIGNAL_APP_ID)
          } else {
            console.warn('⚠️ OneSignal App ID missing (NEXT_PUBLIC_ONESIGNAL_APP_ID)')
          }
          
          // Request permission
          OS.promptForPushNotificationsWithUserResponse()
          console.log('📱 OneSignal bildirim izni istendi')
          
          // Set external user ID
          const { data: { session } } = await supabase.auth.getSession()
          if (session?.user?.id) {
            OS.setExternalUserId(session.user.id)
            console.log('✅ External User ID set:', session.user.id)
          }
          
          // Auth state listener
          supabase.auth.onAuthStateChange((event, session) => {
            if (event === 'SIGNED_IN' && session?.user?.id) {
              OS.setExternalUserId(session.user.id)
              console.log('✅ External User ID updated:', session.user.id)
            } else if (event === 'SIGNED_OUT') {
              OS.removeExternalUserId()
              console.log('�� External User ID removed')
            }
          })
          
          console.log('🎉 OneSignal başarıyla başlatıldı!')
        } else {
          // OneSignal plugin not available - silent in development
          if (process.env.NODE_ENV !== 'development') {
            console.log('⚠️ OneSignal plugin bulunamadı')
          }
        }
      } catch (error) {
        console.error('❌ OneSignal hatası:', error)
      }
    }
    
    initOneSignal()
  }, [])
  
  return null
}
