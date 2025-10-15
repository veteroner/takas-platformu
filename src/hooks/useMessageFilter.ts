/**
 * Mesaj Filtreleme React Hook
 * 
 * Frontend'de mesaj gönderimi öncesi hızlı kontrol sağlar.
 * Kullanıcıya anında feedback verir.
 */

import { useState, useCallback } from 'react'
import { detectProfanity, createUserFriendlyMessage } from '@/lib/profanity-filter'
import type { FilterResult } from '@/lib/profanity-database'

interface UseMessageFilterReturn {
  checkMessage: (message: string) => FilterResult
  isMessageClean: (message: string) => boolean
  getWarningMessage: (message: string, violationCount?: number) => string | null
  filterResult: FilterResult | null
}

export function useMessageFilter(): UseMessageFilterReturn {
  const [filterResult, setFilterResult] = useState<FilterResult | null>(null)

  /**
   * Mesajı kontrol eder ve sonucu döndürür
   */
  const checkMessage = useCallback((message: string): FilterResult => {
    const result = detectProfanity(message)
    setFilterResult(result)
    return result
  }, [])

  /**
   * Mesajın temiz olup olmadığını kontrol eder
   */
  const isMessageClean = useCallback((message: string): boolean => {
    const result = detectProfanity(message)
    return result.isClean
  }, [])

  /**
   * Uyarı mesajı oluşturur
   */
  const getWarningMessage = useCallback((
    message: string, 
    violationCount: number = 0
  ): string | null => {
    const result = detectProfanity(message)
    
    if (result.isClean) {
      return null
    }

    return createUserFriendlyMessage(violationCount + 1, result.severity)
  }, [])

  return {
    checkMessage,
    isMessageClean,
    getWarningMessage,
    filterResult
  }
}

/**
 * Mesaj input alanı için real-time validasyon hook'u
 */
export function useMessageValidation(violationCount: number = 0) {
  const [inputValue, setInputValue] = useState('')
  const [warning, setWarning] = useState<string | null>(null)
  const [isValid, setIsValid] = useState(true)

  const { checkMessage } = useMessageFilter()

  /**
   * Input değiştiğinde kontrol yap
   */
  const handleInputChange = useCallback((value: string) => {
    setInputValue(value)

    if (!value.trim()) {
      setWarning(null)
      setIsValid(true)
      return
    }

    const result = checkMessage(value)
    
    if (!result.isClean) {
      const warningMsg = createUserFriendlyMessage(violationCount + 1, result.severity)
      setWarning(warningMsg)
      setIsValid(false)
    } else {
      setWarning(null)
      setIsValid(true)
    }
  }, [checkMessage, violationCount])

  /**
   * Input'u temizle
   */
  const clearInput = useCallback(() => {
    setInputValue('')
    setWarning(null)
    setIsValid(true)
  }, [])

  return {
    inputValue,
    warning,
    isValid,
    handleInputChange,
    clearInput,
    setInputValue
  }
}
