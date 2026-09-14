import {
  Clapperboard,
} from "lucide-react";

import AppShell
  from "@/components/layout/AppShell";

export default function SeriesPage() {
  return (
    <AppShell>
      <section className="box-container flex min-h-[78vh] items-center justify-center pt-24">
        <div className="max-w-xl text-center">
          <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-[#FFD900]/10 text-[#FFD900]">
            <Clapperboard
              size={24}
            />
          </div>

          <p className="mt-6 text-xs font-black uppercase tracking-[0.22em] text-[#FFD900]">
            SERIES
          </p>

          <h1 className="mt-3 font-display text-4xl font-bold tracking-[-0.04em]">
            Series are coming from the backend next.
          </h1>

          <p className="mt-4 text-sm leading-6 text-[#747474]">
            The current backend API exposes movies only, so this page intentionally
            does not invent demo series. Once Nganji adds the series endpoint, this
            screen can use the same card and player system.
          </p>
        </div>
      </section>
    </AppShell>
  );
}
