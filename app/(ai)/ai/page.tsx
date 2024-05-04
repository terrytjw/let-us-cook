import React from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/user";

import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const aiPages = [
  {
    id: "chat-ai",
    name: "Chat with AI",
    description: "Talk to a helpful AI assistant",
    href: "/ai/chat",
  },
  {
    id: "rag",
    name: "Retrieval Augmented Generation",
    description: "Enhance text with retrieval",
    // href: "/ai/rag",
    href: "/ai/#", // turn on when ready
  },
  {
    id: "ai-agent",
    name: "AI Agent",
    description: "Interact with an AI agent",
    href: "/ai/agent",
  },
  {
    id: "gen-ui",
    name: "Generative UI",
    description: "UI streaming in action",
    href: "/ai/gen-ui",
  },
  {
    id: "chat-ai-legacy",
    name: "Chat with AI (Legacy)",
    description: "Talk to a helpful AI assistant",
    href: "/ai/chat-legacy",
  },
];

const AIPage = async () => {
  const { user, error } = await getCurrentUser();

  if (error || !user) {
    redirect("/login");
  }

  return (
    <main className="flex flex-col justify-center p-6">
      <h1 className="text-4xl font-bold">Let's cook up some AI.</h1>
      <section className="py-4">
        <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2">
          {aiPages.map((page) => (
            <Link className="group" href={page.href} key={page.id}>
              <Card className="block rounded-lg border p-4 shadow">
                <CardHeader>
                  <CardTitle className="transition-all group-hover:text-primary">
                    {page.name}
                  </CardTitle>
                  <CardDescription className="transition-all group-hover:text-primary">
                    {page.description}
                  </CardDescription>
                </CardHeader>
              </Card>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
};

export default AIPage;
