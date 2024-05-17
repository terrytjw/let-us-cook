import "server-only";

import { ReactNode } from "react";
import {
  createAI,
  createStreamableValue,
  getMutableAIState,
  streamUI,
} from "ai/rsc";
import { openai } from "@ai-sdk/openai";
import * as Langtrace from "@langtrase/typescript-sdk";
import { AI_MODELS } from "../constants";
import { z } from "zod";
import { getCurrentUser } from "../user";
import { decrementCredits } from "../server/decrement-credits";
import { nanoid } from "@/lib/utils";
import { Message } from "@/types";

import FlightInfoCard from "@/components/ai/gen-ui/FlightInfoCard";
import BookingSuccessfulCard from "@/components/ai/gen-ui/BookingSuccessfulCard";
import {
  BotCard,
  BotMessage,
  SpinnerMessage,
} from "@/components/ai/gen-ui/GenUIMessage";

Langtrace.init({
  api_key: process.env.LANGTRACE_API_KEY || "",
});

const SYS_INSTRUCTIONS = `
You are a helpful flight assistant on a flight app that talks to users like a friend. You are always concise. You are equipped with the necessary tools to help you with flight related queries and tasks. 

If the user did not ask a question or instruct you to perform a task, list the things you can help them with in organized bullet points and markdown format. You currently have these functionalities:
- Getting flight information: Retrieve your flight details
- Booking a flight: Book flight with flight number and passenger name

There will be more things you can help with in the future once more features are released.

If the user requests to book a flight, ask for his/her desired flight number and passenger name. Then, attempt to book the flight using the provided details. 
If the user provides the required information without you asking, process the booking rightaway. If the booking is successful, return the booking details to the user. If the booking fails, return an error message to the user. 
If the user talks about something else other than booking a flight, gently remind the user that you are a flight assistant and can only help with flight related queries.
`;

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

async function submitUserMessage(userInput: string) {
  "use server";

  const { user } = await getCurrentUser();

  if (!user) {
    throw new Error("User not found");
  }

  const aiState = getMutableAIState();

  // update the AI state with the new user message.
  aiState.update([
    // get a mutable copy of the current AI state - it's either nothing (because it is the start of the conversation) or an array of messages (previous conversation history)
    ...aiState.get(),
    // append the user message to the AI state
    {
      id: nanoid(),
      role: "user",
      content: userInput,
    },
  ]);

  let textStream: undefined | ReturnType<typeof createStreamableValue<string>>;
  let textNode: undefined | React.ReactNode;

  // define the tools that the AI can use to perform specific tasks
  // see https://sdk.vercel.ai/docs/reference/ai-sdk-rsc/stream-ui#tools
  const flightTools = {
    // ---- start tool #1 ----
    get_flight_info: {
      description: "Get the information for a flight",
      parameters: z
        .object({
          flightNumber: z.string().describe("the number of the flight"),
        })
        .required(),
      generate: async function* ({ flightNumber }: { flightNumber: string }) {
        // flightNumber comes from the user input, the AI model is basically calling this function with the user input

        // Show a spinner on the client while we wait for the response.
        yield (
          <div className="text-muted-foreground">
            <SpinnerMessage message="Loading flight information..." />
          </div>
        );

        // Fetch the flight information from an external API.
        const flightInfo = await getFlightInfo(flightNumber);

        const toolCallId = nanoid();

        // Update the final AI state.
        // must call .done() when you're finished updating the AI state. This "seals" the AI state and marks it ready to be synced with the client as well as external storage
        aiState.done((messages: Message[]) => [
          ...messages,
          {
            id: nanoid(),
            role: "assistant",
            // content is for providing context to the llm in the rest of the conversation, different roles have different content format
            content: [
              {
                type: "tool-call",
                toolName: "get_flight_info",
                toolCallId,
                args: { flightNumber },
              },
            ],
          },
          {
            id: nanoid(),
            role: "tool",
            content: [
              {
                type: "tool-result",
                toolName: "get_flight_info",
                toolCallId,
                result: flightInfo,
              },
            ],
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
    // ---- start tool #2 ----
    book_flight_successful: {
      description:
        "Get the booking details for a flight after the flight assistant makes a successful booking",
      parameters: z
        .object({
          flightNumber: z
            .string()
            .describe("the number of the flight that was booked"),
          passengerName: z.string().describe("name of the passenger"),
        })
        .required(),
      generate: async function* ({
        flightNumber,
        passengerName,
      }: {
        flightNumber: string;
        passengerName: string;
      }) {
        // show a spinner on the client while we wait for the booking process.
        yield (
          <div className="text-muted-foreground">
            <SpinnerMessage message="Searching flight... please wait." />
          </div>
        );

        // simulate a delay of 2 seconds to mimic a search flight API call
        // can replace with a real API call
        await new Promise((resolve) => setTimeout(resolve, 2000));

        yield (
          <div className="text-muted-foreground">
            <SpinnerMessage message="Booking flight..." />
          </div>
        );

        // attempt to book the flight using the provided details.
        const bookingResult = await bookFlight(flightNumber, passengerName);

        const toolCallId = nanoid();

        // update the final ai state with the booking result.
        aiState.done((messages: AIState) => [
          ...messages,
          {
            id: nanoid(),
            role: "assistant",
            // content: JSON.stringify(bookingResult),
            content: [
              {
                type: "tool-call",
                toolName: "book_flight_successful",
                toolCallId,
                args: { flightNumber, passengerName },
              },
            ],
          },
          {
            id: nanoid(),
            role: "tool",
            content: [
              {
                type: "tool-result",
                toolName: "book_flight_successful",
                toolCallId,
                result: bookingResult,
              },
            ],
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

  // stream UI to the client
  const ui = await streamUI({
    model: openai(AI_MODELS.OPENAI.GPT_4_O), // GPT_3 is not very accurate at invoking the right tools
    temperature: 0.2, // we want the flight assistant's responses to be somewhat the same for similar user input
    initial: <SpinnerMessage message="" />,
    system: SYS_INSTRUCTIONS,
    messages: [...aiState.get(), { role: "user", content: userInput }],
    // `tools` is an object that defines a set of functions that can be called by the AI model to perform specific tasks
    tools: flightTools,
    // `text` is called when an AI returns a text response instead of using a tool e.g. `get_flight_info`
    // the content is streamed from the LLM, so this `text` function will be called multiple times with `content` being incremental.
    text: ({ content, done, delta }) => {
      if (!textStream) {
        textStream = createStreamableValue("");
        textNode = <BotMessage content={textStream.value} />;
      }

      if (done) {
        textStream.done();

        aiState.done((messages: AIState) => [
          ...messages,
          { id: nanoid(), role: "assistant", content },
        ]);
      } else {
        textStream.update(delta);
      }

      return textNode;
    },
  });

  await decrementCredits(user.id);

  return {
    id: nanoid(),
    display: ui.value,
  };
}

// The AI state can be any JSON object. Here, we define the AI state as an array of messages, where each message is an object with a role, content, id, and optional name.
type AIState = Message[];

// The state of UI that the client will keep track of, which contains the message IDs and their UI nodes.
type UIState = {
  id: string;
  display: ReactNode;
}[];

// AI is a provider you wrap your application with so you can access AI and UI state in your components.
export const AI = createAI<AIState, UIState>({
  // actions are the functions that the AI can call
  actions: {
    submitUserMessage,
  },
  // Each state can be any shape of object, but for chat applications
  // it makes sense to have an array of messages. Or you may prefer something like { id: number, messages: Message[] }
  initialUIState: [] as UIState,
  initialAIState: [] as AIState,
});
