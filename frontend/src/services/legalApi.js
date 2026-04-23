const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

export async function fetchLegalAdvice(query) {
  const response = await fetch(`${BASE_URL}/api/legal/advice`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || `Server error: ${response.status}`);
  }

  return response.json();
}

export async function checkHealth() {
  const response = await fetch(`${BASE_URL}/api/legal/health`);
  return response.ok;
}
