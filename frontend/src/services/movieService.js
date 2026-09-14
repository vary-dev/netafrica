import {
  getMovies,
} from "@/services/contentService";

export async function getTrendingMovies() {
  try {
    return await getMovies(null);
  } catch (error) {
    // Nganji's current content endpoint is authenticated. The public landing
    // page therefore stays brand-led until a backend JWT session exists.
    console.info(
      "Public catalog is unavailable before backend authentication:",
      error.response?.data?.message ||
        error.message
    );

    return [];
  }
}
