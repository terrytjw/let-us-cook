"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

import { Button } from "./ui/button";

const LogoutButton = () => {
  const router = useRouter();
  const supabase = createClient();

  const logout = async () => {
    await supabase.auth.signOut();

    router.push("/login");
  };

  return <Button onClick={logout}>Logout</Button>;
};

export default LogoutButton;
