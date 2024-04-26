import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/user";
import OpenAI from "openai";
import { generateTitle } from "@/lib/ai";

import { z } from "zod";
import { AsstThreadPostSchema } from "@/validations/assistant";
import { db } from "@/lib/db";
import { eq } from "drizzle-orm";
import { threads } from "@/lib/db/schema";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY || "" });

export const GET = async (req: Request) => {
  try {
    const { user } = await getCurrentUser();

    if (!user) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const userId = user.id;
    const _threads = await db
      .select()
      .from(threads)
      .where(eq(threads.userId, userId));

    return NextResponse.json({ threads: _threads }, { status: 200 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ errors: error.issues }, { status: 422 });
    }

    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
};

// create a new thread
export const POST = async (req: Request) => {
  try {
    const { user } = await getCurrentUser();

    if (!user) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const json = await req.json();
    const { message } = AsstThreadPostSchema.parse(json);

    // create a thread and get threadId
    const threadId = (await openai.beta.threads.create({})).id;

    const title = await generateTitle(message);

    try {
      // save the thread to the database
      const thread = {
        id: threadId,
        userId: user.id,
        firstMessage: message,
        title,
      };
      const [data] = await db
        .insert(threads)
        .values(thread)
        .returning({ threadId: threads.id });

      return NextResponse.json({ threadId: data.threadId }, { status: 200 });
    } catch (error) {
      return NextResponse.json(
        { error: "Failed to insert thread into database" },
        { status: 500 },
      );
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ errors: error.issues }, { status: 422 });
    }

    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
};
