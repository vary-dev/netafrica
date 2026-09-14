import {
  getMovies,
} from "@/services/contentService";

import {
  hasBackendSession,
} from "@/services/backendAuthService";

export async function getTrendingMovies() {
  if (!hasBackendSession()) {
    return [];
  }

  try {
    return await getMovies(null);
  } catch (error) {
    console.info(
      "Authenticated catalog is currently unavailable:",
      error.response?.data?.message ||
        error.message
    );

    return [];
  }
}
