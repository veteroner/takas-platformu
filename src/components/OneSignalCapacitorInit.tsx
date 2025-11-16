'use client'

import { useEffect } from 'react'
import { supabase } from '@/lib/supabase'

const ONESIGNAL_APP_ID = 'f26d64d9-c8c9-48ee-a472-f12cc5c8b629'

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
          
          // Initialize
          OS.setAppId(ONESIGNAL_APP_ID)
          console.log('✅ OneSignal App ID set:', ONESIGNAL_APP_ID)
          
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
          console.log('⚠️ OneSignal plugin bulunamadı')
        }
      } catch (error) {
        console.error('❌ OneSignal hatası:', error)
      }
    }
    
    initOneSignal()
  }, [])
  
  return null
}
