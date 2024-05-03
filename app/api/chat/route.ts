import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/user";
import { AI_MODELS } from "@/lib/constants";
import { ChatPostSchema } from "@/validations/chat";
import { formatMessage } from "@/lib/utils";

import { StreamingTextResponse, streamText, CoreMessage } from "ai";
import { openai } from "@ai-sdk/openai";
import { anthropic } from "@ai-sdk/anthropic";

export const runtime = "edge";

const SYS_TEMPLATE = `You are a helpful AI assistant. All responses must be concise.
`;

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

    const json = await req.json();
    const messages = ChatPostSchema.parse(json).messages as CoreMessage[];
    const formattedPreviousMessages = messages.slice(0, -1).map(formatMessage);
    const currentMessageContent = messages[messages.length - 1].content;

    const result = await streamText({
      //   model: openai(AI_MODELS.OPENAI.GPT_4),
      model: anthropic(AI_MODELS.ANTHROPIC.HAIKU),
      system: SYS_TEMPLATE, // system prompt
      messages: messages, // conversation history
      temperature: 0.7, // temperature
      //   maxTokens: 100, // max tokens
    });

    const stream = result.toAIStream();

    return new StreamingTextResponse(stream);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: error.status ?? 500 },
    );
  }
};
