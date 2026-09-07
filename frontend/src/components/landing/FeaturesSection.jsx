import {
  History,
  ListPlus,
  Search,
  Sparkles,
} from "lucide-react";

import {
  motion,
} from "motion/react";

const features = [
  {
    icon: History,
    title:
      "Continue watching",
    description:
      "Pick up exactly where you stopped on your active profile.",
  },

  {
    icon: Sparkles,
    title:
      "Made for you",
    description:
      "Separate preferences help shape recommendations around each viewer.",
  },

  {
    icon: Search,
    title:
      "Discover quickly",
    description:
      "Search movies, series and genres without breaking the cinematic experience.",
  },

  {
    icon: ListPlus,
    title:
      "Your own list",
    description:
      "Save interesting titles and come back when you're ready.",
  },
];

export default function FeatureSection() {
  return (
    <section
      id="features"
      className="py-24"
    >
      <div className="box-container">
        <div className="max-w-xl">
          <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-[#FFD900]">
            BUILT AROUND YOU
          </p>

          <h2 className="mt-4 font-display text-4xl font-bold tracking-[-0.035em] sm:text-5xl">
            Less searching.
            More watching.
          </h2>
        </div>

        <div className="mt-12 grid gap-px overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.06] md:grid-cols-2 lg:grid-cols-4">
          {features.map(
            (feature, index) => {
              const Icon =
                feature.icon;

              return (
                <motion.div
                  key={
                    feature.title
                  }
                  initial={{
                    opacity: 0,
                    y: 20,
                  }}
                  whileInView={{
                    opacity: 1,
                    y: 0,
                  }}
                  viewport={{
                    once: true,
                    amount: 0.3,
                  }}
                  transition={{
                    duration:
                      0.35,
                    delay:
                      index * 0.06,
                  }}
                  className="bg-[#101010] p-7"
                >
                  <div className="flex size-11 items-center justify-center rounded-xl bg-[#FFD900]/10 text-[#FFD900]">
                    <Icon
                      size={21}
                    />
                  </div>

                  <h3 className="mt-7 font-display text-lg font-bold">
                    {
                      feature.title
                    }
                  </h3>

                  <p className="mt-3 text-sm leading-6 text-[#747474]">
                    {
                      feature
                        .description
                    }
                  </p>
                </motion.div>
              );
            }
          )}
        </div>
      </div>
    </section>
  );
}