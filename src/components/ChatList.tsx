'use client'

import React from "react";
import { MessageCircle, ArrowLeft } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

const mockChats = [
  {
    id: 1,
    name: "Ali Yılmaz",
    lastMessage: "Oyuncak arabayı takas edebilirim.",
    timestamp: "14:35",
    unread: 2,
    avatar: "/icons/logo.svg"
  },
  {
    id: 2,
    name: "Ayşe Demir",
    lastMessage: "Merhaba! Takas yapmaya var mısın?",
    timestamp: "Dün",
    unread: 0,
    avatar: "/icons/logo.svg"
  },
  {
    id: 3,
    name: "Mehmet Kaya",
    lastMessage: "Teşekkürler, çok güzel bir takas oldu 😊",
    timestamp: "2 gün önce",
    unread: 0,
    avatar: "/icons/logo.svg"
  }
];

export default function ChatList() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50 dark:from-gray-900 dark:to-black">
      <div className="w-full max-w-md mx-auto">
        {/* Header */}
        <header className="bg-white/80 backdrop-blur-md shadow-sm border-b border-white/20 pt-safe">
          <div className="px-4 py-4 pt-12 md:pt-4 flex items-center gap-3">
            <Link href="/" className="p-2 hover:bg-gray-100 rounded-full transition-colors">
              <ArrowLeft className="w-6 h-6 text-gray-600" />
            </Link>
            <h1 className="text-xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
              Mesajlar
            </h1>
          </div>
        </header>

        {/* Chat List */}
        <div className="p-4">
          {mockChats.length > 0 ? (
            <div className="space-y-2">
              {mockChats.map((chat) => (
                <Link
                  key={chat.id}
                  href="/chat"
                  className="block bg-white/70 backdrop-blur-sm border border-white/20 rounded-xl p-4 hover:bg-white/80 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <Image
                        src={chat.avatar}
                        alt={chat.name}
                        width={48}
                        height={48}
                        className="w-12 h-12 rounded-full bg-gradient-to-r from-pink-500 to-purple-600 p-2"
                      />
                      {chat.unread > 0 && (
                        <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                          {chat.unread}
                        </div>
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-gray-900 truncate">{chat.name}</h3>
                        <span className="text-xs text-gray-500">{chat.timestamp}</span>
                      </div>
                      <p className="text-sm text-gray-600 truncate mt-1">{chat.lastMessage}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <MessageCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-600 mb-2">Henüz mesaj yok</h3>
              <p className="text-gray-500">
                Takas yapmaya başla ve ilk mesajını al!
              </p>
              <Link
                href="/"
                className="inline-block mt-4 bg-gradient-to-r from-pink-500 to-purple-600 text-white px-6 py-3 rounded-xl hover:from-pink-600 hover:to-purple-700 transition-all duration-200 shadow-lg"
              >
                Keşfetmeye Başla
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
