import { CreateFastifyContextOptions } from "@trpc/server/adapters/fastify";
import {
  NoAuth,
  noAuth,
  UserAuthed,
  UserExpiredAuth,
} from "../../utils/auth.js";
import { BadRequestError } from "../../utils/errors.js";
import { Services } from "../envs/type.js";

export function buildCreateContext(srv: Services) {
  return ({ req, res }: CreateFastifyContextOptions) => {
    const { auth, error } = validateRequestAccessToken(
      srv,
      req.headers.authorization
    );
    if (error) throw error;

    return { req, res, srv: srv, auth };
  };
}

type validateRequestAccessTokenReturnType =
  | {
      auth: undefined;
      error: BadRequestError;
    }
  | {
      auth: NoAuth | UserAuthed | UserExpiredAuth;
      error: undefined;
    };

function validateRequestAccessToken(
  srv: Services,
  authHeader: string | undefined
): validateRequestAccessTokenReturnType {
  if (!authHeader || authHeader.trim() === "") {
    return {
      auth: noAuth,
      error: undefined,
    };
  }

  if (!authHeader.startsWith("Bearer ")) {
    return {
      auth: undefined,
      error: new BadRequestError(
        "Invalid Authorization header: " +
          JSON.stringify({ authHeader: authHeader }, null, 2)
      ),
    };
  }
  const token = authHeader.slice(7);

  const validation = srv.jwt.validateAccessToken(token);
  if (validation.error !== undefined) {
    return {
      auth: undefined,
      error: new BadRequestError(
        "Invalid Authorization header: " + validation.error
      ),
    };
  }

  if (validation.expired) {
    return {
      auth: {
        authed: false,
        root: false,
        expired: true,
        userId: validation.userId ?? "",
      },
      error: undefined,
    };
  }

  return {
    auth: {
      authed: true,
      root: false,
      expired: false,
      userId: validation.userId,
      accessToken: token,
    },
    error: undefined,
  };
}

export type TrpcContext = Awaited<
  ReturnType<ReturnType<typeof buildCreateContext>>
>;
