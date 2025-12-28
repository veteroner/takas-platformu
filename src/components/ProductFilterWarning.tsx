/**
 * Yasadışı Ürün Uyarı Komponenti
 * 
 * Kullanıcıya yasadışı içerik hakkında uyarı gösterir
 */

import { AlertTriangle, XCircle, Shield } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { type IllegalProductResult, type RiskLevel } from '@/lib/illegal-product-filter'

interface ProductFilterWarningProps {
  result: IllegalProductResult
  className?: string
}

const riskColors: Record<RiskLevel, string> = {
  low: 'bg-yellow-50 border-yellow-200 text-yellow-800',
  medium: 'bg-orange-50 border-orange-200 text-orange-800',
  high: 'bg-red-50 border-red-200 text-red-800',
  critical: 'bg-red-100 border-red-500 text-red-900'
}

const riskIcons: Record<RiskLevel, React.ReactNode> = {
  low: <AlertTriangle className="w-5 h-5 text-yellow-600" />,
  medium: <AlertTriangle className="w-5 h-5 text-orange-600" />,
  high: <XCircle className="w-5 h-5 text-red-600" />,
  critical: <Shield className="w-6 h-6 text-red-700" />
}

export function ProductFilterWarning({ result, className = '' }: ProductFilterWarningProps) {
  const { t } = useTranslation('common')
  if (result.isClean || !result.shouldBlock) {
    return null
  }

  return (
    <div className={`${riskColors[result.riskLevel]} border-2 rounded-xl p-4 ${className}`}>
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 mt-0.5">
          {riskIcons[result.riskLevel]}
        </div>
        
        <div className="flex-1">
          <h3 className="font-semibold mb-2">
            {result.riskLevel === 'critical' ? t('productFilter.criticalTitle') : t('productFilter.warningTitle')}
          </h3>
          
          <p className="text-sm mb-3">
            {result.message}
          </p>
          
          {result.riskLevel === 'critical' && (
            <div className="bg-white/50 rounded-lg p-3 text-xs">
              <p className="font-semibold mb-1">{t('productFilter.legalNoticeTitle')}</p>
              <p>
                {t('productFilter.legalNoticeBody')}
              </p>
            </div>
          )}
          
          {result.detectedWords.length > 0 && result.riskLevel !== 'critical' && (
            <div className="mt-2">
              <p className="text-xs font-medium mb-1">{t('productFilter.detectedWordsTitle')}</p>
              <div className="flex flex-wrap gap-1">
                {result.detectedWords.slice(0, 5).map((item, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-0.5 bg-white/60 rounded text-xs font-mono"
                  >
                    {item.word}
                  </span>
                ))}
                {result.detectedWords.length > 5 && (
                  <span className="px-2 py-0.5 bg-white/60 rounded text-xs">
                    +{result.detectedWords.length - 5} {t('productFilter.more')}
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

/**
 * Inline küçük uyarı (form içinde)
 */
export function InlineProductWarning({ result }: ProductFilterWarningProps) {
  if (result.isClean || !result.shouldBlock) {
    return null
  }

  return (
    <div className="flex items-center gap-2 text-sm text-red-600 mt-1">
      <XCircle className="w-4 h-4 flex-shrink-0" />
      <span>{result.message}</span>
    </div>
  )
}
