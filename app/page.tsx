"use client";

import ChatInput from "@/components/chat/input";
import ChatMessages from "@/components/chat/messages";
import useApp from "@/hooks/use-app";
import ChatHeader from "@/components/chat/header";
import { useState } from "react";

export default function Chat() {
  const {
    messages,
    handleInputChange,
    handleSubmit,
    input,
    isLoading,
    indicatorState,
    clearMessages,
  } = useApp();

  return (
    <div className="flex flex-col items-center min-h-screen bg-gradient-to-b from-gray-50 to-gray-200">
      <ChatHeader clearMessages={clearMessages} />
      <div className="w-full max-w-3xl bg-white shadow-lg rounded-lg p-6 mt-6 flex flex-col gap-4">
        <h1 className="text-2xl font-bold text-center text-gray-800">Welcome to Your AI Assistant</h1>
        <p className="text-gray-600 text-center">
          Get instant responses, refine your writing, and enhance your job applications with AI-powered assistance.
        </p>
      </div>
      <div className="w-full max-w-3xl flex-1 overflow-y-auto mt-4 p-4 bg-white shadow-md rounded-lg">
        <ChatMessages messages={messages} indicatorState={indicatorState} />
      </div>
      <div className="w-full max-w-3xl mt-4">
        <ChatInput
          input={input}
          handleInputChange={handleInputChange}
          handleSubmit={handleSubmit}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
}

