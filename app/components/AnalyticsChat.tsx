"use client";

import { useChat } from "@ai-sdk/react";
import { useRef, useState, useEffect } from "react";

export default function AnalyticsChat() {
  const { messages, sendMessage, status, stop } = useChat();
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const [autoScroll, setAutoScroll] = useState(true);

  const isStreaming = status === "streaming" || status === "submitted";

  // Pin to bottom only while user is already near the bottom.
  const handleScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    const nearBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 80;
    setAutoScroll(nearBottom);
  };

  useEffect(() => {
    if (autoScroll && scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, autoScroll]);

  const handleSend = () => {
    if (!input.trim() || isStreaming) return;
    sendMessage({ text: input });
    setInput("");
    setAutoScroll(true);
  };

  return (
    <div className="flex flex-col h-[500px] w-full border border-slate-200 rounded-xl bg-white shadow-sm">
      <div className="px-4 py-3 border-b border-slate-100">
        <h3 className="text-sm font-semibold text-slate-800">Ask your data</h3>
      </div>

      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto p-4 space-y-3"
      >
        {messages.length === 0 && (
          <p className="text-sm text-slate-400">
            Try: “Which metric changed the most this week?”
          </p>
        )}

        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[80%] rounded-xl px-4 py-2 text-sm leading-relaxed ${
                m.role === "user"
                  ? "bg-indigo-600 text-white"
                  : "bg-slate-100 text-slate-800"
              }`}
            >
              {m.parts.map((part, i) =>
                part.type === "text" ? <span key={i}>{part.text}</span> : null
              )}
            </div>
          </div>
        ))}

        {status === "submitted" && (
          <div className="flex justify-start">
            <div className="bg-slate-100 rounded-xl px-4 py-2 text-sm text-slate-500 animate-pulse">
              Thinking…
            </div>
          </div>
        )}
      </div>

      {!autoScroll && (
        <button
          onClick={() => {
            setAutoScroll(true);
            scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
          }}
          className="text-xs text-indigo-600 self-center mb-1"
        >
          ↓ Jump to latest
        </button>
      )}

      <div className="flex items-center gap-2 border-t border-slate-100 p-3">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          disabled={isStreaming}
          placeholder="Ask about your metrics…"
          className="flex-1 rounded-lg px-3 py-2 text-sm bg-slate-50 border border-slate-200 disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-indigo-400"
        />
        {isStreaming ? (
          <button
            onClick={stop}
            className="px-4 py-2 rounded-lg bg-red-500 text-white text-sm font-medium"
          >
            Stop
          </button>
        ) : (
          <button
            onClick={handleSend}
            disabled={!input.trim()}
            className="px-4 py-2 rounded-lg bg-indigo-600 text-white text-sm font-medium disabled:opacity-40"
          >
            Send
          </button>
        )}
      </div>
    </div>
  );
}