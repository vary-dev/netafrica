import apiClient from "@/services/apiClient";

const PROFILE_LIMITS = {
  KIDS_7: 7,
  TEEN_13: 13,
  TEEN_16: 16,
  "18_PLUS": 18,
};

function storageKey(profileId, key) {
  return `247box:${profileId || "guest"}:${key}`;
}

function readIds(profileId, key) {
  try {
    return JSON.parse(
      localStorage.getItem(storageKey(profileId, key)) || "[]"
    );
  } catch {
    return [];
  }
}

function writeIds(profileId, key, values) {
  localStorage.setItem(
    storageKey(profileId, key),
    JSON.stringify(values)
  );
}

function normalizeGenres(genres) {
  if (Array.isArray(genres)) {
    return genres.filter(Boolean);
  }

  if (typeof genres === "string") {
    return genres
      .split(",")
      .map((genre) => genre.trim())
      .filter(Boolean);
  }

  return [];
}

function maturityNumber(value) {
  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) ? parsed : 18;
}

function profileMaturityLimit(profile) {
  if (profile?.isKids || profile?.profileType === "kids") {
    return 7;
  }

  if (profile?.ageGroup && PROFILE_LIMITS[profile.ageGroup]) {
    return PROFILE_LIMITS[profile.ageGroup];
  }

  return maturityNumber(profile?.maturityRating);
}

export function normalizeContent(item) {
  if (!item) return null;

  const slug = item.slug || item.movieId || String(item.id);

  return {
    ...item,
    id: item.id ?? item.movieId ?? slug,
    slug,
    movieId: item.movieId ?? slug,
    type:
      item.type === "my_list" || item.type === "recently_watched"
        ? "MOVIE"
        : item.type || "MOVIE",
    title: item.title || "Untitled",
    eyebrow: item.eyebrow || "24/7BOX",
    description: item.description || "",
    year: item.year || null,
    maturityRating: maturityNumber(item.maturityRating),
    runtimeLabel: item.runtimeLabel || item.duration || "",
    duration: item.duration || item.runtimeLabel || "",
    genres: normalizeGenres(item.genres),
    posterUrl: item.posterUrl || item.poster || "",
    poster: item.poster || item.posterUrl || "",
    backdropUrl:
      item.backdropUrl ||
      item.backdrop ||
      item.posterUrl ||
      item.poster ||
      "",
    backdrop:
      item.backdrop ||
      item.backdropUrl ||
      item.poster ||
      item.posterUrl ||
      "",
    videoUrl: item.videoUrl || null,
    quality: item.quality || "",
  };
}

function withLocalState(items, profileId) {
  const saved = new Set(readIds(profileId, "my-list"));
  const liked = new Set(readIds(profileId, "liked"));

  return items.map((item) => ({
    ...item,
    inMyList: saved.has(item.id) || saved.has(item.slug),
    liked: liked.has(item.id) || liked.has(item.slug),
  }));
}

function filterForProfile(items, profile) {
  const max = profileMaturityLimit(profile);

  return items.filter(
    (item) => maturityNumber(item.maturityRating) <= max
  );
}

function sortForProfile(items, profile) {
  const preferred = profile?.preferredGenres ?? [];

  return [...items].sort((a, b) => {
    const aMatches = a.genres.filter((genre) =>
      preferred.includes(genre)
    ).length;

    const bMatches = b.genres.filter((genre) =>
      preferred.includes(genre)
    ).length;

    if (aMatches !== bMatches) {
      return bMatches - aMatches;
    }

    return Number(b.year || 0) - Number(a.year || 0);
  });
}

function normalizeMovieList(data, profile) {
  const list = Array.isArray(data) ? data : [];

  const normalized = list
    .map(normalizeContent)
    .filter(Boolean);

  return withLocalState(
    sortForProfile(
      filterForProfile(normalized, profile),
      profile
    ),
    profile?.id
  );
}

export async function getMovies(profile) {
  const response = await apiClient.get("/content/movies");
  const payload = response.data?.data ?? response.data;

  return normalizeMovieList(payload, profile);
}

export async function getHomeFeed(profile) {
  // The backend MySQL profile IDs and our Firebase subprofile IDs are not
  // synchronized yet. For this first integration the home UI is built from
  // the real /content/movies payload and personalized with Firebase profile
  // preferences on the client.
  const movies = await getMovies(profile);
  const favoriteGenre = profile?.preferredGenres?.[0];

  const featured =
    (favoriteGenre
      ? movies.find((item) => item.genres.includes(favoriteGenre))
      : null) ||
    movies[0] ||
    null;

  const favoriteItems = favoriteGenre
    ? movies.filter((item) => item.genres.includes(favoriteGenre))
    : [];

  const newest = [...movies].sort(
    (a, b) => Number(b.year || 0) - Number(a.year || 0)
  );

  const rows = [
    {
      id: "recommended",
      title: `Recommended for ${profile?.name || "You"}`,
      variant: "standard",
      items: movies,
    },
    favoriteItems.length
      ? {
          id: "favorite-genre",
          title: `Because You Like ${favoriteGenre}`,
          variant: "standard",
          items: favoriteItems,
        }
      : null,
    {
      id: "newest",
      title: "Fresh on 24/7Box",
      variant: "standard",
      items: newest,
    },
  ].filter((row) => row && row.items.length > 0);

  return {
    profile,
    featured,
    rows,
  };
}

export async function getTitle(slug, profile) {
  const response = await apiClient.get(
    `/content/${encodeURIComponent(slug)}`
  );

  const payload = response.data?.data ?? response.data;
  const normalized = normalizeContent(payload);

  if (!normalized) {
    return null;
  }

  const allowed = filterForProfile([normalized], profile);

  if (!allowed.length) {
    return null;
  }

  return withLocalState(allowed, profile?.id)[0];
}

export async function searchContent(query, profile) {
  const normalizedQuery = query.trim().toLowerCase();

  if (!normalizedQuery) {
    return [];
  }

  // /api/search is not implemented yet, so search the real API movie list
  // locally until the backend route is added.
  const movies = await getMovies(profile);

  return movies.filter((item) => {
    const haystack = [
      item.title,
      item.description,
      item.type,
      ...item.genres,
    ]
      .join(" ")
      .toLowerCase();

    return haystack.includes(normalizedQuery);
  });
}

export async function getSeries() {
  // The current backend README explicitly states that series are not built.
  return [];
}

export async function getLibrary(profile) {
  // My List, likes and progress write endpoints are not built yet. Keep only
  // lightweight profile-local state; all movie metadata still comes from API.
  const movies = await getMovies(profile);

  return {
    continueWatching: [],
    recentlyWatched: [],
    myList: movies.filter((item) => item.inMyList),
    liked: movies.filter((item) => item.liked),
  };
}

export async function toggleMyList(profile, contentId) {
  const values = new Set(readIds(profile?.id, "my-list"));

  if (values.has(contentId)) {
    values.delete(contentId);
    writeIds(profile?.id, "my-list", [...values]);
    return false;
  }

  values.add(contentId);
  writeIds(profile?.id, "my-list", [...values]);
  return true;
}

export async function toggleLike(profile, contentId) {
  const values = new Set(readIds(profile?.id, "liked"));

  if (values.has(contentId)) {
    values.delete(contentId);
    writeIds(profile?.id, "liked", [...values]);
    return false;
  }

  values.add(contentId);
  writeIds(profile?.id, "liked", [...values]);
  return true;
}
