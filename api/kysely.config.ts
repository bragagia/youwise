import { defineConfig } from "kysely-ctl";
import { initEnvVars } from "./main/envVars.js";
import { createDatabase } from "./services/db/db.js";

const envVars = initEnvVars();
const kysely = createDatabase({
  database: envVars.DB_NAME,
  host: envVars.DB_HOST,
  user: envVars.DB_USER,
  password: envVars.DB_PASSWORD,
  port: envVars.DB_PORT,
});

export default defineConfig({
  kysely,
  migrations: {
    migrationFolder: "migrations",
  },
  //   plugins: [],
  //   seeds: {
  //     seedFolder: "seeds",
  //   }
});
