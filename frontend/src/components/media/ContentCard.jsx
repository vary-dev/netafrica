import {
  Check,
  Info,
  Play,
  Plus,
  ThumbsUp,
} from "lucide-react";
import { motion } from "motion/react";

export default function ContentCard({
  item,
  onPlay,
  onDetails,
  onAdd,
  onLike,
}) {
  return (
    <motion.article
      whileHover={{ y: -7, scale: 1.035 }}
      transition={{ duration: 0.2 }}
      className="group relative w-[235px] flex-none sm:w-[260px] lg:w-[285px]"
    >
      <button
        type="button"
        onClick={onDetails}
        className="block w-full overflow-hidden rounded-xl bg-[#151515] text-left shadow-lg"
      >
        <div className="relative aspect-video overflow-hidden">
          <img
            src={item.thumbnailUrl || item.backdropUrl || item.posterUrl}
            alt={item.title}
            loading="lazy"
            className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.06]"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/10 opacity-50 transition group-hover:opacity-90" />

          {item.badge && (
            <span className="absolute left-3 top-3 rounded-md bg-[#FFD900] px-2 py-1 text-[9px] font-black uppercase tracking-wide text-black">
              {item.badge}
            </span>
          )}

          <div className="absolute inset-x-3 bottom-3 translate-y-2 opacity-0 transition duration-200 group-hover:translate-y-0 group-hover:opacity-100">
            <h3 className="truncate font-display text-sm font-bold text-white">
              {item.title}
            </h3>
          </div>
        </div>
      </button>

      <div className="mt-2.5">
        <h3 className="truncate font-display text-sm font-bold text-white">
          {item.title}
        </h3>
        <div className="mt-1 flex items-center gap-2 text-[11px] text-[#777]">
          {item.matchScore && (
            <span className="font-bold text-[#37D67A]">
              {item.matchScore}% Match
            </span>
          )}
          <span>{item.year}</span>
          <span>{item.maturityRating}+</span>
        </div>
      </div>

      <div className="pointer-events-none absolute left-0 right-0 top-[calc(100%-44px)] z-30 hidden rounded-xl border border-white/10 bg-[#101010]/98 p-4 opacity-0 shadow-2xl backdrop-blur-xl transition duration-200 group-hover:pointer-events-auto group-hover:opacity-100 lg:block">
        <div className="flex items-center gap-2">
          <CircleButton primary onClick={onPlay} label="Play">
            <Play size={14} fill="currentColor" />
          </CircleButton>

          <CircleButton onClick={onAdd} label={item.inMyList ? "Remove from My List" : "Add to My List"}>
            {item.inMyList ? <Check size={14} /> : <Plus size={14} />}
          </CircleButton>

          <CircleButton onClick={onLike} label="Like">
            <ThumbsUp size={14} />
          </CircleButton>

          <CircleButton onClick={onDetails} label="More info" className="ml-auto">
            <Info size={14} />
          </CircleButton>
        </div>

        <h3 className="mt-4 truncate font-display text-sm font-bold">
          {item.title}
        </h3>

        <div className="mt-2 flex flex-wrap items-center gap-2 text-[11px] text-[#999]">
          {item.matchScore && (
            <span className="font-bold text-[#37D67A]">
              {item.matchScore}% Match
            </span>
          )}
          <span>{item.year}</span>
          <span>{item.maturityRating}+</span>
          <span>{item.quality}</span>
        </div>

        <p className="mt-2 truncate text-xs text-[#747474]">
          {item.genres?.join(" • ")}
        </p>
      </div>
    </motion.article>
  );
}

function CircleButton({
  children,
  primary = false,
  label,
  className = "",
  ...props
}) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      {...props}
      className={`flex size-8 items-center justify-center rounded-full border transition ${
        primary
          ? "border-[#FFD900] bg-[#FFD900] text-black hover:bg-[#FFE347]"
          : "border-white/20 bg-[#191919] text-white hover:border-[#FFD900]/50 hover:text-[#FFD900]"
      } ${className}`}
    >
      {children}
    </button>
  );
}
