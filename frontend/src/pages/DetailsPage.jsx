import { useEffect, useState } from "react";
import { ArrowLeft, Check, Play, Plus, ThumbsUp } from "lucide-react";
import { useNavigate, useParams } from "react-router";
import { toast } from "sonner";
import AppShell from "@/components/layout/AppShell";
import { Button } from "@/components/ui/button";
import { useProfiles } from "@/hooks/useProfiles";
import {
  getTitle,
  toggleLike,
  toggleMyList,
} from "@/services/contentService";

export default function DetailsPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { currentProfile } = useProfiles();
  const [item, setItem] = useState(null);

  useEffect(() => {
    getTitle(slug, currentProfile).then(setItem);
  }, [slug, currentProfile]);

  async function changeList() {
    const added = await toggleMyList(currentProfile, item.id);
    setItem((current) => ({ ...current, inMyList: added }));
    toast.success(added ? "Added to My 24/7Box" : "Removed from My 24/7Box");
  }

  async function like() {
    const liked = await toggleLike(currentProfile, item.id);
    setItem((current) => ({ ...current, liked }));
  }

  if (!item) {
    return (
      <AppShell>
        <div className="flex min-h-screen items-center justify-center text-[#747474]">
          Loading title...
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <section className="relative min-h-screen overflow-hidden">
        <img
          src={item.backdropUrl}
          alt=""
          className="absolute inset-0 h-[70vh] w-full object-cover"
        />
        <div className="absolute inset-x-0 top-0 h-[70vh] bg-[linear-gradient(90deg,#070707_0%,rgba(7,7,7,.9)_35%,rgba(7,7,7,.2)_80%)]" />
        <div className="absolute inset-x-0 top-0 h-[72vh] bg-gradient-to-t from-[#070707] via-transparent to-black/50" />

        <div className="box-container relative z-10 pb-24 pt-28">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 rounded-xl border border-white/10 bg-black/30 px-4 py-2 text-sm font-semibold text-white backdrop-blur-md hover:text-[#FFD900]"
          >
            <ArrowLeft size={16} />
            Back
          </button>

          <div className="max-w-2xl pt-[18vh]">
            <p className="text-xs font-black uppercase tracking-[0.22em] text-[#FFD900]">
              {item.type === "SERIES" ? "24/7BOX SERIES" : "24/7BOX MOVIE"}
            </p>

            <h1 className="mt-3 font-display text-5xl font-bold tracking-[-0.05em] sm:text-6xl">
              {item.title}
            </h1>

            <div className="mt-5 flex flex-wrap gap-3 text-sm text-[#B8B8B8]">
              <span className="font-bold text-[#37D67A]">
                {item.matchScore}% Match
              </span>
              <span>{item.year}</span>
              <span>{item.maturityRating}+</span>
              <span>{item.runtimeLabel}</span>
              <span>{item.quality}</span>
            </div>

            <p className="mt-6 text-sm leading-7 text-[#D0D0D0] sm:text-base">
              {item.description}
            </p>

            <p className="mt-4 text-sm text-[#747474]">
              {item.genres.join(" • ")}
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Button
                onClick={() => toast.success(`Ready to play ${item.title}`)}
                className="h-12 rounded-xl bg-[#FFD900] px-7 font-extrabold text-black hover:bg-[#FFE347]"
              >
                <Play className="mr-2 size-4" fill="currentColor" />
                Play
              </Button>

              <Button
                variant="outline"
                onClick={changeList}
                className="h-12 rounded-xl border-white/10 bg-white/10 text-white hover:bg-white/15 hover:text-white"
              >
                {item.inMyList ? (
                  <Check className="mr-2 size-4" />
                ) : (
                  <Plus className="mr-2 size-4" />
                )}
                {item.inMyList ? "In My List" : "My List"}
              </Button>

              <Button
                size="icon"
                variant="outline"
                onClick={like}
                className={`size-12 rounded-xl border-white/10 bg-white/10 ${
                  item.liked ? "text-[#FFD900]" : "text-white"
                }`}
              >
                <ThumbsUp size={18} />
              </Button>
            </div>
          </div>

          <div className="mt-20 grid gap-5 border-t border-white/[0.06] pt-8 sm:grid-cols-3">
            <Meta label="Type" value={item.type === "SERIES" ? "Series" : "Movie"} />
            <Meta label="Genres" value={item.genres.join(", ")} />
            <Meta label="Viewing level" value={`${item.maturityRating}+`} />
          </div>
        </div>
      </section>
    </AppShell>
  );
}

function Meta({ label, value }) {
  return (
    <div>
      <p className="text-xs font-bold uppercase tracking-[0.15em] text-[#555]">
        {label}
      </p>
      <p className="mt-2 text-sm text-[#B8B8B8]">{value}</p>
    </div>
  );
}
