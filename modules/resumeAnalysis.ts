// Extract keywords from job descriptions
export function extractKeywords(jobDescription: string): string[] {
  const words = jobDescription.match(/\b\w+\b/g) || [];
  return Array.from(new Set(words.map(word => word.toLowerCase())));
}

// Generate follow-up questions based on missing keywords
export function generateFollowUpQuestions(missingKeywords: string[], jobTitle: string): string[] {
  if (missingKeywords.length === 0) {
    return [
      `Your resume appears to align well with the ${jobTitle} role! How do you feel about this opportunity?`
    ];
  }
  
  return missingKeywords.map(keyword => {
    return `I noticed your resume doesn’t mention '${keyword}'. Do you have experience with this skill or a related one?`;
  }).concat([
    `Based on your experience, do you feel confident about applying for a ${jobTitle} role?`
  ]);
}

// Analyze how well the resume matches the job description keywords and generate questions
export function analyzeResumeAgainstJob(resumeText: string, jobDescription: string, jobTitle: string) {
  const jobKeywords = extractKeywords(jobDescription);
  const resumeWords = resumeText.match(/\b\w+\b/g) || [];
  const resumeKeywords = new Set(resumeWords.map(word => word.toLowerCase()));
  const missingKeywords = jobKeywords.filter(keyword => !resumeKeywords.has(keyword));
  
  return {
    matchedKeywords: jobKeywords.filter(keyword => resumeKeywords.has(keyword)),
    missingKeywords,
    matchPercentage: ((jobKeywords.length - missingKeywords.length) / jobKeywords.length) * 100,
    followUpQuestions: generateFollowUpQuestions(missingKeywords, jobTitle)
  };
}
