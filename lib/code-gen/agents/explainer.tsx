import { createStreamableUI, createStreamableValue } from "ai/rsc";
import { CoreMessage, streamText } from "ai";
import { createOpenAI, openai } from "@ai-sdk/openai";
import { anthropic } from "@ai-sdk/anthropic";
import { AI_MODELS } from "@/lib/constants";

import Section from "@/components/ai/code-gen/Section";
import BotMessage from "@/components/ai/code-gen/Message";
import Spinner from "@/components/Spinner";

const groq = createOpenAI({
  baseURL: "https://api.groq.com/openai/v1",
  apiKey: process.env.GROQ_API_KEY || "",
});

export const explainer = async (
  uiStream: ReturnType<typeof createStreamableUI>,
  explanationStream: ReturnType<typeof createStreamableValue>,
  messages: CoreMessage[],
  code: string,
) => {
  const CODE_SYS_INSTRUCTIONS = `
    You are a senior Solidity smart contract developer. Given the conversation history and the most recent smart contract code, you will explain the code to the user in a concise but comprehensive manner.
    
    Here is the code you will explain:
    ${code}
    `;

  let fullExplanation = "";
  let hasExplanationError = false;
  const explanationSection = (
    <Section title="Explanation">
      <BotMessage content={explanationStream.value} size="sm" />
    </Section>
  );

  const result = await streamText({
    model: openai(AI_MODELS.OPENAI.GPT_4_O),
    // model: anthropic(AI_MODELS.ANTHROPIC.HAIKU),
    // model: groq(AI_MODELS.GROQ.LLAMA3_70B),
    system: CODE_SYS_INSTRUCTIONS,
    messages,
    temperature: 0.2,
  });

  for await (const delta of result.fullStream) {
    switch (delta.type) {
      case "text-delta":
        if (delta.textDelta) {
          // If the first text delta is available, add a ui section
          if (fullExplanation.length === 0 && delta.textDelta.length > 0) {
            // Updates the current UI node. It takes a new UI node and replaces the old one.
            uiStream.update(explanationSection);

            uiStream.append(
              <div className="mt-2 flex justify-end">
                <Spinner message="Generating explanation..." />
              </div>,
            );
          }

          fullExplanation += delta.textDelta;
          explanationStream.update(fullExplanation);
        }
        break;

      case "error":
        hasExplanationError = true;
        fullExplanation += `\nError occurred while executing the tool`;
        break;
    }
  }

  uiStream.update(null);

  messages.push({
    role: "assistant",
    content: [{ type: "text", text: fullExplanation }],
  });

  return { fullExplanation, hasExplanationError };
};
