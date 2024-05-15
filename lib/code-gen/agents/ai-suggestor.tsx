import { createStreamableUI, createStreamableValue } from "ai/rsc";
import { CoreMessage, streamObject } from "ai";
import { openai } from "@ai-sdk/openai";
import {
  PartialSuggestions,
  suggestionsSchema,
} from "@/validations/code-gen/suggestions";
import { AI_MODELS } from "@/lib/constants";

import Section from "@/components/ai/code-gen/Section";
import BuildSuggestion from "@/components/ai/code-gen/BuildSuggestion";
import Spinner from "@/components/Spinner";

const CODE_SYS_INSTRUCTIONS = `As a professional Solidity developer, your task is to generate as many suggestions as possible that either enhance the solidity contract code or add new features. The suggestions provided should build upon the existing code, the user's input, and your own insights on what the user might need.

    For example, your output should follow this format:
    "{
      "items": [
        {"label": "Optimize gas", "prompt": "Optimize the loop in the transfer function to reduce gas cost by minimizing state variable writes."},
        {"label": "Prevent reentrancy attacks", "prompt": "Implement checks-effects-interactions pattern to prevent reentrancy attacks."},
        {"label": "Reduce transaction costs", "prompt": "Refactor the contract to use library contracts for common functions to reduce transaction costs."},
        {"label": "Implement example feature", "prompt": "Implement a cool feature that is not present in the contract."}
      ]
    }"

    Ensure that all labels have maximum 3 words and prompts are concise and to the point.

    Aim to create suggestions that progressively improve the contract's security and enhances the contract's features. The goal is to anticipate the developer's potential needs for contract improvement and guide them towards a more robust and feature-rich smart contract.
    Take into account the user's request for any code changes and the code being generated previously to ensure that your suggestions provided are not a repeat of what has already been implemented in the existing code.
    `;

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
  uiStream.append(
    <div className="mt-2 flex justify-end">
      <Spinner message="Generating suggestions..." />
    </div>,
  );

  await streamObject({
    model: openai(AI_MODELS.OPENAI.GPT_4_O),
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
      uiStream.update(null);
      objectStream.done();
    });
}
