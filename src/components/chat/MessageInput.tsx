'use client'

import { useRef, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Send } from 'lucide-react'
import { MessageFilterWarning } from '@/components/MessageFilterWarning'
import LoadingSpinner from '@/components/LoadingSpinner'
import type { MessageInputProps } from '@/types/chat'

export function MessageInput({
  value,
  onChange,
  onSend,
  disabled = false,
  placeholder,
  isSending = false,
  filterWarning,
  onClearWarning,
  isBlocked = false,
  isBanned = false
}: MessageInputProps) {
  const { t } = useTranslation('messages')
  const inputRef = useRef<HTMLInputElement>(null)

  // Auto-focus input when component mounts
  useEffect(() => {
    if (!disabled && !isBlocked && !isBanned) {
      inputRef.current?.focus()
    }
  }, [disabled, isBlocked, isBanned])

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      if (!disabled && !isSending && value.trim()) {
        onSend()
      }
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value)
    if (filterWarning && onClearWarning) {
      onClearWarning()
    }
  }

  const getPlaceholder = () => {
    if (isBlocked) return t('cannotSendBlocked')
    if (isBanned) return t('cannotSendBanned')
    return placeholder || t('messageInputPlaceholder')
  }

  return (
    <div className="bg-white border-t border-gray-200 p-4">
      {filterWarning && onClearWarning && (
        <div className="mb-3">
          <MessageFilterWarning
            reason={filterWarning}
            severity="high"
            onClose={onClearWarning}
          />
        </div>
      )}
      
      <div className="flex items-center gap-2">
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder={getPlaceholder()}
          disabled={disabled || isBanned || isSending || isBlocked}
          autoFocus
          className="flex-1 bg-gray-100 border-2 border-gray-300 rounded-full px-4 py-3 text-gray-900 placeholder:text-gray-500 focus:outline-none focus:border-purple-500 focus:bg-white disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        />
        <button
          onClick={onSend}
          disabled={!value.trim() || isBanned || isSending || isBlocked}
          className="bg-gradient-to-r from-pink-500 to-purple-600 text-white p-3 rounded-full hover:from-pink-600 hover:to-purple-700 transition-all duration-200 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label={t('send')}
        >
          {isSending ? (
            <LoadingSpinner size={20} strokeWidth={2} />
          ) : (
            <Send className="w-5 h-5" />
          )}
        </button>
      </div>
    </div>
  )
}
