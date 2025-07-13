import { NextRequest, NextResponse } from "next/server";
import { nextBasicAuthMiddleware } from "nextjs-basic-auth-middleware";

export function middleware(request: NextRequest, _response: NextResponse) {
  const response = nextBasicAuthMiddleware(
    {
      users: [
        {
          name: "admin",
          password: "WrZYIj6VvIZ2LQK",
        },
      ],
    },
    request
  );

  if (response.status !== 200) {
    return response;
  }

  return NextResponse.next();
}
