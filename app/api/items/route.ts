import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/user";

import { z } from "zod";
import { ItemPostSchema } from "@/validations/items";
import { db } from "@/lib/db";
import { eq } from "drizzle-orm";
import { items } from "@/lib/db/schema";

export const GET = async (req: Request) => {
  try {
    const { user } = await getCurrentUser();

    if (!user) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const userId = user.id;
    const _items = await db
      .select()
      .from(items)
      .where(eq(items.userId, userId));

    return NextResponse.json({ items: _items }, { status: 200 });
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

export const POST = async (req: Request) => {
  try {
    const { user } = await getCurrentUser();

    if (!user) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const json = await req.json();
    const { userId, name, price, description } = ItemPostSchema.parse(json);

    const item = {
      userId,
      name,
      price,
      description,
    };

    const [data] = await db
      .insert(items)
      .values(item)
      .returning({ itemId: items.id });

    return NextResponse.json(data.itemId, { status: 200 });
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
