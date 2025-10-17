/**
 * Kullanıcı şikayet tipleri
 */

export type ReportType = 
  | 'harassment' 
  | 'threat' 
  | 'spam' 
  | 'inappropriate' 
  | 'scam' 
  | 'other'

export interface ReportTypeOption {
  value: ReportType
  label: string
  description?: string
}

/**
 * Şikayet tipi seçenekleri
 */
export const REPORT_TYPE_OPTIONS: ReportTypeOption[] = [
  {
    value: 'harassment',
    label: 'Taciz',
    description: 'Rahatsız edici veya istenmeyen davranışlar'
  },
  {
    value: 'threat',
    label: 'Tehdit',
    description: 'Fiziksel veya psikolojik tehdit içeriği'
  },
  {
    value: 'spam',
    label: 'Spam',
    description: 'İstenmeyen reklam veya spam içerik'
  },
  {
    value: 'inappropriate',
    label: 'Uygunsuz İçerik',
    description: 'Müstehcen, şiddet içeren veya uygunsuz içerik'
  },
  {
    value: 'scam',
    label: 'Dolandırıcılık',
    description: 'Dolandırıcılık girişimi veya sahte profil'
  },
  {
    value: 'other',
    label: 'Diğer',
    description: 'Yukarıdakilerden farklı bir sebep'
  }
]

/**
 * Şikayet türü label'ını döndürür
 */
export function getReportTypeLabel(type: ReportType): string {
  const option = REPORT_TYPE_OPTIONS.find(opt => opt.value === type)
  return option?.label || type
}

/**
 * Şikayet türü açıklamasını döndürür
 */
export function getReportTypeDescription(type: ReportType): string | undefined {
  const option = REPORT_TYPE_OPTIONS.find(opt => opt.value === type)
  return option?.description
}
