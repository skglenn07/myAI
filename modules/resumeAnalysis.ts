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

// Generate follow-up questions based on resume analysis
export function generateFollowUpQuestions(analysis: any): string[] {
  const questions: string[] = [];
  
  if (analysis.missingKeywords.length > 0) {
    questions.push("Can you elaborate on any experience you have related to these missing skills: " + analysis.missingKeywords.join(", ") + "?");
  }
  
  if (analysis.matchPercentage < 50) {
    questions.push("Would you be open to gaining more experience in these areas to improve your fit for this role?");
  }
  
  if (analysis.matchPercentage >= 50 && analysis.matchPercentage < 80) {
    questions.push("Your resume aligns fairly well with this role. Are there any additional projects or coursework you've completed that relate to the job requirements?");
  }
  
  return questions;
}
