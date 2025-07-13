import { z } from "zod/v4";

export const CardBlockStringSchema = z.string().min(1);
export type CardBlockString = z.infer<typeof CardBlockStringSchema>;

export const CardBlockPrimitiveSchema = z.array(CardBlockStringSchema).min(1);
export type CardBlockPrimitive = z.infer<typeof CardBlockPrimitiveSchema>;

export const SingleResponseCardVariantSchema = z
  .object({
    type: z.enum(["single_response"]),
    question: CardBlockPrimitiveSchema,
    answer: CardBlockPrimitiveSchema,
    fakeAnswers: z.array(CardBlockPrimitiveSchema).optional(),
    more_infos: CardBlockPrimitiveSchema.optional(),
  })
  .meta({
    propertyOrdering: [
      "type",
      "question",
      "answer",
      "fakeAnswers",
      "more_infos",
    ],
  });
export type SingleResponseCardVariant = z.infer<
  typeof SingleResponseCardVariantSchema
>;

export const UnorderedListCardVariantSchema = z
  .object({
    type: z.enum(["unordered_list"]), // For learning multiple items that don't have a specific order
    question: CardBlockPrimitiveSchema,
    answers: z.array(CardBlockPrimitiveSchema), // Example: [["Carbon dioxide (CO₂)"], ["Methane (CH₄)"], ["Nitrous oxide (N₂O)"], ["Fluorinated gases"]]
    fakeAnswers: z.array(CardBlockPrimitiveSchema).optional(), // User will be presented with a random set of all the answers and some fake answers. Example: [["Oxygen (O₂)"], ["Nitrogen (N₂)"], ["Helium (He)"], ["Water vapor only"]]
    more_infos: CardBlockPrimitiveSchema.optional(),
  })
  .meta({
    propertyOrdering: [
      "type",
      "question",
      "answers",
      "fakeAnswers",
      "more_infos",
    ],
  });
export type UnorderedListCardVariant = z.infer<
  typeof UnorderedListCardVariantSchema
>;

export const OrderedListCardVariantSchema = z
  .object({
    type: z.enum(["split_sentence", "numbered_list"]), // split_sentence: learn a sentence by heart, numbered_list: learn ordered lists of items
    question: CardBlockPrimitiveSchema,
    answers: z.array(
      z.object({
        answer: CardBlockPrimitiveSchema,
        fakeAnswers: z.array(CardBlockPrimitiveSchema).optional(), // Each answer part can have its own set of contextually relevant fake answers. Example: [["All humans"], ["Men"], ["All men"]]
      })
    ),
    more_infos: CardBlockPrimitiveSchema.optional(),
  })
  .meta({
    propertyOrdering: ["type", "question", "answers", "more_infos"],
  });
export type OrderedListCardVariant = z.infer<
  typeof OrderedListCardVariantSchema
>;

export const CardVariantSchema = z.union([
  SingleResponseCardVariantSchema,
  UnorderedListCardVariantSchema,
  OrderedListCardVariantSchema,
]);
export type CardVariant = z.infer<typeof CardVariantSchema>;

export const CardVariantArraySchema = z.array(CardVariantSchema).min(1);
export type CardVariantArray = z.infer<typeof CardVariantArraySchema>;

// Schema for AI-generated card output
// TODO: Move to web only
export const CardGPTOutputSchema = z
  .object({
    variants: CardVariantArraySchema,
    level: z.enum(["core_concept", "knowledge", "example"]),
  })
  .meta({
    propertyOrdering: ["variants", "level"],
  });
export type CardGPTOutput = z.infer<typeof CardGPTOutputSchema>;

export const GeneratedCardsResponseSchema = z.object({
  cards: z.array(CardGPTOutputSchema).min(1, "At least one card is required"),
});
export type GeneratedCardsResponse = z.infer<
  typeof GeneratedCardsResponseSchema
>;
