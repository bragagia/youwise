import { OAuth2Client } from "google-auth-library";
import { BadRequestError } from "../../utils/errors.js";

export type UserInfoGoogleOAuth = {
  email: string;
  emailVerified: boolean;
  picture?: string;
  firstName: string;
  familyName?: string;
  type: "google";
  googleUid: string;
};

export type GoogleAuthInput = {
  type: "google";
  googleToken: string;
};

export class GoogleAuthService {
  private readonly _clientId: string;

  constructor(config: { clientId: string }) {
    this._clientId = config.clientId;
  }

  public get clientId(): string {
    return this._clientId;
  }

  public async validateGoogleAuth(
    req: GoogleAuthInput
  ): Promise<UserInfoGoogleOAuth> {
    if (req.type !== "google") {
      throw new BadRequestError("Invalid type");
    }

    const client = new OAuth2Client();

    const ticket = await client.verifyIdToken({
      idToken: req.googleToken,
      audience: [this._clientId],
    });

    const payload = ticket.getPayload();
    if (!payload) {
      throw new BadRequestError("Invalid token");
    }

    if (!payload.email || !payload.given_name) {
      throw new BadRequestError("Invalid token, missing email or first name");
    }

    return {
      type: "google",
      googleUid: payload.sub,
      email: payload.email,
      emailVerified: payload.email_verified || false,
      picture: payload.picture,
      firstName: payload.given_name,
      familyName: payload.family_name,
    };
  }
}
