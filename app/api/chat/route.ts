import { NextRequest, NextResponse } from "next/server";
import { StreamingTextResponse } from "ai";
import { AI_MODELS } from "@/lib/constants";
import { formatMessage } from "@/lib/utils";

// Chat Models
import { ChatAnthropic } from "@langchain/anthropic";
import { ChatGroq } from "@langchain/groq";
import { ChatOllama } from "@langchain/community/chat_models/ollama";
import { ChatOpenAI } from "@langchain/openai";
import { ChatTogetherAI } from "@langchain/community/chat_models/togetherai";

// LangChain
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { RunnableSequence } from "@langchain/core/runnables";
import { HttpResponseOutputParser } from "langchain/output_parsers";

export const runtime = "edge";

const SYS_TEMPLATE = `You are a helpful AI assistant. All responses must be concise and provide actionable steps.

Current conversation:
{chat_history}
`;

/**
 * This handler initializes and calls a simple chain with a prompt,
 * chat model, and output parser. See the docs for more information:
 *
 * https://js.langchain.com/docs/guides/expression_language/cookbook#prompttemplate--llm--outputparser
 */
export const POST = async (req: NextRequest) => {
  try {
    const body = await req.json();
    const messages = body.messages ?? [];
    const formattedPreviousMessages = messages.slice(0, -1).map(formatMessage);
    const currentMessageContent = messages[messages.length - 1].content;

    const prompt = ChatPromptTemplate.fromMessages([
      ["system", SYS_TEMPLATE],
      ["human", "{input}"],
    ]);

    /**
     * See a full list of supported models at:
     * https://js.langchain.com/docs/modules/model_io/models/
     */

    // Anthropic
    // const model = new ChatAnthropic({
    //   model: AI_MODELS.ANTHROPIC.HAIKU,
    //   temperature: 0.8,
    // });

    // Groq
    // const model = new ChatGroq({
    //   model: AI_MODELS.GROQ.MIXTRAL_8X7B,
    //   temperature: 0.8,
    // });

    // Ollama (local)
    const model = new ChatOllama({
      baseUrl: "http://localhost:11434", // default port for Ollama running on your local machine
      model: "llama3:latest", // string has to match the model you are running on your local Ollama
    });

    // OpenAI
    // const model = new ChatOpenAI({
    //   model: AI_MODELS.OPENAI.GPT_3,
    //   temperature: 0.8,
    // });

    // TogetherAI (currently buggy, do not use)
    // const model = new ChatTogetherAI({
    // model: "mistralai/Mixtral-8x22B-Instruct-v0.1",
    //   temperature: 0.8,
    // });

    const outputParser = new HttpResponseOutputParser();

    const chain = RunnableSequence.from([prompt, model, outputParser]);

    const stream = await chain.stream({
      chat_history: formattedPreviousMessages.join("\n"),
      input: currentMessageContent,
    });

    return new StreamingTextResponse(stream);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: error.status ?? 500 },
    );
  }
};
