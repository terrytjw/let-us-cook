import { createClient } from "@/lib/supabase/server";

export const getCurrentUser = async () => {
  "use server";

  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  return { user, error };
};
