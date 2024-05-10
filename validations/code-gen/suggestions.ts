import { DeepPartial } from "ai";
import { z } from "zod";

// updated schema to match the new structure defined in ai-suggestor.tsx
export const suggestionsSchema = z.object({
  items: z
    .array(
      z.object({
        label: z.string(),
        prompt: z.string(),
      }),
    )
    .max(4),
});
export type PartialSuggestions = DeepPartial<typeof suggestionsSchema>;
