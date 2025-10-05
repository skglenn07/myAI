# [link text](https://my-ai-alpha-nine.vercel.app/ "ResuMe AI")

ResuMe AI is an AI-powered writing coach designed to help college students improve their resumes, cover letters, and application essays. Unlike traditional editing tools, ResuMe AI provides a coaching experience: it asks questions about the student’s goals, gives reader-response feedback, and guides writers toward stronger revisions.

## Key Features

Conversational Writing Coach:

- Guides students by asking clarifying questions about goals and audience.

- Provides feedback in the style of a writing coach rather than automatic corrections.

Resume & Job Description Matcher:

- Backend + frontend tool to compare a student’s resume with a job description.

- Highlights missing keywords and ATS (Applicant Tracking System) alignment to strengthen applications.

Application Essay & Cover Letter Support:

- Offers feedback on clarity, structure, persuasiveness, and tone.

- Encourages iterative revisions.

## System Design Highlights

Retrieval-Augmented Generation (RAG): Loaded curated datasets to provide grounded advice tailored to resume and application writing.

Prompt Engineering: Iteratively refined backend prompts to an integrated OpenAI API in order to shift from “chatbot answers” to “writing coach style” feedback.

User Experience Improvements: Frontend designed for clarity and usability.

Resume Matcher: Built a backend and frontend structure to allow students to analyze job postings against uploaded resumes for fit and ATS readiness.

## How It Works

Start a Coaching Session: Users describe what they’re working on (resume, cover letter, essay).

Set Goals: The system asks about their goals (job type, program, strengths to highlight).

Receive Feedback: AI provides constructive feedback framed as suggestions and questions.

ATS Matcher: Students upload a resume + job description; tool highlights key skills and keywords to integrate.

## Why ResuMe AI?

- Empowers students to become better writers, not just recipients of edits.

- Helps bridge the gap between career services advising and AI assistance.

- Improves job application success by aligning resumes with ATS systems.

## Future Directions

Expand dataset of career writing resources for RAG grounding.

Add analytics dashboard for students to track improvement over time.

Integrate with LinkedIn or Handshake for real-time job description parsing.


Powered by ringel.AI and configured and deployed with Vercel and Pinecone.
