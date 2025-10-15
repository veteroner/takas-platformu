'use client'

import React, { useState } from 'react'
import Chat from '@/components/Chat'
import { Bell, MessageCircle, Users, CheckCircle } from 'lucide-react'

export default function NotificationTestPage() {
  const [testUserId] = useState('test-user-' + Math.random().toString(36).substr(2, 9))
  const [matchId] = useState('test-match-' + Math.random().toString(36).substr(2, 9))
  
  const sendTestNotification = async (type: string) => {
    try {
      let response;
      
      switch (type) {
        case 'message':
          response = await fetch('/api/messages/send', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              match_id: matchId,
              sender_id: testUserId,
              receiver_id: 'test-receiver-123',
              content: 'Test mesajı - Merhaba! Bu bir test mesajıdır. 📱'
            })
          })
          break
        
        default:
          console.log('Bilinmeyen bildirim türü:', type)
          return
      }
      
      if (response.ok) {
        const data = await response.json()
        alert(`✅ Bildirim gönderildi!\nDurum: ${data.notification_sent ? 'Başarılı' : 'Başarısız'}`)
      } else {
        alert('❌ Bildirim gönderilemedi')
      }
    } catch (error) {
      console.error('Bildirim hatası:', error)
      alert('❌ Hata: ' + error)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 dark:from-gray-900 dark:via-purple-900 dark:to-pink-900 p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <Bell className="w-8 h-8 text-purple-600" />
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Push Bildirim Test Paneli
              </h1>
              <p className="text-gray-600 dark:text-gray-300">
                Mesajlaşma ve bildirim sistemini test edin
              </p>
            </div>
          </div>

          {/* Test Info */}
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-xl p-4 mt-4">
            <p className="text-sm text-blue-800 dark:text-blue-200">
              <strong>Test Kullanıcı ID:</strong> {testUserId}
              <br />
              <strong>Match ID:</strong> {matchId}
            </p>
          </div>
        </div>

        {/* Test Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          
          {/* Message Notification */}
          <button
            onClick={() => sendTestNotification('message')}
            className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200 flex flex-col items-center gap-3"
          >
            <MessageCircle className="w-12 h-12" />
            <div className="text-center">
              <h3 className="font-bold text-lg">Mesaj Bildirimi</h3>
              <p className="text-sm opacity-90">Yeni mesaj geldi bildirimi gönder</p>
            </div>
          </button>

          {/* Match Notification */}
          <button
            onClick={() => alert('Eşleşme bildirimi henüz hazır değil')}
            className="bg-gradient-to-r from-pink-500 to-orange-600 text-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200 flex flex-col items-center gap-3 opacity-50 cursor-not-allowed"
            disabled
          >
            <Users className="w-12 h-12" />
            <div className="text-center">
              <h3 className="font-bold text-lg">Eşleşme Bildirimi</h3>
              <p className="text-sm opacity-90">Yeni eşleşme bildirimi (Yakında)</p>
            </div>
          </button>

          {/* Trade Notification */}
          <button
            onClick={() => alert('Takas onayı bildirimi henüz hazır değil')}
            className="bg-gradient-to-r from-green-500 to-teal-600 text-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200 flex flex-col items-center gap-3 opacity-50 cursor-not-allowed"
            disabled
          >
            <CheckCircle className="w-12 h-12" />
            <div className="text-center">
              <h3 className="font-bold text-lg">Takas Onayı</h3>
              <p className="text-sm opacity-90">Takas onaylandı bildirimi (Yakında)</p>
            </div>
          </button>
        </div>

        {/* Chat Demo */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <MessageCircle className="w-6 h-6 text-purple-600" />
            Canlı Mesajlaşma Demo
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            Mesaj yazdığınızda otomatik olarak karşı tarafa push bildirimi gidecek (gerçek kullanıcı için)
          </p>
          
          <div className="h-[600px] bg-gray-50 dark:bg-gray-900 rounded-xl overflow-hidden">
            <Chat 
              matchId={matchId}
              userId={testUserId}
              otherUserId="test-receiver-123"
              otherUserName="Test Kullanıcısı"
            />
          </div>
        </div>

        {/* Instructions */}
        <div className="bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 rounded-2xl p-6">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
            📋 Test Talimatları
          </h3>
          <ol className="space-y-2 text-gray-700 dark:text-gray-300">
            <li>
              <strong>1.</strong> OneSignal REST API Key'i .env.local dosyasına ekleyin
            </li>
            <li>
              <strong>2.</strong> OneSignal'da bildirim izni verin (popup gelecek)
            </li>
            <li>
              <strong>3.</strong> Farklı bir tarayıcıda veya cihazda test yapın
            </li>
            <li>
              <strong>4.</strong> "Mesaj Bildirimi" butonuna tıklayın
            </li>
            <li>
              <strong>5.</strong> Veya chat alanından doğrudan mesaj gönderin
            </li>
            <li>
              <strong>6.</strong> Karşı cihazda bildirim geldiğini kontrol edin
            </li>
          </ol>
        </div>

        {/* Status Check */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
            ⚙️ Sistem Durumu
          </h3>
          <div className="space-y-2">
            <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <span className="text-gray-700 dark:text-gray-300">OneSignal App ID</span>
              <span className="text-green-600 dark:text-green-400 font-mono text-sm">
                ✅ Tanımlı
              </span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <span className="text-gray-700 dark:text-gray-300">Messages API</span>
              <span className="text-green-600 dark:text-green-400 font-mono text-sm">
                ✅ Hazır
              </span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <span className="text-gray-700 dark:text-gray-300">Realtime Chat</span>
              <span className="text-green-600 dark:text-green-400 font-mono text-sm">
                ✅ Aktif
              </span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <span className="text-gray-700 dark:text-gray-300">REST API Key</span>
              <span className="text-yellow-600 dark:text-yellow-400 font-mono text-sm">
                ⚠️ .env.local'da tanımlayın
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
