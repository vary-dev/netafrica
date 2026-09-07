import {
  Plus,
} from "lucide-react";

import {
  motion,
} from "motion/react";

const examples = [
  {
    name: "You",
    emoji: "😎",
  },
  {
    name: "Family",
    emoji: "🎬",
  },
  {
    name: "Kids",
    emoji: "🧒",
  },
];

export default function ProfileShowcase({
  onProtectedAction,
}) {
  return (
    <section
      id="profiles"
      className="border-y border-white/[0.06] bg-[#101010] py-24"
    >
      <div className="box-container grid items-center gap-16 lg:grid-cols-[1fr_.9fr]">
        <div>
          <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-[#FFD900]">
            PERSONAL SPACE
          </p>

          <h2 className="mt-4 max-w-xl font-display text-4xl font-bold tracking-[-0.035em] sm:text-5xl">
            One account.
            <br />
            Four different worlds.
          </h2>

          <p className="mt-6 max-w-xl text-base leading-7 text-[#8d8d8d]">
            Every profile keeps
            its own recommendations,
            watch history, My List and
            viewing progress without
            mixing everyone together.
          </p>

          <button
            onClick={
              onProtectedAction
            }
            className="mt-8 font-bold text-[#FFD900] transition hover:text-[#FFE347]"
          >
            Create your profiles →
          </button>
        </div>

        <div className="flex flex-wrap justify-center gap-6">
          {examples.map(
            (profile, index) => (
              <motion.button
                key={profile.name}
                whileHover={{
                  y: -8,
                }}
                onClick={
                  onProtectedAction
                }
                className="group"
              >
                <div className="flex size-28 items-center justify-center rounded-2xl border border-white/10 bg-[radial-gradient(circle_at_top,#343434,#151515_65%)] text-5xl transition group-hover:border-[#FFD900]/50 sm:size-32">
                  {
                    profile.emoji
                  }
                </div>

                <p className="mt-3 text-center text-sm font-semibold text-[#B8B8B8] group-hover:text-white">
                  {
                    profile.name
                  }
                </p>
              </motion.button>
            )
          )}

          <motion.button
            whileHover={{
              y: -8,
            }}
            onClick={
              onProtectedAction
            }
            className="group"
          >
            <div className="flex size-28 items-center justify-center rounded-2xl border border-dashed border-white/15 bg-[#151515] transition group-hover:border-[#FFD900]/50 sm:size-32">
              <Plus
                className="text-[#747474] transition group-hover:text-[#FFD900]"
                size={32}
              />
            </div>

            <p className="mt-3 text-center text-sm font-semibold text-[#747474]">
              Add profile
            </p>
          </motion.button>
        </div>
      </div>
    </section>
  );
}