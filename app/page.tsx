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

      {/* Chat Container */}
      <div className="flex flex-col h-screen bg-gradient-to-b from-blue-50 to-gray-100">

        {/* Chat Messages Scrollable Area */}
        <div className="flex-grow overflow-y-auto p-5 max-w-screen-lg w-full mx-auto">
          <ChatMessages messages={messages} indicatorState={indicatorState} />
        </div>

        {/* Chat Input Bar */}
        <div className="sticky bottom-0 bg-white shadow-md p-4 w-full max-w-screen-lg mx-auto">
          <ChatInput
            handleInputChange={handleInputChange}
            handleSubmit={handleSubmit}
            input={input}
            isLoading={isLoading}
          />
        </div>
      </div>
    </>
  );

// return (
//   <>
//     <ChatHeader clearMessages={clearMessages} />
    
//     {/* Chat Interface */}
//     <div className="flex justify-center items-center h-screen bg-gradient-to-b from-blue-50 to-gray-100">
//       <div className="flex flex-col max-w-screen-lg w-full h-full p-5">
//         <ChatMessages messages={messages} indicatorState={indicatorState} />
//       </div>
//     </div>

//     <ChatInput
//       handleInputChange={handleInputChange}
//       handleSubmit={handleSubmit}
//       input={input}
//       isLoading={isLoading}
//     />
//   </>
// );

}
