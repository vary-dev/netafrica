import { motion } from "motion/react";

export function LandingHeader({
  onSignIn,
}) {
  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <div className="mx-auto flex h-20 max-w-[1500px] items-center justify-between px-6 lg:px-10">
        <div className="text-xl font-black tracking-[-0.04em]">
          VARY
          <span className="bg-[linear-gradient(135deg,#7A3028,#A56243,#C18A62)] bg-clip-text text-transparent">
            STREAM
          </span>
        </div>

        <nav className="hidden items-center gap-8 text-sm text-neutral-300 md:flex">
          <a href="#discover">
            Discover
          </a>

          <a href="#features">
            Features
          </a>

          <a href="#profiles">
            Profiles
          </a>
        </nav>

        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={onSignIn}
          className="rounded-lg border border-white/15 bg-black/30 px-5 py-2.5 text-sm font-medium backdrop-blur-xl transition hover:bg-white/10"
        >
          Sign in
        </motion.button>
      </div>
    </header>
  );
}