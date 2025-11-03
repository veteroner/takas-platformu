/**
 * Comprehensive Logging System for Capacitor/Native Apps
 * Xcode Console'da görünür detaylı loglar
 */

import { Capacitor } from '@capacitor/core'

export type LogLevel = 'debug' | 'info' | 'warn' | 'error' | 'fatal'

interface LogEntry {
  timestamp: string
  level: LogLevel
  category: string
  message: string
  data?: any
  stack?: string
}

class Logger {
  private isNative = Capacitor.isNativePlatform()
  private logs: LogEntry[] = []
  private maxLogs = 500 // Son 500 log'u tut

  /**
   * Format log için timestamp
   */
  private getTimestamp(): string {
    const now = new Date()
    return now.toISOString()
  }

  /**
   * Log level emoji
   */
  private getLevelEmoji(level: LogLevel): string {
    const emojis: Record<LogLevel, string> = {
      debug: '🔍',
      info: 'ℹ️',
      warn: '⚠️',
      error: '❌',
      fatal: '💀'
    }
    return emojis[level]
  }

  /**
   * Ana log fonksiyonu - Xcode Console'a yazılır
   */
  private writeLog(level: LogLevel, category: string, message: string, data?: any, error?: Error): void {
    const timestamp = this.getTimestamp()
    const emoji = this.getLevelEmoji(level)
    
    // Log entry oluştur
    const entry: LogEntry = {
      timestamp,
      level,
      category,
      message,
      data,
      stack: error?.stack
    }
    
    // Memory'de sakla
    this.logs.push(entry)
    if (this.logs.length > this.maxLogs) {
      this.logs.shift() // En eski log'u sil
    }

    // Console'a formatlanmış yaz
    const prefix = `[${timestamp}] ${emoji} [${category.toUpperCase()}]`
    const fullMessage = `${prefix} ${message}`
    
    // Native platformlarda daha detaylı log
    if (this.isNative) {
      // iOS NSLog formatı için özel log
      const nativeLog = `
═══════════════════════════════════════════════════════
${fullMessage}
───────────────────────────────────────────────────────`
      
      console.log(nativeLog)
      
      if (data) {
        console.log('📦 Data:', JSON.stringify(data, null, 2))
      }
      
      if (error) {
        console.error('🔥 Error Stack:', error.stack)
      }
      
      console.log('═══════════════════════════════════════════════════════\n')
      
      // CRITICAL: Native alert for errors to ensure visibility
      if (level === 'error' || level === 'fatal') {
        const errorMsg = `${category}: ${message}${error ? '\n' + error.message : ''}`
        console.error('🚨 CRITICAL ERROR:', errorMsg)
        
        // Try to show native alert (will work on device)
        if (typeof window !== 'undefined' && this.isNative) {
          setTimeout(() => {
            try {
              // This will appear as iOS alert on device
              alert(`DEBUG ERROR\n\n${category}:\n${message}${error ? '\n\nError: ' + error.message : ''}`)
            } catch {}
          }, 100)
        }
      }
    } else {
      // Web'de normal console
      switch (level) {
        case 'debug':
          console.debug(fullMessage, data)
          break
        case 'info':
          console.info(fullMessage, data)
          break
        case 'warn':
          console.warn(fullMessage, data)
          break
        case 'error':
        case 'fatal':
          console.error(fullMessage, data, error)
          break
      }
    }
  }

  /**
   * Debug log
   */
  debug(category: string, message: string, data?: any): void {
    this.writeLog('debug', category, message, data)
  }

  /**
   * Info log
   */
  info(category: string, message: string, data?: any): void {
    this.writeLog('info', category, message, data)
  }

  /**
   * Warning log
   */
  warn(category: string, message: string, data?: any): void {
    this.writeLog('warn', category, message, data)
  }

  /**
   * Error log
   */
  error(category: string, message: string, error?: Error, data?: any): void {
    this.writeLog('error', category, message, data, error)
  }

  /**
   * Fatal error log
   */
  fatal(category: string, message: string, error?: Error, data?: any): void {
    this.writeLog('fatal', category, message, data, error)
  }

  /**
   * Fonksiyon execution tracker
   */
  track(category: string, functionName: string, params?: any): () => void {
    const startTime = performance.now()
    this.debug(category, `▶️ STARTED: ${functionName}`, params)
    
    return () => {
      const duration = performance.now() - startTime
      this.debug(category, `✅ COMPLETED: ${functionName} (${duration.toFixed(2)}ms)`)
    }
  }

  /**
   * User action tracker
   */
  userAction(action: string, component: string, data?: any): void {
    this.info('USER_ACTION', `👤 ${component} - ${action}`, data)
  }

  /**
   * API call tracker
   */
  apiCall(method: string, url: string, params?: any): () => void {
    const startTime = performance.now()
    this.info('API', `🌐 ${method} ${url}`, params)
    
    return () => {
      const duration = performance.now() - startTime
      this.info('API', `✅ Response received (${duration.toFixed(2)}ms)`)
    }
  }

  /**
   * Get all logs
   */
  getLogs(): LogEntry[] {
    return [...this.logs]
  }

  /**
   * Export logs as text
   */
  exportLogs(): string {
    return this.logs
      .map(log => {
        let output = `[${log.timestamp}] [${log.level.toUpperCase()}] [${log.category}] ${log.message}`
        if (log.data) {
          output += `\nData: ${JSON.stringify(log.data, null, 2)}`
        }
        if (log.stack) {
          output += `\nStack: ${log.stack}`
        }
        return output
      })
      .join('\n\n')
  }

  /**
   * Clear logs
   */
  clearLogs(): void {
    this.logs = []
    this.info('LOGGER', 'Logs cleared')
  }
}

// Singleton instance
export const logger = new Logger()

// Global error handler
if (typeof window !== 'undefined') {
  window.addEventListener('error', (event) => {
    logger.fatal('GLOBAL', 'Uncaught error', event.error, {
      message: event.message,
      filename: event.filename,
      lineno: event.lineno,
      colno: event.colno
    })
  })

  window.addEventListener('unhandledrejection', (event) => {
    logger.fatal('GLOBAL', 'Unhandled promise rejection', event.reason instanceof Error ? event.reason : undefined, {
      reason: event.reason
    })
  })
}

// Export helper functions
export const logDebug = (category: string, message: string, data?: any) => logger.debug(category, message, data)
export const logInfo = (category: string, message: string, data?: any) => logger.info(category, message, data)
export const logWarn = (category: string, message: string, data?: any) => logger.warn(category, message, data)
export const logError = (category: string, message: string, error?: Error, data?: any) => logger.error(category, message, error, data)
export const logFatal = (category: string, message: string, error?: Error, data?: any) => logger.fatal(category, message, error, data)
export const trackFunction = (category: string, functionName: string, params?: any) => logger.track(category, functionName, params)
export const trackUserAction = (action: string, component: string, data?: any) => logger.userAction(action, component, data)
export const trackApiCall = (method: string, url: string, params?: any) => logger.apiCall(method, url, params)
