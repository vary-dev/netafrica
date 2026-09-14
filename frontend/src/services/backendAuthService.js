import axios from "axios";
import { API_BASE_URL } from "@/config/api";

const BACKEND_TOKEN_KEY = "247box_backend_token";

const authClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 12000,
  headers: {
    "Content-Type": "application/json",
  },
});

function decodeJwtPayload(token) {
  try {
    const payload = token.split(".")[1];
    if (!payload) return null;

    const normalized = payload.replace(/-/g, "+").replace(/_/g, "/");
    const decoded = decodeURIComponent(
      atob(normalized)
        .split("")
        .map((char) => `%${char.charCodeAt(0).toString(16).padStart(2, "0")}`)
        .join("")
    );

    return JSON.parse(decoded);
  } catch {
    return null;
  }
}

function isExpired(token) {
  const payload = decodeJwtPayload(token);
  if (!payload?.exp) return false;

  return payload.exp * 1000 <= Date.now();
}

export function getBackendToken() {
  const token = localStorage.getItem(BACKEND_TOKEN_KEY);

  if (!token) return null;

  if (isExpired(token)) {
    localStorage.removeItem(BACKEND_TOKEN_KEY);
    return null;
  }

  return token;
}

export function hasBackendSession() {
  return Boolean(getBackendToken());
}

export function clearBackendSession() {
  localStorage.removeItem(BACKEND_TOKEN_KEY);
}

function saveBackendToken(token) {
  if (!token) {
    throw new Error("The backend login response did not contain a JWT token.");
  }

  localStorage.setItem(BACKEND_TOKEN_KEY, token);
  return token;
}

export function getBackendErrorMessage(error) {
  const status = error?.response?.status;
  const backendMessage = error?.response?.data?.message;

  if (status === 502) {
    return "The Node API is not reachable from Vite. Start the local backend on port 5000, then retry.";
  }

  if (status === 401) {
    return backendMessage || "The Node API rejected these account credentials.";
  }

  if (status === 404) {
    return backendMessage || "The requested Node API route is not available in this backend version.";
  }

  if (status >= 500) {
    return backendMessage || "The Node/MySQL API returned a server error. Check the backend terminal and MySQL connection.";
  }

  if (error?.code === "ERR_NETWORK" || !error?.response) {
    return "The browser could not reach the Node API. Make sure the backend is running on port 5000.";
  }

  return backendMessage || error?.message || "Unable to connect to the Node/MySQL API.";
}

export async function loginBackend({ email, password }) {
  const response = await authClient.post("/auth/login", {
    email,
    password,
  });

  return saveBackendToken(response.data?.token);
}

export async function registerBackend({ email, password }) {
  return authClient.post("/auth/register", {
    email,
    password,
  });
}

export function verifyBackendSession(token = getBackendToken()) {
  if (!token || isExpired(token)) {
    clearBackendSession();
    return false;
  }

  const payload = decodeJwtPayload(token);

  if (!payload?.accountId) {
    clearBackendSession();
    return false;
  }

  return true;
}

export async function ensureBackendSession({
  email,
  password,
  createIfMissing = true,
}) {
  if (!email || !password) {
    throw new Error("Email and password are required to connect the Node API.");
  }

  let token;

  try {
    token = await loginBackend({ email, password });
  } catch (loginError) {
    const status = loginError.response?.status;

    if (!createIfMissing || status !== 401) {
      throw loginError;
    }

    try {
      await registerBackend({ email, password });
    } catch (registerError) {
      if (registerError.response?.status !== 409) {
        throw registerError;
      }
    }

    token = await loginBackend({ email, password });
  }

  if (!verifyBackendSession(token)) {
    throw new Error("The backend returned an invalid JWT payload.");
  }

  return token;
}
