import {
  Download,
  PlayCircle,
  Sparkles,
  Users,
} from "lucide-react";

import {
  motion,
} from "motion/react";

const features = [
  {
    icon: PlayCircle,
    title: "Play in browser",
    description:
      "Open supported movie links directly in the built-in 24/7Box player.",
  },
  {
    icon: Users,
    title: "Personal profiles",
    description:
      "Keep separate profile identities, avatars and viewing preferences under one account.",
  },
  {
    icon: Sparkles,
    title: "Real movie catalog",
    description:
      "Artwork, metadata and available video sources come from the live Node.js and MySQL API.",
  },
  {
    icon: Download,
    title: "Download controls",
    description:
      "Download supported direct video files while stream-provider links stay playback-only.",
  },
];

export default function FeatureSection() {
  return (
    <section
      id="features"
      className="py-20 sm:py-24"
    >
      <div className="box-container">
        <div className="max-w-xl">
          <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-[#FFD900]">
            BUILT AROUND WATCHING
          </p>

          <h2 className="mt-4 font-display text-4xl font-bold tracking-[-0.035em] sm:text-5xl">
            Simple controls.
            Cinematic experience.
          </h2>
        </div>

        <div className="mt-10 grid gap-px overflow-hidden rounded-[24px] border border-white/[0.06] bg-white/[0.06] sm:mt-12 md:grid-cols-2 lg:grid-cols-4">
          {features.map(
            (feature, index) => {
              const Icon = feature.icon;

              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{
                    duration: 0.35,
                    delay: index * 0.06,
                  }}
                  className="bg-[#101010]/90 p-6 backdrop-blur-sm sm:p-7"
                >
                  <div className="flex size-11 items-center justify-center rounded-xl border border-[#FFD900]/10 bg-[#FFD900]/10 text-[#FFD900]">
                    <Icon size={21} />
                  </div>

                  <h3 className="mt-6 font-display text-lg font-bold">
                    {feature.title}
                  </h3>

                  <p className="mt-3 text-sm leading-6 text-[#747474]">
                    {feature.description}
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
