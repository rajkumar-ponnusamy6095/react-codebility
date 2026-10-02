export class ApiError extends Error {
  public readonly status: number;

  constructor(
    message: string,
    status: number,
  ) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

const API_BASE_URL = (
  import.meta.env.VITE_API_BASE_URL ?? "http://localhost:3000"
).replace(/\/+$/, "");

interface ApiRequestOptions extends RequestInit {
  token?: string | null;
}

export const apiRequest = async <T>(
  path: string,
  options: ApiRequestOptions = {},
): Promise<T | undefined> => {
  const { token, headers: requestHeaders, body, ...requestOptions } = options;
  const headers = new Headers(requestHeaders);
  const authToken =
    token === undefined ? localStorage.getItem("token") : token;

  if (body !== undefined && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  if (authToken) {
    headers.set("Authorization", `Bearer ${authToken}`);
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...requestOptions,
    headers,
    body,
  });
  const responseText = await response.text();

  if (!response.ok) {
    let message = response.statusText || "Request failed";

    if (responseText) {
      try {
        const errorBody: unknown = JSON.parse(responseText);
        if (
          typeof errorBody === "object" &&
          errorBody !== null &&
          "message" in errorBody &&
          typeof errorBody.message === "string"
        ) {
          message = errorBody.message;
        } else {
          message = responseText;
        }
      } catch {
        message = responseText;
      }
    }

    throw new ApiError(message, response.status);
  }

  if (!responseText) {
    return undefined;
  }

  return JSON.parse(responseText) as T;
};
