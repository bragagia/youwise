export function SuccessResponse<T>(data: T) {
  return new Response(JSON.stringify(data), {
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
