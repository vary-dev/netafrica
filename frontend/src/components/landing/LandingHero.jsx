import { motion } from "motion/react";
import {
  Play,
  Sparkles,
} from "lucide-react";

export function LandingHero({
  onStart,
}) {
  return (
    <section className="relative min-h-screen overflow-hidden bg-[#080808]">
      <img
        src="https://images.unsplash.com/photo-1489599849927-2ee91cede3ba"
        alt=""
        className="absolute inset-0 h-full w-full object-cover opacity-55"
      />

      <div className="absolute inset-0 bg-gradient-to-r from-[#080808] via-[#080808]/80 to-transparent" />

      <div className="absolute inset-0 bg-gradient-to-t from-[#080808] via-transparent to-black/40" />

      <div className="relative mx-auto flex min-h-screen max-w-[1500px] items-center px-6 pt-24 lg:px-10">
        <motion.div
          initial={{
            opacity: 0,
            y: 30,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.6,
          }}
          className="max-w-3xl"
        >
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-neutral-300 backdrop-blur-xl">
            <Sparkles size={14} />

            A new way to discover stories
          </div>

          <h1 className="max-w-3xl text-5xl font-extrabold leading-[0.96] tracking-[-0.045em] sm:text-6xl lg:text-7xl">
            Your next story
            <span className="block bg-[linear-gradient(135deg,#7A3028,#A56243,#C18A62)] bg-clip-text text-transparent">
              is already waiting.
            </span>
          </h1>

          <p className="mt-7 max-w-xl text-base leading-7 text-neutral-300 md:text-lg">
            Discover movies and series,
            continue where you left off and
            create personalized viewing
            spaces for everyone on your
            account.
          </p>

          <div className="mt-9 flex flex-wrap gap-3">
            <motion.button
              whileHover={{
                scale: 1.02,
              }}
              whileTap={{
                scale: 0.98,
              }}
              onClick={onStart}
              className="flex h-13 items-center gap-2 rounded-xl bg-[linear-gradient(135deg,#7A3028,#A56243,#C18A62)] px-7 font-semibold"
            >
              <Play
                size={18}
                fill="currentColor"
              />

              Start watching
            </motion.button>

            <a
              href="#discover"
              className="flex h-13 items-center rounded-xl border border-white/15 bg-white/5 px-7 text-sm font-medium backdrop-blur-xl transition hover:bg-white/10"
            >
              Explore what's inside
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}