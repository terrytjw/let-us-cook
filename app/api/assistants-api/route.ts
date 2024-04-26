import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/user";
import OpenAI from "openai";
import { AssistantResponse } from "ai";
import { AssistantPostSchema } from "@/validations/assistant";

export const dynamic = "force-dynamic"; // recommended by the Vercel team, see https://github.com/vercel/ai/blob/main/examples/next-openai/app/api/assistant/route.ts

const openai = new OpenAI();

const homeTemperatures = {
  bedroom: 20,
  "home office": 21,
  "living room": 21,
  kitchen: 42,
  bathroom: 69,
};

const tools = [
  { type: "code_interpreter" },
  { type: "file_search" },
  {
    type: "function",
    function: {
      name: "getRoomTemperature",
      description: "Get the temperature in a room",
      parameters: {
        type: "object",
        properties: {
          room: {
            type: "string",
            enum: [
              "bedroom",
              "home office",
              "living room",
              "kitchen",
              "bathroom",
            ],
          },
          unit: {
            type: "string",
            enum: ["Celsius", "Fahrenheit"],
            description:
              "The temperature unit to use. Infer this from the user's location.",
          },
        },
        required: ["room", "unit"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "setRoomTemperature",
      description: "Set the temperature in a room",
      parameters: {
        type: "object",
        properties: {
          room: {
            type: "string",
            enum: [
              "bedroom",
              "home office",
              "living room",
              "kitchen",
              "bathroom",
            ],
          },
          temperature: { type: "number" },
        },
        required: ["room", "temperature"],
      },
    },
  },
];

const toolcalls = [
  {
    id: "call_mlpWGFEKlYZ6O8o0K9ZwPDt1",
    type: "function",
    function: {
      name: "setRoomTemperature",
      arguments: '{"room":"kitchen","temperature":25.56}',
    },
  },
];

export const POST = async (req: NextRequest) => {
  try {
    const { user } = await getCurrentUser();

    if (!user) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const json = await req.json();
    const { threadId, message } = AssistantPostSchema.parse(json);

    const retrievedThread = await openai.beta.threads.retrieve(threadId);

    // Add a message to the thread
    const createdMessage = await openai.beta.threads.messages.create(threadId, {
      role: "user",
      content: message,
    });

    return AssistantResponse(
      { threadId, messageId: createdMessage.id },
      async ({ forwardStream, sendDataMessage }) => {
        // Run the assistant on the thread
        const runStream = openai.beta.threads.runs.stream(threadId, {
          assistant_id:
            process.env.ASSISTANT_ID ??
            (() => {
              throw new Error("ASSISTANT_ID is not set");
            })(),
        });

        // Forwards the assistant response stream to the client.
        // Returns the Run object after it completes, or when it requires an action.
        let runResult = await forwardStream(runStream);

        // status can be: queued, in_progress, requires_action, cancelling, cancelled, failed, completed, or expired
        while (
          runResult?.status === "requires_action" &&
          runResult.required_action?.type === "submit_tool_outputs"
        ) {
          const tool_outputs =
            runResult.required_action.submit_tool_outputs.tool_calls.map(
              (toolCall: any) => {
                const parameters = JSON.parse(toolCall.function.arguments);

                switch (toolCall.function.name) {
                  case "getRoomTemperature": {
                    const temperature =
                      homeTemperatures[
                        parameters.room as keyof typeof homeTemperatures
                      ];

                    sendDataMessage({
                      role: "data",
                      data: {
                        description: `Getting temperature...`,
                      },
                    });

                    return {
                      tool_call_id: toolCall.id,
                      output: temperature.toString(),
                    };
                  }

                  case "setRoomTemperature": {
                    const oldTemperature =
                      homeTemperatures[
                        parameters.room as keyof typeof homeTemperatures
                      ];

                    homeTemperatures[
                      parameters.room as keyof typeof homeTemperatures
                    ] = parameters.temperature;

                    sendDataMessage({
                      role: "data",
                      data: {
                        oldTemperature,
                        newTemperature: parameters.temperature,
                        description: `Temperature in ${parameters.room} changed from ${oldTemperature} to ${parameters.temperature}`,
                      },
                    });

                    return {
                      tool_call_id: toolCall.id,
                      output: `temperature set successfully`,
                    };
                  }

                  default:
                    throw new Error(
                      `Unknown tool call function: ${toolCall.function.name}`,
                    );
                }
              },
            );

          runResult = await forwardStream(
            openai.beta.threads.runs.submitToolOutputsStream(
              threadId,
              runResult.id,
              { tool_outputs },
            ),
          );
        }
      },
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
};
