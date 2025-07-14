import { createEnvDevelopment } from "@/main/envs/development.js";
import { EnvVars, initEnvVars } from "@/main/envVars.js";
import { startHttpServer } from "@/main/http/server.js";

export function startApi() {
  const env = initEnvVars();
  const services = createServices(env);

  startHttpServer(services);
}

function createServices(envVars: EnvVars) {
  switch (envVars.NODE_ENV) {
    case "development":
      return createEnvDevelopment(envVars);

    default:
      throw new Error(`Unknown environment: ${envVars.NODE_ENV}`);
  }
}

startApi();
