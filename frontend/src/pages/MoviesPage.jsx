import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  useNavigate,
} from "react-router";

import {
  toast,
} from "sonner";

import AppShell
  from "@/components/layout/AppShell";

import ContentRail
  from "@/components/media/ContentRail";

import {
  useProfiles,
} from "@/hooks/useProfiles";

import {
  getMovies,
  toggleMyList,
} from "@/services/contentService";

export default function MoviesPage() {
  const navigate =
    useNavigate();

  const {
    currentProfile,
  } = useProfiles();

  const [movies, setMovies] =
    useState([]);

  const [error, setError] =
    useState("");

  useEffect(() => {
    getMovies(
      currentProfile
    )
      .then(setMovies)
      .catch((requestError) => {
        setError(
          requestError.response?.data?.message ||
            requestError.message
        );
      });
  }, [currentProfile]);

  const genreRows =
    useMemo(() => {
      const genres = [
        ...new Set(
          movies.flatMap(
            (item) => item.genres
          )
        ),
      ].slice(0, 6);

      return genres
        .map((genre) => ({
          genre,
          items: movies.filter(
            (item) =>
              item.genres.includes(
                genre
              )
          ),
        }))
        .filter(
          (row) => row.items.length
        );
    }, [movies]);

  async function add(item) {
    const added =
      await toggleMyList(
        currentProfile,
        item.id
      );

    toast.success(
      added
        ? "Added to My 24/7Box"
        : "Removed from My 24/7Box"
    );

    setMovies(
      await getMovies(
        currentProfile
      )
    );
  }

  return (
    <AppShell>
      <section className="box-container pb-5 pt-32">
        <p className="text-xs font-black uppercase tracking-[0.22em] text-[#FFD900]">
          MOVIES
        </p>

        <h1 className="mt-3 font-display text-5xl font-bold tracking-[-0.045em]">
          Movie night starts here.
        </h1>

        <p className="mt-4 max-w-2xl text-sm leading-6 text-[#747474]">
          This catalog now comes directly from Nganji's Node.js and MySQL API.
        </p>

        {error && (
          <p className="mt-4 rounded-xl border border-[#FF5252]/20 bg-[#FF5252]/5 p-4 text-sm text-[#FF7777]">
            {error}
          </p>
        )}
      </section>

      <ContentRail
        title="Available Movies"
        items={movies}
        onDetails={(item) =>
          navigate(`/title/${item.slug}`)
        }
        onPlay={(item) =>
          navigate(`/watch/${item.slug}`)
        }
        onAdd={add}
      />

      {genreRows.map((row) => (
        <ContentRail
          key={row.genre}
          title={`${row.genre} Movies`}
          items={row.items}
          onDetails={(item) =>
            navigate(`/title/${item.slug}`)
          }
          onPlay={(item) =>
            navigate(`/watch/${item.slug}`)
          }
          onAdd={add}
        />
      ))}
    </AppShell>
  );
}
