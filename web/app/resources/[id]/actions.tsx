"use server";

import { getServices } from "@/lib/database";
import { revalidatePath } from "next/cache";

export async function publishResource(resourceId: string) {
  const { db } = await getServices();

  await db.resources.publishResource(resourceId);
  revalidatePath(`/resources/${resourceId}`);
}

export async function unpublishResource(resourceId: string) {
  const { db } = await getServices();

  await db.resources.unpublishResource(resourceId);
  revalidatePath(`/resources/${resourceId}`);
}