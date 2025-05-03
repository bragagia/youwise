import { createDatabase } from "../../services/db/db.js";
import { EnvVars } from "../envVars.js";
import { Services } from "./type.js";

export function createEnvDevelopment(envVars: EnvVars): Services {
  return {
    db: createDatabase({
      database: envVars.DB_NAME,
      host: envVars.DB_HOST,
      user: envVars.DB_USER,
      password: envVars.DB_PASSWORD,
      port: envVars.DB_PORT,
    }),
  };
}
