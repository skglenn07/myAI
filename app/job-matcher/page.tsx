"use client";
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';

export default function JobMatcher() {
  const [jobDescription, setJobDescription] = useState('');
  const [resumeText, setResumeText] = useState('');
  const [analysis, setAnalysis] = useState(null);
  const [followUpQuestions, setFollowUpQuestions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jobDescription, resumeText }),
      });
      const data = await response.json();
      setAnalysis(data.analysis);
      setFollowUpQuestions(data.followUpQuestions);
    } catch (error) {
      console.error('Error analyzing resume:', error);
    }
    setLoading(false);
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Job Matcher</h1>
      <label className="block mb-2">Job Description:</label>
      <textarea
        value={jobDescription}
        onChange={(e) => setJobDescription(e.target.value)}
        className="w-full p-2 border rounded"
        rows={5}
      />
      <label className="block mt-4 mb-2">Your Resume:</label>
      <textarea
        value={resumeText}
        onChange={(e) => setResumeText(e.target.value)}
        className="w-full p-2 border rounded"
        rows={5}
      />
      <Button onClick={handleSubmit} disabled={loading} className="mt-4 w-full">
        {loading ? 'Analyzing...' : 'Analyze Resume'}
      </Button>
      {analysis && (
        <div className="mt-6 p-4 border rounded">
          <h2 className="text-xl font-bold">Analysis Results:</h2>
          <pre className="whitespace-pre-wrap">{JSON.stringify(analysis, null, 2)}</pre>
        </div>
      )}
      {followUpQuestions && (
        <div className="mt-6 p-4 border rounded">
          <h2 className="text-xl font-bold">Follow-up Questions:</h2>
          <ul className="list-disc pl-6">
            {followUpQuestions.map((question, index) => (
              <li key={index}>{question}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}




// "use client";
// import { useState } from "react";
// import Link from "next/link";

// export default function JobMatcher() {
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
//     <div className="flex flex-col items-center min-h-screen p-8 bg-gradient-to-b from-green-50 to-gray-100">
//       <div className="bg-white shadow-lg rounded-lg p-8 max-w-2xl w-full text-center">
//         <h1 className="text-3xl font-extrabold text-gray-800 mb-3">Job Description Matcher</h1>
//         <p className="text-gray-600 mb-6">
//           The Job Description Matcher helps you analyze how well your resume aligns with a given job description.
//           Simply enter the job posting details and your resume content to receive feedback on your compatibility!
//         </p>

//         <div className="space-y-4">
//           <textarea
//             className="w-full p-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-green-500"
//             placeholder="Enter job description..."
//             value={jobDescription}
//             onChange={(e) => setJobDescription(e.target.value)}
//           />
//           <textarea
//             className="w-full p-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-green-500"
//             placeholder="Enter your resume text..."
//             value={resumeText}
//             onChange={(e) => setResumeText(e.target.value)}
//           />
//           <button
//             className="w-full bg-green-600 text-white font-semibold py-3 rounded-lg shadow-lg hover:bg-green-700 transition"
//             onClick={analyzeJobMatch}
//             disabled={loading}
//           >
//             {loading ? "Analyzing..." : "Check Match"}
//           </button>
//         </div>

//         {feedback && (
//           <div className="mt-6 p-4 bg-gray-50 border-l-4 border-green-500 text-gray-700 rounded-lg shadow-sm">
//             <h2 className="text-lg font-semibold">Feedback</h2>
//             <p>{feedback}</p>
//           </div>
//         )}

//         <div className="mt-6">
//           <Link href="/">
//             <button className="px-4 py-2 bg-gray-600 text-white font-semibold rounded-lg shadow hover:bg-gray-700 transition">
//               Back to Main Chat
//             </button>
//           </Link>
//         </div>
//       </div>
//     </div>
//   );
// }
