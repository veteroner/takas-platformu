'use client'

import { useEffect } from 'react'
import { supabase } from '@/lib/supabase'

const ONESIGNAL_APP_ID = process.env.NEXT_PUBLIC_ONESIGNAL_APP_ID || 'f26d64d9-c8c9-48ee-a472-f12cc5c8b629'

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
        
        // Wait for Cordova deviceready
        const waitForCordova = () => new Promise<void>((resolve) => {
          if (window.cordova) {
            resolve()
          } else {
            document.addEventListener('deviceready', () => resolve(), { once: true })
            setTimeout(resolve, 3000)
          }
        })
        
        await waitForCordova()
        
        // Access OneSignal from window.plugins (Modern Cordova v5.x API)
        const windowWithPlugins = window as any
        
        if (windowWithPlugins.plugins?.OneSignal) {
          console.log('🔔 OneSignal Cordova v5.x başlatılıyor...')
          const OneSignal = windowWithPlugins.plugins.OneSignal

          // Debug: Log plugin structure
          console.log('OneSignal plugin yapısı:', Object.keys(OneSignal))

          // 1. MODERN API (v5.x): initialize() - NOT setAppId()!
          if (typeof OneSignal.initialize === 'function') {
            OneSignal.initialize(ONESIGNAL_APP_ID)
            console.log('✅ OneSignal.initialize() çağrıldı:', ONESIGNAL_APP_ID)
          } else {
            console.warn('⚠️ OneSignal.initialize bulunamadı, plugin API versiyonu kontrol edin')
          }

          // 2. Notification lifecycle events (v5.x) - ÖNCE EVENT LİSTENERLARI!
          if (OneSignal.Notifications?.addEventListener) {
            // Foreground notification received
            OneSignal.Notifications.addEventListener('foregroundWillDisplay', (event: any) => {
              console.log('🔔 Bildirim alındı (foreground):', event)
              event.preventDefault() // İsterseniz prevent edip custom UI gösterebilirsiniz
              event.notification.display() // Veya direkt gösterin
            })

            // Notification clicked
            OneSignal.Notifications.addEventListener('click', (event: any) => {
              console.log('👆 Bildirime tıklandı:', event)
              // TODO: Navigate based on notification.additionalData
            })

            console.log('✅ Notification event listeners kuruldu')
          }

          // 3. Bildirim izni iste (Modern API) - SONRA İZİN İSTE!
          if (OneSignal.Notifications?.requestPermission) {
            const accepted = await OneSignal.Notifications.requestPermission(true)
            console.log('📱 Push bildirim izni:', accepted ? '✅ Kabul edildi' : '❌ Reddedildi')
            
            // İzin alındıktan SONRA subscription token'ı kontrol et
            if (accepted && OneSignal.User?.pushSubscription) {
              // Subscription oluşmasını bekle (max 5 saniye)
              await new Promise(resolve => setTimeout(resolve, 2000))
              
              const subscriptionId = OneSignal.User.pushSubscription.id
              const token = OneSignal.User.pushSubscription.token
              console.log('🔑 Push Subscription ID:', subscriptionId)
              console.log('🔑 Push Token:', token)
              
              if (!token) {
                console.warn('⚠️ Push token henüz oluşmadı, lütfen bekleyin...')
              }
            }
          } else {
            console.warn('⚠️ OneSignal.Notifications.requestPermission bulunamadı')
          }

          // 4. Set External User ID (Supabase user) - EN SON!
          const { data: { session } } = await supabase.auth.getSession()
          if (session?.user?.id && OneSignal.login) {
            // Subscription tamamen hazır olana kadar bekle
            await new Promise(resolve => setTimeout(resolve, 1000))
            
            OneSignal.login(session.user.id)
            console.log('✅ OneSignal.login() called with External User ID:', session.user.id)
            
            // Login sonrası subscription durumunu logla
            if (OneSignal.User?.pushSubscription) {
              setTimeout(() => {
                const subscriptionState = {
                  id: OneSignal.User.pushSubscription.id,
                  token: OneSignal.User.pushSubscription.token,
                  optedIn: OneSignal.User.pushSubscription.optedIn
                }
                console.log('📊 Login sonrası Subscription State:', subscriptionState)
              }, 1000)
            }
          } else if (session?.user?.id && OneSignal.User?.setExternalId) {
            // Fallback for older v5.x API
            await new Promise(resolve => setTimeout(resolve, 1000))
            OneSignal.User.setExternalId(session.user.id)
            console.log('✅ External User ID set (User.setExternalId):', session.user.id)
          } else {
            console.warn('⚠️ Kullanıcı giriş yapmamış, External User ID atanamadı')
          }

          // 5. Auth state listener - Kullanıcı login/logout takibi
          supabase.auth.onAuthStateChange(async (event, session) => {
            try {
              if (event === 'SIGNED_IN' && session?.user?.id) {
                // Yeni login olduğunda, subscription hazır olana kadar bekle
                await new Promise(resolve => setTimeout(resolve, 2000))
                
                if (OneSignal.login) {
                  OneSignal.login(session.user.id)
                  console.log('✅ OneSignal.login() on SIGNED_IN:', session.user.id)
                } else if (OneSignal.User?.setExternalId) {
                  OneSignal.User.setExternalId(session.user.id)
                  console.log('✅ External User ID updated on login:', session.user.id)
                }
                
                // Login sonrası subscription durumunu kontrol et
                if (OneSignal.User?.pushSubscription) {
                  setTimeout(() => {
                    const token = OneSignal.User.pushSubscription.token
                    console.log('🔍 SIGNED_IN sonrası Push Token:', token || 'Token henüz yok!')
                  }, 1000)
                }
              } else if (event === 'SIGNED_OUT') {
                if (OneSignal.logout) {
                  OneSignal.logout()
                  console.log('✅ OneSignal.logout() on SIGNED_OUT')
                } else if (OneSignal.User?.removeExternalId) {
                  OneSignal.User.removeExternalId()
                  console.log('✅ External User ID removed on logout')
                }
              }
            } catch (err) {
              console.error('❌ OneSignal auth state handler error:', err)
            }
          })

          console.log('🎉 OneSignal v5.x kurulumu tamamlandı!')
          
        } else {
          console.warn('⚠️ OneSignal plugin bulunamadı - Lütfen "npx cap sync ios" çalıştırın')
        }
      } catch (error) {
        console.error('❌ OneSignal başlatma hatası:', error)
      }
    }
    
    initOneSignal()
  }, [])
  
  return null
}
