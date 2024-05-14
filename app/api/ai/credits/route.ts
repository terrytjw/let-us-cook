import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/user";

import { z } from "zod";
import { db } from "@/lib/db";
import { eq } from "drizzle-orm";
import { users } from "@/lib/db/schema";

export const GET = async (req: Request) => {
  try {
    const { user } = await getCurrentUser();

    if (!user) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const credits = (
      await db
        .select({ value: users.aiMessagesLeft })
        .from(users)
        .where(eq(users.id, user.id))
    )[0].value;

    return NextResponse.json({ credits }, { status: 200 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ errors: error.issues }, { status: 422 });
    }

    return NextResponse.json(
      { error: `Internal Server Error: ${error}` },
      { status: 500 },
    );
  }
};
