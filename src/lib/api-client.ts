/**
 * Centralized API Client for enterprise backend requests.
 * Easily configured with BASE_URL, authentication headers, and interceptors.
 */

const BASE_URL = (process.env.NEXT_PUBLIC_API_URL || "https://api.ourrealsuccess.com/api").replace(/\/+$/, "");

interface RequestOptions extends RequestInit {
  data?: unknown;
}

export async function apiClient<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
  const { data, headers, ...customConfig } = options;

  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("token") || localStorage.getItem("accessToken")
      : null;

  const isFormData = typeof FormData !== "undefined" && data instanceof FormData;

  const defaultHeaders: Record<string, string> = {};
  if (!isFormData) {
    defaultHeaders["Content-Type"] = "application/json";
  }
  if (token) {
    defaultHeaders["Authorization"] = `Bearer ${token}`;
  }

  const method = options.method || (data ? "POST" : "GET");
  const config: RequestInit = {
    method,
    headers: {
      ...defaultHeaders,
      ...headers,
    },
    ...(data ? { body: isFormData ? (data as FormData) : JSON.stringify(data) } : {}),
    ...customConfig,
  };

  const cleanEndpoint = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
  const response = await fetch(`${BASE_URL}${cleanEndpoint}`, config);

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `API error: ${response.status}`);
  }

  return response.json();
}
