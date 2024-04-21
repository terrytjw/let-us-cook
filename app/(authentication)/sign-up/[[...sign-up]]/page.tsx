import Link from "next/link";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

import { SignUp } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import { Icons } from "@/components/Icons";

const SignUpPage = () => {
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
      <div className="mx-auto flex w-full flex-col items-center justify-center space-y-6 sm:w-[350px]">
        <div className="flex flex-col items-center space-y-1">
          <Icons.chevronsDown className="h-8 w-8 animate-bounce" />
          <h1 className="text-md font-semibold tracking-tight">
            Welcome to{" "}
            <span className="font-bold">
              Next<span className="text-primary">Gen</span>.
            </span>
          </h1>
        </div>

        <SignUp
          afterSignInUrl="/api/auth/callback"
          appearance={{
            baseTheme: dark,
          }}
          signInUrl={process.env.NEXT_PUBLIC_CLERK_SIGN_IN_URL}
        />
      </div>
    </div>
  );
};

export default SignUpPage;
