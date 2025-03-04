"use client";
import { useState } from "react";
import Link from "next/link";

export default function JobMatcher() {
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
    <div className="flex flex-col items-center min-h-screen p-5 bg-gray-100">
      <h1 className="text-2xl font-bold mb-4">Job Description Matcher</h1>

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

      {/* Back to Main Page Button */}
      <Link href="/">
        <button className="mt-6 bg-gray-500 text-white px-4 py-2 rounded">
          Back to Chat
        </button>
      </Link>
    </div>
  );
}
