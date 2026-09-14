const configuredBaseUrl = import.meta.env.VITE_API_URL?.trim();

const pointsToLocalBackend =
  configuredBaseUrl &&
  /^https?:\/\/(localhost|127\.0\.0\.1):5000\/api\/?$/i.test(configuredBaseUrl);

export const API_BASE_URL =
  import.meta.env.DEV && (!configuredBaseUrl || pointsToLocalBackend)
    ? "/api"
    : configuredBaseUrl || "/api";
