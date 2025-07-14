import { Services } from "@/main/envs/type.js";
import { EnvVars } from "@/main/envVars.js";
import { createDatabase } from "@/services/db/db.js";
import { GoogleAuthService } from "@/services/googleAuth/googleAuth.js";
import { JWTService } from "@/services/jwt/jwt.js";

export function createEnvDevelopment(envVars: EnvVars): Services {
  return {
    db: createDatabase({
      database: envVars.DB_NAME,
      host: envVars.DB_HOST,
      user: envVars.DB_USER,
      password: envVars.DB_PASSWORD,
      port: envVars.DB_PORT,
    }),
    jwt: new JWTService({
      jwtPrivateKey: envVars.JWT_PRIVATE_KEY,
      jwtPublicKey: envVars.JWT_PUBLIC_KEY,
    }),
    googleAuth: new GoogleAuthService({
      clientId: envVars.NATIVE_GOOGLE_ID_CLIENT,
    }),
  };
}
