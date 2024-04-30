import React from "react";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/user";
import { db } from "@/lib/db";
import { threads } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

import Assistant from "@/components/ai/assistant/Assistant";
import DeleteThreadButton from "@/components/ai/assistant/DeleteThreadButton";

type ThreadPageProps = {
  params: { threadId: string };
};
const ThreadPage = async ({ params }: ThreadPageProps) => {
  const { threadId } = params;
  const { user } = await getCurrentUser();

  if (!user) {
    return redirect("/login");
  }

  // check if the threadId has an entry in the database that belongs to the user
  const thread = await db
    .select()
    .from(threads)
    .where(eq(threads.id, threadId));
  if (thread.length === 0) {
    return redirect("/404");
  }
  if (thread[0].userId !== user.id) {
    return redirect("/unauthorized");
  }

  const firstMessage = thread[0].firstMessage;

  return (
    <main>
      <div className="flex justify-around p-6">
        <div></div>
        <h1 className="text-center text-xl font-bold italic">
          {thread[0].title}
        </h1>
        <DeleteThreadButton threadId={threadId} />
      </div>
      <Assistant firstMessage={firstMessage} threadId={threadId} />
    </main>
  );
};

export default ThreadPage;
