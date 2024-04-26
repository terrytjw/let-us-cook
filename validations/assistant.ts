import * as z from "zod";

export const AssistantPostSchema = z.object({
  threadId: z.string(),
  message: z.string(),
});

export const AsstThreadPostSchema = z.object({
  message: z.string(),
});
