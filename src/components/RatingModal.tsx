'use client'

import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Star, MessageSquare } from 'lucide-react'

interface RatingModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (rating: number, comment?: string) => Promise<void>
  otherUserName: string
  otherUserAvatar?: string
}

export default function RatingModal({
  isOpen,
  onClose,
  onSubmit,
  otherUserName,
  otherUserAvatar
}: RatingModalProps) {
  const [rating, setRating] = useState(0)
  const [hoveredRating, setHoveredRating] = useState(0)
  const [comment, setComment] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { t } = useTranslation('common')

  const handleSubmit = async () => {
    if (rating === 0) {
      alert(t('ratings.pleaseSelect'))
      return
    }

    setIsSubmitting(true)
    try {
      await onSubmit(rating, comment)
      // Reset form
      setRating(0)
      setComment('')
      onClose()
    } catch (error) {
      console.error('Error submitting rating:', error)
      alert(t('ratings.submitError'))
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden">
              {/* Header */}
              <div className="relative bg-gradient-to-br from-purple-500 to-pink-500 p-6 text-white">
                <button
                  onClick={onClose}
                  className="absolute top-4 right-4 p-2 hover:bg-white/20 rounded-full transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
                
                <div className="text-center">
                  {otherUserAvatar ? (
                    <img
                      src={otherUserAvatar}
                      alt={otherUserName}
                      className="w-20 h-20 rounded-full mx-auto mb-4 border-4 border-white shadow-lg"
                    />
                  ) : (
                    <div className="w-20 h-20 rounded-full mx-auto mb-4 border-4 border-white shadow-lg bg-white/20 flex items-center justify-center text-3xl">
                      {otherUserName.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <h2 className="text-2xl font-bold mb-1">{otherUserName}</h2>
                  <p className="text-white/90 text-sm">{t('ratings.headerSubtitle')}</p>
                  <p className="text-white/70 text-xs mt-1">{t('ratings.privacyNote')}</p>
                </div>
              </div>

              {/* Body */}
              <div className="p-6 space-y-6">
                {/* Star Rating */}
                <div className="text-center">
                  <p className="text-gray-600 mb-4">
                    {t('ratings.prompt')}
                  </p>
                  <div className="flex justify-center gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <motion.button
                        key={star}
                        whileHover={{ scale: 1.2 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => setRating(star)}
                        onMouseEnter={() => setHoveredRating(star)}
                        onMouseLeave={() => setHoveredRating(0)}
                        className="p-2 transition-all"
                      >
                        <Star
                          className={`w-10 h-10 transition-colors ${
                            (hoveredRating || rating) >= star
                              ? 'fill-yellow-400 text-yellow-400'
                              : 'text-gray-300'
                          }`}
                        />
                      </motion.button>
                    ))}
                  </div>
                  {rating > 0 && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-sm text-gray-500 mt-2"
                    >
                      {rating === 5 && t('ratings.labels.5')}
                      {rating === 4 && t('ratings.labels.4')}
                      {rating === 3 && t('ratings.labels.3')}
                      {rating === 2 && t('ratings.labels.2')}
                      {rating === 1 && t('ratings.labels.1')}
                    </motion.p>
                  )}
                </div>

                {/* Comment (Optional) */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                    <MessageSquare className="w-4 h-4" />
                    {t('ratings.commentLabel')}
                  </label>
                  <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder={t('ratings.placeholder')}
                    maxLength={500}
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none text-sm"
                  />
                  <p className="text-xs text-gray-400 mt-1 text-right">
                    {comment.length}/500
                  </p>
                </div>

                {/* Submit Button */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleSubmit}
                  disabled={rating === 0 || isSubmitting}
                  className={`w-full py-4 rounded-xl font-semibold text-white transition-all ${
                    rating === 0
                      ? 'bg-gray-300 cursor-not-allowed'
                      : 'bg-gradient-to-r from-purple-500 to-pink-500 hover:shadow-lg'
                  }`}
                >
                  {isSubmitting ? (
                    <span className="flex items-center justify-center gap-2">
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      {t('ratings.submitting')}
                    </span>
                  ) : (
                    t('ratings.submitButton')
                  )}
                </motion.button>

                <p className="text-xs text-gray-400 text-center">
                  {t('ratings.shareNote')}
                </p>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
