import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import AppShell from "@/components/layout/AppShell";
import ContentRail from "@/components/media/ContentRail";
import { useProfiles } from "@/hooks/useProfiles";
import { getMovies, toggleMyList } from "@/services/contentService";

export default function MoviesPage() {
  const navigate = useNavigate();
  const { currentProfile } = useProfiles();
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    getMovies(currentProfile).then(setMovies);
  }, [currentProfile]);

  const genreRows = useMemo(() => {
    const genres = ["Action", "Drama", "Sci-Fi", "Thriller", "Documentary"];

    return genres
      .map((genre) => ({
        genre,
        items: movies.filter((item) => item.genres.includes(genre)),
      }))
      .filter((row) => row.items.length);
  }, [movies]);

  async function add(item) {
    const added = await toggleMyList(currentProfile, item.id);
    toast.success(added ? "Added to My 24/7Box" : "Removed from My 24/7Box");
    setMovies(await getMovies(currentProfile));
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
          A maturity-aware catalog ordered around the genres and titles your active
          profile enjoys.
        </p>
      </section>

      <ContentRail
        title="Recommended Movies"
        items={movies.slice(0, 10)}
        onDetails={(item) => navigate(`/title/${item.slug}`)}
        onPlay={(item) => toast.success(`Ready to play ${item.title}`)}
        onAdd={add}
      />

      {genreRows.map((row) => (
        <ContentRail
          key={row.genre}
          title={`${row.genre} Movies`}
          items={row.items}
          onDetails={(item) => navigate(`/title/${item.slug}`)}
          onPlay={(item) => toast.success(`Ready to play ${item.title}`)}
          onAdd={add}
        />
      ))}
    </AppShell>
  );
}
