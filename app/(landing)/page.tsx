import Link from "next/link";
import { getCurrentUser } from "@/lib/user";

import { Button } from "@/components/ui/button";

const Home = async () => {
  const user = await getCurrentUser();

  return (
    <main className="flex flex-col items-center gap-y-24 p-24">
      <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm lg:flex">
        <p className="fixed left-0 top-0 flex w-full justify-center border-b border-gray-300 bg-gradient-to-b from-zinc-200 pb-6 pt-8 backdrop-blur-2xl dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit lg:static lg:w-auto  lg:rounded-xl lg:border lg:bg-gray-200 lg:p-4 lg:dark:bg-zinc-800/30">
          Log in to get started.
        </p>
        <div className="fixed bottom-0 left-0 flex h-48 w-full items-end justify-center bg-gradient-to-t from-white via-white dark:from-black dark:via-black lg:static lg:h-auto lg:w-auto lg:bg-none">
          <Button asChild>
            <Link href={user ? "/private" : "/login"}>Login</Link>
          </Button>
        </div>
      </div>
      <h1 className="text-7xl font-semibold tracking-[-0.08em]">
        Next<span className="text-primary">Gen</span>.
      </h1>
    </main>
  );
};

export default Home;
