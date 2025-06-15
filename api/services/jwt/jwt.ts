import jwt from "jsonwebtoken";

const ACCESS_TOKEN_EXPIRY = "60m";
const REFRESH_TOKEN_EXPIRY = "90d";

type validateAccessTokenReturnType =
  | {
      userId: string;
      expired: undefined;
      error: undefined;
    }
  | {
      userId: undefined;
      expired: true;
      error: undefined;
    }
  | {
      userId: undefined;
      expired: undefined;
      error: string;
    };

export class JWTService {
  private readonly _jwtPrivateKey: string;
  private readonly _jwtPublicKey: string;

  constructor(config: { jwtPrivateKey: string; jwtPublicKey: string }) {
    this._jwtPrivateKey = config.jwtPrivateKey;
    this._jwtPublicKey = config.jwtPublicKey;
  }

  public generateRefreshToken(userId: string) {
    const payload = {
      sub: userId,
      type: "refresh",
    };

    return jwt.sign(payload, this._jwtPrivateKey, {
      algorithm: "RS256",
      expiresIn: REFRESH_TOKEN_EXPIRY,
    });
  }

  public generateAccessToken(userId: string) {
    const payload = {
      sub: userId,
      type: "access",
    };

    return jwt.sign(payload, this._jwtPrivateKey, {
      algorithm: "RS256",
      expiresIn: ACCESS_TOKEN_EXPIRY,
    });
  }

  public validateRefreshToken(token: string) {
    try {
      const decoded = jwt.verify(token, this._jwtPublicKey, {
        algorithms: ["RS256"],
      });

      if (typeof decoded === "string") {
        throw new Error("Invalid token, decoded is a string");
      }
      if (decoded.type !== "refresh") {
        throw new Error("Invalid token type");
      }
      if (!decoded.sub) {
        throw new Error("Invalid token, missing sub");
      }

      return {
        userId: decoded.sub,
      };
    } catch (err: any) {
      if (err.name === "TokenExpiredError") {
        return {
          expired: true,
        };
      } else {
        return {
          error: err.message,
        };
      }
    }
  }

  public validateAccessToken(token: string): validateAccessTokenReturnType {
    try {
      const decoded = jwt.verify(token, this._jwtPublicKey, {
        algorithms: ["RS256"],
      });

      if (typeof decoded === "string") {
        throw new Error("Invalid token, decoded is a string");
      }
      if (decoded.type !== "access") {
        throw new Error("Invalid token type");
      }
      if (!decoded.sub) {
        throw new Error("Invalid token, missing sub");
      }

      return {
        userId: decoded.sub,
        expired: undefined,
        error: undefined,
      };
    } catch (err: any) {
      if (err.name === "TokenExpiredError") {
        return {
          userId: undefined,
          expired: true,
          error: undefined,
        };
      } else {
        return {
          userId: undefined,
          expired: undefined,
          error: err.message,
        };
      }
    }
  }
}
