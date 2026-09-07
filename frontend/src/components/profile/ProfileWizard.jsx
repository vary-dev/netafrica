import {
  useState,
} from "react";

import {
  AnimatePresence,
  motion,
} from "motion/react";

import {
  ArrowLeft,
  Check,
} from "lucide-react";

import {
  Button,
} from "@/components/ui/button";

import {
  Input,
} from "@/components/ui/input";

import {
  Progress,
} from "@/components/ui/progress";

const GENRES = [
  "Action",
  "Drama",
  "Comedy",
  "Thriller",
  "Documentary",
  "Animation",
  "Sci-Fi",
  "Romance",
];

const TOTAL_STEPS = 3;

export default function ProfileWizard({
  onCancel,
  onComplete,
}) {
  const [step, setStep] =
    useState(1);

  const [data, setData] =
    useState({
      name: "",
      profileType: "adult",
      preferredGenres: [],
      maturityRating: "18+",
      avatarStyle: "yellow",
    });

  function update(values) {
    setData(
      (current) => ({
        ...current,
        ...values,
      })
    );
  }

  function next() {
    setStep(
      (current) =>
        Math.min(
          TOTAL_STEPS,
          current + 1
        )
    );
  }

  function back() {
    if (step === 1) {
      onCancel?.();
      return;
    }

    setStep(
      (current) =>
        current - 1
    );
  }

  function toggleGenre(
    genre
  ) {
    update({
      preferredGenres:
        data.preferredGenres.includes(
          genre
        )
          ? data.preferredGenres.filter(
              (item) =>
                item !== genre
            )
          : [
              ...data.preferredGenres,
              genre,
            ],
    });
  }

  return (
    <div className="mx-auto w-full max-w-xl">
      <div className="mb-8">
        <div className="mb-3 flex justify-between text-xs font-bold uppercase tracking-[0.15em] text-[#747474]">
          <span>
            Profile setup
          </span>

          <span>
            {step}/
            {TOTAL_STEPS}
          </span>
        </div>

        <Progress
          value={
            (step /
              TOTAL_STEPS) *
            100
          }
          className="h-1 bg-[#1c1c1c] [&>div]:bg-[#FFD900]"
        />
      </div>

      <button
        onClick={back}
        className="mb-7 flex items-center gap-2 text-sm font-semibold text-[#747474] transition hover:text-white"
      >
        <ArrowLeft
          size={16}
        />

        Back
      </button>

      <AnimatePresence
        mode="wait"
      >
        <motion.div
          key={step}
          initial={{
            opacity: 0,
            x: 24,
          }}
          animate={{
            opacity: 1,
            x: 0,
          }}
          exit={{
            opacity: 0,
            x: -24,
          }}
          transition={{
            duration: 0.22,
          }}
        >
          {step === 1 && (
            <div>
              <StepHeader
                eyebrow="STEP 01"
                title="Who's watching?"
                description="Create a personalized viewing space."
              />

              <Input
                autoFocus
                value={data.name}
                onChange={(
                  event
                ) =>
                  update({
                    name:
                      event
                        .target
                        .value,
                  })
                }
                placeholder="Profile name"
                className="mt-8 h-13 rounded-xl border-white/10 bg-[#151515] focus-visible:border-[#FFD900] focus-visible:ring-[#FFD900]/20"
              />

              <Button
                disabled={
                  !data.name.trim()
                }
                onClick={next}
                className="mt-6 h-12 w-full rounded-xl bg-[#FFD900] font-extrabold text-black hover:bg-[#FFE347]"
              >
                Continue
              </Button>
            </div>
          )}

          {step === 2 && (
            <div>
              <StepHeader
                eyebrow="STEP 02"
                title="What do you enjoy?"
                description="Choose some genres. You can change these later."
              />

              <div className="mt-8 flex flex-wrap gap-3">
                {GENRES.map(
                  (genre) => {
                    const selected =
                      data.preferredGenres.includes(
                        genre
                      );

                    return (
                      <button
                        key={
                          genre
                        }
                        onClick={() =>
                          toggleGenre(
                            genre
                          )
                        }
                        className={
                          selected
                            ? "rounded-full border border-[#FFD900]/50 bg-[#FFD900]/10 px-4 py-2.5 text-sm font-semibold text-[#FFD900]"
                            : "rounded-full border border-white/10 bg-[#151515] px-4 py-2.5 text-sm font-semibold text-[#B8B8B8] transition hover:border-white/20 hover:text-white"
                        }
                      >
                        {genre}
                      </button>
                    );
                  }
                )}
              </div>

              <Button
                onClick={next}
                className="mt-8 h-12 w-full rounded-xl bg-[#FFD900] font-extrabold text-black hover:bg-[#FFE347]"
              >
                Continue
              </Button>
            </div>
          )}

          {step === 3 && (
            <div>
              <StepHeader
                eyebrow="READY"
                title={`Meet ${data.name}`}
                description="This profile will keep its own list, recommendations and progress."
              />

              <div className="mx-auto mt-9 flex size-32 items-center justify-center rounded-3xl border border-[#FFD900]/25 bg-[#FFD900]/10">
                <span className="font-display text-5xl font-black text-[#FFD900]">
                  {data.name
                    .slice(0, 1)
                    .toUpperCase()}
                </span>
              </div>

              <div className="mt-8 flex flex-wrap justify-center gap-2">
                {data.preferredGenres.map(
                  (genre) => (
                    <span
                      key={
                        genre
                      }
                      className="flex items-center gap-1 rounded-full bg-[#151515] px-3 py-1.5 text-xs text-[#B8B8B8]"
                    >
                      <Check
                        size={12}
                        className="text-[#FFD900]"
                      />

                      {genre}
                    </span>
                  )
                )}
              </div>

              <Button
                onClick={() =>
                  onComplete(
                    data
                  )
                }
                className="mt-9 h-12 w-full rounded-xl bg-[#FFD900] font-extrabold text-black hover:bg-[#FFE347]"
              >
                Create profile
              </Button>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

function StepHeader({
  eyebrow,
  title,
  description,
}) {
  return (
    <>
      <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-[#FFD900]">
        {eyebrow}
      </p>

      <h2 className="mt-3 font-display text-4xl font-bold tracking-[-0.035em]">
        {title}
      </h2>

      <p className="mt-3 text-sm leading-6 text-[#747474]">
        {description}
      </p>
    </>
  );
}