"use client";

import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useCreateNewThreadMutation } from "@/hooks/assistant/threads/useCreateNewThread";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";
import { Icons } from "@/components/Icons";

const FormSchema = z.object({
  message: z.string(),
});

const AssistantAction = () => {
  const { createThread, isCreateThreadLoading } = useCreateNewThreadMutation();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      message: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    const threadId = await createThread(data.message);
    console.info("created threadId: ", threadId);

    toast({
      title: "You submitted the following values:",
      description: (
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(data, null, 2)}</code>
        </pre>
      ),
    });
  };

  return (
    <main>
      <Dialog>
        <DialogTrigger asChild>
          <Button>+ New Thread</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Start a new thread</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <FormField
                control={form.control}
                name="message"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Textarea
                        className="p-4"
                        onKeyDown={(e) => {
                          // check if enter is pressed without shift
                          if (e.key === "Enter" && !e.shiftKey) {
                            e.preventDefault(); // prevent the default action to avoid new line
                            form.handleSubmit(onSubmit)(); // programmatically submit the form
                          }
                        }}
                        placeholder="What's on your mind today?"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Ask a question, research a topic, or even build something.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter className="mt-4">
                <Button type="submit">
                  {isCreateThreadLoading ? (
                    <div className="flex items-center gap-2">
                      {" "}
                      <Icons.loading className="h-4 w-4 animate-spin" />
                    </div>
                  ) : (
                    "Send"
                  )}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </main>
  );
};

export default AssistantAction;
