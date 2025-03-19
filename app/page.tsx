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
      <div className="flex flex-col h-screen bg-gradient-to-b from-blue-50 to-gray-100 items-center">
        
        {/* Job Matcher Button */}
        <div className="absolute top-4 right-4">
          <button
            onClick={analyzeJobMatch}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
            disabled={loading}
          >
            {loading ? "Analyzing..." : "Analyze Job Match"}
          </button>
        </div>

        {/* Chat Messages Scrollable Area */}
        <div className="flex-grow overflow-y-auto p-5 w-full max-w-screen-lg">
          <ChatMessages messages={messages} indicatorState={indicatorState} />
        </div>

        {/* Chat Input Bar */}
        <div className="w-full max-w-screen-lg px-4 pb-4 flex justify-center">
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
}



// "use client";

// import ChatInput from "@/components/chat/input";
// import ChatMessages from "@/components/chat/messages";
// import useApp from "@/hooks/use-app";
// import ChatHeader from "@/components/chat/header";
// import { useState } from "react";
// import Link from "next/link";


// export default function Chat() {
//   const {
//     messages,
//     handleInputChange,
//     handleSubmit,
//     input,
//     isLoading,
//     indicatorState,
//     clearMessages,
//   } = useApp();

//   // Job Matcher State
//   const [jobDescription, setJobDescription] = useState("");
//   const [resumeText, setResumeText] = useState("");
//   const [feedback, setFeedback] = useState("");
//   const [loading, setLoading] = useState(false);

//   const analyzeJobMatch = async () => {
//     if (!jobDescription || !resumeText) {
//       alert("Please enter both a job description and your resume text.");
//       return;
//     }

//     setLoading(true);
//     const response = await fetch("/api/chat", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ message: jobDescription, resumeText }),
//     });

//     const data = await response.json();
//     setFeedback(data.feedback);
//     setLoading(false);
//   };

//   return (
//     <>
//       <ChatHeader clearMessages={clearMessages} />

//       {/* Chat Container */}
//       <div className="flex flex-col h-screen bg-gradient-to-b from-blue-50 to-gray-100 items-center">
        
//         {/* Chat Messages Scrollable Area */}
//         <div className="flex-grow overflow-y-auto p-5 w-full max-w-screen-lg">
//           <ChatMessages messages={messages} indicatorState={indicatorState} />
//         </div>

//         {/* Chat Input Bar */}
//         <div className="w-full max-w-screen-lg px-4 pb-4">
//           <ChatInput
//             handleInputChange={handleInputChange}
//             handleSubmit={handleSubmit}
//             input={input}
//             isLoading={isLoading}
//           />
//         </div>
//       </div>
//     </>
//   );

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
