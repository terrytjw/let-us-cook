"use client";

import { createClient } from "@/lib/supabase/client";

const LoginPage = () => {
  const supabase = createClient();

  const loginWithGoogle = () => {
    supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${location.origin}/api/auth/callback`,
      },
    });
  };

  return (
    <main className="flex items-center justify-center">
      <button className=" border border-black p-4" onClick={loginWithGoogle}>
        Sign in with Google
      </button>
    </main>
  );
};

export default LoginPage;
