import { useEffect, useState } from "react";
import { Search } from "lucide-react";
import { useNavigate } from "react-router";
import AppShell from "@/components/layout/AppShell";
import { useProfiles } from "@/hooks/useProfiles";
import { searchContent } from "@/services/contentService";

export default function SearchPage() {
  const navigate = useNavigate();
  const { currentProfile } = useProfiles();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);

  useEffect(() => {
    if (query.trim().length < 2) {
      setResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setResults(await searchContent(query, currentProfile));
    }, 260);

    return () => clearTimeout(timer);
  }, [query, currentProfile]);

  return (
    <AppShell>
      <section className="box-container pt-28">
        <div className="flex h-14 items-center rounded-2xl border border-white/10 bg-[#151515] px-5 focus-within:border-[#FFD900]/60">
          <Search className="mr-3 text-[#747474]" size={20} />
          <input
            autoFocus
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search movies, series and genres..."
            className="h-full flex-1 bg-transparent text-base outline-none placeholder:text-[#555]"
          />
        </div>

        <div className="grid grid-cols-2 gap-x-4 gap-y-7 py-10 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
          {results.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => navigate(`/title/${item.slug}`)}
              className="group text-left"
            >
              <div className="aspect-[2/3] overflow-hidden rounded-xl bg-[#151515]">
                <img
                  src={item.posterUrl}
                  alt={item.title}
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                />
              </div>
              <h2 className="mt-2 truncate text-sm font-semibold">{item.title}</h2>
              <p className="mt-1 text-xs text-[#747474]">
                {item.year} • {item.type === "SERIES" ? "Series" : "Movie"}
              </p>
            </button>
          ))}
        </div>

        {!query && (
          <div className="py-20 text-center">
            <p className="font-display text-3xl font-bold">Find your next story.</p>
            <p className="mt-3 text-sm text-[#747474]">
              Search is already filtered for this profile's viewing level.
            </p>
          </div>
        )}
      </section>
    </AppShell>
  );
}
