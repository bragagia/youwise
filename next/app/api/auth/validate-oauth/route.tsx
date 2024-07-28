import { generateAccessToken, generateRefreshToken } from "@/lib/jwt";
import { ErrorResponse, SuccessResponse } from "@/lib/responses";
import { PrismaClient, User } from "@prisma/client";
import { OAuth2Client } from "google-auth-library";
import {
  AuthValidateOAuthRequest,
  authValidateOAuthRequestSchema,
  AuthValidateOAuthResponse,
  authValidateOAuthResponseSchema,
} from "youwise-shared/api";

type UserInfoOAuth = {
  email: string;
  emailVerified: boolean;
  picture?: string;
  firstName: string;
  familyName?: string;
} & (
  | {
      type: "apple";
      appleUid: string;
    }
  | {
      type: "google";
      googleUid: string;
    }
);

export async function POST(request: Request) {
  const body = authValidateOAuthRequestSchema.safeParse(await request.json());

  if (!body.success) {
    return ErrorResponse(body.error, 400);
  }

  let userInfo: UserInfoOAuth;
  try {
    if (body.data.type === "google") {
      userInfo = await validateGoogleAuth(body.data);
    } else {
      // if (body.data.type === "apple")
      return ErrorResponse(
        {
          error: "Apple login is not supported yet",
        },
        400
      );
    }
  } catch (e) {
    return ErrorResponse(
      {
        error: e,
      },
      400
    );
  }

  const prisma = new PrismaClient();

  // Check if user already exists
  let existingUser: User | null;
  if (userInfo.type === "google") {
    existingUser = await prisma.user.findUnique({
      where: {
        googleUid: userInfo.googleUid,
      },
    });
  } else {
    // apple
    return ErrorResponse(
      {
        error: "Apple login is not supported yet",
      },
      400
    );
  }

  // If can't find user by oauth uid, try to find by email
  if (!existingUser) {
    existingUser = await prisma.user.findUnique({
      where: {
        email: userInfo.email,
      },
    });

    if (existingUser) {
      return ErrorResponse(
        {
          error: "Email already exists, try another login method",
        },
        400
      );
    }
  }

  let user: User;
  // Create user if not exists
  if (existingUser) {
    user = existingUser;
  } else {
    user = await prisma.user.create({
      data: {
        email: userInfo.email,
        givenName: userInfo.firstName,
        familyName: userInfo.familyName,
        //picture: userInfo.picture,
        googleUid: userInfo.type === "google" ? userInfo.googleUid : undefined,
        //appleUid: userInfo.type === "apple" ? userInfo.appleUid : undefined,
      },
    });
  }

  await prisma.$disconnect();

  return SuccessResponse<AuthValidateOAuthResponse>(
    authValidateOAuthResponseSchema,
    {
      refreshToken: generateRefreshToken(user.id),
      accessToken: generateAccessToken(user.id),
      userId: user.id,
    }
  );
}

async function validateGoogleAuth(
  req: AuthValidateOAuthRequest
): Promise<UserInfoOAuth> {
  if (req.type !== "google") {
    throw new Error("Invalid type");
  }

  const client = new OAuth2Client();

  const ticket = await client.verifyIdToken({
    idToken: req.googleToken,
    audience: [process.env.NATIVE_GOOGLE_ID_CLIENT!],
  });

  const payload = ticket.getPayload();
  if (!payload) {
    throw new Error("Invalid token");
  }

  return {
    type: "google",
    googleUid: payload.sub,
    email: payload.email || req.email,
    emailVerified: payload.email_verified || false,
    picture: payload.picture,
    firstName: payload.given_name || req.givenName,
    familyName: payload.family_name,
  };
}
