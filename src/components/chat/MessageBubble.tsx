'use client'

import Image from 'next/image'

interface MessageBubbleProps {
  content: string
  senderId: string
  currentUserId: string
  createdAt: string
  read?: boolean
  readAt?: string
  senderAvatar?: string
  senderName?: string
}

export function MessageBubble({
  content,
  senderId,
  currentUserId,
  createdAt,
  read = false,
  readAt,
}: MessageBubbleProps) {
  const isMine = senderId === currentUserId
  
  const getMessageStatus = () => {
    if (!isMine) return null
    if (readAt) return <span className="ml-1" title="Görüldü">✓✓</span>
    if (read) return <span className="ml-1" title="İletildi">✓✓</span>
    return <span className="ml-1" title="Gönderildi">✓</span>
  }
  
  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString('tr-TR', { 
      hour: '2-digit', 
      minute: '2-digit' 
    })
  }
  
  return (
    <div className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}>
      <div className={`max-w-[70%] rounded-2xl px-4 py-2.5 shadow-sm ${
        isMine 
          ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white' 
          : 'bg-white border border-gray-200 text-gray-900'
      }`}>
        <p className="text-sm leading-relaxed break-words whitespace-pre-wrap">{content}</p>
        <div className={`flex items-center justify-end gap-1 text-xs mt-1 ${
          isMine ? 'text-white/80' : 'text-gray-500'
        }`}>
          <span>{formatTime(createdAt)}</span>
          {getMessageStatus()}
        </div>
      </div>
    </div>
  )
}
