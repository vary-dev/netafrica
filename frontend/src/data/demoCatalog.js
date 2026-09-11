const IMG = (id, width = 1600) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${width}&q=88`;

export const demoCatalog = [
  {
    id: 1,
    slug: "midnight-protocol",
    type: "MOVIE",
    title: "Midnight Protocol",
    description:
      "A systems engineer discovers a hidden network buried beneath the city and must decide whether exposing it will save millions or trigger a crisis.",
    year: 2026,
    maturityRating: 16,
    runtimeMinutes: 128,
    runtimeLabel: "2h 08m",
    quality: "4K",
    genres: ["Sci-Fi", "Thriller", "Drama"],
    matchScore: 98,
    badge: "Top 10",
    trendingRank: 1,
    releaseDate: "2026-08-18",
    posterUrl: IMG("photo-1519608487953-e999c86e7455", 800),
    backdropUrl: IMG("photo-1519608487953-e999c86e7455", 2200),
    thumbnailUrl: IMG("photo-1519608487953-e999c86e7455", 1000),
    logoUrl: "",
    trailerUrl: "",
    progress: 42,
    inMyList: true,
    liked: true,
    isFeatured: true,
  },
  {
    id: 2,
    slug: "beyond-kigali",
    type: "MOVIE",
    title: "Beyond Kigali",
    description:
      "Three friends leave the city for a journey that tests ambition, loyalty and what home really means.",
    year: 2026,
    maturityRating: 13,
    runtimeMinutes: 112,
    runtimeLabel: "1h 52m",
    quality: "HD",
    genres: ["Drama", "Adventure"],
    matchScore: 94,
    badge: "New",
    trendingRank: 4,
    releaseDate: "2026-09-01",
    posterUrl: IMG("photo-1500534623283-312aade485b7", 800),
    backdropUrl: IMG("photo-1500534623283-312aade485b7", 2200),
    thumbnailUrl: IMG("photo-1500534623283-312aade485b7", 1000),
    logoUrl: "",
    trailerUrl: "",
    progress: 0,
    inMyList: false,
    liked: false,
  },
  {
    id: 3,
    slug: "last-signal",
    type: "MOVIE",
    title: "Last Signal",
    description:
      "A radio operator receives a transmission from a station that officially disappeared twenty years ago.",
    year: 2025,
    maturityRating: 16,
    runtimeMinutes: 118,
    runtimeLabel: "1h 58m",
    quality: "4K",
    genres: ["Mystery", "Thriller", "Sci-Fi"],
    matchScore: 96,
    badge: "Highly Rewatched",
    trendingRank: 2,
    releaseDate: "2025-11-10",
    posterUrl: IMG("photo-1440404653325-ab127d49abc1", 800),
    backdropUrl: IMG("photo-1440404653325-ab127d49abc1", 2200),
    thumbnailUrl: IMG("photo-1440404653325-ab127d49abc1", 1000),
    logoUrl: "",
    trailerUrl: "",
    progress: 67,
    inMyList: true,
    liked: true,
  },
  {
    id: 4,
    slug: "wild-earth",
    type: "SERIES",
    title: "Wild Earth",
    description:
      "An immersive documentary series following communities protecting ecosystems across Africa.",
    year: 2026,
    maturityRating: 7,
    runtimeMinutes: 48,
    runtimeLabel: "8 episodes",
    quality: "4K",
    genres: ["Documentary", "Nature", "Family"],
    matchScore: 91,
    badge: "New Episodes",
    trendingRank: 8,
    releaseDate: "2026-08-29",
    posterUrl: IMG("photo-1441974231531-c6227db76b6e", 800),
    backdropUrl: IMG("photo-1441974231531-c6227db76b6e", 2200),
    thumbnailUrl: IMG("photo-1441974231531-c6227db76b6e", 1000),
    logoUrl: "",
    trailerUrl: "",
    progress: 20,
    inMyList: false,
    liked: false,
  },
  {
    id: 5,
    slug: "neon-district",
    type: "SERIES",
    title: "Neon District",
    description:
      "A young detective enters the city's most secretive nightlife district while chasing a case nobody else believes exists.",
    year: 2026,
    maturityRating: 18,
    runtimeMinutes: 52,
    runtimeLabel: "10 episodes",
    quality: "4K",
    genres: ["Crime", "Thriller", "Drama"],
    matchScore: 93,
    badge: "Top 10",
    trendingRank: 3,
    releaseDate: "2026-07-24",
    posterUrl: IMG("photo-1519608487953-e999c86e7455", 800),
    backdropUrl: IMG("photo-1492684223066-81342ee5ff30", 2200),
    thumbnailUrl: IMG("photo-1492684223066-81342ee5ff30", 1000),
    logoUrl: "",
    trailerUrl: "",
    progress: 0,
    inMyList: true,
    liked: false,
  },
  {
    id: 6,
    slug: "silent-road",
    type: "MOVIE",
    title: "Silent Road",
    description:
      "After waking beside an abandoned highway, a traveler follows clues left by someone who seems to know every move before it happens.",
    year: 2026,
    maturityRating: 13,
    runtimeMinutes: 105,
    runtimeLabel: "1h 45m",
    quality: "HD",
    genres: ["Adventure", "Mystery", "Drama"],
    matchScore: 89,
    badge: "",
    trendingRank: 6,
    releaseDate: "2026-05-14",
    posterUrl: IMG("photo-1500530855697-b586d89ba3ee", 800),
    backdropUrl: IMG("photo-1500530855697-b586d89ba3ee", 2200),
    thumbnailUrl: IMG("photo-1500530855697-b586d89ba3ee", 1000),
    logoUrl: "",
    trailerUrl: "",
    progress: 84,
    inMyList: false,
    liked: true,
  },
  {
    id: 7,
    slug: "after-dark",
    type: "SERIES",
    title: "After Dark",
    description:
      "Six strangers discover that every midnight the same unexplained event repeats across their city.",
    year: 2025,
    maturityRating: 16,
    runtimeMinutes: 50,
    runtimeLabel: "6 episodes",
    quality: "4K",
    genres: ["Mystery", "Drama", "Thriller"],
    matchScore: 95,
    badge: "Fan Favorite",
    trendingRank: 5,
    releaseDate: "2025-12-04",
    posterUrl: IMG("photo-1495567720989-cebdbdd97913", 800),
    backdropUrl: IMG("photo-1495567720989-cebdbdd97913", 2200),
    thumbnailUrl: IMG("photo-1495567720989-cebdbdd97913", 1000),
    logoUrl: "",
    trailerUrl: "",
    progress: 35,
    inMyList: true,
    liked: true,
  },
  {
    id: 8,
    slug: "little-explorers",
    type: "SERIES",
    title: "Little Explorers",
    description:
      "Curious young explorers learn about animals, science and everyday wonders through playful adventures.",
    year: 2026,
    maturityRating: 7,
    runtimeMinutes: 24,
    runtimeLabel: "12 episodes",
    quality: "HD",
    genres: ["Kids", "Animation", "Education"],
    matchScore: 99,
    badge: "Kids Pick",
    trendingRank: 7,
    releaseDate: "2026-08-10",
    posterUrl: IMG("photo-1503454537195-1dcabb73ffb9", 800),
    backdropUrl: IMG("photo-1503454537195-1dcabb73ffb9", 2200),
    thumbnailUrl: IMG("photo-1503454537195-1dcabb73ffb9", 1000),
    logoUrl: "",
    trailerUrl: "",
    progress: 58,
    inMyList: true,
    liked: true,
  },
  {
    id: 9,
    slug: "red-horizon",
    type: "MOVIE",
    title: "Red Horizon",
    description:
      "A rescue pilot has one final flight to reach a scientific team before a violent storm isolates them completely.",
    year: 2026,
    maturityRating: 13,
    runtimeMinutes: 116,
    runtimeLabel: "1h 56m",
    quality: "4K",
    genres: ["Adventure", "Action", "Drama"],
    matchScore: 92,
    badge: "Recently Added",
    trendingRank: 9,
    releaseDate: "2026-09-05",
    posterUrl: IMG("photo-1470770841072-f978cf4d019e", 800),
    backdropUrl: IMG("photo-1470770841072-f978cf4d019e", 2200),
    thumbnailUrl: IMG("photo-1470770841072-f978cf4d019e", 1000),
    logoUrl: "",
    trailerUrl: "",
    progress: 0,
    inMyList: false,
    liked: false,
  },
  {
    id: 10,
    slug: "code-zero",
    type: "MOVIE",
    title: "Code Zero",
    description:
      "When an autonomous security system begins rewriting its own rules, its original developer must outthink the machine.",
    year: 2026,
    maturityRating: 16,
    runtimeMinutes: 121,
    runtimeLabel: "2h 01m",
    quality: "4K",
    genres: ["Sci-Fi", "Action", "Thriller"],
    matchScore: 97,
    badge: "Top 10",
    trendingRank: 10,
    releaseDate: "2026-06-21",
    posterUrl: IMG("photo-1518709268805-4e9042af9f23", 800),
    backdropUrl: IMG("photo-1518709268805-4e9042af9f23", 2200),
    thumbnailUrl: IMG("photo-1518709268805-4e9042af9f23", 1000),
    logoUrl: "",
    trailerUrl: "",
    progress: 11,
    inMyList: false,
    liked: false,
  },
  {
    id: 11,
    slug: "second-chance",
    type: "MOVIE",
    title: "Second Chance",
    description:
      "A retired musician returns home and discovers that the unfinished song he left behind still connects an entire community.",
    year: 2025,
    maturityRating: 13,
    runtimeMinutes: 109,
    runtimeLabel: "1h 49m",
    quality: "HD",
    genres: ["Drama", "Music", "Romance"],
    matchScore: 86,
    badge: "",
    trendingRank: 12,
    releaseDate: "2025-10-12",
    posterUrl: IMG("photo-1493225457124-a3eb161ffa5f", 800),
    backdropUrl: IMG("photo-1493225457124-a3eb161ffa5f", 2200),
    thumbnailUrl: IMG("photo-1493225457124-a3eb161ffa5f", 1000),
    logoUrl: "",
    trailerUrl: "",
    progress: 0,
    inMyList: false,
    liked: false,
  },
  {
    id: 12,
    slug: "inside-the-game",
    type: "SERIES",
    title: "Inside the Game",
    description:
      "Athletes, coaches and analysts reveal the decisions that changed unforgettable matches.",
    year: 2026,
    maturityRating: 7,
    runtimeMinutes: 44,
    runtimeLabel: "9 episodes",
    quality: "4K",
    genres: ["Documentary", "Sport"],
    matchScore: 88,
    badge: "New",
    trendingRank: 11,
    releaseDate: "2026-08-30",
    posterUrl: IMG("photo-1461896836934-ffe607ba8211", 800),
    backdropUrl: IMG("photo-1461896836934-ffe607ba8211", 2200),
    thumbnailUrl: IMG("photo-1461896836934-ffe607ba8211", 1000),
    logoUrl: "",
    trailerUrl: "",
    progress: 73,
    inMyList: false,
    liked: true,
  },
];

const allowedMaturity = {
  KIDS_7: 7,
  TEEN_13: 13,
  TEEN_16: 16,
  "18_PLUS": 18,
};

export function maturityForProfile(profile) {
  if (profile?.isKids || profile?.profileType === "kids") return 7;
  if (profile?.ageGroup && allowedMaturity[profile.ageGroup]) {
    return allowedMaturity[profile.ageGroup];
  }

  const parsed = Number.parseInt(profile?.maturityRating, 10);
  return Number.isFinite(parsed) ? parsed : 18;
}

export function catalogForProfile(profile) {
  const max = maturityForProfile(profile);
  return demoCatalog.filter((item) => Number(item.maturityRating) <= max);
}

export function sortForProfile(items, profile) {
  const preferred = profile?.preferredGenres ?? [];

  return [...items].sort((a, b) => {
    const aMatches = a.genres.filter((genre) => preferred.includes(genre)).length;
    const bMatches = b.genres.filter((genre) => preferred.includes(genre)).length;

    if (aMatches !== bMatches) return bMatches - aMatches;
    return (a.trendingRank ?? 999) - (b.trendingRank ?? 999);
  });
}

export function buildDemoHome(profile = {}) {
  const catalog = sortForProfile(catalogForProfile(profile), profile);
  const name = profile?.name || "You";
  const favoriteGenre = profile?.preferredGenres?.[0];

  const featured =
    catalog.find((item) =>
      favoriteGenre ? item.genres.includes(favoriteGenre) : item.isFeatured
    ) ??
    catalog.find((item) => item.isFeatured) ??
    catalog[0];

  const continueWatching = catalog
    .filter((item) => item.progress > 0 && item.progress < 95)
    .sort((a, b) => b.progress - a.progress);

  const topTen = [...catalog]
    .sort((a, b) => (a.trendingRank ?? 999) - (b.trendingRank ?? 999))
    .slice(0, 10);

  const newReleases = [...catalog]
    .sort((a, b) => new Date(b.releaseDate) - new Date(a.releaseDate))
    .slice(0, 10);

  const genreItems = favoriteGenre
    ? catalog.filter((item) => item.genres.includes(favoriteGenre))
    : catalog.slice(0, 8);

  return {
    profile: {
      id: profile?.id ?? "demo-profile",
      name,
      ageGroup: profile?.ageGroup ?? "18_PLUS",
      preferredGenres: profile?.preferredGenres ?? [],
    },
    featured,
    rows: [
      {
        id: "continue-watching",
        title: `Continue Watching for ${name}`,
        variant: "continue",
        items: continueWatching,
      },
      {
        id: "recommended",
        title: "Recommended for You",
        variant: "standard",
        items: catalog.slice(0, 10),
      },
      {
        id: "top-ten",
        title: "Top 10 on 24/7Box Today",
        variant: "top10",
        items: topTen,
      },
      {
        id: "because-you-like",
        title: favoriteGenre ? `Because You Like ${favoriteGenre}` : "Critically Loved",
        variant: "standard",
        items: genreItems,
      },
      {
        id: "new-releases",
        title: "New on 24/7Box",
        variant: "standard",
        items: newReleases,
      },
    ].filter((row) => row.items.length),
  };
}
