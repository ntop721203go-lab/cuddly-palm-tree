import { Message } from "@/store";

export default function ChatMessage({ message }: { message: Message }) {
  const isUser = message.role === "user";
  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[70%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed whitespace-pre-wrap ${
          isUser
            ? "bg-blue-500 text-white"
            : "bg-white text-gray-900 shadow-sm border border-gray-100"
        }`}
      >
        {message.content}
      </div>
    </div>
  );
}
