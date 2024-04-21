"use server";

import { createClient } from "@/lib/supabase/server";

export const getCurrentUser = async () => {
  const supabase = createClient();

  const { data, error } = await supabase.auth.getUser();
  const user = data?.user;

  return { user, error };
};
