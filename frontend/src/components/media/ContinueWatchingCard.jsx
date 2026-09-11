import { Play } from "lucide-react";
import { motion } from "motion/react";

export default function ContinueWatchingCard({
  item,
  onPlay,
  onDetails,
}) {
  return (
    <motion.article
      whileHover={{ y: -5 }}
      className="group w-[270px] flex-none sm:w-[310px] lg:w-[340px]"
    >
      <div
        role="button"
        tabIndex={0}
        onClick={onDetails}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            onDetails?.();
          }
        }}
        className="block w-full cursor-pointer overflow-hidden rounded-xl bg-[#151515] text-left outline-none focus-visible:ring-2 focus-visible:ring-[#FFD900]/70"
      >
        <div className="relative aspect-video overflow-hidden">
          <img
            src={item.thumbnailUrl || item.backdropUrl}
            alt={item.title}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          />

          <div className="absolute inset-0 bg-black/10 transition group-hover:bg-black/35" />

          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              onPlay?.();
            }}
            className="absolute left-1/2 top-1/2 flex size-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-[#FFD900] text-black opacity-0 shadow-xl transition group-hover:opacity-100 focus-visible:opacity-100"
            aria-label={`Resume ${item.title}`}
          >
            <Play size={18} fill="currentColor" />
          </button>

          <div className="absolute inset-x-0 bottom-0 h-1 bg-white/20">
            <div
              className="h-full bg-[#FFD900]"
              style={{ width: `${Math.min(item.progress || 0, 100)}%` }}
            />
          </div>
        </div>

        <div className="flex items-center justify-between gap-3 px-1 pt-3">
          <div className="min-w-0">
            <h3 className="truncate font-display text-sm font-bold text-white">
              {item.title}
            </h3>
            <p className="mt-1 text-[11px] text-[#747474]">
              {item.progress}% watched
            </p>
          </div>
          <span className="shrink-0 text-[10px] font-bold text-[#FFD900]">
            RESUME
          </span>
        </div>
      </div>
    </motion.article>
  );
}
