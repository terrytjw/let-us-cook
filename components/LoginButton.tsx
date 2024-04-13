"use client";

import React from "react";
import { createClient } from "@/lib/supabase/client";

import { Button } from "./ui/button";

const LoginButton = () => {
  const supabase = createClient();

  const loginWithGoogle = () => {
    supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${location.origin}/api/auth/callback`,
      },
    });
  };

  return <Button onClick={loginWithGoogle}>Login</Button>;
};

export default LoginButton;
