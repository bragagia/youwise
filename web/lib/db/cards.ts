import { getDatabase } from "@/lib/database";
import {
  CardModelUnsaved,
  CardVariantArraySchema,
  fromCardModelToCardWithVariants,
  UpdatableCardModel,
} from "@youwise/shared";

export async function saveGeneratedCards(
  sectionId: string,
  cards: UpdatableCardModel[]
) {
  const database = getDatabase();

  // Ensure we save valid variants for each card
  cards.forEach((card) => {
    CardVariantArraySchema.parse(card.variants);
  });

  const savedCards = await database.transaction().execute(async (trx) => {
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

export async function createCard(sectionId: string, card: CardModelUnsaved) {
  const database = getDatabase();

  // Ensure we save valid variants
  CardVariantArraySchema.parse(card.variants);

  const newCard = await database
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

export async function updateCard(cardId: string, card: CardModelUnsaved) {
  const database = getDatabase();

  // Ensure we save valid variants
  CardVariantArraySchema.parse(card.variants);

  const updatedCard = await database
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

export async function deleteCard(cardId: string) {
  const database = getDatabase();

  await database.deleteFrom("cards").where("id", "=", cardId).execute();
}
