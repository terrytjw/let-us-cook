import { createStreamableUI, createStreamableValue } from "ai/rsc";
import { CoreMessage, streamObject } from "ai";
import { openai } from "@ai-sdk/openai";
import {
  PartialSuggestions,
  suggestionsSchema,
} from "@/validations/code-gen/suggestions";

import { Section } from "@/components/ai/code-gen/Section";
import BuildSuggestion from "@/components/ai/code-gen/BuildSuggestion";
import { AI_MODELS } from "@/lib/constants";

const CODE_SYS_INSTRUCTIONS = `As a professional Solidity developer, your task is to generate a set of three suggestions that enhance the solidity contract code, building upon the initial code review and the insights uncovered during the analysis.

    For instance, if the initial review highlighted issues with gas optimization in a token contract, your output should follow this format:

    "{
      "improvements": [
        {"label": "Optimize gas", "prompt": "Optimize the loop in the transfer function to reduce gas cost by minimizing state variable writes."},
        {"label": "Prevent reentrancy attacks", "prompt": "Implement checks-effects-interactions pattern to prevent reentrancy attacks."},
        {"label": "Reduce deployment and transaction costs", "prompt": "Refactor the contract to use library contracts for common functions to reduce deployment and transaction costs."}
      ]
    }"

    Aim to create suggestions that progressively delve into more specific aspects of security, efficiency, or maintainability related to the initial code. The goal is to anticipate the developer's potential needs for contract improvement and guide them towards a more robust and optimized smart contract.
    Please match the language of the response to the user's language.`;

export async function aiSuggestor(
  uiStream: ReturnType<typeof createStreamableUI>,
  messages: CoreMessage[],
) {
  const objectStream = createStreamableValue<PartialSuggestions>();
  uiStream.append(
    <Section title="AI Suggestions" separator={true}>
      <BuildSuggestion aiSuggestions={objectStream.value} />
    </Section>,
  );

  await streamObject({
    model: openai(AI_MODELS.OPENAI.GPT_4),
    system: CODE_SYS_INSTRUCTIONS,
    messages,
    schema: suggestionsSchema,
  })
    .then(async (result) => {
      for await (const obj of result.partialObjectStream) {
        objectStream.update(obj);
      }
    })
    .finally(() => {
      objectStream.done();
    });
}
