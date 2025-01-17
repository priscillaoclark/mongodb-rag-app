"use client";

import { useChat } from "ai/react";
import { useState, useRef, useEffect } from "react";
import NavBar from "../component/navbar";
import { MessageSquare, Send, Loader2 } from "lucide-react";

export default function Home() {
  const [waitingForAI, setWaitingForAI] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { messages, input, handleInputChange, handleSubmit } = useChat({
    onResponse: () => setWaitingForAI(false),
    onFinish: () => setWaitingForAI(false),
  });

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleFormSubmit = (e: React.FormEvent) => {
    if (!input.trim()) return;
    setWaitingForAI(true);
    handleSubmit(e);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-black">
      <NavBar />

      <main className="flex-1 container mx-auto max-w-4xl px-4 pt-20 pb-24">
        {/* Welcome Message */}
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center space-y-8 min-h-[60vh]">
            <div className="p-6 rounded-2xl bg-gradient-to-r from-blue-900/20 to-blue-500/20 backdrop-blur-md shadow-xl">
              <div className="text-center space-y-4">
                <div className="inline-block p-3 rounded-full bg-blue-600/20 mb-4">
                  <MessageSquare className="w-8 h-8 text-blue-400" />
                </div>
                <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
                  Welcome to Zeno
                </h2>
                <p className="text-xl text-gray-300">Your AI Algebra Tutor</p>
                <p className="text-gray-400 max-w-md mx-auto">
                  I&apos;m here to help you understand algebra concepts, solve
                  equations, and master mathematical principles. Ask me
                  anything!
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Messages Container */}
        <div className="space-y-6 mb-8">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex gap-4 ${
                m.role === "assistant" ? "justify-start" : "justify-end"
              }`}
            >
              {m.role === "assistant" && (
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-600 to-blue-800 p-1 flex-shrink-0">
                  <img
                    src="/logo.png"
                    alt="Zeno"
                    className="w-full h-full rounded-full bg-white p-1"
                  />
                </div>
              )}
              <div
                className={`flex max-w-[80%] ${m.role === "user" ? "flex-row-reverse" : ""}`}
              >
                <div
                  className={`px-4 py-3 rounded-2xl shadow-lg ${
                    m.role === "assistant"
                      ? "bg-gradient-to-r from-gray-800/90 to-gray-900/90 text-gray-200"
                      : "bg-gradient-to-r from-blue-600 to-blue-700 text-white"
                  }`}
                >
                  <div className="prose prose-invert">
                    <p className="whitespace-pre-wrap">{m.content}</p>
                  </div>
                </div>
              </div>
              {m.role === "user" && (
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-400 to-blue-600 p-1 flex-shrink-0">
                  <img
                    src="/user.svg"
                    alt="User"
                    className="w-full h-full rounded-full bg-white p-1"
                  />
                </div>
              )}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Thinking Indicator */}
        {waitingForAI && (
          <div className="fixed bottom-24 left-1/2 transform -translate-x-1/2 z-10">
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-blue-900/40 backdrop-blur-sm text-blue-400">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span className="text-sm">Zeno is thinking...</span>
            </div>
          </div>
        )}

        {/* Input Form */}
        <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4 z-10">
          <div className="container mx-auto max-w-4xl">
            <form
              onSubmit={handleFormSubmit}
              className="flex items-center gap-2 bg-gradient-to-r from-gray-900 to-gray-800 rounded-xl p-2 shadow-xl ring-1 ring-gray-800"
            >
              <input
                value={input}
                onChange={handleInputChange}
                placeholder="Ask me anything about algebra..."
                className="flex-1 bg-transparent px-4 py-3 text-gray-200 placeholder-gray-400 focus:outline-none"
                disabled={waitingForAI}
              />
              <button
                type="submit"
                disabled={waitingForAI || !input.trim()}
                className="p-2 rounded-lg bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:hover:bg-blue-600 transition-colors"
              >
                <Send className="w-5 h-5 text-white" />
              </button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}
