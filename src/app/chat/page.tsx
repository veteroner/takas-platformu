import Chat from "@/components/Chat";

export default function ChatPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50 dark:from-gray-900 dark:to-black">
      <div className="w-full max-w-md mx-auto h-screen">
        <Chat />
      </div>
    </main>
  );
}
