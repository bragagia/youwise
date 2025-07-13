import { DB, fromCardModelToCardWithVariants } from "@youwise/shared";
import { Kysely } from "kysely";
import { jsonArrayFrom, jsonObjectFrom } from "kysely/helpers/postgres";

const levelsRanking = ["example", "knowledge", "core_concept"];

export class DatabaseResources {
  constructor(private db: Kysely<DB>) {}

  async getResources() {
    return await this.db
      .selectFrom("resources")
      .selectAll()
      .orderBy("created_at", "desc")
      .execute();
  }

  async getResourceById(resourceId: string) {
    return await this.db
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
      .executeTakeFirstOrThrow();
  }

  async getResourceSectionById(sectionId: string) {
    const dbSection = await this.db
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
      .executeTakeFirstOrThrow();

    const section = {
      ...dbSection,
      cards: dbSection.cards
        .map((card) => fromCardModelToCardWithVariants(card))
        .sort(
          (a, b) =>
            levelsRanking.indexOf(b.level) - levelsRanking.indexOf(a.level)
        ),
    };

    return section;
  }

  async saveResource(resource: {
    name: string;
    description: string;
    intro: string;
    short_description: string;
    sections: {
      title: string;
      content: string;
      more_content?: string | null;
      position: number;
    }[];
  }) {
    const savedResource = await this.db.transaction().execute(async (trx) => {
      const newResource = await trx
        .insertInto("resources")
        .values({
          name: resource.name,
          description: resource.description,
          intro: resource.intro,
          short_description: resource.short_description,
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

  async updateResource(
    resourceId: string,
    resource: {
      name: string;
      description: string;
      intro: string;
      short_description: string;
      cover?: string;
      tint?: number;
    }
  ) {
    const updatedResource = await this.db
      .updateTable("resources")
      .set({
        name: resource.name,
        description: resource.description,
        intro: resource.intro,
        short_description: resource.short_description,
        cover: resource.cover,
        tint: resource.tint,
        updated_at: new Date(),
      })
      .where("id", "=", resourceId)
      .returningAll()
      .executeTakeFirstOrThrow();

    return updatedResource;
  }

  async updateResourceSection(
    sectionId: string,
    section: {
      title: string;
      content: string;
      more_content?: string | null;
      position: number;
    }
  ) {
    const updatedSection = await this.db
      .updateTable("resource_sections")
      .set({
        title: section.title,
        content: section.content,
        more_content: section.more_content || null,
        position: section.position,
        updated_at: new Date(),
      })
      .where("id", "=", sectionId)
      .returningAll()
      .executeTakeFirstOrThrow();

    return updatedSection;
  }
}

export type ResourceWithSections = NonNullable<
  Awaited<ReturnType<DatabaseResources["getResourceById"]>>
>;

export type UpdateResource = {
  name: string;
  description: string;
  intro: string;
  short_description: string;
  cover?: string;
  tint?: number;
};
