/**
 * Centralized API Client for enterprise backend requests.
 * Easily configured with BASE_URL, authentication headers, and interceptors.
 */

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://api.realsuccess.com/v1";

interface RequestOptions extends RequestInit {
  data?: unknown;
}

export async function apiClient<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
  const { data, headers, ...customConfig } = options;

  const token = typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;

  const config: RequestInit = {
    method: data ? "POST" : "GET",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
    ...(data ? { body: JSON.stringify(data) } : {}),
    ...customConfig,
  };

  const response = await fetch(`${BASE_URL}${endpoint}`, config);

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `API error: ${response.status}`);
  }

  return response.json();
}
