import Link from "next/link";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

import { Icons } from "@/components/Icons";
import LoginButton from "@/components/LoginButton";

const LoginPage = () => {
  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <Link
        href="/"
        className={cn(
          buttonVariants({ variant: "ghost" }),
          "absolute left-10 top-4 md:left-8 md:top-8",
        )}
      >
        <div className="flex items-center">
          <Icons.chevronLeft className="mr-2 h-4 w-4" />
          Back to home
        </div>
      </Link>
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <div className="flex flex-col items-center space-y-1">
          <Icons.cook className="h-8 w-8 animate-bounce" />
          <h1 className="text-md font-semibold tracking-tight">
            Welcome to{" "}
            <span className="font-bold">
              Let Us <span className="text-primary">Cook</span>.
            </span>
          </h1>
        </div>
        <LoginButton />
        <p className="text-center text-sm text-muted-foreground">
          Sign in to continue to your account.
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
