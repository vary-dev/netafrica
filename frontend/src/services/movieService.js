import {
  collection,
  getDocs,
  limit,
  orderBy,
  query,
} from "firebase/firestore";

import {
  db,
} from "@/firebase/firebase";

import {
  demoMovies,
} from "@/data/demoMovies";

export async function getTrendingMovies() {
  try {
    const q = query(
      collection(
        db,
        "movies"
      ),
      orderBy(
        "trendingRank",
        "asc"
      ),
      limit(10)
    );

    const snapshot =
      await getDocs(q);

    if (snapshot.empty) {
      return demoMovies;
    }

    return snapshot.docs.map(
      (movieDoc) => ({
        id: movieDoc.id,
        ...movieDoc.data(),
      })
    );
  } catch (error) {
    console.warn(
      "Using landing fallback data:",
      error
    );

    return demoMovies;
  }
}