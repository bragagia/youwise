import { validateRequestAccessToken } from "@/lib/jwt";
import { SuccessResponse } from "@/lib/responses";
import { UserResourcesResponseT } from "youwise-shared/api/user";

const userResources = [
  {
    id: "1",
    title: "Sapiens: A Brief History of Humankind",
  },
  { id: "2", title: "Resource 2" },
  { id: "3", title: "Resource 3" },
  { id: "3", title: "Resource 3" },
  { id: "3", title: "Resource 3" },
];

export async function POST(request: Request) {
  const { userId, tokenErrorResponse } = validateRequestAccessToken(request);
  if (tokenErrorResponse) return tokenErrorResponse;

  return SuccessResponse<UserResourcesResponseT>({
    resources: userResources,
  });
}
