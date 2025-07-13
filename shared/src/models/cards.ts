import { Selectable, Updateable } from "kysely";
import { Cards } from "../database";
import { CardVariantArray, CardVariantArraySchema } from "./card-schemas";

export type CardModel = Omit<Selectable<Cards>, "variants"> & {
  variants: CardVariantArray;
};
export type UpdatableCardModel = Omit<Updateable<Cards>, "variants"> & {
  variants: CardVariantArray;
};

export type CardModelUnsaved = Pick<CardModel, 'level' | 'variants'>;

export function fromCardModelToCardWithVariants(
  card: Selectable<Cards>
): CardModel {
  const variants = CardVariantArraySchema.parse(card.variants);

  return {
    ...card,
    variants,
  };
}
