import { getDatabase } from "@/lib/database";
import { UpdatableCardModel } from "@youwise/shared";
import console from "console";
import { v4 as uuidv4 } from "uuid";

export async function saveGeneratedCards(
  sectionId: string,
  cards: UpdatableCardModel[]
) {
  console.log(
    `[DB Cards] Saving ${cards.length} cards for section: ${sectionId}`
  );

  const database = getDatabase();

  try {
    const savedCards = await database.transaction().execute(async (trx) => {
      const results = await Promise.all(
        cards.map(async (card) => {
          const cardId = uuidv4();

          console.log(
            `[DB Cards] Saving card ${cardId} with ${card.variants.length} variants`
          );

          return await trx
            .insertInto("cards")
            .values({
              id: cardId,
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

    console.log(`[DB Cards] Successfully saved ${savedCards.length} cards`);
    return savedCards;
  } catch (error) {
    console.error(
      `[DB Cards] Error saving cards for section ${sectionId}:`,
      error
    );
    throw error;
  }
}
