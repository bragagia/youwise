// Generated by ts-to-zod
import { z } from "zod";

import { memorySchema } from "./memory-schema";

export const cardBlockPrimitiveSchema = z.string();

export const cardBlocksSchema = z.union([
  cardBlockPrimitiveSchema,
  z.array(cardBlockPrimitiveSchema),
]);

export const textCardPartSchema = z.array(
  z.object({
    id: z.string(),
    part: cardBlocksSchema,
  }),
);

export const classicCardVariantSchema = z.object({
  type: z.literal("classic"),
  question: cardBlocksSchema,
  answer: cardBlocksSchema,
  fakeAnswers: z.array(cardBlocksSchema).optional(),
});

export const textCardVariantSchema = z.object({
  type: z.literal("text"),
  title: cardBlocksSchema,
  text: z.array(textCardPartSchema),
});

export const cardVariantSchema = z.union([
  classicCardVariantSchema,
  textCardVariantSchema,
]);

export const cardGPTOutputSchema = z.object({
  variants: z.array(cardVariantSchema),
});

export const cardSchema = z.object({
  id: z.string(),
  variants: z.array(cardVariantSchema),
});

export const cardWithMemorySchema = cardSchema.and(
  z.object({
    memory: memorySchema.nullable(),
  }),
);
