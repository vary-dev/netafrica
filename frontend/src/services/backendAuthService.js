import axios from "axios";
import { API_BASE_URL } from "@/config/api";

const TOKEN_KEY = "247box_backend_token";
const ACCOUNT_KEY = "247box_backend_account";

const authClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 12000,
  headers: { "Content-Type": "application/json" },
});

function decodeJwtPayload(token) {
  try {
    const payload = token?.split(".")?.[1];
    if (!payload) return null;

    const normalized = payload.replace(/-/g, "+").replace(/_/g, "/");
    const padded = normalized.padEnd(
      normalized.length + ((4 - (normalized.length % 4)) % 4),
      "="
    );

    const decoded = atob(padded);
    const json = decodeURIComponent(
      decoded
        .split("")
        .map((char) => `%${char.charCodeAt(0).toString(16).padStart(2, "0")}`)
        .join("")
    );

    return JSON.parse(json);
  } catch {
    return null;
  }
}

function tokenExpired(token) {
  const payload = decodeJwtPayload(token);
  if (!payload?.exp) return false;
  return payload.exp * 1000 <= Date.now();
}

function normalizeEmail(email) {
  return email.trim().toLowerCase();
}

function saveSession({ token, email }) {
  const payload = decodeJwtPayload(token);

  if (!payload?.accountId) {
    throw new Error("The backend returned a JWT without an accountId.");
  }

  const account = {
    accountId: payload.accountId,
    email: normalizeEmail(email),
  };

  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(ACCOUNT_KEY, JSON.stringify(account));
  return account;
}

export function getBackendToken() {
  const token = localStorage.getItem(TOKEN_KEY);
  if (!token) return null;

  if (tokenExpired(token)) {
    clearBackendSession();
    return null;
  }

  return token;
}

export function getBackendAccount() {
  const token = getBackendToken();
  if (!token) return null;

  try {
    const stored = JSON.parse(localStorage.getItem(ACCOUNT_KEY) || "null");
    const payload = decodeJwtPayload(token);

    if (!stored?.email || !payload?.accountId) {
      clearBackendSession();
      return null;
    }

    return {
      accountId: payload.accountId,
      email: stored.email,
    };
  } catch {
    clearBackendSession();
    return null;
  }
}

export function hasBackendSession() {
  return Boolean(getBackendToken() && getBackendAccount());
}

export function clearBackendSession() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(ACCOUNT_KEY);
  sessionStorage.removeItem("247box_active_profile_id");
}

export function getBackendErrorMessage(error) {
  const status = error?.response?.status;
  const backendMessage = error?.response?.data?.message;

  if (status === 400) {
    return backendMessage || "Please check the submitted information.";
  }

  if (status === 401) {
    return "Email or password is incorrect. If you do not have an account yet, create one first.";
  }

  if (status === 409) {
    return "An account already exists with this email. Sign in instead.";
  }

  if (status === 502) {
    return "The local Node API could not be reached. Make sure Nganji's backend is running on port 5000.";
  }

  if (status >= 500) {
    return backendMessage || "The Node/MySQL server returned an error. Check the backend terminal and database connection.";
  }

  if (!error?.response || error?.code === "ERR_NETWORK") {
    return "The browser could not reach the Node API.";
  }

  return backendMessage || error?.message || "Something went wrong.";
}

export async function loginBackendAccount({ email, password }) {
  const normalizedEmail = normalizeEmail(email);

  const response = await authClient.post("/auth/login", {
    email: normalizedEmail,
    password,
  });

  const token = response.data?.token;

  if (!token) {
    throw new Error("The backend login response did not include a token.");
  }

  const account = saveSession({
    token,
    email: normalizedEmail,
  });

  return {
    account,
    token,
    message: response.data?.message || "Login successful",
  };
}

export async function registerBackendAccount({ email, password }) {
  const normalizedEmail = normalizeEmail(email);

  const registerResponse = await authClient.post("/auth/register", {
    email: normalizedEmail,
    password,
  });

  const loginResult = await loginBackendAccount({
    email: normalizedEmail,
    password,
  });

  return {
    ...loginResult,
    registeredAccountId: registerResponse.data?.accountId,
    registerMessage:
      registerResponse.data?.message || "Account created successfully",
  };
}
