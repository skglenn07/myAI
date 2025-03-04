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
      <h1 className="text-2xl font-bold mb-2">Job Description Matcher</h1>
      <p className="text-gray-700 mb-6 text-center max-w-lg">
        The Job Description Matcher helps you analyze how well your resume aligns with a given job description.
        Simply enter the job posting details and your resume content to receive feedback on your compatibility!
      </p>
      {/* Existing input fields and logic */}
    </div>
  );
}

