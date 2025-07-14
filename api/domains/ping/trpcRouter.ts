import { ping } from "@/domains/ping/ping.js";
import { t } from "@/main/http/trpc.js";

export const pingTrpcRouter = t.router({
  ping: t.procedure.query(ping),
});
