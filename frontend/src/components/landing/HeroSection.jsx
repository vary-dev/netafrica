import {
  Info,
  Play,
} from "lucide-react";

import {
  motion,
} from "motion/react";

import {
  Badge,
} from "@/components/ui/badge";

import {
  Button,
} from "@/components/ui/button";

export default function HeroSection({
  movie,
  onProtectedAction,
}) {
  if (!movie) {
    return (
      <section
        id="discover"
        className="relative min-h-[86vh] overflow-hidden bg-[#070707]"
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_72%_35%,rgba(255,217,0,.14),transparent_27%),radial-gradient(circle_at_22%_72%,rgba(255,255,255,.06),transparent_24%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_top,#070707_0%,transparent_45%)]" />

        <div className="box-container relative flex min-h-[86vh] items-center pt-24">
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-2xl pb-20 pt-16"
          >
            <p className="text-xs font-extrabold uppercase tracking-[0.26em] text-[#FFD900]">
              24/7BOX
            </p>

            <h1 className="mt-4 font-display text-balance text-5xl font-bold leading-[0.94] tracking-[-0.05em] sm:text-6xl lg:text-7xl">
              Your next story, ready when you are.
            </h1>

            <p className="mt-6 max-w-xl text-[15px] leading-7 text-[#B8B8B8] sm:text-base">
              Sign in to explore the live movie catalog, choose a viewing profile,
              and play available titles directly in your browser.
            </p>

            <Button
              onClick={onProtectedAction}
              className="mt-8 h-12 rounded-xl bg-[#FFD900] px-6 font-extrabold text-[#070707] hover:bg-[#FFE347]"
            >
              <Play className="mr-2" size={18} fill="currentColor" />
              Start watching
            </Button>
          </motion.div>
        </div>
      </section>
    );
  }

  return (
    <section
      id="discover"
      className="relative min-h-[92vh] overflow-hidden"
    >
      {movie.backdropUrl && (
        <img
          src={movie.backdropUrl}
          alt=""
          className="absolute inset-0 h-full w-full object-cover object-center"
        />
      )}

      <div className="absolute inset-0 bg-[linear-gradient(90deg,#070707_0%,rgba(7,7,7,.94)_24%,rgba(7,7,7,.62)_53%,rgba(7,7,7,.12)_78%,rgba(7,7,7,.15)_100%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(to_top,#070707_0%,rgba(7,7,7,.76)_13%,transparent_52%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(7,7,7,.55),transparent_30%)]" />

      <div className="box-container relative flex min-h-[92vh] items-center pt-24">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: "easeOut" }}
          className="max-w-2xl pb-24 pt-20"
        >
          <p className="mb-4 text-xs font-extrabold uppercase tracking-[0.26em] text-[#FFD900]">
            {movie.eyebrow}
          </p>

          <h1 className="font-display text-balance text-5xl font-bold leading-[0.94] tracking-[-0.045em] sm:text-6xl lg:text-7xl">
            {movie.title}
          </h1>

          <div className="mt-6 flex flex-wrap items-center gap-3 text-sm text-[#B8B8B8]">
            {movie.year && <span>{movie.year}</span>}

            <Badge className="border-white/10 bg-white/10 text-white">
              {movie.maturityRating}+
            </Badge>

            {movie.runtimeLabel && <span>{movie.runtimeLabel}</span>}

            {movie.quality && (
              <Badge className="border-[#FFD900]/25 bg-[#FFD900]/10 font-bold text-[#FFD900]">
                {movie.quality}
              </Badge>
            )}
          </div>

          {movie.description && (
            <p className="mt-6 max-w-xl text-[15px] leading-7 text-[#D1D1D1] sm:text-base">
              {movie.description}
            </p>
          )}

          {movie.genres?.length > 0 && (
            <p className="mt-4 text-sm text-[#8B8B8B]">
              {movie.genres.join(" • ")}
            </p>
          )}

          <div className="mt-8 flex flex-wrap gap-3">
            <Button
              onClick={onProtectedAction}
              className="h-12 rounded-xl bg-[#FFD900] px-6 font-extrabold text-[#070707] hover:bg-[#FFE347]"
            >
              <Play className="mr-2" size={18} fill="currentColor" />
              Start watching
            </Button>

            <Button
              variant="outline"
              onClick={onProtectedAction}
              className="h-12 rounded-xl border-white/10 bg-white/10 px-6 text-white backdrop-blur-md hover:bg-white/15 hover:text-white"
            >
              <Info className="mr-2" size={18} />
              More info
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
