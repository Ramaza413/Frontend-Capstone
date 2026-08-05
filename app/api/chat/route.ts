import { streamText, convertToModelMessages, UIMessage } from "ai";
import { AI_MODEL, AI_CONFIG, SYSTEM_PROMPT } from "@/lib/ai/config";

export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json();

  const result = streamText({
    model: AI_MODEL,
    system: SYSTEM_PROMPT,
    messages: await convertToModelMessages(messages), // ← await add kiya
    temperature: AI_CONFIG.temperature,
    maxOutputTokens: AI_CONFIG.maxTokens,
  });

  return result.toUIMessageStreamResponse();
}