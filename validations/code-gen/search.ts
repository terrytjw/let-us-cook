import { DeepPartial } from "ai";
import { z } from "zod";

export const kbSearchSchema = z.object({
  query: z.string().describe("The query to search for"),
});

export type PartialInquiry = DeepPartial<typeof kbSearchSchema>;
