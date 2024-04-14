import Link from "next/link";
import { getCurrentUser } from "@/lib/user";

import { Button } from "@/components/ui/button";

const Home = async () => {
  const user = await getCurrentUser();

  return (
    <main className="flex flex-col items-center justify-center gap-y-24 p-24">
      <div>
        <h1 className="mt-28 text-7xl font-semibold tracking-[-0.08em]">
          Next<span className="text-primary">Gen</span>.
        </h1>
        <p className="text-center font-medium text-gray-300">
          Absolute kickass Next.js template 🔥
        </p>
        <div className="mt-6 flex justify-center">
          <Button asChild>
            <Link href={user ? "/private" : "/login"}>Get Started</Link>
          </Button>
        </div>
      </div>
    </main>
  );
};

export default Home;
