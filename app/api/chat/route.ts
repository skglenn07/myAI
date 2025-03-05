import { NextResponse } from 'next/server';
import { extractKeywords, analyzeResumeAgainstJob } from '@/modules/resumeAnalysis';
import { generateFollowUpQuestions } from '@/modules/response';
import { OpenAI } from "openai";
import { Pinecone } from "@pinecone-database/pinecone";
import { AIProviders, Chat, Intention } from "@/types";
import { IntentionModule } from "@/modules/intention";
import { ResponseModule } from "@/modules/response";
import { PINECONE_INDEX_NAME } from "@/configuration/pinecone";
import Anthropic from "@anthropic-ai/sdk";

export const maxDuration = 60;

// Get API keys
const pineconeApiKey = process.env.PINECONE_API_KEY;
const openaiApiKey = process.env.OPENAI_API_KEY;
const anthropicApiKey = process.env.ANTHROPIC_API_KEY;
const fireworksApiKey = process.env.FIREWORKS_API_KEY;

// Check if API keys are set
if (!pineconeApiKey) {
  throw new Error("PINECONE_API_KEY is not set");
}
if (!openaiApiKey) {
  throw new Error("OPENAI_API_KEY is not set");
}

// Initialize Pinecone
const pineconeClient = new Pinecone({
  apiKey: pineconeApiKey,
});
const pineconeIndex = pineconeClient.Index(PINECONE_INDEX_NAME);

// Initialize Providers
const openaiClient = new OpenAI({
  apiKey: openaiApiKey,
});
const anthropicClient = new Anthropic({
  apiKey: anthropicApiKey,
});
const fireworksClient = new OpenAI({
  baseURL: "https://api.fireworks.ai/inference/v1",
  apiKey: fireworksApiKey,
});
const providers: AIProviders = {
  openai: openaiClient,
  anthropic: anthropicClient,
  fireworks: fireworksClient,
};

async function determineIntention(chat: Chat): Promise<Intention> {
  return await IntentionModule.detectIntention({
    chat: chat,
    openai: providers.openai,
  });
}

export async function POST(req: Request) {
  try {
    const { jobDescription, resumeText, mode, message, chat } = await req.json();
    
    // If mode is 'chat', preserve main chat functionality
    if (mode === 'chat') {
      const intention: Intention = await determineIntention(chat);
      if (intention.type === "question") {
        return ResponseModule.respondToQuestion(chat, providers, pineconeIndex);
      } else if (intention.type === "hostile_message") {
        return ResponseModule.respondToHostileMessage(chat, providers);
      } else {
        return ResponseModule.respondToRandomMessage(chat, providers);
      }
    }
    
    if (!jobDescription || !resumeText) {
      return NextResponse.json({ error: 'Missing job description or resume text' }, { status: 400 });
    }
    
    // Extract important keywords from the job description
    const jobKeywords = extractKeywords(jobDescription);
    
    // Analyze how well the resume matches the job description
    const analysis = analyzeResumeAgainstJob(resumeText, jobKeywords);
    
    // Generate follow-up questions for the user
    const followUpQuestions = generateFollowUpQuestions(analysis);
    
    return NextResponse.json({ analysis, followUpQuestions });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to process request' }, { status: 500 });
  }
}


// import { OpenAI } from "openai";
// import { Pinecone } from "@pinecone-database/pinecone";
// import { AIProviders, Chat, Intention } from "@/types";
// import { IntentionModule } from "@/modules/intention";
// import { ResponseModule } from "@/modules/response";
// import { PINECONE_INDEX_NAME } from "@/configuration/pinecone";
// import Anthropic from "@anthropic-ai/sdk";

// export const maxDuration = 60;

// // Get API keys
// const pineconeApiKey = process.env.PINECONE_API_KEY;
// const openaiApiKey = process.env.OPENAI_API_KEY;
// const anthropicApiKey = process.env.ANTHROPIC_API_KEY;
// const fireworksApiKey = process.env.FIREWORKS_API_KEY;

// // Check if API keys are set
// if (!pineconeApiKey) {
//   throw new Error("PINECONE_API_KEY is not set");
// }
// if (!openaiApiKey) {
//   throw new Error("OPENAI_API_KEY is not set");
// }

// // Initialize Pinecone
// const pineconeClient = new Pinecone({
//   apiKey: pineconeApiKey,
// });
// const pineconeIndex = pineconeClient.Index(PINECONE_INDEX_NAME);

// // Initialize Providers
// const openaiClient = new OpenAI({
//   apiKey: openaiApiKey,
// });
// const anthropicClient = new Anthropic({
//   apiKey: anthropicApiKey,
// });
// const fireworksClient = new OpenAI({
//   baseURL: "https://api.fireworks.ai/inference/v1",
//   apiKey: fireworksApiKey,
// });
// const providers: AIProviders = {
//   openai: openaiClient,
//   anthropic: anthropicClient,
//   fireworks: fireworksClient,
// };

// async function determineIntention(chat: Chat): Promise<Intention> {
//   return await IntentionModule.detectIntention({
//     chat: chat,
//     openai: providers.openai,
//   });
// }

// // export async function POST(req: Request) {
// //   const { chat } = await req.json();

// //   const intention: Intention = await determineIntention(chat);

// //   if (intention.type === "question") {
// //     return ResponseModule.respondToQuestion(chat, providers, pineconeIndex);
// //   } else if (intention.type === "hostile_message") {
// //     return ResponseModule.respondToHostileMessage(chat, providers);
// //   } else {
// //     return ResponseModule.respondToRandomMessage(chat, providers);
// //   }
// // }

// export async function POST(req: Request) {
//   const { message, resumeText, chat } = await req.json();
//   const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

//   //  Job Matching Request (Check if both `message` and `resumeText` exist)
//   if (message && resumeText) {
//     const response = await openai.chat.completions.create({
//       model: "gpt-4",
//       messages: [
//         { role: "system", content: "You are an expert in ATS resume matching. Analyze this job description against the provided resume and suggest optimizations." },
//         { role: "user", content: `Job Description:\n${message}\n\nResume:\n${resumeText}` },
//       ],
//     });

//     return new Response(JSON.stringify({ feedback: response.choices[0].message.content }), {
//       headers: { "Content-Type": "application/json" },
//     });
//   }

//   //  Chat Message Handling
//   if (chat) {
//     const intention: Intention = await determineIntention(chat);

//     if (intention.type === "question") {
//       return ResponseModule.respondToQuestion(chat, providers, pineconeIndex);
//     } else if (intention.type === "hostile_message") {
//       return ResponseModule.respondToHostileMessage(chat, providers);
//     } else {
//       return ResponseModule.respondToRandomMessage(chat, providers);
//     }
//   }

//   // If no valid request type is found, return an error
//   return new Response(JSON.stringify({ error: "Invalid request payload" }), {
//     status: 400,
//     headers: { "Content-Type": "application/json" },
//   });
// }

