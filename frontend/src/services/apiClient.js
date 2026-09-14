import axios from "axios";
import { API_BASE_URL } from "@/config/api";
import {
  clearBackendSession,
  getBackendToken,
} from "@/services/backendAuthService";

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: { "Content-Type": "application/json" },
});

apiClient.interceptors.request.use((config) => {
  const token = getBackendToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

function isTokenAuthenticationFailure(error) {
  if (error.response?.status !== 401) {
    return false;
  }

  const message = String(
    error.response?.data?.message || ""
  ).toLowerCase();

  return (
    message.includes("invalid or expired token") ||
    message.includes("authentication required")
  );
}

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Nganji's POST /profiles also uses 401 for an incorrect parent-account
    // confirmation password. Do not destroy the real JWT for that case.
    if (isTokenAuthenticationFailure(error)) {
      clearBackendSession();

      window.dispatchEvent(
        new CustomEvent("247box:auth-expired", {
          detail: {
            message:
              error.response?.data?.message ||
              "Your session expired. Please sign in again.",
          },
        })
      );
    }

    return Promise.reject(error);
  }
);

export default apiClient;
