import {
  ArrowRight,
  Play,
  Sparkles,
} from "lucide-react";

import {
  motion,
} from "motion/react";

import {
  Button,
} from "@/components/ui/button";

const LANDING_WALLPAPER =
  "https://res.cloudinary.com/dydg39ukk/image/upload/v1789383274/moviebanner_dujb0w.png";

export default function HeroSection({
  movie,
  onProtectedAction,
}) {
  const background =
    movie?.backdropUrl ||
    LANDING_WALLPAPER;

  const title =
    movie?.title ||
    "Watch more. Switch profiles. Stream your way.";

  const description =
    movie?.description ||
    "24/7Box brings movies, personal profiles and browser playback into one clean streaming experience built to feel cinematic on every screen.";

  return (
    <section
      id="discover"
      className="relative min-h-[88svh] overflow-hidden bg-[#070707] sm:min-h-[92vh]"
    >
      <motion.img
        src={background}
        alt=""
        initial={{ scale: 1.03 }}
        animate={{ scale: [1.03, 1.075, 1.03] }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute inset-0 h-full w-full object-cover object-center"
      />

      <div className="absolute inset-0 bg-[linear-gradient(90deg,#070707_2%,rgba(7,7,7,.92)_30%,rgba(7,7,7,.58)_58%,rgba(7,7,7,.25)_100%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(to_top,#070707_0%,rgba(7,7,7,.88)_12%,rgba(7,7,7,.12)_55%,rgba(7,7,7,.5)_100%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_72%_32%,rgba(255,217,0,.12),transparent_23%),radial-gradient(circle_at_16%_18%,rgba(255,255,255,.06),transparent_18%)]" />

      <div className="box-container relative flex min-h-[88svh] items-end pb-16 pt-28 sm:min-h-[92vh] sm:items-center sm:pb-20 sm:pt-32">
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: "easeOut" }}
          className="max-w-2xl"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-[#FFD900]/20 bg-[#FFD900]/10 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.18em] text-[#FFD900] backdrop-blur-md sm:text-xs">
            <Sparkles size={13} />
            24/7Box streaming
          </div>

          <h1 className="mt-5 max-w-2xl font-display text-4xl font-bold leading-[0.96] tracking-[-0.05em] sm:text-6xl lg:text-7xl">
            {title}
          </h1>

          <p className="mt-5 max-w-xl text-sm leading-7 text-[#D0D0D0] sm:text-base">
            {description}
          </p>

          {movie?.genres?.length > 0 && (
            <p className="mt-4 text-sm text-[#8B8B8B]">
              {movie.genres.join(" • ")}
            </p>
          )}

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <Button
              onClick={onProtectedAction}
              className="h-12 w-full rounded-xl bg-[#FFD900] px-6 font-extrabold text-[#070707] shadow-lg shadow-[#FFD900]/10 hover:bg-[#FFE347] sm:w-auto"
            >
              <Play className="mr-2" size={18} fill="currentColor" />
              Start watching
            </Button>

            <Button
              variant="outline"
              onClick={onProtectedAction}
              className="h-12 w-full rounded-xl border-white/15 bg-black/25 px-6 text-white backdrop-blur-xl hover:border-white/25 hover:bg-white/10 hover:text-white sm:w-auto"
            >
              Explore 24/7Box
              <ArrowRight className="ml-2" size={17} />
            </Button>
          </div>

          <div className="mt-8 flex flex-wrap gap-x-5 gap-y-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-white/45">
            <span>Multiple profiles</span>
            <span>Real movie catalog</span>
            <span>Browser playback</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
