"use client";

import React from "react";
import { createClient } from "@/lib/supabase/client";
// import { signInWithEmail } from "@/lib/supabase/auth";

import { Button } from "./ui/button";
import { signInWithEmail } from "@/lib/supabase/auth";

const LoginWithEmailButton = () => {
  const supabase = createClient();

  // async function signInWithEmail() {
  //   const { data, error } = await supabase.auth.signInWithOtp({
  //     email: "terry.t@menyala.com",
  //     options: {
  //       // set this to false if you do not want the user to be automatically signed up
  //       shouldCreateUser: true,
  //       // emailRedirectTo: "/api/auth/callback",
  //       data: {
  //         email: "terry.t@menyala.com",
  //       },
  //     },
  //   });

  //   console.log("data -> ", data);
  //   console.log("error -> ", error);
  // }

  return (
    <Button
      variant="outline"
      onClick={() => signInWithEmail("terry.t@menyala.com")}
    >
      Login With Magic Link
    </Button>
  );
};

export default LoginWithEmailButton;
