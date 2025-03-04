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

      {/* Job Matching Feature */}
      <div className="flex flex-col items-center p-5 bg-gray-100">
        <h2 className="text-xl font-bold mb-4">Job Description Matcher</h2>

        <textarea
          className="w-full max-w-lg p-2 border border-gray-300 rounded mb-3"
          placeholder="Paste the job description here..."
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
        />

        <textarea
          className="w-full max-w-lg p-2 border border-gray-300 rounded mb-3"
          placeholder="Paste your resume text here..."
          value={resumeText}
          onChange={(e) => setResumeText(e.target.value)}
        />

        <button
          onClick={analyzeJobMatch}
          className="p-2 bg-blue-500 text-white rounded"
          disabled={loading}
        >
          {loading ? "Analyzing..." : "Analyze Job Match"}
        </button>

        {feedback && (
          <div className="mt-4 w-full max-w-lg bg-white p-4 rounded shadow">
            <h2 className="text-lg font-bold">AI Feedback:</h2>
            <p className="text-gray-700 whitespace-pre-line">{feedback}</p>
          </div>
        )}
      </div>

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
