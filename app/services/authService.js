const COSMO_LOGIN_URL = "/api/login";
const AUTH_API_URL = "/api/auth";

export async function sendMagicLinkRequest(email) {
  const response = await fetch(`${AUTH_API_URL}?email=${encodeURIComponent(email)}`);
  if (!response.ok) throw new Error("Failed to send magic link email");

  return await response.json();
}

export async function exchangeAuthToken(transactionId, pendingToken) {
  const response = await fetch(AUTH_API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ transactionId, pendingToken }),
  });

  if (!response.ok) throw new Error("Token exchange failed");
  return await response.json();
}

export async function loginToCosmoRequest(email, idToken) {
  const response = await fetch(COSMO_LOGIN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, idToken }),
  });

  if (!response.ok) throw new Error("Cosmo login failed");
  return await response.json();
}
