/**
 * Apple Moderasyon Sistemi - Ürün Raporlama Butonu
 * Component: ReportProductButton
 * Kullanım: Ürün detay sayfalarında "Ürünü Raporla" butonu
 */

'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from '@/components/ui/dialog';
import { Flag, AlertCircle, Check } from 'lucide-react';
import { toast } from 'sonner';
import { PRODUCT_REPORT_TYPES, type ProductReportType } from '@/types/moderation';

interface ReportProductButtonProps {
  productId: string;
  variant?: 'default' | 'ghost' | 'outline';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  showIcon?: boolean;
  showText?: boolean;
}

export function ReportProductButton({
  productId,
  variant = 'ghost',
  size = 'sm',
  showIcon = true,
  showText = true,
}: ReportProductButtonProps) {
  const [open, setOpen] = useState(false);
  const [selectedType, setSelectedType] = useState<ProductReportType | ''>('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);

  const handleReport = async () => {
    if (!selectedType) {
      toast.error('Lütfen şikayet türü seçin');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/products/report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId,
          reportType: selectedType,
          description: description.trim() || undefined,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success('✅ ' + data.message, {
          description: 'İnceleme süreci başlatıldı. Teşekkür ederiz.',
          duration: 5000,
        });
        setOpen(false);
        setSelectedType('');
        setDescription('');
      } else {
        toast.error(data.error || 'Bir hata oluştu');
      }
    } catch (error) {
      console.error('Report error:', error);
      toast.error('Şikayet gönderilemedi. Lütfen tekrar deneyin.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant={variant} size={size} className="text-red-600 hover:text-red-700 hover:bg-red-50">
          {showIcon && <Flag className="w-4 h-4" />}
          {showText && <span className={showIcon ? 'ml-2' : ''}>Ürünü Raporla</span>}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Flag className="w-5 h-5 text-red-600" />
            Ürünü Raporla
          </DialogTitle>
          <DialogDescription>
            Uygunsuz veya yasadışı içerik gördüyseniz bize bildirin
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Bilgilendirme */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
            <div className="flex gap-2">
              <AlertCircle className="w-5 h-5 text-yellow-600 shrink-0 mt-0.5" />
              <div className="text-sm text-yellow-800 space-y-1">
                <p className="font-medium">Şikayetiniz gizli tutulacaktır</p>
                <p>Otomatik inceleme sistemi şikayetinizi değerlendirecektir. Çoklu şikayet durumunda ürün otomatik olarak kaldırılır.</p>
              </div>
            </div>
          </div>

          {/* Şikayet Türü Seçimi */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Şikayet Türü *</label>
            <div className="grid grid-cols-1 gap-2">
              {(Object.entries(PRODUCT_REPORT_TYPES) as [ProductReportType, typeof PRODUCT_REPORT_TYPES[ProductReportType]][]).map(
                ([key, type]) => (
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
                          <span className="font-medium text-gray-900">{type.label}</span>
                          {selectedType === key && (
                            <Check className="w-5 h-5 text-red-600" />
                          )}
                        </div>
                        <p className="text-xs text-gray-600 mt-0.5">{type.description}</p>
                      </div>
                    </div>
                  </button>
                )
              )}
            </div>
          </div>

          {/* Açıklama */}
          <div className="space-y-2">
            <label className="text-sm font-medium">
              Açıklama <span className="text-gray-500 font-normal">(Opsiyonel)</span>
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Detaylı açıklama ekleyebilirsiniz..."
              className="w-full p-3 border border-gray-300 rounded-lg resize-none h-24 text-sm focus:ring-2 focus:ring-red-500 focus:border-transparent"
              maxLength={500}
            />
            <p className="text-xs text-gray-500 text-right">{description.length}/500</p>
          </div>

          {/* Butonlar */}
          <div className="flex gap-2 pt-2">
            <Button
              onClick={handleReport}
              disabled={loading || !selectedType}
              className="flex-1 bg-red-600 hover:bg-red-700 text-white"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Gönderiliyor...
                </>
              ) : (
                <>
                  <Flag className="w-4 h-4 mr-2" />
                  Şikayeti Gönder
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
              İptal
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
