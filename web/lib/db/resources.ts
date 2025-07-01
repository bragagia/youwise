"use server";

import { getDatabase } from "@/lib/database";
import { jsonArrayFrom, jsonObjectFrom } from "kysely/helpers/postgres";

export async function getResources() {
  const database = getDatabase();
  return await database
    .selectFrom("resources")
    .selectAll()
    .orderBy("created_at", "desc")
    .execute();
}
export async function getResourceById(resourceId: string) {
  const database = getDatabase();
  return await database
    .selectFrom("resources")
    .selectAll()
    .where("resources.id", "=", resourceId)
    .select((eb) => [
      jsonArrayFrom(
        eb
          .selectFrom("resource_sections")
          .selectAll()
          .whereRef("resource_sections.resource_id", "=", "resources.id")
          .orderBy("resource_sections.position", "asc")
      ).as("sections"),
    ])
    .executeTakeFirst();
}
export async function getResourceSectionById(sectionId: string) {
  const database = getDatabase();
  return await database
    .selectFrom("resource_sections")
    .selectAll()
    .where("resource_sections.id", "=", sectionId)
    .select((eb) => [
      jsonObjectFrom(
        eb
          .selectFrom("resources")
          .selectAll()
          .whereRef("resources.id", "=", "resource_sections.resource_id")
      ).as("resource"),
      jsonArrayFrom(
        eb
          .selectFrom("cards")
          .selectAll()
          .whereRef("cards.resource_section_id", "=", "resource_sections.id")
          .orderBy("cards.created_at", "desc")
      ).as("cards"),
    ])
    .executeTakeFirst();
}
export async function saveResource(resource: {
  name: string;
  description: string;
  sections: {
    title: string;
    content: string;
    more_content?: string | null;
    position: number;
  }[];
}) {
  const database = getDatabase();
  const savedResource = await database.transaction().execute(async (trx) => {
    const newResource = await trx
      .insertInto("resources")
      .values({
        name: resource.name,
        description: resource.description,
        cover: "/placeholder.svg?height=200&width=150", // Will be handled later
        tint: Math.floor(Math.random() * 10) + 1, // Random tint for now
      })
      .returningAll()
      .executeTakeFirstOrThrow();

    const sections = await Promise.all(
      resource.sections.map((section) =>
        trx
          .insertInto("resource_sections")
          .values({
            resource_id: newResource.id,
            title: section.title,
            content: section.content,
            more_content: section.more_content || null,
            position: section.position,
          })
          .returningAll()
          .executeTakeFirstOrThrow()
      )
    );

    return { ...newResource, sections };
  });
  return savedResource;
}
export async function updateResource(
  resourceId: string,
  resource: {
    name: string;
    description: string;
    sections: {
      title: string;
      content: string;
      more_content?: string | null;
      position: number;
    }[];
  }
) {
  const database = getDatabase();
  const updatedResource = await database.transaction().execute(async (trx) => {
    const updated = await trx
      .updateTable("resources")
      .set({
        name: resource.name,
        description: resource.description,
        updated_at: new Date(),
      })
      .where("id", "=", resourceId)
      .returningAll()
      .executeTakeFirstOrThrow();

    // Delete existing sections
    await trx
      .deleteFrom("resource_sections")
      .where("resource_id", "=", resourceId)
      .execute();

    // Insert new sections
    const sections = await Promise.all(
      resource.sections.map((section) =>
        trx
          .insertInto("resource_sections")
          .values({
            resource_id: resourceId,
            title: section.title,
            content: section.content,
            more_content: section.more_content || null,
            position: section.position,
          })
          .returningAll()
          .executeTakeFirstOrThrow()
      )
    );

    return { ...updated, sections };
  });
  return updatedResource;
}
