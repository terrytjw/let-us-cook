import { ReactNode } from "react";
import {
  createAI,
  createStreamableValue,
  getMutableAIState,
  render,
} from "ai/rsc";
// import { experimental_streamUI } from "ai";
import { OpenAI } from "openai";
import { AI_MODELS } from "../constants";
import { z } from "zod";
import { nanoid } from "@/lib/utils";

import FlightInfoCard from "@/components/ai/gen-ui/FlightInfoCard";
import BookingSuccessfulCard from "@/components/ai/gen-ui/BookingSuccessfulCard";
import {
  BotCard,
  BotMessage,
  SpinnerMessage,
} from "@/components/ai/gen-ui/GenUIMessage";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || "",
});

const SYS_INSTRUCTIONS = `You are a helpful flight assistant that talks to users like a friend. You are always concise. You are equipped with the necessary tools to help you with flight related queries and tasks. If the user seems like he/she has no idea what you can help them with, list the things you can help them with. If the user requests to book a flight, ask for his/her desired flight number and passenger name. Then, attempt to book the flight using the provided details. If the user provides the required information without you asking, process the booking rightaway. If the booking is successful, return the booking details to the user. If the booking fails, return an error message to the user. If the user talks about something else other than booking a flight, gently remind the user that you are a flight assistant and can only help with flight related queries. When listing things, always do so in organized bullet points.`;

// An example of a function that fetches flight information from an external API.
async function getFlightInfo(flightNumber: string) {
  // simulate a delay of 3 seconds to mimic an API call
  await new Promise((resolve) => setTimeout(resolve, 3000));

  // check if the flight number starts with an alphabet
  if (isNaN(parseInt(flightNumber[0]))) {
    return {
      flightNumber,
      departureTime: "12:30",
      departure: "Singapore (SIN)",
      arrival: "Dubai (DXB)",
    };
  } else {
    // if the flight number starts with a number, use the current flight info
    return {
      flightNumber,
      departureTime: "16:45",
      departure: "New York (JFK)",
      arrival: "San Francisco (SFO)",
    };
  }
}

// function to book a flight based on user input with specific parameters
async function bookFlight(flightNumber: string, passengerName: string) {
  // simulate a delay of 2 seconds to mimic an API call
  await new Promise((resolve) => setTimeout(resolve, 3000));

  // assume the booking is successful and return the details
  return {
    flightNumber: flightNumber,
    passengerName: passengerName,
    isSuccess: true,
    error: null,
    bookingReference: "Q7GX62HMS43",
  };
}

type SubmitUserMessageReturn = {
  id: number;
  display: React.ReactNode;
};
async function submitUserMessage(
  userInput: string,
): Promise<SubmitUserMessageReturn> {
  "use server";

  const aiState = getMutableAIState<typeof AI>();

  // update the AI state with the new user message.
  aiState.update([
    // get a mutable copy of the current AI state - it's either nothing (because it is the start of the conversation) or an array of messages (previous conversation history)
    ...aiState.get(),
    // append the user message to the AI state
    {
      role: "user",
      content: userInput,
    },
  ]);

  let textStream: undefined | ReturnType<typeof createStreamableValue<string>>;
  let textNode: undefined | React.ReactNode;

  const flightTools = {
    get_flight_info: {
      description: "Get the information for a flight",
      // `parameters` is a zod schema that defines the expected input for the tool.
      parameters: z
        .object({
          flightNumber: z.string().describe("the number of the flight"),
        })
        .required(),
      render: async function* ({ flightNumber }: { flightNumber: string }) {
        // Show a spinner on the client while we wait for the response.
        yield <SpinnerMessage message="Loading flight information..." />;

        // Fetch the flight information from an external API.
        const flightInfo = await getFlightInfo(flightNumber);

        // Update the final AI state.
        // must call .done() when you're finished updating the AI state. This "seals" the AI state and marks it ready to be synced with the client as well as external storage
        aiState.done([
          ...aiState.get(),
          {
            role: "function",
            name: "get_flight_info",
            // Content can be any string to provide context to the LLM in the rest of the conversation.
            content: JSON.stringify(flightInfo),
          },
        ]);

        // Return the flight card (final UI component) to the client.
        return (
          <BotCard>
            <FlightInfoCard flightInfo={flightInfo} />
          </BotCard>
        );
      },
    },
    book_flight_successful: {
      description:
        "Get the booking details for a flight after the flight assistant makes a successful booking",
      // `parameters` is a zod schema that defines the expected input for the tool.
      parameters: z
        .object({
          flightNumber: z
            .string()
            .describe("the number of the flight that was booked"),
          passengerName: z.string().describe("name of the passenger"),
        })
        .required(),
      render: async function* ({
        flightNumber,
        passengerName,
      }: {
        flightNumber: string;
        passengerName: string;
      }) {
        // show a spinner on the client while we wait for the booking process.
        yield <SpinnerMessage message="Searching flight... please wait." />;

        // simulate a delay of 2 seconds to mimic a search flight API call
        // can replace with a real API call
        await new Promise((resolve) => setTimeout(resolve, 2000));

        yield <SpinnerMessage message="Booking flight..." />;

        // attempt to book the flight using the provided details.
        const bookingResult = await bookFlight(flightNumber, passengerName);

        // update the final ai state with the booking result.
        aiState.done([
          ...aiState.get(),
          {
            role: "function",
            name: "book_flight",
            // content can be any string to provide context to the llm in the rest of the conversation.
            content: JSON.stringify(bookingResult),
          },
        ]);

        const {
          flightNumber: bookedFlightNumber,
          passengerName: bookedPassengerName,
          isSuccess,
          bookingReference,
          error,
        } = bookingResult;

        // return a confirmation message or error message based on the booking result.
        if (isSuccess) {
          return (
            <BotCard>
              <p className="mb-2">
                Flight successfully booked! Take a look at the confirmed details
                below.
              </p>
              <BookingSuccessfulCard
                flightNumber={bookedFlightNumber}
                passengerName={bookedPassengerName}
                bookingReference={bookingReference}
              />
            </BotCard>
          );
        } else {
          return (
            <BotCard>
              <h1 className="mb-2">Booking Error:</h1>
              <p>
                Failed to book flight {flightNumber} for {passengerName}.
              </p>
              <p>Error: {error}</p>
            </BotCard>
          );
        }
      },
    },
  };

  // `render()` creates a generated, streamable UI.
  // TODO: `render()` is deprecated, replace to experimental_streamUI when the new docs (https://sdk.vercel.ai/docs/ai-core) are ready
  const ui = render({
    model: AI_MODELS.OPENAI.GPT_4, // GPT_3 is not very accurate at invoking the right tools
    provider: openai,
    initial: <SpinnerMessage message="Assistant is thinking..." />,
    messages: [
      {
        role: "system",
        content: SYS_INSTRUCTIONS,
      },
      // @ts-ignore
      ...aiState.get(),
    ],
    // `text` is called when an AI returns a text response instead of using a tool e.g. `get_flight_info`
    // the content is streamed from the LLM, so this `text` function will be called multiple times with `content` being incremental.
    text: ({ content, done, delta }) => {
      if (!textStream) {
        textStream = createStreamableValue("");
        textNode = <BotMessage content={textStream.value} />;
      }

      if (done) {
        textStream.done();
        aiState.done([
          ...aiState.get(),
          {
            id: nanoid(),
            role: "assistant",
            content,
          },
        ]);
      } else {
        textStream.update(delta);
      }

      return textNode;
    },

    // `tools` is an object that defines a set of functions that can be called by the AI model to perform specific tasks
    tools: flightTools,
  });

  return {
    id: Date.now(),
    display: ui,
  };
}

// Define the initial state of the AI. It can be any JSON object.
const initialAIState: {
  role: "user" | "assistant" | "system" | "function";
  content: string;
  id?: string;
  name?: string;
}[] = [];

// The initial UI state that the client will keep track of, which contains the message IDs and their UI nodes.
const initialUIState: {
  id: number;
  display: ReactNode;
}[] = [];

// AI is a provider you wrap your application with so you can access AI and UI state in your components.
export const AI = createAI({
  // actions are the functions that the AI can call
  actions: {
    submitUserMessage,
  },
  // Each state can be any shape of object, but for chat applications
  // it makes sense to have an array of messages. Or you may prefer something like { id: number, messages: Message[] }
  initialUIState,
  initialAIState,
});
