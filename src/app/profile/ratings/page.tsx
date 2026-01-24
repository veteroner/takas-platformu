'use client'

import { useState, useEffect } from 'react'
import { ArrowLeft, Star, MessageSquare, Calendar } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { getCurrentUser } from '@/lib/auth'
import { getUserRatings, getUserAverageRating, getUserRatingCount } from '@/lib/api'
import { useTranslation } from 'react-i18next'

interface Rating {
  id: string
  rating: number
  comment: string | null
  created_at: string
  rater: {
    id: string
    name: string
    avatar_url: string | null
  }
  match: {
    id: string
    created_at: string
  }
}

export default function UserRatingsPage() {
  const { t } = useTranslation(['profile','common'])
  const router = useRouter()
  const [ratings, setRatings] = useState<Rating[]>([])
  const [averageRating, setAverageRating] = useState(0)
  const [totalRatings, setTotalRatings] = useState(0)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadRatings()
  }, [])

  const loadRatings = async () => {
    try {
      setIsLoading(true)
      const currentUser = await getCurrentUser()
      
      if (!currentUser) {
        router.push('/login')
        return
      }

      // Load ratings, average, and count
      const [ratingsData, avgRating, ratingCount] = await Promise.all([
        getUserRatings(currentUser.id),
        getUserAverageRating(currentUser.id),
        getUserRatingCount(currentUser.id)
      ])

      setRatings((ratingsData as unknown as Rating[]) || [])
      setAverageRating(avgRating)
      setTotalRatings(ratingCount)
    } catch (error) {
      console.error('Error loading ratings:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('tr-TR', { 
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    })
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-purple-600 via-pink-500 to-orange-400 flex items-center justify-center">
        <div className="text-white text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p>{t('loading')}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="h-svh overflow-hidden bg-linear-to-br from-purple-600 via-pink-500 to-orange-400 flex flex-col">
      {/* Header */}
      <header className="shrink-0 bg-white/10 backdrop-blur-lg border-b border-white/20 pt-safe">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center gap-3">
          <Link
            href="/profile"
            className="p-2 hover:bg-white/20 rounded-full transition-colors"
          >
            <ArrowLeft className="w-6 h-6 text-white" />
          </Link>
          <div>
            <h1 className="text-xl font-bold text-white">{t('ratings')}</h1>
            <p className="text-white/80 text-sm">
              {totalRatings} {t('ratings')}
            </p>
          </div>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto overscroll-contain">
        <div className="max-w-4xl mx-auto px-4 py-6 space-y-4 pb-20">
        {/* Rating Summary Card */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
          <div className="flex items-center gap-6">
            <div className="text-center">
              <div className="text-5xl font-bold text-white mb-2">
                {averageRating.toFixed(1)}
              </div>
              <div className="flex gap-1 justify-center mb-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`w-5 h-5 ${
                      star <= Math.round(averageRating)
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-white/30'
                    }`}
                  />
                ))}
              </div>
              <div className="text-white/70 text-sm">
                {t('ratingCountLabel', { count: totalRatings })}
              </div>
            </div>

            <div className="flex-1">
              {/* Rating distribution */}
              {[5, 4, 3, 2, 1].map((star) => {
                const count = ratings.filter(r => r.rating === star).length
                const percentage = totalRatings > 0 ? (count / totalRatings) * 100 : 0
                
                return (
                  <div key={star} className="flex items-center gap-2 mb-1">
                    <div className="text-white/70 text-xs w-8">{star} ⭐</div>
                    <div className="flex-1 h-2 bg-white/20 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-yellow-400 transition-all"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <div className="text-white/70 text-xs w-8 text-right">{count}</div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Ratings List */}
        {ratings.length === 0 ? (
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-12 border border-white/20 text-center">
            <Star className="w-16 h-16 text-white/40 mx-auto mb-4" />
            <h3 className="text-white text-lg font-semibold mb-2">
              {t('noRatingsTitle')}
            </h3>
            <p className="text-white/70">
              {t('noRatingsDesc')}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {ratings.map((rating) => (
              <div
                key={rating.id}
                className="bg-white/10 backdrop-blur-lg rounded-2xl p-5 border border-white/20"
              >
                {/* Rater Info */}
                <div className="flex items-start gap-3 mb-3">
                  {rating.rater.avatar_url ? (
                    <img
                      src={rating.rater.avatar_url}
                      alt={rating.rater.name}
                      className="w-12 h-12 rounded-full border-2 border-white/20"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center text-white text-lg font-semibold">
                      {rating.rater.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                  
                  <div className="flex-1">
                    <h4 className="text-white font-semibold">
                      {rating.rater.name}
                    </h4>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex gap-0.5">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`w-4 h-4 ${
                              star <= rating.rating
                                ? 'fill-yellow-400 text-yellow-400'
                                : 'text-white/30'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-white/60 text-xs">
                        • {formatDate(rating.created_at)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Comment */}
                {rating.comment && (
                  <div className="bg-white/10 rounded-xl p-3 mt-3">
                    <div className="flex items-start gap-2">
                      <MessageSquare className="w-4 h-4 text-white/60 shrink-0 mt-0.5" />
                      <p className="text-white/90 text-sm leading-relaxed">
                        {rating.comment}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
        </div>
      </div>
    </div>
  )
}
