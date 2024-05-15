import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq, sql } from "drizzle-orm";

// to be called when a user invokes any AI apps
export const decrementCredits = async (userId: string) => {
  "use server";

  try {
    // check if the user has any more AI messages left
    const aiMessagesLeft = (
      await db
        .select({ value: users.aiCredits })
        .from(users)
        .where(eq(users.id, userId))
    )[0].value;

    if (aiMessagesLeft === 0) {
      throw new Error(
        "No more AI credits left. Please contact support for more.",
      );
    }

    // decrement the number of AI messages left
    const res = await db
      .update(users)
      .set({
        aiCredits: sql`${users.aiCredits} - 1`, // decrement ai credits available by 1
      })
      .where(eq(users.id, userId))
      .returning({ aiCredits: users.aiCredits });

    return res[0].aiCredits;
  } catch (error) {
    const err = error as Error; // type assertion

    if (err.message.includes("No more AI credits left")) {
      console.error("No more AI credits left: ", err);
      throw new Error(
        "No more AI credits left. Please contact support for more.",
      );
    }

    console.error("Error decrementing AI message: ", err);
    throw new Error(
      "An unexpected error occurred while decrementing AI message. Please try again later.",
    );
  }
};
