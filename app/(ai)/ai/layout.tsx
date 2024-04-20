import { notFound } from "next/navigation";
import { getCurrentUser } from "@/lib/user";

import Footer from "@/components/navigation/Footer";

type AILayoutProps = {
  children?: React.ReactNode;
};
const AILayout = async ({ children }: AILayoutProps) => {
  const user = await getCurrentUser();

  if (!user) {
    return notFound();
  }

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
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
};

export default AILayout;
