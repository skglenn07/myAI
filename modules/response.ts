import {
  Chat,
  Chunk,
  Source,
  CoreMessage,
  AIProviders,
  ProviderName,
  Citation,
} from "@/types";
import {
  convertToCoreMessages,
  embedHypotheticalData,
  generateHypotheticalData,
  getSourcesFromChunks,
  getContextFromSources,
  getCitationsFromChunks,
  searchForChunksUsingEmbedding,
  stripMessagesOfCitations,
} from "@/utilities/chat";
import {
  queueAssistantResponse,
  queueError,
  queueIndicator,
} from "@/actions/streaming";
import {
  HISTORY_CONTEXT_LENGTH,
  DEFAULT_RESPONSE_MESSAGE,
} from "@/configuration/chat";
import {
  RESPOND_TO_HOSTILE_MESSAGE_SYSTEM_PROMPT,
  RESPOND_TO_QUESTION_BACKUP_SYSTEM_PROMPT,
  RESPOND_TO_QUESTION_SYSTEM_PROMPT,
  RESPOND_TO_RANDOM_MESSAGE_SYSTEM_PROMPT,
} from "@/configuration/prompts";
import {
  RANDOM_RESPONSE_PROVIDER,
  RANDOM_RESPONSE_MODEL,
  HOSTILE_RESPONSE_PROVIDER,
  HOSTILE_RESPONSE_MODEL,
  QUESTION_RESPONSE_PROVIDER,
  QUESTION_RESPONSE_MODEL,
  HOSTILE_RESPONSE_TEMPERATURE,
  QUESTION_RESPONSE_TEMPERATURE,
  RANDOM_RESPONSE_TEMPERATURE,
} from "@/configuration/models";

export class ResponseModule {
  static async respondToRandomMessage(
    chat: Chat,
    providers: AIProviders
  ): Promise<Response> {
    const PROVIDER_NAME: ProviderName = RANDOM_RESPONSE_PROVIDER;
    const MODEL_NAME: string = RANDOM_RESPONSE_MODEL;

    const stream = new ReadableStream({
      async start(controller) {
        queueIndicator({
          controller,
          status: "Thinking about your writing goals...",
          icon: "thinking",
        });

        const mostRecentMessages: CoreMessage[] = await convertToCoreMessages(
          stripMessagesOfCitations(chat.messages.slice(-HISTORY_CONTEXT_LENGTH))
        );
        
        const systemPrompt = RESPOND_TO_RANDOM_MESSAGE_SYSTEM_PROMPT();

        queueAssistantResponse({
          controller,
          providers,
          providerName: PROVIDER_NAME,
          messages: mostRecentMessages,
          model_name: MODEL_NAME,
          systemPrompt,
          citations: [],
          error_message: DEFAULT_RESPONSE_MESSAGE,
          temperature: RANDOM_RESPONSE_TEMPERATURE,
        });
      },
    });
    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  }

  static async respondToHostileMessage(
    chat: Chat,
    providers: AIProviders
  ): Promise<Response> {
    const PROVIDER_NAME: ProviderName = HOSTILE_RESPONSE_PROVIDER;
    const MODEL_NAME: string = HOSTILE_RESPONSE_MODEL;

    const stream = new ReadableStream({
      async start(controller) {
        queueIndicator({
          controller,
          status: "Coming up with an answer...",
          icon: "thinking",
        });
        const systemPrompt = RESPOND_TO_HOSTILE_MESSAGE_SYSTEM_PROMPT();
        queueAssistantResponse({
          controller,
          providers,
          providerName: PROVIDER_NAME,
          messages: [],
          model_name: MODEL_NAME,
          systemPrompt,
          citations: [],
          error_message: DEFAULT_RESPONSE_MESSAGE,
          temperature: HOSTILE_RESPONSE_TEMPERATURE,
        });
      },
    });
    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  }

static async respondToQuestion(
    chat: Chat,
    providers: AIProviders,
    index: any
  ): Promise<Response> {
    const PROVIDER_NAME: ProviderName = QUESTION_RESPONSE_PROVIDER;
    const MODEL_NAME: string = QUESTION_RESPONSE_MODEL;

    const stream = new ReadableStream({
      async start(controller) {
        queueIndicator({
          controller,
          status: "Helping you refine your thoughts...",
          icon: "thinking",
        });
        try {
          const hypotheticalData: string = await generateHypotheticalData(
            chat,
            providers.openai
          );
          const { embedding }: { embedding: number[] } =
            await embedHypotheticalData(hypotheticalData, providers.openai);
          queueIndicator({
            controller,
            status: "Exploring relevant ideas...",
            icon: "searching",
          });
          const chunks: Chunk[] = await searchForChunksUsingEmbedding(
            embedding,
            index
          );
          const sources: Source[] = await getSourcesFromChunks(chunks);
          queueIndicator({
            controller,
            status: `Reviewing ${sources.length} related sources...`,
            icon: "documents",
          });
          const citations: Citation[] = await getCitationsFromChunks(chunks);
          const contextFromSources = await getContextFromSources(sources);

          const systemPrompt = RESPOND_TO_QUESTION_SYSTEM_PROMPT(contextFromSources) + `
          Based on the student's stated focus, tailor the response to address their concerns.
          - Identify strengths in the draft.
          - Highlight specific areas that could be improved, using direct excerpts from the user's text and **sourced materials when available**.
          - Offer guiding questions that encourage deeper thinking.
          - Suggest structural or content adjustments with a preference for **source-backed recommendations** while allowing general insights when needed.
          - Do not rewrite the entire text, but you may suggest rewordings of small pieces or reorganization changes if relevant. 
          - Ensure feedback references actual excerpts from the user's draft or cited sources to make it more actionable, when appropriate.

          After providing feedback, ask:
          - How do they feel about the feedback?
          - Would they like to focus on a specific aspect further?
          - Is there anything they'd like to discuss or clarify before revising?
          `;

          queueIndicator({
            controller,
            status: "Providing specific feedback...",
            icon: "thinking",
          });
          queueAssistantResponse({
            controller,
            providers,
            providerName: PROVIDER_NAME,
            messages: stripMessagesOfCitations(
              chat.messages.slice(-HISTORY_CONTEXT_LENGTH)
            ),
            model_name: MODEL_NAME,
            systemPrompt,
            citations,
            error_message: DEFAULT_RESPONSE_MESSAGE,
            temperature: QUESTION_RESPONSE_TEMPERATURE,
          });
        } catch (error: any) {
          console.error("Error in respondToQuestion:", error);
          queueError({
            controller,
            error_message: error.message ?? DEFAULT_RESPONSE_MESSAGE,
          });
          queueAssistantResponse({
            controller,
            providers,
            providerName: PROVIDER_NAME,
            messages: [],
            model_name: MODEL_NAME,
            systemPrompt: RESPOND_TO_QUESTION_BACKUP_SYSTEM_PROMPT(),
            citations: [],
            error_message: DEFAULT_RESPONSE_MESSAGE,
            temperature: QUESTION_RESPONSE_TEMPERATURE,
          });
        }
      },
    });
    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  }
}



// import {
//   Chat,
//   Chunk,
//   Source,
//   CoreMessage,
//   AIProviders,
//   ProviderName,
//   Citation,
// } from "@/types";
// import {
//   convertToCoreMessages,
//   embedHypotheticalData,
//   generateHypotheticalData,
//   getSourcesFromChunks,
//   searchForChunksUsingEmbedding,
//   getContextFromSources,
//   getCitationsFromChunks,
//   buildPromptFromContext,
// } from "@/utilities/chat";
// import {
//   queueAssistantResponse,
//   queueError,
//   queueIndicator,
// } from "@/actions/streaming";
// import {
//   HISTORY_CONTEXT_LENGTH,
//   DEFAULT_RESPONSE_MESSAGE,
// } from "@/configuration/chat";
// import { stripMessagesOfCitations } from "@/utilities/chat";
// import {
//   RESPOND_TO_HOSTILE_MESSAGE_SYSTEM_PROMPT,
//   RESPOND_TO_QUESTION_BACKUP_SYSTEM_PROMPT,
//   RESPOND_TO_QUESTION_SYSTEM_PROMPT,
//   RESPOND_TO_RANDOM_MESSAGE_SYSTEM_PROMPT,
// } from "@/configuration/prompts";
// import {
//   RANDOM_RESPONSE_PROVIDER,
//   RANDOM_RESPONSE_MODEL,
//   HOSTILE_RESPONSE_PROVIDER,
//   HOSTILE_RESPONSE_MODEL,
//   QUESTION_RESPONSE_PROVIDER,
//   QUESTION_RESPONSE_MODEL,
//   HOSTILE_RESPONSE_TEMPERATURE,
//   QUESTION_RESPONSE_TEMPERATURE,
//   RANDOM_RESPONSE_TEMPERATURE,
// } from "@/configuration/models";


// // import { respondToResumeAnalysis } from '@/modules/resumeAnalysis';
// // import { analyzeResumeAgainstJob, extractKeywords } from '@/modules/resumeAnalysis';

// /**
//  * ResponseModule is responsible for collecting data and building a response
//  */
// export class ResponseModule {
//   // resume analysis response:
//   // static async respondToResumeAnalysisRequest(
//   //   jobDescription: string,
//   //   resumeText: string
//   // ): Promise<Response> {
//   //   const { analysis, followUpQuestions } = await respondToResumeAnalysis(jobDescription, resumeText);

//   //   return new Response(
//   //     JSON.stringify({ analysis, followUpQuestions }),
//   //     { headers: { "Content-Type": "application/json" } }
//   //   );
//   // }
//   static async respondToRandomMessage(
//     chat: Chat,
//     providers: AIProviders
//   ): Promise<Response> {
//     /**
//      * Respond to the user when they send a RANDOM message
//      */
//     const PROVIDER_NAME: ProviderName = RANDOM_RESPONSE_PROVIDER;
//     const MODEL_NAME: string = RANDOM_RESPONSE_MODEL;

//     const stream = new ReadableStream({
//       async start(controller) {
//         queueIndicator({
//           controller,
//           status: "Coming up with an answer",
//           icon: "thinking",
//         });
//         const systemPrompt = RESPOND_TO_RANDOM_MESSAGE_SYSTEM_PROMPT();
//         const mostRecentMessages: CoreMessage[] = await convertToCoreMessages(
//           stripMessagesOfCitations(chat.messages.slice(-HISTORY_CONTEXT_LENGTH))
//         );

//         const citations: Citation[] = [];
//         queueAssistantResponse({
//           controller,
//           providers,
//           providerName: PROVIDER_NAME,
//           messages: mostRecentMessages,
//           model_name: MODEL_NAME,
//           systemPrompt,
//           citations,
//           error_message: DEFAULT_RESPONSE_MESSAGE,
//           temperature: RANDOM_RESPONSE_TEMPERATURE,
//         });
//       },
//     });

//     return new Response(stream, {
//       headers: {
//         "Content-Type": "text/event-stream",
//         "Cache-Control": "no-cache",
//         Connection: "keep-alive",
//       },
//     });
//   }

//   static async respondToHostileMessage(
//     chat: Chat,
//     providers: AIProviders
//   ): Promise<Response> {
//     /**
//      * Respond to the user when they send a HOSTILE message
//      */
//     const PROVIDER_NAME: ProviderName = HOSTILE_RESPONSE_PROVIDER;
//     const MODEL_NAME: string = HOSTILE_RESPONSE_MODEL;

//     const stream = new ReadableStream({
//       async start(controller) {
//         queueIndicator({
//           controller,
//           status: "Coming up with an answer",
//           icon: "thinking",
//         });
//         const systemPrompt = RESPOND_TO_HOSTILE_MESSAGE_SYSTEM_PROMPT();
//         const citations: Citation[] = [];
//         queueAssistantResponse({
//           controller,
//           providers,
//           providerName: PROVIDER_NAME,
//           messages: [],
//           model_name: MODEL_NAME,
//           systemPrompt,
//           citations,
//           error_message: DEFAULT_RESPONSE_MESSAGE,
//           temperature: HOSTILE_RESPONSE_TEMPERATURE,
//         });
//       },
//     });

//     return new Response(stream, {
//       headers: {
//         "Content-Type": "text/event-stream",
//         "Cache-Control": "no-cache",
//         Connection: "keep-alive",
//       },
//     });
//   }

//   static async respondToQuestion(
//     chat: Chat,
//     providers: AIProviders,
//     index: any
//   ): Promise<Response> {
//     /**
//      * Respond to the user when they send a QUESTION
//      */
//     const PROVIDER_NAME: ProviderName = QUESTION_RESPONSE_PROVIDER;
//     const MODEL_NAME: string = QUESTION_RESPONSE_MODEL;

//     const stream = new ReadableStream({
//       async start(controller) {
//         queueIndicator({
//           controller,
//           status: "Figuring out what your answer looks like",
//           icon: "thinking",
//         });
//         try {
//           const hypotheticalData: string = await generateHypotheticalData(
//             chat,
//             providers.openai
//           );
//           const { embedding }: { embedding: number[] } =
//             await embedHypotheticalData(hypotheticalData, providers.openai);
//           queueIndicator({
//             controller,
//             status: "Reading through documents",
//             icon: "searching",
//           });
//           const chunks: Chunk[] = await searchForChunksUsingEmbedding(
//             embedding,
//             index
//           );
//           const sources: Source[] = await getSourcesFromChunks(chunks);
//           queueIndicator({
//             controller,
//             status: `Read over ${sources.length} documents`,
//             icon: "documents",
//           });
//           const citations: Citation[] = await getCitationsFromChunks(chunks);
//           const contextFromSources = await getContextFromSources(sources);
//           const systemPrompt =
//             RESPOND_TO_QUESTION_SYSTEM_PROMPT(contextFromSources);
//           queueIndicator({
//             controller,
//             status: "Coming up with an answer",
//             icon: "thinking",
//           });
//           queueAssistantResponse({
//             controller,
//             providers,
//             providerName: PROVIDER_NAME,
//             messages: stripMessagesOfCitations(
//               chat.messages.slice(-HISTORY_CONTEXT_LENGTH)
//             ),
//             model_name: MODEL_NAME,
//             systemPrompt,
//             citations,
//             error_message: DEFAULT_RESPONSE_MESSAGE,
//             temperature: QUESTION_RESPONSE_TEMPERATURE,
//           });
//         } catch (error: any) {
//           console.error("Error in respondToQuestion:", error);
//           queueError({
//             controller,
//             error_message: error.message ?? DEFAULT_RESPONSE_MESSAGE,
//           });
//           queueAssistantResponse({
//             controller,
//             providers,
//             providerName: PROVIDER_NAME,
//             messages: [],
//             model_name: MODEL_NAME,
//             systemPrompt: RESPOND_TO_QUESTION_BACKUP_SYSTEM_PROMPT(),
//             citations: [],
//             error_message: DEFAULT_RESPONSE_MESSAGE,
//             temperature: QUESTION_RESPONSE_TEMPERATURE,
//           });
//         }
//       },
//     });

//     return new Response(stream, {
//       headers: {
//         "Content-Type": "text/event-stream",
//         "Cache-Control": "no-cache",
//         Connection: "keep-alive",
//       },
//     });
//   }
// }

// // follow up question generator:
// export function generateFollowUpQuestions(analysis: any): string[] {
//   const questions: string[] = [];
  
//   if (analysis.missingKeywords.length > 0) {
//     questions.push("Can you elaborate on any experience you have related to these missing skills: " + analysis.missingKeywords.join(", ") + "?");
//   }
  
//   if (analysis.matchPercentage < 50) {
//     questions.push("Would you be open to gaining more experience in these areas to improve your fit for this role?");
//   }
  
//   if (analysis.matchPercentage >= 50 && analysis.matchPercentage < 80) {
//     questions.push("Your resume aligns fairly well with this role. Are there any additional projects or coursework you've completed that relate to the job requirements?");
//   }
  
//   return questions;
// }

