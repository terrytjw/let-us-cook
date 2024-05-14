import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { and, eq, sql } from "drizzle-orm";

// to be called when a user invokes any AI apps
export const decrementCredits = async (userId: string) => {
  try {
    // #1 check if the user has any more AI messages left
    const aiMessagesLeft = (
      await db
        .select({ value: users.aiMessagesLeft })
        .from(users)
        .where(eq(users.id, userId))
    )[0].value;

    if (aiMessagesLeft === 0) {
      throw new Error(
        "No more AI messages left. Please contact tanjunweiterry@gmail.com for support.",
      );
    }

    // #2 decrement the number of AI messages left
    const res = await db
      .update(users)
      .set({
        aiMessagesLeft: sql`${users.aiMessagesLeft} - 1`, // decrement aiMessagesLeft by 1
      })
      .where(eq(users.id, userId))
      .returning({ aiMessagesLeft: users.aiMessagesLeft });

    return res[0].aiMessagesLeft;
  } catch (error) {
    console.error("Error decrementing AI message: ", error);
    throw new Error("Error decrementing AI message");
  }
};
