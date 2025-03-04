"use client";

import ChatInput from "@/components/chat/input";
import ChatMessages from "@/components/chat/messages";
import useApp from "@/hooks/use-app";
import ChatHeader from "@/components/chat/header";

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
    <>
      <ChatHeader clearMessages={clearMessages} />
      <div className="flex justify-center items-center h-screen">
        <div className="flex flex-col max-w-screen-lg w-full h-full p-5">
          <ChatMessages messages={messages} indicatorState={indicatorState} />
        </div>
      </div>
      <ChatInput
        handleInputChange={handleInputChange}
        handleSubmit={handleSubmit}
        input={input}
        isLoading={isLoading}
      />
    </>
  );
}

// file upload capabilities: 
import { useState } from "react";

export default function Home() {
  const [file, setFile] = useState<File | null>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const submitFile = async () => {
    if (!file) return;
    const formData = new FormData();
    formData.append("resume", file);

    const response = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    const data = await response.json();
    console.log("AI Feedback:", data);
  };

  return (
    <div className="flex flex-col items-center">
      <input type="file" accept=".pdf,.docx" onChange={handleFileUpload} />
      <button onClick={submitFile} className="mt-4 p-2 bg-blue-500 text-white rounded">Analyze Resume</button>
    </div>
  );
}
