import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

import LogoutButton from "@/components/LogoutButton";
import ItemsList from "@/components/items/ItemsList";
import ItemsAction from "@/components/items/ItemsAction";

// stub page: only able to see page when logged in
const PrivatePage = async () => {
  const supabase = createClient();

  const { data, error } = await supabase.auth.getUser();

  if (error || !data?.user) {
    redirect("/login");
  }

  return (
    <main className="flex flex-col items-center justify-center p-6">
      <p>
        HELLO{" "}
        <span className="font-semibold text-primary">{data.user.email}</span>
      </p>
      <ItemsList />
      <ItemsAction userId={data.user.id} />
      <LogoutButton />
    </main>
  );
};

export default PrivatePage;
