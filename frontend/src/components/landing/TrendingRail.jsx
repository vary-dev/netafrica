import {
  useRef,
} from "react";

import {
  ChevronLeft,
  ChevronRight,
  Play,
} from "lucide-react";

import {
  motion,
} from "motion/react";

export default function TrendingRail({
  movies,
  onProtectedAction,
}) {
  const railRef = useRef(null);

  function scroll(amount) {
    railRef.current?.scrollBy({
      left: amount,
      behavior: "smooth",
    });
  }

  if (!movies?.length) {
    return null;
  }

  return (
    <section
      id="trending"
      className="relative z-10 -mt-20 pb-20"
    >
      <div className="box-container">
        <div className="mb-5 flex items-end justify-between">
          <div>
            <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-[#FFD900]">
              From the catalog
            </p>

            <h2 className="mt-1 font-display text-2xl font-bold tracking-[-0.02em]">
              Available now
            </h2>
          </div>

          <div className="hidden gap-2 md:flex">
            <button
              type="button"
              onClick={() => scroll(-600)}
              className="flex size-10 items-center justify-center rounded-full border border-white/10 bg-[#151515]/90 text-white transition hover:border-[#FFD900]/40 hover:text-[#FFD900]"
              aria-label="Scroll left"
            >
              <ChevronLeft size={18} />
            </button>

            <button
              type="button"
              onClick={() => scroll(600)}
              className="flex size-10 items-center justify-center rounded-full border border-white/10 bg-[#151515]/90 text-white transition hover:border-[#FFD900]/40 hover:text-[#FFD900]"
              aria-label="Scroll right"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>

        <div
          ref={railRef}
          className="flex snap-x gap-4 overflow-x-auto pb-5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {movies.map((movie, index) => (
            <motion.button
              key={movie.id}
              whileHover={{ y: -7, scale: 1.025 }}
              whileTap={{ scale: 0.98 }}
              onClick={onProtectedAction}
              className="group relative w-[180px] flex-none snap-start text-left sm:w-[205px] lg:w-[220px]"
            >
              <div className="relative aspect-[2/3] overflow-hidden rounded-xl bg-[#151515]">
                {movie.posterUrl ? (
                  <img
                    src={movie.posterUrl}
                    alt={movie.title}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="flex h-full items-end bg-[linear-gradient(145deg,#1d1d1d,#0d0d0d)] p-4">
                    <span className="font-display text-lg font-bold">
                      {movie.title}
                    </span>
                  </div>
                )}

                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-transparent opacity-60 transition group-hover:opacity-90" />

                <div className="absolute left-3 top-3 flex size-7 items-center justify-center rounded-full bg-[#FFD900] font-display text-xs font-black text-black">
                  {index + 1}
                </div>

                <div className="absolute inset-x-3 bottom-3 flex translate-y-3 items-center justify-between opacity-0 transition duration-200 group-hover:translate-y-0 group-hover:opacity-100">
                  <div className="flex size-9 items-center justify-center rounded-full bg-[#FFD900] text-black">
                    <Play size={15} fill="currentColor" />
                  </div>
                </div>
              </div>

              <h3 className="mt-3 truncate font-display text-sm font-bold">
                {movie.title}
              </h3>

              <p className="mt-1 text-xs text-[#747474]">
                {movie.year || "Movie"} • {movie.maturityRating}+
              </p>
            </motion.button>
          ))}
        </div>
      </div>
    </section>
  );
}
