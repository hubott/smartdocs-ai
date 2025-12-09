export async function api<T>(
  url: string,
  options: RequestInit = {}
): Promise<T> {
  const res = await fetch(`http://localhost:8080${url}`, {
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {})
    },
    ...options,
    cache: "no-store" // important for auth
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.message || `Error: ${res.status}`);
  }

  return res.json() as Promise<T>;
}
