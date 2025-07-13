import {
  CardModelUnsaved,
  CardVariantArraySchema,
  DB,
  fromCardModelToCardWithVariants,
  UpdatableCardModel,
} from "@youwise/shared";
import { Kysely } from "kysely";

export class DatabaseCards {
  constructor(private db: Kysely<DB>) {}

  async saveGeneratedCards(sectionId: string, cards: UpdatableCardModel[]) {
    // Ensure we save valid variants for each card
    cards.forEach((card) => {
      CardVariantArraySchema.parse(card.variants);
    });

    const savedCards = await this.db.transaction().execute(async (trx) => {
      const results = await Promise.all(
        cards.map(async (card) => {
          return await trx
            .insertInto("cards")
            .values({
              resource_section_id: sectionId,
              variants: JSON.stringify(card.variants),
              level: card.level,
            })
            .returningAll()
            .executeTakeFirstOrThrow();
        })
      );

      return results;
    });

    return savedCards;
  }

  async createCard(sectionId: string, card: CardModelUnsaved) {
    // Ensure we save valid variants
    CardVariantArraySchema.parse(card.variants);

    const newCard = await this.db
      .insertInto("cards")
      .values({
        resource_section_id: sectionId,
        variants: JSON.stringify(card.variants),
        level: card.level,
      })
      .returningAll()
      .executeTakeFirstOrThrow();

    return fromCardModelToCardWithVariants(newCard);
  }

  async updateCard(cardId: string, card: CardModelUnsaved) {
    // Ensure we save valid variants
    CardVariantArraySchema.parse(card.variants);

    const updatedCard = await this.db
      .updateTable("cards")
      .set({
        variants: JSON.stringify(card.variants),
        level: card.level,
        updated_at: new Date(),
      })
      .where("id", "=", cardId)
      .returningAll()
      .executeTakeFirstOrThrow();

    return fromCardModelToCardWithVariants(updatedCard);
  }

  async deleteCard(cardId: string) {
    await this.db.deleteFrom("cards").where("id", "=", cardId).execute();
  }
}
