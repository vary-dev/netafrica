import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import AppShell from "@/components/layout/AppShell";
import ContentRail from "@/components/media/ContentRail";
import { useProfiles } from "@/hooks/useProfiles";
import { getSeries, toggleMyList } from "@/services/contentService";

export default function SeriesPage() {
  const navigate = useNavigate();
  const { currentProfile } = useProfiles();
  const [series, setSeries] = useState([]);

  useEffect(() => {
    getSeries(currentProfile).then(setSeries);
  }, [currentProfile]);

  const continueWatching = useMemo(
    () => series.filter((item) => item.progress > 0 && item.progress < 95),
    [series]
  );

  async function add(item) {
    const added = await toggleMyList(currentProfile, item.id);
    toast.success(added ? "Added to My 24/7Box" : "Removed from My 24/7Box");
    setSeries(await getSeries(currentProfile));
  }

  return (
    <AppShell>
      <section className="box-container pb-5 pt-32">
        <p className="text-xs font-black uppercase tracking-[0.22em] text-[#FFD900]">
          SERIES
        </p>
        <h1 className="mt-3 font-display text-5xl font-bold tracking-[-0.045em]">
          One more episode?
        </h1>
        <p className="mt-4 max-w-2xl text-sm leading-6 text-[#747474]">
          Personalized series discovery with independent progress for every profile.
        </p>
      </section>

      {continueWatching.length > 0 && (
        <ContentRail
          title={`Continue Watching for ${currentProfile?.name || "You"}`}
          items={continueWatching}
          variant="continue"
          onDetails={(item) => navigate(`/title/${item.slug}`)}
          onPlay={(item) => toast.success(`Resuming ${item.title}`)}
        />
      )}

      <ContentRail
        title="Series for You"
        items={series}
        onDetails={(item) => navigate(`/title/${item.slug}`)}
        onPlay={(item) => toast.success(`Ready to play ${item.title}`)}
        onAdd={add}
      />
    </AppShell>
  );
}
