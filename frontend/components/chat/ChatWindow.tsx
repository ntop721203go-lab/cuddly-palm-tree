"use client";
import { useEffect, useRef } from "react";
import { useChatStore } from "@/store";
import { logout } from "@/lib/actions/auth";
import { createClient } from "@/lib/supabase/client";
import ChatMessage from "./ChatMessage";
import ChatInput from "./ChatInput";

interface Props {
  user: { email: string };
}

export default function ChatWindow({ user }: Props) {
  const { messages, isLoading, addMessage, initMessages, setLoading, clearMessages } = useChatStore();
  const bottomRef = useRef<HTMLDivElement>(null);

  // 로그인 시 채팅 기록 로드
  useEffect(() => {
    const load = async () => {
      const supabase = createClient();
      const { data } = await supabase
        .from("messages")
        .select("id, role, content, created_at")
        .order("created_at", { ascending: true })
        .limit(100);
      if (data?.length) {
        initMessages(
          data.map((m) => ({
            id: m.id,
            role: m.role as "user" | "assistant",
            content: m.content,
            createdAt: new Date(m.created_at),
          }))
        );
      }
    };
    load();
  }, [initMessages]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const handleSend = async (content: string) => {
    addMessage({ id: crypto.randomUUID(), role: "user", content, createdAt: new Date() });
    setLoading(true);

    try {
      const supabase = createClient();
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token ?? "";

      const history = messages.map(({ role, content }) => ({ role, content }));
      const res = await fetch("/api/py/chat/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: JSON.stringify({ message: content, history }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      addMessage({ id: crypto.randomUUID(), role: "assistant", content: data.reply, createdAt: new Date() });
    } catch (e) {
      addMessage({
        id: crypto.randomUUID(),
        role: "assistant",
        content: `오류가 발생했습니다. 잠시 후 다시 시도해주세요.\n(${e instanceof Error ? e.message : "unknown error"})`,
        createdAt: new Date(),
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <h1 className="text-lg font-semibold text-gray-900">AI 비서</h1>
        <div className="flex items-center gap-3">
          {messages.length > 0 && (
            <button
              onClick={clearMessages}
              className="text-xs text-gray-400 hover:text-gray-600 transition-colors"
            >
              대화 초기화
            </button>
          )}
          <span className="text-xs text-gray-400 hidden sm:block">{user.email}</span>
          <form action={logout}>
            <button
              type="submit"
              className="text-xs text-gray-500 hover:text-red-500 border border-gray-200 hover:border-red-200 rounded-lg px-3 py-1.5 transition-colors"
            >
              로그아웃
            </button>
          </form>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-3">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-gray-400 gap-2">
            <span className="text-5xl">🤖</span>
            <p className="text-sm">무엇이든 물어보세요!</p>
          </div>
        )}

        {messages.map((msg) => (
          <ChatMessage key={msg.id} message={msg} />
        ))}

        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white rounded-2xl px-4 py-3 shadow-sm border border-gray-100">
              <div className="flex gap-1 items-center h-4">
                {[0, 150, 300].map((delay) => (
                  <span
                    key={delay}
                    className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                    style={{ animationDelay: `${delay}ms` }}
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      <ChatInput onSend={handleSend} disabled={isLoading} />
    </div>
  );
}
