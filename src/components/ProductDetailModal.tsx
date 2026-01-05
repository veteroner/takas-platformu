import { getPublicUserName } from '@/lib/utils'
/**
 * Ürün Detay Modal Component
 * Swipe kartlarından tıklandığında detay gösterir
 * ReportProductButton ile entegre
 */

'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Item } from '@/types';
import Image from 'next/image';
import { MapPin, Calendar, Star, Package } from 'lucide-react';
import { ReportProductButton } from './ReportProductButton';
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

  const getCategoryLabel = (category: string) => {
    const cat = category.toLowerCase();
    if (cat.includes('clothing')) return 'Giyim';
    if (cat.includes('toys')) return 'Oyuncak';
    if (cat.includes('electronics')) return 'Elektronik';
    if (cat.includes('books')) return 'Kitap';
    if (cat.includes('sports')) return 'Spor';
    if (cat.includes('home')) return 'Ev';
    return 'Diğer';
  };

  const getConditionLabel = (condition: string) => {
    const cond = condition.toLowerCase();
    if (cond.includes('like_new')) return 'Sıfır Gibi';
    if (cond.includes('new')) return 'Yeni';
    if (cond.includes('good')) return 'İyi';
    if (cond.includes('fair')) return 'Normal';
    return 'Kullanılmış';
  };

  const isOwnProduct = currentUserId && item.ownerId === currentUserId;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
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
              <span className="text-sm text-gray-500">tahmini değer</span>
            </div>
            <div className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm font-medium">
              {getConditionLabel(item.condition)}
            </div>
          </div>

          {/* Kategori ve Konum */}
          <div className="flex items-center gap-4 text-sm text-gray-600">
            <div className="flex items-center gap-1">
              <Package className="w-4 h-4" />
              <span>{getCategoryLabel(item.category)}</span>
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
            <h3 className="font-semibold text-gray-900">Açıklama</h3>
            <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-wrap">
              {item.description || 'Bu ürün için açıklama bulunmuyor.'}
            </p>
          </div>

          {/* Sahibi Bilgileri */}
          <div className="border-t pt-4">
            <h3 className="font-semibold text-gray-900 mb-3">Ürün Sahibi</h3>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-pink-400 to-purple-500 flex items-center justify-center text-white text-lg font-bold">
                        {(getPublicUserName(item.owner) || item.owner.name).charAt(0).toUpperCase()}
                </div>
                <div>
                        <p className="font-medium text-gray-900">{getPublicUserName(item.owner) || item.owner.name}</p>
                  <div className="flex items-center gap-1 text-sm text-gray-600">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span>{item.owner.rating.toFixed(1)}</span>
                    <span className="mx-1">•</span>
                    <span>{item.owner.totalTrades} takas</span>
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
