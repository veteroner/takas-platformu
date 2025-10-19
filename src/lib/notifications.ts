// OneSignal Push Notification Helper Functions

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
  imageUrl
}: SendNotificationParams): Promise<boolean> {
  
  if (!ONESIGNAL_REST_API_KEY) {
    console.warn('⚠️ OneSignal REST API key tanımlanmamış');
    return false;
  }

  if (!userIds || userIds.length === 0) {
    console.warn('⚠️ Bildirim gönderilecek kullanıcı yok');
    return false;
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
        include_external_user_ids: userIds,
        
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
        ios_badgeType: 'Increase',
        ios_badgeCount: 1,
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
  senderName: string,
  messageText: string,
  matchId: string
) {
  return sendPushNotification({
    userIds: [receiverId],
    title: `💬 ${senderName}`,
    message: messageText.substring(0, 100),
    data: {
      type: 'message',
      sender_id: receiverId,
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
  itemName: string
) {
  return sendPushNotification({
    userIds: [userId],
    title: '🎉 Yeni Eşleşme!',
    message: `${otherUserName} ile eşleştin! ${itemName} için takas yapabilirsiniz.`,
    data: {
      type: 'match',
      timestamp: new Date().toISOString()
    },
    url: '/matches'
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
