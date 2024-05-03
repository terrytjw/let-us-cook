import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/user";

import { z } from "zod";
import { items } from "@/lib/db/schema";
import { db } from "@/lib/db";
import { and, eq } from "drizzle-orm";

const RouteContextSchema = z.object({
  params: z.object({
    itemId: z.string(),
  }),
});

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
      params: { itemId },
    } = RouteContextSchema.parse(context);

    // delete the item
    const deleteResult = await db
      .delete(items)
      .where(
        and(eq(items.id, parseInt(itemId, 10)), eq(items.userId, user.id)),
      );

    if (deleteResult.count === 0) {
      return NextResponse.json(
        { error: "Item not found or not owned by user" },
        { status: 404 },
      );
    }

    return NextResponse.json(null, { status: 200 });
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
