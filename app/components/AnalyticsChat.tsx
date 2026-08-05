"use client";

import { useChat } from "@ai-sdk/react";
import { useRef, useState, useEffect } from "react";
import { MetricResultCard, type MetricOutput } from "./MetricResultCard";

const EXAMPLE_PROMPTS = [
  "Show me the mrr trend for the last 10 days",
  "How is churnRate trending this week?",
  "What's the average active users over 14 days?",
];

export default function AnalyticsChat() {
  const { messages, sendMessage, status, stop, error, regenerate } = useChat({
    onError: (err) => {
      // Centralized logging point for AI failures — network, 429s,
      // malformed tool output, refusals, etc.
      console.error("Chat error:", err);
    },
  });

  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const [autoScroll, setAutoScroll] = useState(true);
  const [retrying, setRetrying] = useState(false);

  const isStreaming = status === "streaming" || status === "submitted";
  const hasError = status === "error";

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

  const handleSend = (text?: string) => {
    const value = text ?? input;
    if (!value.trim() || isStreaming) return;
    sendMessage({ text: value });
    setInput("");
    setAutoScroll(true);
  };

  // Retries only the last failed message, not the whole conversation.
  // Guards against double-click by disabling itself while in flight.
  const handleRetry = async () => {
    if (retrying) return;
    setRetrying(true);
    try {
      await regenerate();
    } finally {
      setRetrying(false);
    }
  };

  return (
    <div className="flex flex-col h-[500px] max-h-[85dvh] w-full border border-slate-200 rounded-xl bg-white shadow-sm">
      <div className="px-4 py-3 border-b border-slate-100 shrink-0">
        <h3 className="text-sm font-semibold text-slate-800">Ask your data</h3>
      </div>

      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto overscroll-contain p-4 space-y-3"
      >
        {/* Designed empty state — onboarding, not apology */}
        {messages.length === 0 && (
          <div className="space-y-2">
            <p className="text-sm text-slate-400">
              No conversation yet — try asking:
            </p>
            {EXAMPLE_PROMPTS.map((p) => (
              <button
                key={p}
                onClick={() => handleSend(p)}
                className="block w-full text-left text-sm text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-lg px-3 py-2 transition-colors"
              >
                {p}
              </button>
            ))}
          </div>
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
              {m.parts.map((part, i) => {
                if (part.type === "text") {
                  return <span key={i}>{part.text}</span>;
                }

                if (part.type === "tool-queryMetric") {
                  switch (part.state) {
                    case "input-streaming":
                      return (
                        <div key={i} className="text-xs text-slate-400 italic py-1">
                          Preparing query…
                        </div>
                      );
                    case "input-available":
                      return (
                        <div
                          key={i}
                          className="flex items-center gap-2 text-xs text-slate-500 py-1"
                        >
                          <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" />
                          Fetching{" "}
                          {(part.input as { metric?: string })?.metric ?? "metric"}{" "}
                          data…
                        </div>
                      );
                    case "output-available":
                      return (
                        <MetricResultCard key={i} data={part.output as MetricOutput} />
                      );
                    case "output-error":
                      return (
                        <div
                          key={i}
                          className="text-xs text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2 my-1"
                        >
                          ⚠ Couldn't fetch that metric: {part.errorText}
                        </div>
                      );
                    default:
                      return null;
                  }
                }

                return null;
              })}
            </div>
          </div>
        ))}

        {/* Skeleton matches the real bubble's shape — no layout jump */}
        {status === "submitted" && (
          <div className="flex justify-start">
            <div className="bg-slate-100 rounded-xl px-4 py-2 w-40 space-y-2">
              <div className="h-2.5 bg-slate-200 rounded animate-pulse w-full" />
              <div className="h-2.5 bg-slate-200 rounded animate-pulse w-3/4" />
            </div>
          </div>
        )}

        {/* Designed mid-stream / API failure state, with scoped retry */}
        {hasError && (
          <div className="flex justify-start">
            <div className="max-w-[85%] bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-700 space-y-2">
              <p>
                {error?.message?.includes("429") || error?.message?.toLowerCase().includes("rate")
                  ? "The AI service is rate-limited right now."
                  : "The response was interrupted."}
              </p>
              <button
                onClick={handleRetry}
                disabled={retrying}
                className="text-xs font-medium px-3 py-1.5 rounded-md bg-red-600 text-white disabled:opacity-50"
              >
                {retrying ? "Retrying…" : "Retry last message"}
              </button>
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
          className="text-xs text-indigo-600 self-center mb-1 shrink-0"
        >
          ↓ Jump to latest
        </button>
      )}

      <div className="flex items-center gap-2 border-t border-slate-100 p-3 shrink-0">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          disabled={isStreaming}
          placeholder="Ask about your metrics…"
          className="flex-1 rounded-lg px-3 py-2 text-base sm:text-sm bg-white text-slate-900 placeholder-slate-400 border border-slate-300 disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-indigo-400"
        />
        {isStreaming ? (
          <button
            onClick={stop}
            className="px-4 py-2 rounded-lg bg-red-500 text-white text-sm font-medium shrink-0"
          >
            Stop
          </button>
        ) : (
          <button
            onClick={() => handleSend()}
            disabled={!input.trim()}
            className="px-4 py-2 rounded-lg bg-indigo-600 text-white text-sm font-medium disabled:opacity-40 shrink-0"
          >
            Send
          </button>
        )}
      </div>
    </div>
  );
}