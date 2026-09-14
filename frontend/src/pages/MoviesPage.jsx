import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  Download,
  Film,
} from "lucide-react";

import {
  useNavigate,
} from "react-router";

import {
  toast,
} from "sonner";

import AppShell from "@/components/layout/AppShell";
import ContentRail from "@/components/media/ContentRail";
import { useProfiles } from "@/hooks/useProfiles";

import {
  getMovies,
  toggleMyList,
} from "@/services/contentService";

import {
  downloadMedia,
} from "@/utils/mediaDownload";

export default function MoviesPage() {
  const navigate = useNavigate();
  const { currentProfile } = useProfiles();

  const [movies, setMovies] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    getMovies(currentProfile)
      .then(setMovies)
      .catch((requestError) => {
        setError(
          requestError.response?.data?.message ||
            requestError.message
        );
      });
  }, [currentProfile]);

  const genreRows = useMemo(() => {
    const genres = [
      ...new Set(
        movies.flatMap((item) => item.genres)
      ),
    ].slice(0, 6);

    return genres
      .map((genre) => ({
        genre,
        items: movies.filter((item) =>
          item.genres.includes(genre)
        ),
      }))
      .filter((row) => row.items.length);
  }, [movies]);

  async function add(item) {
    const added = await toggleMyList(
      currentProfile,
      item.id
    );

    toast.success(
      added
        ? "Added to My 24/7Box"
        : "Removed from My 24/7Box"
    );

    setMovies(await getMovies(currentProfile));
  }

  function download(item) {
    const result = downloadMedia(item);

    if (result.ok) {
      toast.success(result.message);
    } else {
      toast.info(result.message);
    }
  }

  return (
    <AppShell>
      <section className="relative overflow-hidden pb-5 pt-28 sm:pt-32">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_15%,rgba(255,217,0,.10),transparent_22%),radial-gradient(circle_at_84%_8%,rgba(255,255,255,.045),transparent_18%)]" />

        <div className="box-container relative">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#FFD900]/15 bg-[#FFD900]/8 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.16em] text-[#FFD900]">
            <Film size={13} />
            Movies
          </div>

          <h1 className="mt-4 max-w-3xl font-display text-4xl font-bold tracking-[-0.045em] sm:text-5xl lg:text-6xl">
            Movie night starts here.
          </h1>

          <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="max-w-2xl text-sm leading-6 text-[#747474] sm:text-base">
              Browse the live catalog from the Node.js and MySQL API, open a title,
              play it in the browser, or download supported direct video files.
            </p>

            <div className="flex shrink-0 items-center gap-2 rounded-full border border-white/[0.07] bg-white/[0.025] px-3 py-2 text-xs text-[#777]">
              <Download size={14} className="text-[#FFD900]" />
              {movies.length} available
            </div>
          </div>

          {error && (
            <p className="mt-5 rounded-xl border border-[#FF5252]/20 bg-[#FF5252]/5 p-4 text-sm text-[#FF7777]">
              {error}
            </p>
          )}
        </div>
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
        onDownload={download}
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
          onDownload={download}
        />
      ))}
    </AppShell>
  );
}
