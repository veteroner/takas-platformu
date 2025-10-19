'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Heart, X, MessageCircle } from 'lucide-react'

interface MatchToastProps {
  isVisible: boolean
  otherUserName: string
  otherUserAvatar?: string
  onClose: () => void
}

export default function MatchToast({ 
  isVisible, 
  otherUserName, 
  otherUserAvatar,
  onClose 
}: MatchToastProps) {
  useEffect(() => {
    if (isVisible) {
      // Auto-close after 3 seconds
      const timer = setTimeout(() => {
        onClose()
      }, 3000)
      
      return () => clearTimeout(timer)
    }
  }, [isVisible, onClose])

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -100, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -100, scale: 0.8 }}
          className="fixed top-4 left-1/2 -translate-x-1/2 z-[9999] w-[90%] max-w-md"
        >
          <div className="bg-gradient-to-r from-pink-500 to-purple-600 rounded-2xl shadow-2xl p-6 relative overflow-hidden">
            {/* Animated background */}
            <div className="absolute inset-0 bg-white/10 animate-pulse"></div>
            
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-3 right-3 p-1.5 hover:bg-white/20 rounded-full transition-colors z-10"
            >
              <X className="w-5 h-5 text-white" />
            </button>

            {/* Content */}
            <div className="relative z-10">
              {/* Hearts animation */}
              <div className="flex justify-center mb-4">
                <motion.div
                  animate={{
                    scale: [1, 1.2, 1],
                    rotate: [0, 10, -10, 0]
                  }}
                  transition={{
                    duration: 0.8,
                    repeat: Infinity,
                    repeatDelay: 0.5
                  }}
                >
                  <Heart className="w-12 h-12 text-white fill-white" />
                </motion.div>
              </div>

              {/* Title */}
              <h2 className="text-2xl font-bold text-white text-center mb-2">
                🎉 Eşleştiniz!
              </h2>

              {/* Other user info */}
              <div className="flex items-center justify-center gap-3 mb-4">
                {otherUserAvatar ? (
                  <img
                    src={otherUserAvatar}
                    alt={otherUserName}
                    className="w-12 h-12 rounded-full border-3 border-white shadow-lg"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-white/30 border-3 border-white shadow-lg flex items-center justify-center text-white text-xl font-bold">
                    {otherUserName.charAt(0).toUpperCase()}
                  </div>
                )}
                <div className="text-white">
                  <p className="font-semibold text-lg">{otherUserName}</p>
                  <p className="text-sm text-white/90">ile eşleştiniz!</p>
                </div>
              </div>

              {/* Message */}
              <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3 text-center">
                <div className="flex items-center justify-center gap-2 text-white">
                  <MessageCircle className="w-5 h-5" />
                  <p className="text-sm font-medium">
                    Hemen mesajlaşmaya başlayın!
                  </p>
                </div>
              </div>

              {/* Confetti effect */}
              <div className="absolute inset-0 pointer-events-none">
                {[...Array(20)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute text-2xl"
                    initial={{
                      top: '50%',
                      left: '50%',
                      opacity: 1
                    }}
                    animate={{
                      top: `${Math.random() * 100}%`,
                      left: `${Math.random() * 100}%`,
                      opacity: 0,
                      rotate: Math.random() * 360
                    }}
                    transition={{
                      duration: 1.5,
                      delay: Math.random() * 0.3
                    }}
                  >
                    {['🎉', '❤️', '⭐', '✨', '💫'][Math.floor(Math.random() * 5)]}
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
