import { DeepPartial } from "ai";
import { z } from "zod";

export const nextActionSchema = z.object({
  // the property `next` can only have one of two values - "inquire" or "proceed"
  next: z.enum(["inquire", "proceed"]),
});

export type NextAction = DeepPartial<typeof nextActionSchema>;
