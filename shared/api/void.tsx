import { z } from "zod";

export const VoidResponseS = z.object({});
export type VoidResponseT = z.infer<typeof VoidResponseS>;
