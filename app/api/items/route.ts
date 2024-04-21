import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";

import { z } from "zod";
import { ItemPostSchema } from "@/validations/items";
import { db } from "@/lib/db";
import { eq } from "drizzle-orm";
import { items } from "@/lib/db/schema";

export const GET = async (req: Request) => {
  try {
    // ensure user is authenticated
    const user = await currentUser();

    console.log("user -> ", user);

    if (!user) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { id } = user;

    // const userId = user.id;
    const _items = await db.select().from(items).where(eq(items.userId, id));

    console.log("items -> ", _items);

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
    // ensure user is authenticated
    const user = await currentUser();

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

    console.log("item -> ", item);

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
