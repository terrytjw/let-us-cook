import { CoreMessage, generateObject } from "ai";
import { openai } from "@ai-sdk/openai";
import { nextActionSchema } from "@/validations/code-gen/next-action";
import { AI_MODELS } from "@/lib/constants";

const CODE_SYS_INSTRUCTIONS = `As a professional Solidity developer, your primary objective is to understand the user's requirements for a blockchain application, design secure and efficient smart contracts, and provide a well-documented codebase.
    To achieve this, you must first analyze the user's input and determine the optimal course of action. You have two options at your disposal:
    1. "proceed": If the provided information is clear and detailed enough to start coding the smart contract directly, choose this option to proceed with the development and implementation.
    2. "inquire": If you believe that additional information from the user would enhance your ability to deliver a robust and functional smart contract, select this option. You may present a form to the user, offering default selections or free-form input fields, to gather the required details about the contract's purpose, functions, and security considerations.
    Your decision should be based on a careful assessment of the context and the potential for further information to improve the quality, security, and functionality of the smart contract.
    For example, if the user asks, "Can you create a token smart contract based on ERC-20 standard?", you may choose to "proceed" as the query is specific and follows a well-known standard.
    However, if the user says, "Build me a Web3 OnlyFans.", you may opt to "inquire" and present a form asking about their application's purpose, expected user interactions, and any specific compliance or security features needed.
    Make your choice wisely to ensure that you fulfill your mission as a Solidity developer effectively and deliver the most valuable and secure smart contracts to the user.
    `;

// Decide whether inquiry is required for the user input
export const requirementsManager = async (messages: CoreMessage[]) => {
  try {
    const result = await generateObject({
      model: openai(AI_MODELS.OPENAI.GPT_4),
      system: CODE_SYS_INSTRUCTIONS,
      messages,
      schema: nextActionSchema,
    });

    return result;
  } catch (error) {
    console.error(error);
    return null;
  }
};
