import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

import LogoutButton from "@/components/LogoutButton";
import ItemsList from "@/components/items/ItemsList";
import ItemsAction from "@/components/items/ItemsAction";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";

// only able to see page when logged in
const PrivatePage = async () => {
  const supabase = createClient();

  const { data, error } = await supabase.auth.getUser();

  if (error || !data?.user) {
    redirect("/login");
  }

  return (
    <main className="flex flex-col justify-center p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl">
            Welcome,{" "}
            <span className="font-semibold italic text-primary">
              {data.user.email}
            </span>
          </h1>
          <h2 className="text-gray-500">Here are your items.</h2>
        </div>
        <div className="flex gap-x-2">
          <Button asChild>
            <Link href="/">Home</Link>
          </Button>
          <LogoutButton />
        </div>
      </div>

      <Separator className="my-4" />

      <section className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Items</h1>
        <ItemsAction userId={data.user.id} />
      </section>
      <ItemsList />
    </main>
  );
};

export default PrivatePage;
