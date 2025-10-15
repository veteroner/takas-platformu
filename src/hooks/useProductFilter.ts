/**
 * React Hook: Ürün Filtreleme
 * 
 * Ürün yükleme sırasında yasadışı içerik kontrolü yapar
 */

import { useState, useCallback } from 'react'
import { detectIllegalProduct, type IllegalProductResult } from '@/lib/illegal-product-filter'

export function useProductFilter() {
  const [isChecking, setIsChecking] = useState(false)
  const [lastResult, setLastResult] = useState<IllegalProductResult | null>(null)

  /**
   * Ürün bilgilerini kontrol et
   */
  const checkProduct = useCallback((title: string, description?: string): IllegalProductResult => {
    setIsChecking(true)
    
    try {
      const result = detectIllegalProduct(title, description)
      setLastResult(result)
      return result
    } finally {
      setIsChecking(false)
    }
  }, [])

  /**
   * Son kontrolü temizle
   */
  const clearResult = useCallback(() => {
    setLastResult(null)
  }, [])

  return {
    checkProduct,
    clearResult,
    isChecking,
    lastResult
  }
}

/**
 * Real-time validation hook
 * Form değiştiğinde otomatik kontrol yapar
 */
export function useProductValidation(title: string, description: string) {
  const [validationResult, setValidationResult] = useState<IllegalProductResult | null>(null)

  // Debounced validation
  const validate = useCallback(() => {
    if (!title.trim() && !description.trim()) {
      setValidationResult(null)
      return
    }

    const result = detectIllegalProduct(title, description)
    setValidationResult(result)
  }, [title, description])

  return {
    validationResult,
    validate,
    hasError: validationResult?.shouldBlock || false
  }
}
