import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/user";
import { ChatPostSchema } from "@/validations/chat";
import { formatMessage } from "@/lib/utils";
import { decrementCredits } from "@/lib/server/decrement-credits";

import { AI_MODELS } from "@/lib/constants";
import { StreamingTextResponse, streamText, CoreMessage } from "ai";
import {
  createAnthropicProvider,
  createGroqProvider,
  createOpenAIProvider,
} from "@/lib/ai-sdk-providers";

// ensure no caching and latest data is always fetched and rendered. important as Chat route requires real-time update
export const dynamic = "force-dynamic";
// 'auto' | 'force-dynamic' | 'error' | 'force-static'

const SYS_TEMPLATE = `You are a helpful AI assistant. Be concise and always provide actionable responses.`;

/**
 * This handler initializes and calls a simple chain with a prompt,
 * chat model, and output parser. See the docs for more information:
 *
 * https://js.langchain.com/docs/guides/expression_language/cookbook#prompttemplate--llm--outputparser
 */
export const POST = async (req: NextRequest) => {
  try {
    const { user } = await getCurrentUser();

    if (!user) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // const openai = createOpenAIProvider(user.email || user.id);
    // const anthropic = createAnthropicProvider(user.email || user.id);
    const groq = createGroqProvider(user.email || user.id);

    const json = await req.json();
    const messages = ChatPostSchema.parse(json).messages as CoreMessage[];
    const formattedPreviousMessages = messages.slice(0, -1).map(formatMessage);
    const currentMessageContent = messages[messages.length - 1].content;

    const result = await streamText({
      // model: openai(AI_MODELS.OPENAI.GPT_4_O),
      // model: anthropic(AI_MODELS.ANTHROPIC.HAIKU),
      model: groq(AI_MODELS.GROQ.LLAMA3_70B),
      system: SYS_TEMPLATE, // system prompt
      messages: messages, // conversation history
      temperature: 0.7, // temperature
      //   maxTokens: 100, // max tokens
    });

    const stream = result.toAIStream();

    await decrementCredits(user.id);

    return new StreamingTextResponse(stream);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: error.status ?? 500 },
    );
  }
};
