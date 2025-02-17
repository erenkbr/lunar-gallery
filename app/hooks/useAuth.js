import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState, useEffect } from "react";

const STORAGE_KEYS = {
  EMAIL: "userEmail",
  ID_TOKEN: "idToken",
  USER_DETAILS: "userDetails",
};

const POLLING_INTERVAL = 2000;
const COSMO_LOGIN_URL = "/api/login";
const AUTH_API_URL = "/api/auth";

export function useAuth() {
  const queryClient = useQueryClient();
  const [pendingToken, setPendingToken] = useState(null);
  const [transactionId, setTransactionId] = useState(null);

  const { data: authData } = useQuery({
    queryKey: ["auth"],
    queryFn: () => {
      if (typeof window === "undefined") return null;

      return {
        email: localStorage.getItem(STORAGE_KEYS.EMAIL),
        idToken: localStorage.getItem(STORAGE_KEYS.ID_TOKEN),
        userDetails: JSON.parse(localStorage.getItem(STORAGE_KEYS.USER_DETAILS) || "null"),
      };
    },
    staleTime: Infinity,
  });

  const isLoggedIn = !!authData?.idToken;

  const { mutate: sendMagicLink, isPending: isSendingLink } = useMutation({
    mutationFn: async (email) => {
      const response = await fetch(`${AUTH_API_URL}?email=${encodeURIComponent(email)}`);
      if (!response.ok) throw new Error("Failed to send magic link email");

      const data = await response.json();
      if (!data.success || !data.pendingToken) throw new Error("Failed to get pending token");

      return { email, pendingToken: data.pendingToken, transactionId: data.transactionId };
    },
    onSuccess: ({ email, pendingToken, transactionId }) => {
      localStorage.setItem(STORAGE_KEYS.EMAIL, email);
      queryClient.setQueryData(["auth"], (old) => ({ ...old, email }));
      setPendingToken(pendingToken);
      setTransactionId(transactionId);
      alert("Check your email to authenticate!");
    },
  });

  const { mutate: exchangeToken } = useMutation({
    mutationFn: async ({ transactionId, pendingToken }) => {
      const response = await fetch(AUTH_API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ transactionId, pendingToken }),
      });

      if (!response.ok) throw new Error("Token exchange failed");

      const data = await response.json();
      if (!data.success) throw new Error(data.error || "Token exchange failed");

      return data;
    },
    onSuccess: (data) => {
      localStorage.setItem(STORAGE_KEYS.ID_TOKEN, data.ssoCredential.idToken);
      queryClient.setQueryData(["auth"], (old) => ({
        ...old,
        idToken: data.ssoCredential.idToken,
      }));

      setPendingToken(null);
      setTransactionId(null);

      loginToCosmo();
    },
    onError: (error) => {
      alert(error.message || "Failed to complete authentication");
    },
  });

  const { mutate: loginToCosmo } = useMutation({
    mutationFn: async () => {
      const email = localStorage.getItem(STORAGE_KEYS.EMAIL);
      const idToken = localStorage.getItem(STORAGE_KEYS.ID_TOKEN);

      if (!email || !idToken) {
        throw new Error("Missing authentication data");
      }

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
      localStorage.setItem(STORAGE_KEYS.USER_DETAILS, JSON.stringify(userDetails));
      queryClient.setQueryData(["auth"], (old) => ({ ...old, userDetails }));
      console.log("🎉 Successfully authenticated with Cosmo!", userDetails);
    },
    onError: (error) => {
      console.error("🚨 Cosmo login failed:", error);
      alert(error.message || "Authentication failed.");
    },
  });

  useEffect(() => {
    if (!pendingToken || !transactionId) return;

    const pollInterval = setInterval(() => {
      exchangeToken({ transactionId, pendingToken });
    }, POLLING_INTERVAL);

    return () => clearInterval(pollInterval);
  }, [pendingToken, transactionId, exchangeToken]);

  return {
    authData,
    isLoggedIn,
    sendMagicLink,
    isSendingLink,
    logout: () => {
      localStorage.removeItem(STORAGE_KEYS.EMAIL);
      localStorage.removeItem(STORAGE_KEYS.ID_TOKEN);
      localStorage.removeItem(STORAGE_KEYS.USER_DETAILS);
      queryClient.setQueryData(["auth"], null);
    },
  };
}
