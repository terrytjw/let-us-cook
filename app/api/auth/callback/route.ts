import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export const GET = async (request: Request) => {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/ai";

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    // check for user entry in db
    const {
      data: { user },
    } = await supabase.auth.getUser();
    const userFromDB = await db
      .select()
      .from(users)
      .where(eq(users.email, user?.email || ""));

    console.info("User from DB: ", userFromDB[0]);

    if (userFromDB[0]) {
      console.info("User exists in db");
    } else {
      console.info("User does not exist in db. Adding new user to db...");
      const { data } = await supabase.auth.getUserIdentities();

      const userId = user!.id;
      const userFullName = data?.identities[0].identity_data?.full_name;
      const userEmail = data?.identities[0].identity_data?.email;

      await db.insert(users).values({
        id: userId,
        fullName: userFullName,
        email: userEmail,
      });

      console.info("User added to db");
    }

    if (!error) {
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  // return the user to an error page with instructions
  return NextResponse.redirect(`${origin}/auth/auth-code-error`);
};
