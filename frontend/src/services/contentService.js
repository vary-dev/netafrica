import apiClient from "@/services/apiClient";
import {
  buildDemoHome,
  catalogForProfile,
  demoCatalog,
  sortForProfile,
} from "@/data/demoCatalog";

const useBackend = import.meta.env.VITE_USE_BACKEND === "true";

function storageKey(profileId, key) {
  return `247box:${profileId || "guest"}:${key}`;
}

function readIds(profileId, key) {
  try {
    return JSON.parse(localStorage.getItem(storageKey(profileId, key)) || "[]");
  } catch {
    return [];
  }
}

function writeIds(profileId, key, values) {
  localStorage.setItem(storageKey(profileId, key), JSON.stringify(values));
}

function withLocalState(items, profileId) {
  const saved = new Set(readIds(profileId, "my-list"));
  const liked = new Set(readIds(profileId, "liked"));

  return items.map((item) => ({
    ...item,
    inMyList: saved.has(item.id) || item.inMyList,
    liked: liked.has(item.id) || item.liked,
  }));
}

export async function getHomeFeed(profile) {
  if (useBackend) {
    const response = await apiClient.get(`/profiles/${profile.id}/home`);
    return response.data.data;
  }

  const feed = buildDemoHome(profile);

  return {
    ...feed,
    featured: {
      ...feed.featured,
      inMyList: withLocalState([feed.featured], profile?.id)[0]?.inMyList,
    },
    rows: feed.rows.map((row) => ({
      ...row,
      items: withLocalState(row.items, profile?.id),
    })),
  };
}

export async function getMovies(profile) {
  if (useBackend) {
    const response = await apiClient.get("/content/movies", {
      params: { profileId: profile?.id },
    });
    return response.data.data;
  }

  return withLocalState(
    sortForProfile(
      catalogForProfile(profile).filter((item) => item.type === "MOVIE"),
      profile
    ),
    profile?.id
  );
}

export async function getSeries(profile) {
  if (useBackend) {
    const response = await apiClient.get("/content/series", {
      params: { profileId: profile?.id },
    });
    return response.data.data;
  }

  return withLocalState(
    sortForProfile(
      catalogForProfile(profile).filter((item) => item.type === "SERIES"),
      profile
    ),
    profile?.id
  );
}

export async function getTitle(slug, profile) {
  if (useBackend) {
    const response = await apiClient.get(`/content/${slug}`, {
      params: { profileId: profile?.id },
    });
    return response.data.data;
  }

  const item = catalogForProfile(profile).find((content) => content.slug === slug);
  if (!item) return null;

  return withLocalState([item], profile?.id)[0];
}

export async function searchContent(query, profile) {
  if (useBackend) {
    const response = await apiClient.get("/search", {
      params: {
        q: query,
        profileId: profile?.id,
      },
    });

    return response.data.data;
  }

  const normalized = query.trim().toLowerCase();

  if (!normalized) return [];

  const results = catalogForProfile(profile).filter((item) => {
    const haystack = [
      item.title,
      item.description,
      item.type,
      ...item.genres,
    ]
      .join(" ")
      .toLowerCase();

    return haystack.includes(normalized);
  });

  return withLocalState(sortForProfile(results, profile), profile?.id);
}

export async function getLibrary(profile) {
  if (useBackend) {
    const response = await apiClient.get(`/profiles/${profile.id}/library`);
    return response.data.data;
  }

  const catalog = withLocalState(catalogForProfile(profile), profile?.id);

  return {
    continueWatching: catalog.filter(
      (item) => item.progress > 0 && item.progress < 95
    ),
    myList: catalog.filter((item) => item.inMyList),
    liked: catalog.filter((item) => item.liked),
  };
}

export async function toggleMyList(profile, contentId) {
  if (useBackend) {
    const current = await getTitle(
      demoCatalog.find((item) => item.id === contentId)?.slug || contentId,
      profile
    );

    if (current?.inMyList) {
      await apiClient.delete(`/profiles/${profile.id}/my-list/${contentId}`);
      return false;
    }

    await apiClient.post(`/profiles/${profile.id}/my-list/${contentId}`);
    return true;
  }

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
  if (useBackend) {
    const response = await apiClient.post(
      `/profiles/${profile.id}/likes/${contentId}`
    );
    return response.data.data;
  }

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
