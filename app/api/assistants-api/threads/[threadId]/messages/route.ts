// api/assistants-api/threads/[threadId]/messages

import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/user";
import OpenAI from "openai";

import { z } from "zod";

export const runtime = "edge";

const openai = new OpenAI();

const RouteContextSchema = z.object({
  params: z.object({
    threadId: z.string(),
  }),
});
export const GET = async (
  req: Request,
  context: z.infer<typeof RouteContextSchema>,
) => {
  try {
    const { user } = await getCurrentUser();

    if (!user) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { params } = RouteContextSchema.parse(context);
    const { threadId } = params;

    const messages = (await openai.beta.threads.messages.list(threadId)).data
      .map((msg) => {
        return {
          id: msg.id,
          role: msg.role,
          content:
            msg.content[0].type === "text"
              ? msg.content[0].text.value
              : "Non-text content", // image file present
        };
      })
      .reverse(); // reverse the order of the messages so that the latest message is at the bottom

    return NextResponse.json({ messages }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
};
