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

export function getBackendToken() {
  return localStorage.getItem(BACKEND_TOKEN_KEY);
}

export function hasBackendSession() {
  return Boolean(getBackendToken());
}

export function clearBackendSession() {
  localStorage.removeItem(BACKEND_TOKEN_KEY);
}

function saveBackendToken(token) {
  if (!token) {
    throw new Error("The backend login response did not contain a token.");
  }

  localStorage.setItem(BACKEND_TOKEN_KEY, token);
  return token;
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

export async function ensureBackendSession({
  email,
  password,
  createIfMissing = true,
}) {
  try {
    return await loginBackend({ email, password });
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

    return loginBackend({ email, password });
  }
}
