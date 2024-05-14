import { createClient } from "@/lib/supabase/server";

import { db } from "@/lib/db";
import { and, eq } from "drizzle-orm";
import { users } from "@/lib/db/schema";

export const getCurrentUser = async () => {
  "use server";

  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  // check if the current user is an admin
  const isAdminResult = await db
    .select()
    .from(users)
    .where(and(eq(users.email, user?.email || ""), eq(users.isAdmin, true)));
  const isAdmin = !!isAdminResult.length;

  return { user, error, isAdmin };
};
