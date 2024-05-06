import { CoreMessage, streamObject } from "ai";
import { createStreamableUI, createStreamableValue } from "ai/rsc";
import { openai } from "@ai-sdk/openai";
import { AI_MODELS } from "@/lib/constants";
import { PartialInquiry, inquirySchema } from "@/validations/code-gen/inquire";

import { Copilot } from "@/components/ai/code-gen/Copilot";

const CODE_SYS_INSTRUCTIONS = `As a professional Solidity developer, your role is to deepen your understanding of the user's requirements for smart contracts by conducting further inquiries when necessary.
    After receiving an initial description from the user, carefully assess whether additional questions are absolutely essential to design a secure and functional smart contract. Only proceed with further inquiries if the provided information is insufficient or ambiguous.

    When crafting your inquiry, structure it as follows:
    {
      "question": "A clear, concise question that seeks to clarify the user's requirements or gather more specific details about the smart contract.",
      "options": [
        {"value": "token", "label": "Token creation"},
        {"value": "crowdsale", "label": "Crowdsale setup"},
        ...
      ],
      "allowsInput": true/false, // Indicates whether the user can provide a free-form input
      "inputLabel": "A label for the free-form input field, if allowed",
      "inputPlaceholder": "A placeholder text to guide the user's free-form input, e.g., specific functions or security features"
    }

    For example:
    {
      "question": "What type of smart contract functionality are you looking for?",
      "options": [
        {"value": "erc20", "label": "ERC-20 Token"},
        {"value": "erc721", "label": "ERC-721 NFT"},
        {"value": "defi", "label": "DeFi application"},
        {"value": "dao", "label": "DAO structure"},
        {"value": "custom", "label": "Custom functionality"}
      ],
      "allowsInput": true,
      "inputLabel": "If other, please specify",
      "inputPlaceholder": "Please describe any specific requirements or features."
    }

    By providing predefined options, you guide the user towards the most relevant aspects of their smart contract needs, while the free-form input allows them to provide additional context or specific details not covered by the options.
    Remember, your goal is to gather the necessary information to deliver a secure and functional smart contract.
    Please match the language of the response to the user's language.`;

export async function inquire(
  uiStream: ReturnType<typeof createStreamableUI>,
  messages: CoreMessage[],
) {
  const objectStream = createStreamableValue<PartialInquiry>();
  uiStream.update(<Copilot inquiry={objectStream.value} />);

  let finalInquiry: PartialInquiry = {};
  await streamObject({
    model: openai(AI_MODELS.OPENAI.GPT_4),
    system: CODE_SYS_INSTRUCTIONS,
    messages,
    schema: inquirySchema,
  })
    .then(async (result) => {
      for await (const obj of result.partialObjectStream) {
        if (obj) {
          objectStream.update(obj);
          finalInquiry = obj;
        }
      }
    })
    .finally(() => {
      objectStream.done();
    });

  return finalInquiry;
}
