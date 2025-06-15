import { Selectable } from "kysely";
import { Users } from "../database.js";

export type UserModel = Selectable<Users>;
