import { useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  ArrowLeft,
  Camera,
  Check,
  ChevronRight,
  Loader2,
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
  {
    value: "KIDS_7",
    title: "Kids",
    subtitle: "A simplified catalog for younger viewers.",
  },
  {
    value: "TEEN_13",
    title: "13+",
    subtitle: "Teen-friendly movies and series.",
  },
  {
    value: "TEEN_16",
    title: "16+",
    subtitle: "A broader catalog with mature themes.",
  },
  {
    value: "18_PLUS",
    title: "18+",
    subtitle: "The full catalog available to adult profiles.",
  },
];

const TOTAL_STEPS = 6;

export default function ProfileWizard({ onCancel, onComplete }) {
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
  });

  function update(values) {
    setData((current) => ({ ...current, ...values }));
  }

  function next() {
    setStep((current) => Math.min(current + 1, TOTAL_STEPS));
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
    <div className="mx-auto w-full max-w-2xl">
      <div className="mb-8">
        <div className="mb-3 flex justify-between text-xs font-bold uppercase tracking-[0.16em] text-[#747474]">
          <span>Personalize profile</span>
          <span>
            {step}/{TOTAL_STEPS}
          </span>
        </div>

        <Progress
          value={(step / TOTAL_STEPS) * 100}
          className="h-1 bg-[#1c1c1c] [&>div]:bg-[#FFD900]"
        />
      </div>

      <button
        type="button"
        onClick={back}
        className="mb-8 flex items-center gap-2 text-sm font-semibold text-[#747474] transition hover:text-white"
      >
        <ArrowLeft size={16} />
        Back
      </button>

      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 28 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -28 }}
          transition={{ duration: 0.22 }}
        >
          {step === 1 && (
            <section>
              <StepTitle
                eyebrow="PROFILE"
                title="Who's watching?"
                description="Each viewer gets independent recommendations, history, My List and settings."
              />

              <Input
                autoFocus
                value={data.name}
                onChange={(event) => update({ name: event.target.value })}
                placeholder="Profile name"
                maxLength={32}
                className="mt-8 h-14 rounded-xl border-white/10 bg-[#151515] focus-visible:border-[#FFD900] focus-visible:ring-[#FFD900]/20"
              />

              <Button
                disabled={!data.name.trim()}
                onClick={next}
                className="mt-6 h-12 w-full rounded-xl bg-[#FFD900] font-extrabold text-black hover:bg-[#FFE347]"
              >
                Continue
              </Button>
            </section>
          )}

          {step === 2 && (
            <section>
              <StepTitle
                eyebrow="AGE & CONTENT"
                title="Choose a viewing level"
                description="This keeps the catalog and recommendations appropriate for this profile."
              />

              <div className="mt-8 grid gap-3 sm:grid-cols-2">
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
                      className={`rounded-2xl border p-5 text-left transition ${
                        active
                          ? "border-[#FFD900]/50 bg-[#FFD900]/10"
                          : "border-white/10 bg-[#101010] hover:border-white/20"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="font-display text-lg font-bold">
                            {option.title}
                          </p>
                          <p className="mt-2 text-sm leading-6 text-[#747474]">
                            {option.subtitle}
                          </p>
                        </div>
                        {active && <Check size={19} className="text-[#FFD900]" />}
                      </div>
                    </button>
                  );
                })}
              </div>

              <Button
                onClick={next}
                className="mt-7 h-12 w-full rounded-xl bg-[#FFD900] font-extrabold text-black hover:bg-[#FFE347]"
              >
                Continue
              </Button>
            </section>
          )}

          {step === 3 && (
            <section>
              <StepTitle
                eyebrow="AVATAR"
                title="Make it recognizable"
                description="Use a photo or continue with a clean initials avatar."
              />

              <div className="mt-8 flex flex-col items-center">
                <div className="flex size-32 items-center justify-center overflow-hidden rounded-3xl border border-[#FFD900]/25 bg-[#FFD900]/10">
                  {data.avatarUrl ? (
                    <img
                      src={data.avatarUrl}
                      alt=""
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <span className="font-display text-5xl font-black text-[#FFD900]">
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
                  {uploading ? "Uploading..." : "Upload photo"}
                </Button>

                {avatarError && (
                  <p className="mt-3 max-w-sm text-center text-xs text-[#FF5252]">
                    {avatarError}
                  </p>
                )}
              </div>

              <Button
                onClick={next}
                className="mt-8 h-12 w-full rounded-xl bg-[#FFD900] font-extrabold text-black hover:bg-[#FFE347]"
              >
                Continue
              </Button>
            </section>
          )}

          {step === 4 && (
            <section>
              <StepTitle
                eyebrow="TASTE"
                title="What are you into?"
                description="Choose a few genres so your first homepage already feels personal."
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
                          ? "border-[#FFD900]/50 bg-[#FFD900]/10 text-[#FFD900]"
                          : "border-white/10 bg-[#151515] text-[#B8B8B8] hover:border-white/20 hover:text-white"
                      }`}
                    >
                      {genre}
                    </button>
                  );
                })}
              </div>

              <Button
                onClick={next}
                className="mt-8 h-12 w-full rounded-xl bg-[#FFD900] font-extrabold text-black hover:bg-[#FFE347]"
              >
                Continue
              </Button>
            </section>
          )}

          {step === 5 && (
            <section>
              <StepTitle
                eyebrow="LANGUAGE & PLAYBACK"
                title="Set your watching style"
                description="You can change these preferences anytime from Settings."
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

              <div className="mt-6 overflow-hidden rounded-2xl border border-white/10 bg-[#101010]">
                <ToggleRow
                  title="Autoplay next episode"
                  description="Continue a series automatically."
                  checked={data.autoplayNextEpisode}
                  onChange={(value) => update({ autoplayNextEpisode: value })}
                />
                <ToggleRow
                  title="Autoplay previews"
                  description="Allow muted previews while browsing."
                  checked={data.autoplayPreviews}
                  onChange={(value) => update({ autoplayPreviews: value })}
                />
              </div>

              <Button
                onClick={next}
                className="mt-8 h-12 w-full rounded-xl bg-[#FFD900] font-extrabold text-black hover:bg-[#FFE347]"
              >
                Review profile
              </Button>
            </section>
          )}

          {step === 6 && (
            <section>
              <StepTitle
                eyebrow="READY"
                title={`Meet ${data.name}`}
                description="24/7Box will use these choices to shape this profile's catalog and recommendations."
              />

              <div className="mt-8 rounded-2xl border border-white/10 bg-[#101010] p-6">
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
                  label="Language"
                  value={data.preferredLanguage.toUpperCase()}
                />
                <ReviewRow
                  label="Autoplay next episode"
                  value={data.autoplayNextEpisode ? "On" : "Off"}
                />
              </div>

              <Button
                onClick={() => onComplete(data)}
                className="mt-8 h-12 w-full rounded-xl bg-[#FFD900] font-extrabold text-black hover:bg-[#FFE347]"
              >
                Create profile
                <ChevronRight size={17} className="ml-2" />
              </Button>
            </section>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

function StepTitle({ eyebrow, title, description }) {
  return (
    <>
      <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-[#FFD900]">
        {eyebrow}
      </p>
      <h2 className="mt-3 font-display text-4xl font-bold tracking-[-0.035em]">
        {title}
      </h2>
      <p className="mt-3 max-w-xl text-sm leading-6 text-[#747474]">
        {description}
      </p>
    </>
  );
}

function SelectField({ label, value, onChange }) {
  return (
    <label>
      <span className="mb-2 block text-sm font-semibold text-[#B8B8B8]">
        {label}
      </span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-12 w-full rounded-xl border border-white/10 bg-[#151515] px-4 text-sm outline-none focus:border-[#FFD900]/60"
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
      className="flex w-full items-center justify-between gap-6 border-b border-white/[0.06] p-5 text-left last:border-0"
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
    <div className="flex justify-between gap-4 border-b border-white/[0.06] py-4 last:border-0">
      <span className="text-sm text-[#747474]">{label}</span>
      <span className="max-w-[62%] text-right text-sm font-semibold">{value}</span>
    </div>
  );
}
