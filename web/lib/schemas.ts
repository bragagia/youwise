import { z } from "zod/v4";

export const ResourceSectionSchema = z
  .object({
    title: z.string(),
    content: z.string(),
    more_content: z.string().nullable(),
    position: z.number().int(),
  })
  .meta({
    propertyOrdering: ["title", "content", "more_content", "position"],
  });

export const GeneratedResourceSchema = z
  .object({
    name: z.string(),
    sections: z.array(ResourceSectionSchema),
    intro: z.string(),
    description: z.string(),
    short_description: z.string(),
  })
  .meta({
    propertyOrdering: [
      "name",
      "sections",
      "intro",
      "description",
      "short_description",
    ],
  });

export type GeneratedResource = z.infer<typeof GeneratedResourceSchema>;
