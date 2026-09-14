import {
  useEffect,
  useState,
} from "react";

import {
  ArrowLeft,
  Check,
  Download,
  Play,
  Plus,
  ThumbsUp,
} from "lucide-react";

import {
  useNavigate,
  useParams,
} from "react-router";

import {
  toast,
} from "sonner";

import AppShell from "@/components/layout/AppShell";
import { Button } from "@/components/ui/button";
import { useProfiles } from "@/hooks/useProfiles";

import {
  getTitle,
  toggleLike,
  toggleMyList,
} from "@/services/contentService";

import {
  downloadMedia,
} from "@/utils/mediaDownload";

export default function DetailsPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { currentProfile } = useProfiles();

  const [item, setItem] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    getTitle(slug, currentProfile)
      .then(setItem)
      .catch((requestError) => {
        setError(
          requestError.response?.data?.message ||
            requestError.message
        );
      });
  }, [slug, currentProfile]);

  async function changeList() {
    const added = await toggleMyList(
      currentProfile,
      item.id
    );

    setItem((current) => ({
      ...current,
      inMyList: added,
    }));

    toast.success(
      added
        ? "Added to My 24/7Box"
        : "Removed from My 24/7Box"
    );
  }

  async function like() {
    const liked = await toggleLike(
      currentProfile,
      item.id
    );

    setItem((current) => ({
      ...current,
      liked,
    }));

    toast.success(liked ? "Liked." : "Like removed.");
  }

  function download() {
    const result = downloadMedia(item);

    if (result.ok) {
      toast.success(result.message);
    } else {
      toast.info(result.message);
    }
  }

  if (error) {
    return (
      <AppShell>
        <div className="box-container flex min-h-screen items-center justify-center pt-20 text-center">
          <div>
            <h1 className="font-display text-3xl font-bold">
              Title unavailable
            </h1>
            <p className="mt-3 text-sm text-[#747474]">
              {error}
            </p>
          </div>
        </div>
      </AppShell>
    );
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
        {item.backdropUrl && (
          <img
            src={item.backdropUrl}
            alt=""
            className="absolute inset-0 h-[72vh] w-full object-cover object-center"
          />
        )}

        <div className="absolute inset-x-0 top-0 h-[72vh] bg-[linear-gradient(90deg,#070707_0%,rgba(7,7,7,.94)_34%,rgba(7,7,7,.28)_82%)]" />
        <div className="absolute inset-x-0 top-0 h-[74vh] bg-gradient-to-t from-[#070707] via-transparent to-black/50" />
        <div className="absolute inset-x-0 top-0 h-[72vh] bg-[radial-gradient(circle_at_78%_25%,rgba(255,217,0,.08),transparent_24%)]" />

        <div className="box-container relative z-10 pb-24 pt-24 sm:pt-28">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 rounded-xl border border-white/10 bg-black/30 px-4 py-2 text-sm font-semibold text-white backdrop-blur-md transition hover:border-[#FFD900]/30 hover:text-[#FFD900]"
          >
            <ArrowLeft size={16} />
            Back
          </button>

          <div className="max-w-2xl pt-[14vh] sm:pt-[18vh]">
            <p className="text-xs font-black uppercase tracking-[0.22em] text-[#FFD900]">
              {item.eyebrow || "24/7BOX MOVIE"}
            </p>

            <h1 className="mt-3 font-display text-4xl font-bold tracking-[-0.05em] sm:text-6xl lg:text-7xl">
              {item.title}
            </h1>

            <div className="mt-5 flex flex-wrap gap-3 text-xs text-[#B8B8B8] sm:text-sm">
              {item.year && <span>{item.year}</span>}
              <span>{item.maturityRating}+</span>
              {item.runtimeLabel && <span>{item.runtimeLabel}</span>}
              {item.quality && <span>{item.quality}</span>}
            </div>

            {item.description && (
              <p className="mt-6 max-w-xl text-sm leading-7 text-[#D0D0D0] sm:text-base">
                {item.description}
              </p>
            )}

            {item.genres?.length > 0 && (
              <p className="mt-4 text-sm text-[#747474]">
                {item.genres.join(" • ")}
              </p>
            )}

            <div className="mt-8 flex flex-wrap gap-2.5 sm:gap-3">
              <Button
                onClick={() => navigate(`/watch/${item.slug}`)}
                className="h-11 rounded-xl bg-[#FFD900] px-6 font-extrabold text-black hover:bg-[#FFE347] sm:h-12 sm:px-7"
              >
                <Play className="mr-2 size-4" fill="currentColor" />
                Play
              </Button>

              <Button
                variant="outline"
                onClick={changeList}
                className="h-11 rounded-xl border-white/10 bg-white/10 text-white backdrop-blur-md hover:bg-white/15 hover:text-white sm:h-12"
              >
                {item.inMyList ? (
                  <Check className="mr-2 size-4" />
                ) : (
                  <Plus className="mr-2 size-4" />
                )}
                {item.inMyList ? "In My List" : "My List"}
              </Button>

              <Button
                variant="outline"
                onClick={download}
                className="h-11 rounded-xl border-white/10 bg-white/10 px-4 text-white backdrop-blur-md hover:border-[#FFD900]/35 hover:bg-[#FFD900]/10 hover:text-[#FFD900] sm:h-12"
              >
                <Download className="mr-2 size-4" />
                Download
              </Button>

              <Button
                size="icon"
                variant="outline"
                onClick={like}
                className={`size-11 rounded-xl border-white/10 bg-white/10 backdrop-blur-md sm:size-12 ${
                  item.liked ? "text-[#FFD900]" : "text-white"
                }`}
                aria-label="Like movie"
              >
                <ThumbsUp size={18} />
              </Button>
            </div>

            {!item.videoUrl && (
              <p className="mt-4 text-xs text-[#747474]">
                This title currently has no video file linked by the backend. You
                can still view its details and artwork.
              </p>
            )}
          </div>

          <div className="mt-20 grid gap-5 border-t border-white/[0.06] pt-8 sm:grid-cols-3">
            <Meta label="Type" value="Movie" />
            <Meta
              label="Genres"
              value={item.genres.length ? item.genres.join(", ") : "Not provided"}
            />
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
      <p className="mt-2 text-sm text-[#B8B8B8]">
        {value}
      </p>
    </div>
  );
}
