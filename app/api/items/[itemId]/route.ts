import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

import { z } from "zod";
import { items } from "@/lib/db/schema";
import { db } from "@/lib/db";
import { and, eq } from "drizzle-orm";

const RouteContextSchema = z.object({
  params: z.object({
    itemId: z.string(),
  }),
});

// TODO: add get and put routes

export const DELETE = async (
  req: Request,
  context: z.infer<typeof RouteContextSchema>,
) => {
  try {
    // validate the route context
    const { params } = RouteContextSchema.parse(context);

    // ensure user is authenticated
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // delete the item
    const deleteResult = await db
      .delete(items)
      .where(
        and(
          eq(items.id, parseInt(params.itemId, 10)),
          eq(items.userId, user.id),
        ),
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
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
};
