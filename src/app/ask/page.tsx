
"use client";

import { useChat } from "ai/react";
import { useState } from "react";
import NavBar from "../component/navbar";

export default function Home() {
  const [waitingForAI, setWaitingForAI] = useState<Boolean>(false);
  const { messages, input, handleInputChange, handleSubmit } = useChat({
    onResponse: () => setWaitingForAI(false),
    onFinish: () => setWaitingForAI(false),
  });

  const handleFormSubmit = (e: React.FormEvent) => {
    setWaitingForAI(true);
    handleSubmit(e);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-900 via-red-900 to-yellow-900">
      <NavBar />
      <div
        className="px-4 py-16 sm:px-6 lg:px-8 transition-all duration-300"
        style={{
          height: "70vh",
          flexDirection: "column-reverse",
          display: "flex",
        }}
      >
        {waitingForAI && (
          <div className="flex items-center justify-center p-4 bg-blue-900/20 backdrop-blur-sm rounded-lg mb-4 transition-all duration-300 animate-pulse">
            <div className="text-blue-400 flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: "0.4s" }}></div>
              <span className="ml-2">Zeno is thinking...</span>
            </div>
          </div>
        )}
        {messages.length === 0 && (
          <div className="flex items-center justify-center p-8 rounded-lg mb-4 bg-gradient-to-r from-blue-900/20 to-purple-900/20 backdrop-blur-sm transition-all duration-300">
            <div className="text-gray-300 text-center">
              <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-red-500 via-blue-500 to-yellow-500 text-transparent bg-clip-text">Welcome to Zeno</h2>
              <p className="text-lg text-gray-400">Your AI Algebra Tutor</p>
              <p className="mt-4 text-sm text-gray-500">Ask me anything about your math problems!</p>
            </div>
          </div>
        )}
        <div className="pr-4 messages">
          {messages.map((m) => (
            <div
              key={m.id}
              className="flex gap-3 my-4 text-gray-600 text-sm flex-1 animate-fadeIn"
            >
              <span
                className="relative flex shrink-0 overflow-hidden rounded-full w-8 h-8 transition-transform hover:scale-110"
                style={{ margin: "30px", marginTop: "0px" }}
              >
                <div className="rounded-full bg-gradient-to-r from-blue-500 to-purple-500 p-1">
                  {m.role === "user" ? (
                    <img src="/user.svg" alt="User" width={32} height={32} className="bg-white rounded-full p-1" />
                  ) : (
                    <img src="/bot.svg" alt="Bot" width={32} height={32} className="bg-white rounded-full p-1" />
                  )}
                </div>
              </span>
              <div className="flex-1">
                <p className="leading-relaxed px-4 py-3 rounded-lg bg-gradient-to-r from-gray-800/50 to-gray-900/50 backdrop-blur-sm text-gray-200 shadow-lg">
                  <span className="block font-bold mb-1 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
                    {m.role === "assistant" ? "Zeno" : "You"}
                  </span>
                  {m.content}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="flex items-center pt-0 chat-window">
          <form
            className="flex items-center justify-center w-full space-x-2 backdrop-blur-sm bg-gradient-to-r from-red-900/10 via-blue-900/10 to-yellow-900/10 p-4 rounded-lg"
            onSubmit={handleFormSubmit}
          >
            <input
              value={input}
              onChange={handleInputChange}
              className="flex h-12 w-full rounded-lg border border-blue-500/30 bg-gray-900/50 px-4 py-2 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 disabled:cursor-not-allowed disabled:opacity-50 text-gray-200 transition-all duration-300"
              placeholder="Ask me anything about algebra..."
            />
            <button
              type="submit"
              disabled={waitingForAI}
              className="inline-flex items-center justify-center rounded-lg text-sm font-medium text-white disabled:pointer-events-none disabled:opacity-50 bg-gradient-to-r from-red-600 via-blue-600 to-yellow-600 hover:from-red-500 hover:via-blue-500 hover:to-yellow-500 h-12 px-6 py-2 transition-all duration-300 transform hover:scale-105 focus:ring-2 focus:ring-blue-500/50"
            >
              Send
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
