import Link from "next/link";
import { cn } from "@/lib/utils";

// import MainNav from "@/components/navigation/MainNav";
import Footer from "@/components/navigation/Footer";

type LandingLayoutProps = {
  children: React.ReactNode;
};
const LandingLayout = async ({ children }: LandingLayoutProps) => {
  return (
    <div className="flex min-h-screen flex-col">
      {/* <header className="container z-40 bg-background">
        <MainNav items={marketingConfig.mainNav} />
        <nav>
          <Link
            href="/login"
            className={cn(
              buttonVariants({ variant: "outline" }),
              "px-4 font-semibold",
              "transition-all duration-700 hover:border-orange-500 hover:bg-background/60 hover:text-orange-500",
            )}
          >
            Launch App
          </Link>
        </nav>
      </header> */}
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
};

export default LandingLayout;
