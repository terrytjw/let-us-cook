import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/user";

import Footer from "@/components/navigation/Footer";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import LogoutButton from "@/components/LogoutButton";

type AILayoutProps = {
  children?: React.ReactNode;
};
const AILayout = async ({ children }: AILayoutProps) => {
  const { user, error } = await getCurrentUser();

  if (error || !user) {
    redirect("/login");
  }

  const {
    user_metadata: { full_name },
  } = user;

  return (
    <div className="flex min-h-screen flex-col">
      {/* <header className="sticky top-0 z-40 border-b bg-background">
        <div className="container flex h-16 items-center justify-between py-4">
          <MainNav items={dashboardConfig.mainNav} />
          <UserAccountNav
            user={{
              name: user.name || "",
              email: user.email || "",
              image: user.image || "",
            }}
          />
        </div>
      </header> */}
      <header className="flex items-center justify-between p-6">
        <div>
          <h1 className="text-xl">
            Welcome,{" "}
            <span className="font-semibold italic text-primary">
              {full_name}
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
          <LogoutButton />
        </div>
      </header>

      <Separator />

      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
};

export default AILayout;
