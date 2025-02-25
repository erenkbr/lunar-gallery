import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { useLocalStorage } from './useLocalStorage';

const STORAGE_KEYS = {
  EMAIL: "userEmail",
  ID_TOKEN: "idToken",
  USER_DETAILS: "userDetails",
  PENDING_AUTH: "pendingAuth",
};

const AUTH_API_URL = "/api/auth";
const COSMO_LOGIN_URL = "/api/login";
const POLLING_INTERVAL = 2000;
const MAX_POLL_ATTEMPTS = 30; // Stop after ~1 minute if no success

export function useAuth() {
  const queryClient = useQueryClient();
  const [email, setEmail] = useLocalStorage(STORAGE_KEYS.EMAIL, null);
  const [idToken, setIdToken] = useLocalStorage(STORAGE_KEYS.ID_TOKEN, null);
  const [userDetails, setUserDetails] = useLocalStorage(STORAGE_KEYS.USER_DETAILS, null);
  const [pendingAuth, setPendingAuth] = useLocalStorage(STORAGE_KEYS.PENDING_AUTH, null);
  const [pollAttempts, setPollAttempts] = useState(0);

  const isLoggedIn = !!idToken;

  const sendMagicLink = useMutation({
    mutationFn: async (email) => {
      const response = await fetch(`${AUTH_API_URL}?email=${encodeURIComponent(email)}`);
      if (!response.ok) throw new Error("Failed to send magic link");
      const data = await response.json();
      if (!data.success || !data.pendingToken) throw new Error("Failed to get pending token");
      return { email, pendingToken: data.pendingToken, transactionId: data.transactionId };
    },
    onSuccess: ({ email, pendingToken, transactionId }) => {
      console.log("Magic link sent:", { email, pendingToken, transactionId });
      setEmail(email);
      setPendingAuth({ pendingToken, transactionId });
      setPollAttempts(0); // Reset attempts
      queryClient.setQueryData(["auth"], { email, idToken: null, userDetails: null });
      alert("Check your email to authenticate!");
    },
    onError: (error) => {
      console.error("Send magic link error:", error);
      alert(error.message || "Failed to send magic link");
    },
  });

  const exchangeToken = useMutation({
    mutationFn: async ({ transactionId, pendingToken }) => {
      console.log("Polling with:", { transactionId, pendingToken, attempt: pollAttempts + 1 });
      const response = await fetch(AUTH_API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ transactionId, pendingToken }),
      });
      const data = await response.json();
      console.log("Polling response:", data);
      if (!response.ok) throw new Error("Token exchange failed");
      if (!data.success) {
        return { success: false, error: data.error || "Unknown error" };
      }
      return data;
    },
    onSuccess: (data) => {
      if (data.success && data.ssoCredential?.idToken) {
        console.log("Token exchanged:", data.ssoCredential.idToken);
        setIdToken(data.ssoCredential.idToken);
        setPendingAuth(null);
        setPollAttempts(0);
        loginToCosmo.mutate({ email, idToken: data.ssoCredential.idToken });
      } else {
        console.log("Poll failed, continuing:", data.error);
        setPollAttempts((prev) => prev + 1);
      }
    },
    onError: (error) => {
      console.error("Exchange token error:", error);
      setPendingAuth(null);
      setPollAttempts(0);
      alert(error.message || "Failed to complete authentication");
    },
  });

  const loginToCosmo = useMutation({
    mutationFn: async ({ email, idToken }) => {
      const response = await fetch(COSMO_LOGIN_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, idToken }),
      });
      if (!response.ok) throw new Error("Cosmo login failed");
      const data = await response.json();
      if (!data.success) throw new Error(data.error || "Cosmo login failed");
      return data.cosmoData;
    },
    onSuccess: (userDetails) => {
      setUserDetails(userDetails);
      queryClient.setQueryData(["auth"], { email, idToken, userDetails });
      console.log("🎉 Successfully authenticated with Cosmo!", userDetails);
    },
    onError: (error) => {
      console.error("🚨 Cosmo login failed:", error);
      alert(error.message || "Authentication failed");
    },
  });

  useEffect(() => {
    if (!pendingAuth || isLoggedIn) return;

    const pollInterval = setInterval(() => {
      if (pollAttempts >= MAX_POLL_ATTEMPTS) {
        console.log("Max poll attempts reached, stopping");
        setPendingAuth(null);
        setPollAttempts(0);
        alert("Authentication timed out. Please try again.");
        clearInterval(pollInterval);
        return;
      }
      exchangeToken.mutate({ transactionId: pendingAuth.transactionId, pendingToken: pendingAuth.pendingToken });
    }, POLLING_INTERVAL);

    return () => {
      console.log("Clearing polling interval");
      clearInterval(pollInterval);
    };
  }, [pendingAuth, isLoggedIn, exchangeToken, pollAttempts]);

  return {
    authData: { email, idToken, userDetails },
    isLoggedIn,
    sendMagicLink: sendMagicLink.mutate,
    isSendingLink: sendMagicLink.isPending,
    logout: () => {
      setEmail(null);
      setIdToken(null);
      setUserDetails(null);
      setPendingAuth(null);
      setPollAttempts(0);
      queryClient.setQueryData(["auth"], null);
    },
  };
}