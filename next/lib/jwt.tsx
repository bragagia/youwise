import jwt from "jsonwebtoken";

const JWT_PRIVATE_KEY = process.env.JWT_PRIVATE_KEY!;
const JWT_PUBLIC_KEY = process.env.JWT_PUBLIC_KEY!;
const ACCESS_TOKEN_EXPIRY = "60m";
const REFRESH_TOKEN_EXPIRY = "90d";

export function generateRefreshToken(userId: string) {
  const payload = {
    sub: userId,
    type: "refresh",
  };

  return jwt.sign(payload, JWT_PRIVATE_KEY, {
    algorithm: "RS256",
    expiresIn: REFRESH_TOKEN_EXPIRY,
  });
}

export function generateAccessToken(userId: string) {
  const payload = {
    sub: userId,
    type: "access",
  };

  return jwt.sign(payload, JWT_PRIVATE_KEY, {
    algorithm: "RS256",
    expiresIn: ACCESS_TOKEN_EXPIRY,
  });
}

export function validateRefreshToken(token: string) {
  try {
    const decoded = jwt.verify(token, JWT_PUBLIC_KEY, {
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

export function validateAccessToken(token: string) {
  try {
    const decoded = jwt.verify(token, JWT_PUBLIC_KEY, {
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

export function validateRequestAccessToken(request: Request) {
  const authHeader = request.headers.get("Authorization");
  if (!authHeader) {
    return {
      tokenErrorResponse: new Response(
        JSON.stringify({
          error: "Missing Authorization header",
        }),
        {
          status: 401,
          headers: {
            "Content-Type": "application/json",
          },
        }
      ),
    };
  }

  if (!authHeader.startsWith("Bearer ")) {
    return {
      tokenErrorResponse: new Response(
        JSON.stringify({
          error: "Invalid Authorization header",
        }),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json",
          },
        }
      ),
    };
  }
  const token = authHeader.slice(7);

  const validation = validateAccessToken(token);
  if (validation.error || validation.expired) {
    return {
      tokenErrorResponse: new Response(
        JSON.stringify({
          error: validation.error,
          expired: validation.expired,
        }),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json",
          },
        }
      ),
    };
  }

  return {
    userId: validation.userId,
  };
}
