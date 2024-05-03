import * as z from "zod";

export const ChatPostSchema = z.object({
  messages: z.array(
    z.object({
      role: z.enum(["user", "assistant", "tool"]), // restrict role to "user", "assistant", or "tool" only
      content: z.string(),
    }),
  ),
});
