import Link from "next/link";
import { auth, signOut } from "@/auth";

import { Button } from "@/components/ui/button";
import SignOutButton from "@/components/SignOutButton";

export default async function Home() {
  const session = await auth();
  console.log("session -> ", session);

  return (
    <main className="flex min-h-screen flex-col items-center gap-y-24 p-24">
      <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm lg:flex">
        <p className="fixed left-0 top-0 flex w-full justify-center border-b border-gray-300 bg-gradient-to-b from-zinc-200 pb-6 pt-8 backdrop-blur-2xl dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit lg:static lg:w-auto  lg:rounded-xl lg:border lg:bg-gray-200 lg:p-4 lg:dark:bg-zinc-800/30">
          {session?.user
            ? "You are logged in. View your login details below."
            : "Log in to get started."}
        </p>
        <div className="fixed bottom-0 left-0 flex h-48 w-full items-end justify-center bg-gradient-to-t from-white via-white dark:from-black dark:via-black lg:static lg:h-auto lg:w-auto lg:bg-none">
          {/* <a
            className="pointer-events-none flex place-items-center gap-2 p-8 lg:pointer-events-auto lg:p-0"
            href="https://vercel.com?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            By{" "}
            <Image
              src="/vercel.svg"
              alt="Vercel Logo"
              className="dark:invert"
              width={100}
              height={24}
              priority
            />
          </a> */}
          {session?.user ? (
            <SignOutButton
              signOut={async () => {
                "use server";
                await signOut({ redirectTo: "/" });
              }}
            />
          ) : (
            <Button asChild>
              <Link href="/api/auth/signin">Login</Link>
            </Button>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-y-2 rounded border border-gray-300 p-3">
        {session?.user ? (
          <>
            <p>
              <span className="font-semibold">userId:</span> {session?.user.id}
            </p>
            <p>
              <span className="font-semibold">displayName:</span>{" "}
              {session?.user.name}
            </p>
            <p>
              <span className="font-semibold">email:</span>{" "}
              {session?.user.email}
            </p>
          </>
        ) : (
          <p>User details will display upon login.</p>
        )}
      </div>
    </main>
  );
}
