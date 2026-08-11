"use client";

import { useChat } from "@ai-sdk/react";
import { useEffect, useRef, useState } from "react";
import { MetricResultCard, type MetricOutput } from "./MetricResultCard";

const EXAMPLE_PROMPTS = [
  "Show me the MRR trend for the last 10 days",
  "How is churnRate trending this week?",
  "What's the average active users over 14 days?",
];

export default function AnalyticsChat() {
  const { messages, sendMessage, status, stop, error, regenerate } = useChat({
    onError: (err) => {
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

    const nearBottom =
      el.scrollHeight - el.scrollTop - el.clientHeight < 80;

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

    sendMessage({ text: value.trim() });
    setInput("");
    setAutoScroll(true);
  };

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
    <div className="flex h-[540px] max-h-[80dvh] w-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      {/* Chat Header */}
      <div className="flex shrink-0 items-center justify-between border-b border-slate-100 bg-white px-4 py-3.5 sm:px-5">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-900 text-sm text-white shadow-sm">
            ✦
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-semibold text-slate-900">
                Ask your data
              </h3>

              <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-700">
                AI
              </span>
            </div>

            <p className="mt-0.5 text-[11px] text-slate-400">
              Get insights from your analytics
            </p>
          </div>
        </div>

        <div
          className={`flex items-center gap-1.5 text-[11px] font-medium ${
            isStreaming ? "text-indigo-600" : "text-slate-400"
          }`}
          aria-live="polite"
        >
          <span
            className={`h-2 w-2 rounded-full ${
              isStreaming
                ? "animate-pulse bg-indigo-500"
                : "bg-emerald-500"
            }`}
          />

          {isStreaming ? "Thinking…" : "Ready"}
        </div>
      </div>

      {/* Conversation */}
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        role="log"
        aria-live="polite"
        aria-label="Conversation with analytics assistant"
        className="flex-1 overflow-y-auto overscroll-contain bg-slate-50/50 p-4 sm:p-5"
      >
        {/* Empty State */}
        {messages.length === 0 && (
          <div className="flex min-h-full flex-col items-center justify-center py-8">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-2xl shadow-sm ring-1 ring-slate-200">
              ✦
            </div>

            <h4 className="text-sm font-semibold text-slate-900">
              Ask anything about your metrics
            </h4>

            <p className="mt-1.5 max-w-sm text-center text-xs leading-5 text-slate-400">
              I can help you explore trends, compare metrics, and understand
              your analytics data.
            </p>

            <div className="mt-6 w-full max-w-lg space-y-2">
              <p className="px-1 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                Suggested questions
              </p>

              {EXAMPLE_PROMPTS.map((prompt) => (
                <button
                  key={prompt}
                  type="button"
                  onClick={() => handleSend(prompt)}
                  disabled={isStreaming}
                  className="group flex w-full items-center justify-between rounded-xl border border-slate-200 bg-white px-4 py-3 text-left text-xs font-medium text-slate-600 shadow-sm transition-all hover:-translate-y-0.5 hover:border-indigo-200 hover:bg-indigo-50/50 hover:text-indigo-700 hover:shadow disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
                >
                  <span>{prompt}</span>

                  <span className="ml-3 shrink-0 text-slate-300 transition-colors group-hover:text-indigo-500">
                    →
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Messages */}
        {messages.length > 0 && (
          <div className="space-y-4">
            {messages.map((message) => {
              const isUser = message.role === "user";

              return (
                <div
                  key={message.id}
                  className={`flex ${
                    isUser ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`flex max-w-[88%] items-start gap-2.5 sm:max-w-[78%] ${
                      isUser ? "flex-row-reverse" : "flex-row"
                    }`}
                  >
                    {/* Avatar */}
                    <div
                      className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-[10px] font-bold ${
                        isUser
                          ? "bg-indigo-600 text-white"
                          : "bg-slate-900 text-white"
                      }`}
                    >
                      {isUser ? "You" : "✦"}
                    </div>

                    {/* Message Bubble */}
                    <div
                      className={`rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-sm ${
                        isUser
                          ? "rounded-tr-md bg-indigo-600 text-white"
                          : "rounded-tl-md border border-slate-200 bg-white text-slate-800"
                      }`}
                    >
                      {message.parts.map((part, index) => {
                        if (part.type === "text") {
                          return (
                            <span
                              key={index}
                              className="whitespace-pre-wrap"
                            >
                              {part.text}
                            </span>
                          );
                        }

                        if (part.type === "tool-queryMetric") {
                          switch (part.state) {
                            case "input-streaming":
                              return (
                                <div
                                  key={index}
                                  className="flex items-center gap-2 py-1 text-xs italic text-slate-400"
                                >
                                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-indigo-400" />
                                  Preparing analytics query…
                                </div>
                              );

                            case "input-available": {
                              const metric =
                                (part.input as { metric?: string })?.metric ??
                                "metric";

                              return (
                                <div
                                  key={index}
                                  className="my-1 flex items-center gap-2 rounded-lg bg-slate-50 px-3 py-2 text-xs text-slate-500"
                                >
                                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-indigo-50 text-indigo-600">
                                    ↗
                                  </span>

                                  <span>
                                    Fetching{" "}
                                    <strong className="font-semibold text-slate-700">
                                      {metric}
                                    </strong>{" "}
                                    data…
                                  </span>

                                  <span className="ml-auto flex gap-1">
                                    <span className="h-1 w-1 animate-bounce rounded-full bg-indigo-400 [animation-delay:-0.3s]" />
                                    <span className="h-1 w-1 animate-bounce rounded-full bg-indigo-400 [animation-delay:-0.15s]" />
                                    <span className="h-1 w-1 animate-bounce rounded-full bg-indigo-400" />
                                  </span>
                                </div>
                              );
                            }

                            case "output-available":
                              return (
                                <div key={index} className="mt-2">
                                  <MetricResultCard
                                    data={part.output as MetricOutput}
                                  />
                                </div>
                              );

                            case "output-error":
                              return (
                                <div
                                  key={index}
                                  className="my-1 rounded-xl border border-red-200 bg-red-50 px-3 py-2.5 text-xs text-red-700"
                                >
                                  <div className="flex gap-2">
                                    <span>⚠</span>

                                    <span>
                                      Couldn't fetch that metric:{" "}
                                      {part.errorText}
                                    </span>
                                  </div>
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
                </div>
              );
            })}
          </div>
        )}

        {/* Initial Response Skeleton */}
        {status === "submitted" && (
          <div className="mt-4 flex justify-start">
            <div className="flex items-start gap-2.5">
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-slate-900 text-[10px] text-white">
                ✦
              </div>

              <div className="rounded-2xl rounded-tl-md border border-slate-200 bg-white px-4 py-3 shadow-sm">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs text-slate-400">
                    Analyzing your data
                  </span>

                  <span className="flex gap-1">
                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-indigo-400 [animation-delay:-0.3s]" />
                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-indigo-400 [animation-delay:-0.15s]" />
                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-indigo-400" />
                  </span>
                </div>
              </div>

              <span className="sr-only">Assistant is responding…</span>
            </div>
          </div>
        )}

        {/* Error State */}
        {hasError && (
          <div className="mt-4 flex justify-start">
            <div className="max-w-[88%] rounded-2xl rounded-tl-md border border-red-200 bg-red-50 px-4 py-3 shadow-sm">
              <div className="flex items-start gap-3">
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-red-100 text-xs text-red-600">
                  !
                </div>

                <div>
                  <p className="text-sm font-semibold text-red-800">
                    Something went wrong
                  </p>

                  <p className="mt-1 text-xs leading-5 text-red-600">
                    {error?.message?.includes("429") ||
                    error?.message?.toLowerCase().includes("rate")
                      ? "The AI service is rate-limited right now. Please try again shortly."
                      : "The response was interrupted. You can retry your last question."}
                  </p>

                  <button
                    type="button"
                    onClick={handleRetry}
                    disabled={retrying}
                    className="mt-3 rounded-lg bg-red-600 px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
                  >
                    {retrying ? "Retrying…" : "Retry last message"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Jump To Latest */}
      {!autoScroll && (
        <button
          type="button"
          onClick={() => {
            setAutoScroll(true);

            scrollRef.current?.scrollTo({
              top: scrollRef.current.scrollHeight,
              behavior: "smooth",
            });
          }}
          className="mx-auto mb-2 shrink-0 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-indigo-600 shadow-sm transition-colors hover:bg-indigo-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
        >
          ↓ Jump to latest
        </button>
      )}

      {/* Input Area */}
      <div className="shrink-0 border-t border-slate-100 bg-white p-3 sm:p-4">
        <div className="flex items-end gap-2 rounded-xl border border-slate-200 bg-slate-50 p-1.5 transition-colors focus-within:border-indigo-300 focus-within:ring-2 focus-within:ring-indigo-100">
          <input
            value={input}
            onChange={(event) => setInput(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter" && !event.shiftKey) {
                event.preventDefault();
                handleSend();
              }
            }}
            disabled={isStreaming}
            placeholder="Ask about your metrics…"
            aria-label="Ask a question about your metrics"
            className="min-w-0 flex-1 bg-transparent px-3 py-2 text-base text-slate-900 placeholder-slate-400 outline-none disabled:cursor-not-allowed disabled:opacity-50 sm:text-sm"
          />

          {isStreaming ? (
            <button
              type="button"
              onClick={stop}
              aria-label="Stop response"
              className="shrink-0 rounded-lg bg-red-500 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-red-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-500"
            >
              Stop
            </button>
          ) : (
            <button
              type="button"
              onClick={() => handleSend()}
              disabled={!input.trim()}
              aria-label="Send message"
              className="shrink-0 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-all hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Send
            </button>
          )}
        </div>

        <p className="mt-2 text-center text-[10px] text-slate-400">
          Press Enter to send · AI responses may contain errors
        </p>
      </div>
    </div>
  );
}