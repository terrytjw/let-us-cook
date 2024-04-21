import Link from "next/link";
import { currentUser } from "@clerk/nextjs/server";

import { Button } from "@/components/ui/button";

const Home = async () => {
  const user = await currentUser();

  return (
    <main className="flex flex-col items-center justify-center gap-y-24 p-24">
      <div>
        <h1 className="mt-28 text-7xl font-semibold tracking-[-0.08em]">
          Next<span className="text-primary">Gen</span>.
        </h1>
        <p className="text-center font-medium text-gray-300">
          Absolute kickass Next.js template 🔥
        </p>
        <div className="mt-6 flex gap-x-2">
          <Button className="w-full" asChild>
            <Link href={user ? "/private" : "/sign-in"}>Sign In</Link>
          </Button>
          <Button className="w-full" variant="outline" asChild>
            <Link href={user ? "/private" : "/sign-up"}>Sign Up</Link>
          </Button>
        </div>
      </div>
    </main>
  );
};

export default Home;
