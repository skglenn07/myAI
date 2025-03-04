// seperating file upload capabilities

"use client";
import { useState } from "react";

export default function ResumeAnalyzer() {
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
      <h1 className="text-2xl font-bold mb-4">Upload Your Resume</h1>
      <input type="file" accept=".pdf,.docx" onChange={handleFileUpload} />
      <button onClick={submitFile} className="mt-4 p-2 bg-blue-500 text-white rounded">
        Analyze Resume
      </button>
    </div>
  );
}
