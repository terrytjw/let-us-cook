import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/user";
import OpenAI from "openai";

import { z } from "zod";
import { threads } from "@/lib/db/schema";
import { db } from "@/lib/db";
import { and, eq } from "drizzle-orm";

const RouteContextSchema = z.object({
  params: z.object({
    threadId: z.string(),
  }),
});

const openai = new OpenAI();

export const DELETE = async (
  req: Request,
  context: z.infer<typeof RouteContextSchema>,
) => {
  try {
    const { user } = await getCurrentUser();

    if (!user) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const {
      params: { threadId },
    } = RouteContextSchema.parse(context);

    // delete the thread from openai
    await openai.beta.threads.del(threadId);

    // delete the thread from DB
    const deleteResult = await db
      .delete(threads)
      .where(and(eq(threads.id, threadId), eq(threads.userId, user.id)));

    if (deleteResult.count === 0) {
      return NextResponse.json(
        { error: "Thread not found or not owned by user" },
        { status: 404 },
      );
    }

    return NextResponse.json(null, { status: 200 });
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
