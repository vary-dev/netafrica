import { Info, Play, Plus, Check } from "lucide-react";
import { motion } from "motion/react";
import { Button } from "@/components/ui/button";

export default function FeaturedHero({
  content,
  onPlay,
  onMoreInfo,
  onAdd,
}) {
  if (!content) return null;

  return (
    <section className="relative px-3 pt-[84px] sm:px-5">
      <div className="box-container relative min-h-[72vh] overflow-hidden rounded-[26px] border border-white/[0.06] bg-[#101010] shadow-2xl shadow-black/30 lg:min-h-[78vh]">
        <img
          src={content.backdropUrl}
          alt=""
          className="absolute inset-0 h-full w-full object-cover object-center"
        />

        <div className="absolute inset-0 bg-[linear-gradient(90deg,#070707_0%,rgba(7,7,7,.95)_27%,rgba(7,7,7,.65)_53%,rgba(7,7,7,.12)_82%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_top,#070707_0%,rgba(7,7,7,.68)_10%,transparent_48%)]" />

        <div className="relative flex min-h-[72vh] items-center px-6 py-16 sm:px-10 lg:min-h-[78vh] lg:px-16">
          <motion.div
            initial={{ opacity: 0, y: 26 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.48, ease: "easeOut" }}
            className="max-w-2xl"
          >
            <div className="mb-4 flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-[#FFD900] px-3 py-1 text-[10px] font-black uppercase tracking-[0.16em] text-black">
                24/7Box Pick
              </span>

              {content.badge && (
                <span className="rounded-full border border-white/10 bg-black/30 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-white backdrop-blur-md">
                  {content.badge}
                </span>
              )}
            </div>

            {content.logoUrl ? (
              <img
                src={content.logoUrl}
                alt={content.title}
                className="max-h-28 max-w-[330px] object-contain object-left"
              />
            ) : (
              <h1 className="font-display text-5xl font-bold leading-[0.95] tracking-[-0.05em] sm:text-6xl lg:text-7xl">
                {content.title}
              </h1>
            )}

            <div className="mt-6 flex flex-wrap items-center gap-3 text-sm text-[#B8B8B8]">
              {content.matchScore && (
                <span className="font-bold text-[#37D67A]">
                  {content.matchScore}% Match
                </span>
              )}
              <span>{content.year}</span>
              <span className="rounded border border-white/20 px-1.5 py-0.5 text-xs">
                {content.maturityRating}+
              </span>
              <span>{content.runtimeLabel}</span>
              <span className="rounded border border-white/20 px-1.5 py-0.5 text-[10px] font-bold">
                {content.quality}
              </span>
            </div>

            <p className="mt-5 max-w-xl text-sm leading-7 text-[#D2D2D2] sm:text-[15px]">
              {content.description}
            </p>

            <p className="mt-4 text-sm text-[#8b8b8b]">
              {content.genres?.join(" • ")}
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Button
                onClick={onPlay}
                className="h-12 rounded-xl bg-[#FFD900] px-6 font-extrabold text-black hover:bg-[#FFE347]"
              >
                <Play size={18} fill="currentColor" className="mr-2" />
                Play
              </Button>

              <Button
                variant="outline"
                onClick={onMoreInfo}
                className="h-12 rounded-xl border-white/10 bg-white/10 px-6 text-white backdrop-blur-lg hover:bg-white/15 hover:text-white"
              >
                <Info size={18} className="mr-2" />
                More info
              </Button>

              <Button
                size="icon"
                variant="outline"
                onClick={onAdd}
                className="size-12 rounded-xl border-white/10 bg-black/30 text-white hover:border-[#FFD900]/40 hover:bg-[#FFD900]/10 hover:text-[#FFD900]"
                aria-label={content.inMyList ? "Remove from My List" : "Add to My List"}
              >
                {content.inMyList ? <Check size={19} /> : <Plus size={19} />}
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
