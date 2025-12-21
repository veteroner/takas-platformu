/**
 * Apple Moderasyon Sistemi - TypeScript Types
 * Oluşturma Tarihi: 21 Aralık 2025
 * Amaç: Ürün raporlama ve moderasyon tip tanımlamaları
 */

export const PRODUCT_REPORT_TYPES = {
  inappropriate_content: {
    label: 'Uygunsuz İçerik',
    emoji: '🚫',
    description: 'Müstehcen, şiddet içeren veya uygunsuz içerik',
  },
  illegal_item: {
    label: 'Yasadışı Ürün',
    emoji: '⚠️',
    description: 'Yasal olmayan ürün veya hizmet',
  },
  scam: {
    label: 'Dolandırıcılık',
    emoji: '🎭',
    description: 'Dolandırıcılık girişimi veya sahte ürün',
  },
  fake_item: {
    label: 'Sahte/Taklit Ürün',
    emoji: '👎',
    description: 'Taklit, replika veya sahte marka ürünü',
  },
  spam: {
    label: 'Spam',
    emoji: '📢',
    description: 'İstenmeyen reklam veya spam içerik',
  },
  other: {
    label: 'Diğer',
    emoji: '❓',
    description: 'Yukarıdakilerden farklı bir sebep',
  },
} as const;

export type ProductReportType = keyof typeof PRODUCT_REPORT_TYPES;

export interface ProductReport {
  id: string;
  product_id: string;
  reporter_id: string;
  report_type: ProductReportType;
  description?: string;
  status: 'pending' | 'auto_removed' | 'dismissed';
  auto_removed_at?: string;
  created_at: string;
}

export interface RemovedProductLog {
  id: string;
  product_id: string;
  product_owner_id: string;
  removal_reason: 'auto_threshold' | 'illegal_content' | 'admin_action' | 'user_request';
  report_count: number;
  removed_at: string;
  product_data?: Record<string, any>;
  restored_at?: string;
  restoration_reason?: string;
}

export type ProductStatus = 'active' | 'sold' | 'removed' | 'pending';

export interface ProductWithModeration {
  status: ProductStatus;
  removed_at?: string;
  removal_reason?: string;
}
