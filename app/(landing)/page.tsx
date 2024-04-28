import Link from "next/link";
import { getCurrentUser } from "@/lib/user";

import { Button } from "@/components/ui/button";

const Home = async () => {
  const user = await getCurrentUser();

  return (
    <main className="flex h-screen flex-col items-center justify-center gap-y-24 p-24">
      <div>
        <h1 className="text-7xl font-semibold tracking-[-0.08em]">
          Let Us <span className="text-primary">Cook</span>.
        </h1>
        <p className="text-center font-medium tracking-[0.015em] text-gray-500 dark:text-gray-400">
          Cook up kickass full-stack AI apps in minutes 🔥
        </p>
        <div className="mt-6 flex justify-center">
          <Button asChild>
            <Link href={user ? "/ai" : "/login"}>Start cookin'</Link>
          </Button>
        </div>
      </div>
    </main>
  );
};

export default Home;
