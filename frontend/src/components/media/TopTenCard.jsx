import { Play } from "lucide-react";
import { motion } from "motion/react";

export default function TopTenCard({
  item,
  rank,
  onPlay,
  onDetails,
}) {
  return (
    <motion.article
      whileHover={{ y: -6 }}
      className="group relative flex w-[255px] flex-none items-end sm:w-[285px]"
    >
      <div className="relative z-10 w-[42%] select-none font-display text-[120px] font-black leading-[0.78] tracking-[-0.1em] text-[#070707] [-webkit-text-stroke:2px_rgba(255,255,255,0.45)] sm:text-[145px]">
        {rank}
      </div>

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
        className="relative -ml-4 w-[68%] cursor-pointer overflow-hidden rounded-xl bg-[#151515] outline-none focus-visible:ring-2 focus-visible:ring-[#FFD900]/70"
      >
        <div className="relative aspect-[2/3] overflow-hidden">
          <img
            src={item.posterUrl}
            alt={item.title}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent opacity-60" />

          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              onPlay?.();
            }}
            className="absolute bottom-3 right-3 flex size-9 items-center justify-center rounded-full bg-[#FFD900] text-black opacity-0 transition group-hover:opacity-100 focus-visible:opacity-100"
            aria-label={`Play ${item.title}`}
          >
            <Play size={14} fill="currentColor" />
          </button>
        </div>
      </div>
    </motion.article>
  );
}
