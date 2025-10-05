import React, { useState } from "react";
import { Send, ArrowLeft } from "lucide-react";
import Link from "next/link";

const mockMessages = [
  { id: 1, sender: "Ali", text: "Merhaba! Takas yapmak ister misin?", timestamp: "14:30", isOwn: false },
  { id: 2, sender: "Sen", text: "Tabii, hangi ürünü düşünüyorsun?", timestamp: "14:32", isOwn: true },
  { id: 3, sender: "Ali", text: "Oyuncak arabayı takas edebilirim.", timestamp: "14:35", isOwn: false },
  { id: 4, sender: "Ali", text: "İlginç bir parça, çok seviyorum ama artık kullanmıyorum.", timestamp: "14:35", isOwn: false },
];

export default function Chat() {
  const [messages, setMessages] = useState(mockMessages);
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (input.trim()) {
      const newMessage = {
        id: messages.length + 1,
        sender: "Sen",
        text: input,
        timestamp: new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' }),
        isOwn: true
      };
      setMessages([...messages, newMessage]);
      setInput("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-full bg-white dark:bg-gray-900 rounded-xl shadow-lg overflow-hidden">
      {/* Chat Header */}
      <div className="bg-gradient-to-r from-pink-500 to-purple-600 text-white p-4 flex items-center gap-3">
        <Link href="/" className="p-1 hover:bg-white/20 rounded-full transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div className="flex-1">
          <h3 className="font-semibold">Ali Yılmaz</h3>
          <p className="text-sm opacity-90">Aktif</p>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.isOwn ? "justify-end" : "justify-start"}`}>
            <div className={`max-w-[80%] rounded-2xl px-4 py-2 ${
              msg.isOwn 
                ? "bg-gradient-to-r from-pink-500 to-purple-600 text-white" 
                : "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white"
            }`}>
              <p className="text-sm">{msg.text}</p>
              <p className={`text-xs mt-1 ${
                msg.isOwn ? "text-white/70" : "text-gray-500 dark:text-gray-400"
              }`}>
                {msg.timestamp}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Message Input */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
        <div className="flex gap-2 items-end">
          <input
            type="text"
            className="flex-1 border border-gray-300 dark:border-gray-600 rounded-full px-4 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Mesaj yaz..."
          />
          <button
            className="bg-gradient-to-r from-pink-500 to-purple-600 text-white p-2 rounded-full hover:from-pink-600 hover:to-purple-700 transition-all duration-200 shadow-lg disabled:opacity-50"
            onClick={handleSend}
            disabled={!input.trim()}
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
