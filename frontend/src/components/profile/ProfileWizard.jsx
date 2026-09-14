import { useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  ArrowLeft,
  Camera,
  Check,
  ChevronRight,
  Languages,
  Loader2,
  LockKeyhole,
  Sparkles,
  UserRound,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { uploadAvatar } from "@/cloudinary/upload";

const GENRES = [
  "Action",
  "Comedy",
  "Drama",
  "Thriller",
  "Sci-Fi",
  "Animation",
  "Documentary",
  "Romance",
];

const AGE_GROUPS = [
  { value: "KIDS_7", title: "Kids", subtitle: "Designed for younger viewers." },
  { value: "TEEN_13", title: "13+", subtitle: "Teen-friendly discovery." },
  { value: "TEEN_16", title: "16+", subtitle: "A broader catalog." },
  { value: "18_PLUS", title: "18+", subtitle: "Full adult catalog." },
];

const STEPS = [
  { number: 1, label: "Identity", icon: UserRound },
  { number: 2, label: "Avatar", icon: Camera },
  { number: 3, label: "Taste", icon: Sparkles },
  { number: 4, label: "Language", icon: Languages },
  { number: 5, label: "Confirm", icon: LockKeyhole },
];

export default function ProfileWizard({
  onCancel,
  onComplete,
}) {
  const fileRef = useRef(null);

  const [step, setStep] = useState(1);
  const [uploading, setUploading] = useState(false);
  const [avatarError, setAvatarError] = useState("");

  const [data, setData] = useState({
    name: "",
    avatarUrl: "",
    ageGroup: "18_PLUS",
    isKids: false,
    preferredGenres: [],
    preferredLanguage: "en",
    subtitleLanguage: "en",
    autoplayNextEpisode: true,
    autoplayPreviews: false,
    password: "",
  });

  function update(values) {
    setData((current) => ({ ...current, ...values }));
  }

  function next() {
    setStep((current) => Math.min(current + 1, STEPS.length));
  }

  function back() {
    if (step === 1) {
      onCancel?.();
      return;
    }

    setStep((current) => current - 1);
  }

  function toggleGenre(genre) {
    update({
      preferredGenres: data.preferredGenres.includes(genre)
        ? data.preferredGenres.filter((item) => item !== genre)
        : [...data.preferredGenres, genre],
    });
  }

  async function handleAvatar(event) {
    const file = event.target.files?.[0];
    if (!file) return;

    setAvatarError("");
    setUploading(true);

    try {
      const result = await uploadAvatar(file);
      update({ avatarUrl: result.url });
    } catch (error) {
      setAvatarError(error.message);
    } finally {
      setUploading(false);
      event.target.value = "";
    }
  }

  return (
    <div className="mx-auto grid w-full max-w-5xl overflow-hidden rounded-[28px] border border-white/[0.08] bg-[#0d0d0d] shadow-2xl lg:grid-cols-[260px_1fr]">
      <aside className="border-b border-white/[0.06] bg-[#101010] p-6 lg:border-b-0 lg:border-r lg:p-8">
        <p className="text-xs font-black uppercase tracking-[0.2em] text-[#FFD900]">
          NEW PROFILE
        </p>

        <h2 className="mt-3 font-display text-2xl font-bold">
          Make it personal.
        </h2>

        <p className="mt-2 text-xs leading-5 text-[#666]">
          The backend stores the profile identity. Viewing preferences stay attached
          to this profile in the frontend until Nganji adds those columns.
        </p>

        <div className="mt-7 hidden space-y-2 lg:block">
          {STEPS.map((item) => {
            const Icon = item.icon;
            const active = item.number === step;
            const complete = item.number < step;

            return (
              <div
                key={item.number}
                className={`flex items-center gap-3 rounded-xl border px-3 py-3 transition ${
                  active
                    ? "border-[#FFD900]/25 bg-[#FFD900]/8"
                    : "border-transparent"
                }`}
              >
                <div
                  className={`flex size-8 items-center justify-center rounded-lg ${
                    active || complete
                      ? "bg-[#FFD900] text-black"
                      : "bg-white/[0.05] text-[#555]"
                  }`}
                >
                  {complete ? <Check size={15} /> : <Icon size={15} />}
                </div>

                <div>
                  <p
                    className={`text-xs font-bold ${
                      active ? "text-white" : "text-[#666]"
                    }`}
                  >
                    {item.label}
                  </p>
                  <p className="text-[10px] text-[#444]">
                    Step {item.number}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        <Progress
          value={(step / STEPS.length) * 100}
          className="mt-6 h-1 bg-white/[0.06] [&>div]:bg-[#FFD900]"
        />

        <p className="mt-2 text-[10px] font-bold uppercase tracking-widest text-[#555]">
          {step} of {STEPS.length}
        </p>
      </aside>

      <section className="min-h-[610px] p-6 sm:p-9 lg:p-12">
        <button
          type="button"
          onClick={back}
          className="mb-8 flex items-center gap-2 text-sm font-semibold text-[#666] transition hover:text-white"
        >
          <ArrowLeft size={16} />
          {step === 1 ? "Cancel" : "Back"}
        </button>

        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -24 }}
            transition={{ duration: 0.2 }}
          >
            {step === 1 && (
              <>
                <StepTitle
                  eyebrow="IDENTITY"
                  title="Who's watching?"
                  description="Choose the name shown when this viewer selects their profile."
                />

                <Input
                  autoFocus
                  value={data.name}
                  onChange={(event) => update({ name: event.target.value })}
                  maxLength={32}
                  placeholder="Profile name"
                  className="mt-8 h-14 rounded-xl border-white/10 bg-[#151515] text-base focus-visible:border-[#FFD900] focus-visible:ring-[#FFD900]/20"
                />

                <div className="mt-5 grid gap-3 sm:grid-cols-2">
                  {AGE_GROUPS.map((option) => {
                    const active = data.ageGroup === option.value;

                    return (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() =>
                          update({
                            ageGroup: option.value,
                            isKids: option.value === "KIDS_7",
                          })
                        }
                        className={`rounded-xl border p-4 text-left transition ${
                          active
                            ? "border-[#FFD900]/35 bg-[#FFD900]/8"
                            : "border-white/[0.07] bg-[#121212] hover:border-white/15"
                        }`}
                      >
                        <div className="flex items-center justify-between gap-3">
                          <div>
                            <p className="font-bold">{option.title}</p>
                            <p className="mt-1 text-xs text-[#666]">
                              {option.subtitle}
                            </p>
                          </div>

                          {active && (
                            <Check size={17} className="text-[#FFD900]" />
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>

                <ContinueButton onClick={next} disabled={!data.name.trim()} />
              </>
            )}

            {step === 2 && (
              <>
                <StepTitle
                  eyebrow="AVATAR"
                  title="Give this profile a face."
                  description="Upload an avatar to Cloudinary. The returned URL is stored in Nganji's profile avatar field."
                />

                <div className="mt-10 flex flex-col items-center">
                  <div className="flex size-40 items-center justify-center overflow-hidden rounded-[32px] border border-[#FFD900]/20 bg-[#FFD900]/8">
                    {data.avatarUrl ? (
                      <img
                        src={data.avatarUrl}
                        alt=""
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <span className="font-display text-6xl font-black text-[#FFD900]">
                        {data.name.slice(0, 1).toUpperCase()}
                      </span>
                    )}
                  </div>

                  <input
                    ref={fileRef}
                    type="file"
                    accept="image/*"
                    onChange={handleAvatar}
                    className="hidden"
                  />

                  <Button
                    type="button"
                    variant="outline"
                    disabled={uploading}
                    onClick={() => fileRef.current?.click()}
                    className="mt-5 rounded-xl border-white/10 bg-[#151515] text-white hover:border-[#FFD900]/40 hover:text-[#FFD900]"
                  >
                    {uploading ? (
                      <Loader2 className="mr-2 size-4 animate-spin" />
                    ) : (
                      <Camera className="mr-2 size-4" />
                    )}
                    {uploading ? "Uploading..." : "Upload avatar"}
                  </Button>

                  {avatarError && (
                    <p className="mt-3 text-xs text-[#FF6A6A]">
                      {avatarError}
                    </p>
                  )}
                </div>

                <ContinueButton
                  onClick={next}
                  label={data.avatarUrl ? "Continue" : "Continue without photo"}
                />
              </>
            )}

            {step === 3 && (
              <>
                <StepTitle
                  eyebrow="TASTE"
                  title="Shape the first recommendations."
                  description="These choices personalize the frontend while the backend profile model remains intentionally unchanged."
                />

                <div className="mt-8 flex flex-wrap gap-3">
                  {GENRES.map((genre) => {
                    const active = data.preferredGenres.includes(genre);

                    return (
                      <button
                        key={genre}
                        type="button"
                        onClick={() => toggleGenre(genre)}
                        className={`rounded-full border px-5 py-3 text-sm font-semibold transition ${
                          active
                            ? "border-[#FFD900]/40 bg-[#FFD900]/10 text-[#FFD900]"
                            : "border-white/[0.08] bg-[#121212] text-[#888] hover:text-white"
                        }`}
                      >
                        {genre}
                      </button>
                    );
                  })}
                </div>

                <ContinueButton onClick={next} />
              </>
            )}

            {step === 4 && (
              <>
                <StepTitle
                  eyebrow="WATCHING STYLE"
                  title="Set language and playback."
                  description="Profile-level controls stay independent from the parent account."
                />

                <div className="mt-8 grid gap-5 sm:grid-cols-2">
                  <SelectField
                    label="Preferred language"
                    value={data.preferredLanguage}
                    onChange={(value) => update({ preferredLanguage: value })}
                  />

                  <SelectField
                    label="Subtitle language"
                    value={data.subtitleLanguage}
                    onChange={(value) => update({ subtitleLanguage: value })}
                  />
                </div>

                <div className="mt-6 overflow-hidden rounded-2xl border border-white/[0.07] bg-[#111]">
                  <ToggleRow
                    title="Autoplay next episode"
                    description="Continue automatically when episodic content arrives."
                    checked={data.autoplayNextEpisode}
                    onChange={(value) =>
                      update({ autoplayNextEpisode: value })
                    }
                  />

                  <ToggleRow
                    title="Autoplay previews"
                    description="Allow preview behavior while browsing."
                    checked={data.autoplayPreviews}
                    onChange={(value) =>
                      update({ autoplayPreviews: value })
                    }
                  />
                </div>

                <ContinueButton onClick={next} label="Review profile" />
              </>
            )}

            {step === 5 && (
              <>
                <StepTitle
                  eyebrow="PARENT ACCOUNT"
                  title="Confirm profile creation."
                  description="Nganji's backend requires the main account password before it inserts a new sub-profile."
                />

                <div className="mt-8 rounded-2xl border border-white/[0.07] bg-[#111] p-5">
                  <ReviewRow label="Name" value={data.name} />
                  <ReviewRow label="Viewing level" value={data.ageGroup} />
                  <ReviewRow
                    label="Genres"
                    value={
                      data.preferredGenres.length
                        ? data.preferredGenres.join(", ")
                        : "Discover for me"
                    }
                  />
                  <ReviewRow
                    label="Avatar"
                    value={data.avatarUrl ? "Uploaded" : "Initials avatar"}
                  />
                </div>

                <label className="mt-6 block">
                  <span className="mb-2 block text-xs font-semibold text-[#8b8b8b]">
                    Main account password
                  </span>

                  <div className="relative">
                    <LockKeyhole
                      size={16}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-[#666]"
                    />

                    <Input
                      type="password"
                      autoComplete="current-password"
                      value={data.password}
                      onChange={(event) =>
                        update({ password: event.target.value })
                      }
                      placeholder="Confirm account password"
                      className="h-12 rounded-xl border-white/10 bg-[#151515] pl-11 text-white focus-visible:border-[#FFD900] focus-visible:ring-[#FFD900]/20"
                    />
                  </div>
                </label>

                <Button
                  type="button"
                  disabled={!data.password}
                  onClick={() => onComplete(data)}
                  className="mt-7 h-12 w-full rounded-xl bg-[#FFD900] font-extrabold text-black hover:bg-[#FFE347]"
                >
                  Create profile
                  <ChevronRight className="ml-2 size-4" />
                </Button>
              </>
            )}
          </motion.div>
        </AnimatePresence>
      </section>
    </div>
  );
}

function StepTitle({ eyebrow, title, description }) {
  return (
    <>
      <p className="text-xs font-black uppercase tracking-[0.2em] text-[#FFD900]">
        {eyebrow}
      </p>
      <h3 className="mt-3 font-display text-4xl font-bold tracking-[-0.04em]">
        {title}
      </h3>
      <p className="mt-3 max-w-xl text-sm leading-6 text-[#777]">
        {description}
      </p>
    </>
  );
}

function ContinueButton({ onClick, disabled = false, label = "Continue" }) {
  return (
    <Button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="mt-8 h-12 w-full rounded-xl bg-[#FFD900] font-extrabold text-black hover:bg-[#FFE347]"
    >
      {label}
      <ChevronRight className="ml-2 size-4" />
    </Button>
  );
}

function SelectField({ label, value, onChange }) {
  return (
    <label>
      <span className="mb-2 block text-xs font-semibold text-[#8b8b8b]">
        {label}
      </span>

      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-12 w-full rounded-xl border border-white/10 bg-[#151515] px-4 text-sm text-white outline-none focus:border-[#FFD900]/50"
      >
        <option value="en">English</option>
        <option value="rw">Kinyarwanda</option>
        <option value="fr">Français</option>
      </select>
    </label>
  );
}

function ToggleRow({ title, description, checked, onChange }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className="flex w-full items-center justify-between gap-5 border-b border-white/[0.06] p-5 text-left last:border-0"
    >
      <div>
        <p className="text-sm font-semibold">{title}</p>
        <p className="mt-1 text-xs leading-5 text-[#666]">{description}</p>
      </div>

      <span
        className={`relative h-6 w-11 shrink-0 rounded-full transition ${
          checked ? "bg-[#FFD900]" : "bg-[#333]"
        }`}
      >
        <span
          className={`absolute top-1 size-4 rounded-full bg-black transition-all ${
            checked ? "left-6" : "left-1"
          }`}
        />
      </span>
    </button>
  );
}

function ReviewRow({ label, value }) {
  return (
    <div className="flex justify-between gap-5 border-b border-white/[0.06] py-3.5 last:border-0">
      <span className="text-xs text-[#666]">{label}</span>
      <span className="max-w-[65%] text-right text-xs font-bold text-[#bbb]">
        {value}
      </span>
    </div>
  );
}
