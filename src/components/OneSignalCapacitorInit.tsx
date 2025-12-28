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

          const OS = windowWithPlugins.plugins.OneSignal as any

          // Debug: log plugin shape for diagnostics
          try {
            console.log('OneSignal plugin object:', Object.keys(OS || {}).length ? OS : OS)
          } catch (e) {
            console.log('OneSignal plugin present (unable to enumerate keys)')
          }

          // Initialize (env üzerinden) - try both common call signatures
          if (ONESIGNAL_APP_ID) {
            try {
              if (typeof OS.setAppId === 'function') {
                // Most plugins expect a string
                OS.setAppId(ONESIGNAL_APP_ID)
              } else if (typeof OS.setAppId === 'object') {
                // Some wrappers accept { appId }
                // @ts-ignore
                OS.setAppId({ appId: ONESIGNAL_APP_ID })
              } else {
                console.warn('OneSignal.setAppId unknown type:', typeof OS.setAppId)
              }
              console.log('✅ OneSignal App ID set:', ONESIGNAL_APP_ID)
            } catch (err) {
              const safe = (() => {
                try { return JSON.stringify(err) } catch { return String(err) }
              })()
              console.error('❌ OneSignal setAppId error:', err, safe)
            }
          } else {
            console.warn('⚠️ OneSignal App ID missing (NEXT_PUBLIC_ONESIGNAL_APP_ID)')
          }

          // Request permission (guarded)
          try {
            if (typeof OS.promptForPushNotificationsWithUserResponse === 'function') {
              OS.promptForPushNotificationsWithUserResponse()
              console.log('📱 OneSignal bildirim izni istendi')
            } else {
              console.warn('OneSignal.promptForPushNotificationsWithUserResponse not available')
            }
          } catch (err) {
            console.error('❌ OneSignal prompt error:', err)
          }

          // Set external user ID
          try {
            const { data: { session } } = await supabase.auth.getSession()
            if (session?.user?.id && typeof OS.setExternalUserId === 'function') {
              OS.setExternalUserId(session.user.id)
              console.log('✅ External User ID set:', session.user.id)
            }
          } catch (err) {
            console.error('❌ Error setting external user id:', err)
          }

          // Auth state listener
          supabase.auth.onAuthStateChange((event, session) => {
            try {
              if (event === 'SIGNED_IN' && session?.user?.id && typeof OS.setExternalUserId === 'function') {
                OS.setExternalUserId(session.user.id)
                console.log('✅ External User ID updated:', session.user.id)
              } else if (event === 'SIGNED_OUT' && typeof OS.removeExternalUserId === 'function') {
                OS.removeExternalUserId()
                console.log('✅ External User ID removed')
              }
            } catch (err) {
              console.error('❌ OneSignal auth state handler error:', err)
            }
          })

          console.log('🎉 OneSignal init routine complete')
        } else {
          // OneSignal plugin not available - log for diagnostics
          console.warn('⚠️ OneSignal plugin bulunamadı - native plugin absent or not loaded')
        }
      } catch (error) {
        console.error('❌ OneSignal hatası:', error)
      }
    }
    
    initOneSignal()
  }, [])
  
  return null
}
