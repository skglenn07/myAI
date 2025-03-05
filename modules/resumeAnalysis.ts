// Extract keywords from job descriptions
export function extractKeywords(jobDescription: string): string[] {
  const words = jobDescription.match(/\b\w+\b/g) || [];
  return Array.from(new Set(words.map(word => word.toLowerCase())));
}

// Analyze how well the resume matches the job description keywords
export function analyzeResumeAgainstJob(resumeText: string, jobKeywords: string[]) {
  const resumeWords = resumeText.match(/\b\w+\b/g) || [];
  const resumeKeywords = new Set(resumeWords.map(word => word.toLowerCase()));
  const missingKeywords = jobKeywords.filter(keyword => !resumeKeywords.has(keyword));
  
  return {
    matchedKeywords: jobKeywords.filter(keyword => resumeKeywords.has(keyword)),
    missingKeywords,
    matchPercentage: ((jobKeywords.length - missingKeywords.length) / jobKeywords.length) * 100
  };
}
