'use client';

/**
 * Ürün Detay Modal Component
 * Swipe kartlarından tıklandığında detay gösterir
 * ReportProductButton ile entegre
 */

import { getPublicUserName } from '@/lib/utils'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Item } from '@/types';
import Image from 'next/image';
import { MapPin, Calendar, Star, Package } from 'lucide-react';
import { ReportProductButton } from './ReportProductButton';
import { useTranslation } from 'react-i18next'
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';

interface ProductDetailModalProps {
  item: Item | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentUserId?: string;
}

export function ProductDetailModal({ item, open, onOpenChange, currentUserId }: ProductDetailModalProps) {
  if (!item) return null;

  const { t } = useTranslation('common')

  const getCategoryKey = (category: string) => {
    const cat = category.toLowerCase();
    if (cat.includes('clothing')) return 'clothing';
    if (cat.includes('toys')) return 'toys';
    if (cat.includes('electronics')) return 'electronics';
    if (cat.includes('books')) return 'books';
    if (cat.includes('sports')) return 'sports';
    if (cat.includes('home')) return 'home';
    return 'other';
  };

  const getConditionKey = (condition: string) => {
    const cond = condition.toLowerCase();
    if (cond.includes('like_new')) return 'like_new';
    if (cond.includes('new')) return 'new';
    if (cond.includes('good')) return 'good';
    if (cond.includes('fair')) return 'fair';
    return 'poor';
  };

  const isOwnProduct = currentUserId && item.ownerId === currentUserId;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-white text-gray-900 border border-gray-200 dark:bg-neutral-950 dark:text-neutral-50 dark:border-neutral-800">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between pr-8">
            <span className="line-clamp-1">{item.title}</span>
            {!isOwnProduct && (
              <ReportProductButton 
                productId={item.id} 
                variant="ghost" 
                size="sm"
                showIcon={true}
                showText={false}
              />
            )}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Resim Galerisi */}
          <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-gray-100">
            <Image
              src={item.images[0] || '/placeholder-item.jpg'}
              alt={item.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 600px"
            />
          </div>

          {/* Fiyat ve Durum */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-green-600">₺{item.estimatedValue}</span>
              <span className="text-sm text-gray-500 dark:text-gray-400">{t('productDetail.estimatedValueLabel')}</span>
            </div>
            <div className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm font-medium dark:bg-blue-950/40 dark:text-blue-200">
              {t(`conditions.${getConditionKey(item.condition)}`)}
            </div>
          </div>

          {/* Kategori ve Konum */}
          <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-300">
            <div className="flex items-center gap-1">
              <Package className="w-4 h-4" />
              <span>{t(`categories.${getCategoryKey(item.category)}`)}</span>
            </div>
            <div className="flex items-center gap-1">
              <MapPin className="w-4 h-4" />
              <span>{item.location.city}</span>
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              <span>{format(new Date(item.createdAt), 'dd MMM yyyy', { locale: tr })}</span>
            </div>
          </div>

          {/* Açıklama */}
          <div className="space-y-2">
            <h3 className="font-semibold text-gray-900 dark:text-neutral-50">{t('productDetail.descriptionTitle')}</h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed whitespace-pre-wrap">
              {item.description || t('noDescription')}
            </p>
          </div>

          {/* Sahibi Bilgileri */}
          <div className="border-t pt-4">
            <h3 className="font-semibold text-gray-900 dark:text-neutral-50 mb-3">{t('productDetail.ownerTitle')}</h3>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-pink-400 to-purple-500 flex items-center justify-center text-white text-lg font-bold">
                        {(getPublicUserName(item.owner) || item.owner.name).charAt(0).toUpperCase()}
                </div>
                <div className="min-w-0">
                        <p className="font-medium text-gray-900 truncate">{getPublicUserName(item.owner) || item.owner.name}</p>
                  <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-300">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span>{item.owner.rating.toFixed(1)}</span>
                    <span className="mx-1">•</span>
                    <span>{t('productDetail.trades', { count: item.owner.totalTrades })}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
