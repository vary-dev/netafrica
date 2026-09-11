import { useState } from "react";
import { Check, Loader2 } from "lucide-react";
import { toast } from "sonner";
import AppShell from "@/components/layout/AppShell";
import { Button } from "@/components/ui/button";
import { useProfiles } from "@/hooks/useProfiles";

const LANGUAGES = [
  { value: "en", label: "English" },
  { value: "rw", label: "Kinyarwanda" },
  { value: "fr", label: "Français" },
];

export default function SettingsPage() {
  const { currentProfile, updateProfile } = useProfiles();
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    preferredLanguage: currentProfile?.preferredLanguage || currentProfile?.language || "en",
    subtitleLanguage: currentProfile?.subtitleLanguage || "en",
    autoplayNextEpisode: currentProfile?.autoplayNextEpisode ?? true,
    autoplayPreviews: currentProfile?.autoplayPreviews ?? false,
  });

  function change(key, value) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  async function save() {
    setSaving(true);
    try {
      await updateProfile(currentProfile.id, form);
      toast.success("Profile settings saved.");
    } catch (error) {
      toast.error(error.message || "Could not save settings.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <AppShell>
      <div className="box-container max-w-5xl pb-24 pt-32">
        <p className="text-xs font-black uppercase tracking-[0.22em] text-[#FFD900]">
          SETTINGS
        </p>
        <h1 className="mt-3 font-display text-5xl font-bold tracking-[-0.045em]">
          Make 24/7Box yours.
        </h1>
        <p className="mt-4 max-w-2xl text-sm leading-6 text-[#747474]">
          These options belong to {currentProfile?.name || "this profile"} and do
          not change another viewer's experience.
        </p>

        <div className="mt-10 overflow-hidden rounded-2xl border border-white/10 bg-[#101010]">
          <SettingHeader
            title="Language & subtitles"
            description="Choose the default interface and subtitle preferences."
          />

          <div className="grid gap-5 p-6 sm:grid-cols-2">
            <SelectSetting
              label="Preferred language"
              value={form.preferredLanguage}
              onChange={(value) => change("preferredLanguage", value)}
            />
            <SelectSetting
              label="Subtitle language"
              value={form.subtitleLanguage}
              onChange={(value) => change("subtitleLanguage", value)}
            />
          </div>
        </div>

        <div className="mt-6 overflow-hidden rounded-2xl border border-white/10 bg-[#101010]">
          <SettingHeader
            title="Playback"
            description="Control how the browsing and episode experience behaves."
          />

          <ToggleRow
            title="Autoplay next episode"
            description="Automatically continue to the next episode when available."
            checked={form.autoplayNextEpisode}
            onChange={(value) => change("autoplayNextEpisode", value)}
          />

          <ToggleRow
            title="Autoplay previews"
            description="Allow muted title previews while browsing."
            checked={form.autoplayPreviews}
            onChange={(value) => change("autoplayPreviews", value)}
          />
        </div>

        <div className="mt-6 rounded-2xl border border-white/10 bg-[#101010] p-6">
          <p className="text-sm font-semibold text-white">Viewing level</p>
          <div className="mt-3 flex items-center gap-2">
            <span className="rounded-full bg-[#FFD900]/10 px-3 py-1.5 text-xs font-bold text-[#FFD900]">
              {currentProfile?.ageGroup || currentProfile?.maturityRating || "18+"}
            </span>
            <span className="text-xs text-[#747474]">
              Account owners should manage maturity changes from profile management.
            </span>
          </div>
        </div>

        <div className="mt-8 flex justify-end">
          <Button
            onClick={save}
            disabled={saving}
            className="h-12 rounded-xl bg-[#FFD900] px-7 font-extrabold text-black hover:bg-[#FFE347]"
          >
            {saving ? (
              <>
                <Loader2 className="mr-2 size-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Check className="mr-2 size-4" />
                Save changes
              </>
            )}
          </Button>
        </div>
      </div>
    </AppShell>
  );
}

function SettingHeader({ title, description }) {
  return (
    <div className="border-b border-white/[0.06] p-6">
      <h2 className="font-display text-xl font-bold">{title}</h2>
      <p className="mt-1 text-sm text-[#747474]">{description}</p>
    </div>
  );
}

function SelectSetting({ label, value, onChange }) {
  return (
    <label>
      <span className="mb-2 block text-sm font-semibold text-[#B8B8B8]">
        {label}
      </span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-12 w-full rounded-xl border border-white/10 bg-[#151515] px-4 text-sm text-white outline-none focus:border-[#FFD900]/60"
      >
        {LANGUAGES.map((language) => (
          <option key={language.value} value={language.value}>
            {language.label}
          </option>
        ))}
      </select>
    </label>
  );
}

function ToggleRow({ title, description, checked, onChange }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className="flex w-full items-center justify-between gap-6 border-b border-white/[0.06] p-6 text-left last:border-0 hover:bg-white/[0.025]"
    >
      <div>
        <p className="font-semibold">{title}</p>
        <p className="mt-1 text-sm text-[#747474]">{description}</p>
      </div>

      <span
        className={`relative h-6 w-11 shrink-0 rounded-full transition ${
          checked ? "bg-[#FFD900]" : "bg-[#333]"
        }`}
      >
        <span
          className={`absolute top-1 size-4 rounded-full bg-[#070707] transition-all ${
            checked ? "left-6" : "left-1"
          }`}
        />
      </span>
    </button>
  );
}
