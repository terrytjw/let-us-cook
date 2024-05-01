"use server";

import { redirect } from "next/navigation";

import { getURL } from "@/lib/utils";
import { createClient } from "@/lib/supabase/server";

export type ActionResponse =
  | {
      data: any;
      error: any;
    }
  | undefined;
export async function signInWithEmail(email: string): Promise<ActionResponse> {
  const supabase = createClient();

  const { data, error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: getURL("api/auth/callback"),
      shouldCreateUser: true,
    },
  });

  console.log("data -> ", data);
  //   console.log("error", error);

  if (error) {
    console.error(error);
    return { data: null, error: error };
  }

  return { data: null, error: null };
}
