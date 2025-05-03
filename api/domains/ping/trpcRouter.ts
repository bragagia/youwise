import { t } from "../../main/http/trpc.js";
import { ping } from "./ping.js";

export const pingTrpcRouter = t.router({
  ping: t.procedure.query(ping),
});
