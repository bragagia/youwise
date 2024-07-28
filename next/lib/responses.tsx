import { Schema } from "zod";

export function SuccessResponse<T>(schema: Schema, data: T) {
  const resObj = schema.parse(data);

  return new Response(JSON.stringify(resObj), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
}

export function ErrorResponse<T>(data: T, code: number) {
  return new Response(JSON.stringify(data), {
    status: code,
    headers: {
      "Content-Type": "application/json",
    },
  });
}
