import { z } from "zod";

export const UserResourcesResponseS = z.object({
  resources: z.array(
    z.object({
      id: z.string(),
      title: z.string(),
    })
  ),
});
export type UserResourcesResponseT = z.infer<typeof UserResourcesResponseS>;

export const UserCreateRequestS = z.object({
  url: z.string(),
});
export type UserCreateRequestT = z.infer<typeof UserCreateRequestS>;
