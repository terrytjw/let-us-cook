import Link from "next/link";
import { redirect } from "next/navigation";
import { currentUser } from "@clerk/nextjs/server";

import { ClerkLoaded, ClerkLoading, UserButton } from "@clerk/nextjs";
import Footer from "@/components/navigation/Footer";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

type DashboardLayoutProps = {
  children?: React.ReactNode;
};
const DashboardLayout = async ({ children }: DashboardLayoutProps) => {
  const user = await currentUser();

  if (!user) {
    redirect("/sign-in");
  }

  const { firstName } = user;

  return (
    <div className="flex min-h-screen flex-col">
      <header className="flex items-center justify-between p-6">
        <div>
          <h1 className="text-xl">
            Welcome,{" "}
            <span className="font-semibold italic text-primary">
              {firstName}
            </span>
          </h1>
        </div>
        <div className="flex gap-x-2">
          <Button asChild>
            <Link href="/">Home</Link>
          </Button>
          <Button asChild>
            <Link href="/private">Private</Link>
          </Button>
          <Button asChild>
            <Link href="/ai">AI</Link>
          </Button>
          <ClerkLoading>
            <Avatar>
              {/* <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" /> */}
              <AvatarFallback className="border bg-background">
                ..
              </AvatarFallback>
            </Avatar>
          </ClerkLoading>
          <ClerkLoaded>
            <UserButton afterSignOutUrl="/sign-in" />
          </ClerkLoaded>
        </div>
      </header>

      <Separator />

      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
};

export default DashboardLayout;
