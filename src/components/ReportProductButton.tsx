/**
 * Apple Moderasyon Sistemi - Ürün Raporlama Butonu
 * Component: ReportProductButton
 * Kullanım: Ürün detay sayfalarında "Ürünü Raporla" butonu
 */

'use client'

import { useState, type ComponentProps } from 'react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Flag, AlertCircle, Check } from 'lucide-react'
import { toast } from 'sonner'
import { PRODUCT_REPORT_TYPES, type ProductReportType } from '@/types/moderation'

interface ReportProductButtonProps {
  productId: string
  variant?: ComponentProps<typeof Button>['variant']
  size?: ComponentProps<typeof Button>['size']
  showIcon?: boolean
  showText?: boolean
}

export function ReportProductButton({
  productId,
  variant = 'ghost',
  size = 'sm',
  showIcon = true,
  showText = true,
}: ReportProductButtonProps) {
  const { t } = useTranslation('common')
  const [open, setOpen] = useState(false)
  const [selectedType, setSelectedType] = useState<ProductReportType | ''>('')
  const [description, setDescription] = useState('')
  const [loading, setLoading] = useState(false)

  const handleReport = async () => {
    if (!selectedType) {
      toast.error(t('productReport.selectTypeError'))
      return
    }

    setLoading(true)
    try {
      const response = await fetch('/api/products/report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId,
          reportType: selectedType,
          description: description.trim() || undefined,
        }),
      })

      const data = await response.json()
      if (response.ok) {
        toast.success(`✅ ${data.message}`, {
          description: t('productReport.successDescription'),
          duration: 5000,
        })

        setOpen(false)
        setSelectedType('')
        setDescription('')
      } else {
        toast.error(data.error || t('productReport.genericError'))
      }
    } catch (error) {
      console.error('Report error:', error)
      toast.error(t('productReport.sendFailed'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant={variant}
          size={size}
          className="text-red-600 hover:text-red-700 hover:bg-red-50"
        >
          {showIcon && <Flag className="w-4 h-4" />}
          {showText && (
            <span className={showIcon ? 'ml-2' : ''}>{t('productReport.trigger')}</span>
          )}
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Flag className="w-5 h-5 text-red-600" />
            {t('productReport.title')}
          </DialogTitle>
          <DialogDescription>{t('productReport.subtitle')}</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
            <div className="flex gap-2">
              <AlertCircle className="w-5 h-5 text-yellow-600 shrink-0 mt-0.5" />
              <div className="text-sm text-yellow-800 space-y-1">
                <p className="font-medium">{t('productReport.infoTitle')}</p>
                <p>{t('productReport.infoBody')}</p>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">{t('productReport.typeLabel')}</label>
            <div className="grid grid-cols-1 gap-2">
              {(Object.entries(PRODUCT_REPORT_TYPES) as [
                ProductReportType,
                (typeof PRODUCT_REPORT_TYPES)[ProductReportType],
              ][]).map(([key, type]) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setSelectedType(key)}
                  className={`p-3 rounded-lg border-2 text-left transition-all ${
                    selectedType === key
                      ? 'border-red-500 bg-red-50 shadow-sm'
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">{type.emoji}</span>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-gray-900">
                          {t(`productReportTypes.${key}.label`)}
                        </span>
                        {selectedType === key && (
                          <Check className="w-5 h-5 text-red-600" />
                        )}
                      </div>
                      <p className="text-xs text-gray-600 mt-0.5">
                        {t(`productReportTypes.${key}.description`)}
                      </p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">
              {t('productReport.descriptionLabel')}{' '}
              <span className="text-gray-500 font-normal">({t('productReport.optional')})</span>
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={t('productReport.descriptionPlaceholder')}
              className="w-full p-3 border border-gray-300 rounded-lg resize-none h-24 text-sm focus:ring-2 focus:ring-red-500 focus:border-transparent"
              maxLength={500}
            />
            <p className="text-xs text-gray-500 text-right">{description.length}/500</p>
          </div>

          <div className="flex gap-2 pt-2">
            <Button
              onClick={handleReport}
              disabled={loading || !selectedType}
              className="flex-1 bg-red-600 hover:bg-red-700 text-white"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  {t('productReport.sending')}
                </>
              ) : (
                <>
                  <Flag className="w-4 h-4 mr-2" />
                  {t('productReport.submit')}
                </>
              )}
            </Button>
            <Button
              type="button"
              onClick={() => setOpen(false)}
              variant="outline"
              className="flex-1"
              disabled={loading}
            >
              {t('cancel')}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
