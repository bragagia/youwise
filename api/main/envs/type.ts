import { Database } from "@/services/db/db.js";
import { GoogleAuthService } from "@/services/googleAuth/googleAuth.js";
import { JWTService } from "@/services/jwt/jwt.js";

export type Services = {
  db: Database;
  jwt: JWTService;
  googleAuth: GoogleAuthService;
};
