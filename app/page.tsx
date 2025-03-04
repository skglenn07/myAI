"use client";

import ChatInput from "@/components/chat/input";
import ChatMessages from "@/components/chat/messages";
import useApp from "@/hooks/use-app";
import ChatHeader from "@/components/chat/header";
import { useState } from "react";
import Link from "next/link";


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

  // Job Matcher State
  const [jobDescription, setJobDescription] = useState("");
  const [resumeText, setResumeText] = useState("");
  const [feedback, setFeedback] = useState("");
  const [loading, setLoading] = useState(false);

  const analyzeJobMatch = async () => {
    if (!jobDescription || !resumeText) {
      alert("Please enter both a job description and your resume text.");
      return;
    }

    setLoading(true);
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: jobDescription, resumeText }),
    });

    const data = await response.json();
    setFeedback(data.feedback);
    setLoading(false);
  };

return (
  <>
    <ChatHeader clearMessages={clearMessages} />

{/*     {/* Job Matching Button */}
    <div className="absolute top-24 right-4">
      <Link href="/job-matcher">
        <button className="px-6 py-3 bg-green-600 text-white text-lg font-semibold rounded-lg shadow-lg hover:bg-green-700 transition">
          Try Job Matcher
        </button>
      </Link>
    </div>
 */}
    {/* Chat Interface */}
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
