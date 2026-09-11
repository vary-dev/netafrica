import { useEffect, useRef, useState } from "react";
import { Search, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useNavigate } from "react-router";
import { searchContent } from "@/services/contentService";
import { useProfiles } from "@/hooks/useProfiles";

export default function SearchOverlay({ open, onClose }) {
  const navigate = useNavigate();
  const { currentProfile } = useProfiles();
  const inputRef = useRef(null);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [searching, setSearching] = useState(false);

  useEffect(() => {
    if (!open) return;

    const timer = window.setTimeout(() => inputRef.current?.focus(), 80);
    return () => window.clearTimeout(timer);
  }, [open]);

  useEffect(() => {
    if (!open || query.trim().length < 2) {
      setResults([]);
      return;
    }

    const timer = window.setTimeout(async () => {
      setSearching(true);
      try {
        setResults(await searchContent(query, currentProfile));
      } finally {
        setSearching(false);
      }
    }, 280);

    return () => window.clearTimeout(timer);
  }, [query, open, currentProfile]);

  function openTitle(item) {
    onClose();
    navigate(`/title/${item.slug}`);
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] overflow-y-auto bg-[#070707]/98 backdrop-blur-2xl"
        >
          <div className="box-container py-7 sm:py-10">
            <div className="flex items-center gap-3">
              <div className="flex h-14 flex-1 items-center rounded-2xl border border-white/10 bg-[#151515] px-5 shadow-xl focus-within:border-[#FFD900]/60">
                <Search size={20} className="mr-3 shrink-0 text-[#747474]" />
                <input
                  ref={inputRef}
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Search movies, series, genres..."
                  className="h-full min-w-0 flex-1 bg-transparent text-base text-white outline-none placeholder:text-[#555] sm:text-lg"
                />
                {searching && (
                  <span className="ml-3 size-4 animate-spin rounded-full border-2 border-white/10 border-t-[#FFD900]" />
                )}
              </div>

              <button
                type="button"
                onClick={onClose}
                className="flex size-12 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-[#151515] transition hover:text-[#FFD900]"
                aria-label="Close search"
              >
                <X size={20} />
              </button>
            </div>

            {!query && (
              <div className="py-16">
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#FFD900]">
                  Discover
                </p>
                <h2 className="mt-3 font-display text-3xl font-bold">
                  What are you in the mood for?
                </h2>
                <p className="mt-3 text-sm text-[#747474]">
                  Try Action, Drama, Sci-Fi, Documentary, Kids or a title name.
                </p>
              </div>
            )}

            {query && !searching && results.length === 0 && (
              <div className="py-20 text-center">
                <p className="font-display text-2xl font-bold">No matches yet</p>
                <p className="mt-2 text-sm text-[#747474]">
                  Try a different title, genre or keyword.
                </p>
              </div>
            )}

            <div className="grid grid-cols-2 gap-x-4 gap-y-7 py-10 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
              {results.map((item) => (
                <button
                  type="button"
                  key={item.id}
                  onClick={() => openTitle(item)}
                  className="group min-w-0 text-left"
                >
                  <div className="aspect-[2/3] overflow-hidden rounded-xl bg-[#151515]">
                    <img
                      src={item.posterUrl}
                      alt={item.title}
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    />
                  </div>
                  <p className="mt-2 truncate text-sm font-semibold text-white">
                    {item.title}
                  </p>
                  <p className="mt-1 text-xs text-[#747474]">
                    {item.year} • {item.type === "SERIES" ? "Series" : "Movie"}
                  </p>
                </button>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
