"use client";

import React from "react";
import { createClient } from "@/lib/supabase/client";

import { Button } from "./ui/button";

const LoginWithEmailButton = () => {
  const supabase = createClient();

  const loginWithEmail = async () => {
    alert("loginWithEmail");
    const { data, error } = await supabase.auth.signInWithOtp({
      email: "tanjunweiterry@gmail.com",
      options: {
        // set this to false if you do not want the user to be automatically signed up
        shouldCreateUser: true,
      },
    });
  };

  return (
    <Button variant="outline" onClick={loginWithEmail}>
      Login With Magic Link
    </Button>
  );
};

export default LoginWithEmailButton;
