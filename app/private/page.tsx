import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";

// stub page: only able to see page when logged in
const PrivatePage = async () => {
  const supabase = createClient();

  const { data, error } = await supabase.auth.getUser();

  if (error || !data?.user) {
    redirect("/login");
  }

  return <p>HELLO {data.user.email}</p>;
};

export default PrivatePage;
