import { streamText, convertToModelMessages, UIMessage, stepCountIs } from "ai";
import { AI_MODEL, AI_CONFIG, SYSTEM_PROMPT } from "@/lib/ai/config";
import { queryMetricTool } from "@/lib/ai/tools";

export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json();

  const result = streamText({
    model: AI_MODEL,
    system: SYSTEM_PROMPT,
    messages: await convertToModelMessages(messages),
    temperature: AI_CONFIG.temperature,
    maxOutputTokens: AI_CONFIG.maxTokens,
    tools: {
      queryMetric: queryMetricTool,
    },
    // Allow the model to call the tool, then generate a follow-up
    // text response using the tool's output (max 3 steps total).
    stopWhen: stepCountIs(3),
  });

  return result.toUIMessageStreamResponse();
}