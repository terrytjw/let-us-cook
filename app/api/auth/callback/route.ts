import { NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";

import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export const GET = async (request: Request) => {
  const { searchParams, origin } = new URL(request.url);

  try {
    // Get the Backend API User object when you need access to the user's information
    const user = await currentUser();

    if (!user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { id, emailAddresses, firstName, lastName } = user;

    console.log("id -> ", id);

    const userFromDB = await db
      .select()
      .from(users)
      .where(eq(users.email, emailAddresses[0].emailAddress || ""));

    console.log("User from DB -> ", userFromDB[0]);

    if (userFromDB[0]) {
      console.log("User exists in db");
    } else {
      console.log("User does not exist in db. Adding new user to db...");

      await db.insert(users).values({
        id,
        fullName: `${firstName} ${lastName}`,
        email: emailAddresses[0].emailAddress,
      });

      console.log("User added to db");
    }

    return NextResponse.redirect(`${origin}/private`);
  } catch (error) {
    // return the user to an error page with instructions
    return NextResponse.redirect(`${origin}/auth/auth-code-error`);
  }
};
