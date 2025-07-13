import { Resources, ResourceSections } from "@youwise/shared";
import { Insertable, Selectable } from "kysely";

export type ResourceSection = Selectable<ResourceSections>;
export type ResourceWithSections = Insertable<Resources> & {
  sections: ResourceSection[];
};
