import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import ContentCard from "@/components/media/ContentCard";
import ContinueWatchingCard from "@/components/media/ContinueWatchingCard";
import TopTenCard from "@/components/media/TopTenCard";

export default function ContentRail({
  title,
  items = [],
  variant = "standard",
  onDetails,
  onPlay,
  onAdd,
  onLike,
}) {
  const railRef = useRef(null);

  function move(direction) {
    railRef.current?.scrollBy({
      left: direction * Math.min(window.innerWidth * 0.8, 900),
      behavior: "smooth",
    });
  }

  if (!items.length) return null;

  return (
    <section className="relative py-5 sm:py-7">
      <div className="box-container">
        <div className="mb-4 flex items-end justify-between gap-4">
          <h2 className="font-display text-xl font-bold tracking-[-0.025em] sm:text-2xl">
            {title}
          </h2>

          <div className="hidden gap-2 md:flex">
            <RailButton onClick={() => move(-1)} label="Scroll left">
              <ChevronLeft size={17} />
            </RailButton>
            <RailButton onClick={() => move(1)} label="Scroll right">
              <ChevronRight size={17} />
            </RailButton>
          </div>
        </div>

        <div
          ref={railRef}
          className={`flex snap-x gap-4 overflow-x-auto overflow-y-visible pt-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden ${
            variant === "standard" ? "pb-28" : "pb-5"
          }`}
        >
          {items.map((item, index) => (
            <div key={item.id} className="snap-start">
              {variant === "continue" ? (
                <ContinueWatchingCard
                  item={item}
                  onPlay={() => onPlay?.(item)}
                  onDetails={() => onDetails?.(item)}
                />
              ) : variant === "top10" ? (
                <TopTenCard
                  item={item}
                  rank={index + 1}
                  onPlay={() => onPlay?.(item)}
                  onDetails={() => onDetails?.(item)}
                />
              ) : (
                <ContentCard
                  item={item}
                  onPlay={() => onPlay?.(item)}
                  onDetails={() => onDetails?.(item)}
                  onAdd={() => onAdd?.(item)}
                  onLike={() => onLike?.(item)}
                />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function RailButton({ children, label, ...props }) {
  return (
    <button
      type="button"
      aria-label={label}
      {...props}
      className="flex size-9 items-center justify-center rounded-full border border-white/10 bg-[#151515] text-white transition hover:border-[#FFD900]/40 hover:text-[#FFD900]"
    >
      {children}
    </button>
  );
}
