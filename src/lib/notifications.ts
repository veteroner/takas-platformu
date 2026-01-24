import 'server-only'

// OneSignal Push Notification Helper Functions

import { getSupabaseAdmin } from '@/lib/admin'

const ONESIGNAL_APP_ID = process.env.NEXT_PUBLIC_ONESIGNAL_APP_ID!;
const ONESIGNAL_REST_API_KEY = process.env.ONESIGNAL_REST_API_KEY || '';

export interface PushNotificationData {
  type: 'message' | 'match' | 'trade' | 'general';
  sender_id?: string;
  match_id?: string;
  item_id?: string;
  timestamp: string;
}

export interface SendNotificationParams {
  userIds: string[];
  title: string;
  message: string;
  data?: PushNotificationData;
  url?: string;
  imageUrl?: string;
  iosBadgeCount?: number;
}

/**
 * Kullanıcının bildirim tercihlerini kontrol et
 */
async function checkNotificationPreference(userId: string, notificationType: string): Promise<boolean> {
  try {
    const supabaseAdmin = getSupabaseAdmin()
    if (!supabaseAdmin) return true

    const [prefsRes, settingsRes] = await Promise.all([
      supabaseAdmin
        .from('notification_prefs')
        .select('enabled, categories')
        .eq('user_id', userId)
        .maybeSingle(),
      supabaseAdmin
        .from('user_settings')
        .select('notifications_enabled')
        .eq('user_id', userId)
        .maybeSingle()
    ])

    const prefs = prefsRes.data as { enabled?: boolean; categories?: string[] | null } | null
    const settings = settingsRes.data as { notifications_enabled?: boolean } | null

    // user_settings.notifications_enabled (global toggle)
    if (settings && settings.notifications_enabled === false) return false

    // notification_prefs.enabled (digest-style/global notification toggle)
    if (prefs && prefs.enabled === false) return false

    // category filtering (optional): if categories list exists, treat type as a category key
    if (prefs?.categories && Array.isArray(prefs.categories) && prefs.categories.length > 0) {
      if (!prefs.categories.includes(notificationType)) return false
    }

    return true
  } catch (error) {
    console.error('Bildirim tercihi kontrol hatası:', error)
    // Hata durumunda bildirimlere izin ver
    return true
  }
}

/**
 * OneSignal REST API ile push bildirimi gönder
 */
export async function sendPushNotification({
  userIds,
  title,
  message,
  data,
  url,
  imageUrl,
  iosBadgeCount
}: SendNotificationParams): Promise<boolean> {
  
  if (!ONESIGNAL_REST_API_KEY) {
    console.warn('⚠️ OneSignal REST API key tanımlanmamış');
    return false;
  }

  if (!userIds || userIds.length === 0) {
    console.warn('⚠️ Bildirim gönderilecek kullanıcı yok');
    return false;
  }

  // 📋 Bildirim tercihlerini kontrol et
  const notificationType = data?.type || 'general'
  const allowedUserIds: string[] = []
  
  for (const userId of userIds) {
    const allowed = await checkNotificationPreference(userId, notificationType)
    if (allowed) {
      allowedUserIds.push(userId)
    } else {
      console.log(`⏭️ Kullanıcı ${userId} için ${notificationType} bildirimi devre dışı`)
    }
  }

  if (allowedUserIds.length === 0) {
    console.log('⚠️ Tüm kullanıcılar bildirimleri kapattı')
    return false
  }

  try {
    const response = await fetch('https://onesignal.com/api/v1/notifications', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${ONESIGNAL_REST_API_KEY}`
      },
      body: JSON.stringify({
        app_id: ONESIGNAL_APP_ID,
        include_external_user_ids: allowedUserIds,
        
        // Başlık (çoklu dil desteği)
        headings: {
          en: title,
          tr: title
        },
        
        // Mesaj içeriği
        contents: {
          en: message,
          tr: message
        },
        
        // Özel veri
        data: data || {
          type: 'general',
          timestamp: new Date().toISOString()
        },
        
        // URL (tıklandığında açılacak sayfa)
        url: url,
        
        // Görsel
        big_picture: imageUrl,
        large_icon: imageUrl,
        
        // iOS ayarları
        ios_badgeType: typeof iosBadgeCount === 'number' ? 'SetTo' : 'Increase',
        ios_badgeCount: typeof iosBadgeCount === 'number' ? iosBadgeCount : 1,
        ios_sound: 'notification.wav',
        
        // Android ayarları
        android_sound: 'notification',
        android_channel_id: data?.type || 'general',
        
        // Yüksek öncelik
        priority: 10,
        
        // TTL (Time To Live - 24 saat)
        ttl: 86400
      })
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('❌ OneSignal bildirim hatası:', error);
      return false;
    }

    const result = await response.json();
    console.log('✅ Push bildirim başarıyla gönderildi:', result.id);
    return true;

  } catch (error) {
    console.error('❌ Push bildirim gönderme hatası:', error);
    return false;
  }
}

/**
 * Mesaj bildirimi gönder
 */
export async function sendMessageNotification(
  receiverId: string,
  senderId: string,
  senderName: string,
  messageText: string,
  matchId: string,
  iosBadgeCount?: number
) {
  return sendPushNotification({
    userIds: [receiverId],
    title: `💬 ${senderName}`,
    message: messageText.substring(0, 100),
    iosBadgeCount,
    data: {
      type: 'message',
      sender_id: senderId,
      match_id: matchId,
      timestamp: new Date().toISOString()
    },
    url: `/chat/${matchId}`
  });
}

/**
 * Eşleşme bildirimi gönder
 */
export async function sendMatchNotification(
  userId: string,
  otherUserName: string,
  itemName: string,
  matchId?: string
) {
  return sendPushNotification({
    userIds: [userId],
    title: '🎉 Yeni Eşleşme!',
    message: `${otherUserName} ile eşleştin! ${itemName} için takas yapabilirsiniz.`,
    data: {
      type: 'match',
      match_id: matchId,
      timestamp: new Date().toISOString()
    },
    url: matchId ? `/chat/${matchId}` : '/matches'
  });
}

/**
 * Takas onayı bildirimi
 */
export async function sendTradeConfirmationNotification(
  userId: string,
  otherUserName: string,
  itemName: string
) {
  return sendPushNotification({
    userIds: [userId],
    title: '✅ Takas Onaylandı!',
    message: `${otherUserName} takası onayladı. ${itemName} artık senin!`,
    data: {
      type: 'trade',
      timestamp: new Date().toISOString()
    },
    url: '/profile?tab=trades'
  });
}

/**
 * Genel bildirim gönder
 */
export async function sendGeneralNotification(
  userIds: string[],
  title: string,
  message: string,
  url?: string
) {
  return sendPushNotification({
    userIds,
    title,
    message,
    data: {
      type: 'general',
      timestamp: new Date().toISOString()
    },
    url
  });
}
