import { AI_MODELS } from "@/lib/constants";
import { ChatGroq } from "@langchain/groq";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { RunnableSequence } from "@langchain/core/runnables";
import { StringOutputParser } from "@langchain/core/output_parsers";

export const generateTitle = async (message: string) => {
  const SYS_TEMPLATE = `You are an expert at creating titles. You will be given a message from a human user. Using that message, create a title for it that is 10 words or less. The title should be descriptive and concise.`;

  const prompt = ChatPromptTemplate.fromMessages([
    ["system", SYS_TEMPLATE],
    ["human", "{input}"],
  ]);

  const model = new ChatGroq({
    model: AI_MODELS.GROQ.LLAMA3_8B,
    temperature: 0.3, // we want the title to be somewhat the same with the same inputs
  });

  const outputParser = new StringOutputParser();

  const chain = RunnableSequence.from([prompt, model, outputParser]);

  const title = await chain.invoke({ input: message });
  const formattedTitle = title.replace(/"/g, ""); // remove quotes from the title

  return formattedTitle;
};
