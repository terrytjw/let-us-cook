import { redirect } from "next/navigation";
import { currentUser } from "@clerk/nextjs/server";

import ItemsList from "@/components/items/ItemsList";
import ItemsAction from "@/components/items/ItemsAction";

// only able to see page when logged in
const PrivatePage = async () => {
  const user = await currentUser();

  if (!user) {
    redirect("/sign-in");
  }

  const { id } = user;

  return (
    <main className="flex flex-col justify-center p-6">
      <section className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Items</h1>
        <ItemsAction userId={id} />
      </section>
      <ItemsList />
    </main>
  );
};

export default PrivatePage;
