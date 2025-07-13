"use server";

import { getServices } from "@/lib/database";
import { UpdateResource } from "@/lib/db/resources";

export async function updateResourceAction(
  resourceId: string,
  resource: UpdateResource
) {
  try {
    const { db } = await getServices();
    const updatedResource = await db.resources.updateResource(resourceId, resource);

    return { success: true, resource: updatedResource };
  } catch (error) {
    console.error("Error updating resource:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to update resource",
    };
  }
}

export async function getResourceByIdAction(resourceId: string) {
  try {
    const { db } = await getServices();
    const resource = await db.resources.getResourceById(resourceId);

    return { success: true as const, resource };
  } catch (error) {
    console.error("Error fetching resource:", error);
    return {
      success: false as const,
      error:
        error instanceof Error ? error.message : "Failed to fetch resource",
    };
  }
}
