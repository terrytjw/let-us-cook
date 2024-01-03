"use client";
import React from "react";

import { Button } from "./ui/button";

type SignOutButtonProps = {
  signOut: () => void;
};
const SignOutButton = ({ signOut }: SignOutButtonProps) => {
  return (
    <Button
      onClick={() => {
        signOut();
      }}
    >
      Logout
    </Button>
  );
};

export default SignOutButton;
