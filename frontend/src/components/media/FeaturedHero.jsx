import {
  Check,
  Download,
  Info,
  Play,
  Plus,
} from "lucide-react";
import { motion } from "motion/react";
import { Button } from "@/components/ui/button";

export default function FeaturedHero({
  content,
  onPlay,
  onMoreInfo,
  onAdd,
  onDownload,
}) {
  if (!content) return null;

  return (
    <section className="relative px-3 pt-[84px] sm:px-5">
      <div className="box-container relative min-h-[68svh] overflow-hidden rounded-[24px] border border-white/[0.06] bg-[#101010] shadow-2xl shadow-black/30 sm:min-h-[72vh] sm:rounded-[28px] lg:min-h-[78vh]">
        <img
          src={content.backdropUrl}
          alt=""
          className="absolute inset-0 h-full w-full object-cover object-center"
        />

        <div className="absolute inset-0 bg-[linear-gradient(90deg,#070707_0%,rgba(7,7,7,.96)_30%,rgba(7,7,7,.62)_58%,rgba(7,7,7,.16)_100%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_top,#070707_0%,rgba(7,7,7,.78)_14%,transparent_54%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_76%_24%,rgba(255,217,0,.08),transparent_24%)]" />

        <div className="relative flex min-h-[68svh] items-end px-5 py-10 sm:min-h-[72vh] sm:items-center sm:px-10 sm:py-16 lg:min-h-[78vh] lg:px-16">
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
                className="max-h-24 max-w-[260px] object-contain object-left sm:max-h-28 sm:max-w-[330px]"
              />
            ) : (
              <h1 className="font-display text-4xl font-bold leading-[0.96] tracking-[-0.05em] sm:text-6xl lg:text-7xl">
                {content.title}
              </h1>
            )}

            <div className="mt-5 flex flex-wrap items-center gap-3 text-xs text-[#B8B8B8] sm:mt-6 sm:text-sm">
              {content.matchScore && (
                <span className="font-bold text-[#37D67A]">
                  {content.matchScore}% Match
                </span>
              )}
              {content.year && <span>{content.year}</span>}
              <span className="rounded border border-white/20 px-1.5 py-0.5 text-xs">
                {content.maturityRating}+
              </span>
              {content.runtimeLabel && <span>{content.runtimeLabel}</span>}
              {content.quality && (
                <span className="rounded border border-white/20 px-1.5 py-0.5 text-[10px] font-bold">
                  {content.quality}
                </span>
              )}
            </div>

            <p className="mt-5 max-w-xl line-clamp-3 text-sm leading-6 text-[#D2D2D2] sm:line-clamp-none sm:text-[15px] sm:leading-7">
              {content.description}
            </p>

            {content.genres?.length > 0 && (
              <p className="mt-4 text-xs text-[#8b8b8b] sm:text-sm">
                {content.genres.join(" • ")}
              </p>
            )}

            <div className="mt-7 flex flex-wrap gap-2.5 sm:mt-8 sm:gap-3">
              <Button
                onClick={onPlay}
                className="h-11 rounded-xl bg-[#FFD900] px-5 font-extrabold text-black hover:bg-[#FFE347] sm:h-12 sm:px-6"
              >
                <Play size={18} fill="currentColor" className="mr-2" />
                Play
              </Button>

              <Button
                variant="outline"
                onClick={onMoreInfo}
                className="h-11 rounded-xl border-white/10 bg-white/10 px-5 text-white backdrop-blur-lg hover:bg-white/15 hover:text-white sm:h-12 sm:px-6"
              >
                <Info size={18} className="mr-2" />
                More info
              </Button>

              <Button
                size="icon"
                variant="outline"
                onClick={onAdd}
                className="size-11 rounded-xl border-white/10 bg-black/30 text-white hover:border-[#FFD900]/40 hover:bg-[#FFD900]/10 hover:text-[#FFD900] sm:size-12"
                aria-label={content.inMyList ? "Remove from My List" : "Add to My List"}
              >
                {content.inMyList ? <Check size={19} /> : <Plus size={19} />}
              </Button>

              <Button
                size="icon"
                variant="outline"
                onClick={onDownload}
                className="size-11 rounded-xl border-white/10 bg-black/30 text-white hover:border-[#FFD900]/40 hover:bg-[#FFD900]/10 hover:text-[#FFD900] sm:size-12"
                aria-label="Download movie"
                title="Download"
              >
                <Download size={18} />
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
