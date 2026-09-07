import {
  AnimatePresence,
  motion,
} from "motion/react";

import { useState } from "react";
import { ArrowLeft } from "lucide-react";

import { ProfileNameStep } from "./ProfileNameStep";
import { ProfileAvatarStep } from "./ProfileAvatarStep";
import { ProfilePreferencesStep } from "./ProfilePreferencesStep";
import { ProfileReviewStep } from "./ProfileReviewStep";

const TOTAL_STEPS = 4;

export function ProfileWizard({
  onComplete,
}) {
  const [step, setStep] = useState(1);

  const [formData, setFormData] =
    useState({
      name: "",
      avatar: null,
      profileType: "adult",
      genres: [],
    });

  function updateForm(data) {
    setFormData((current) => ({
      ...current,
      ...data,
    }));
  }

  function next() {
    setStep((current) =>
      Math.min(current + 1, TOTAL_STEPS)
    );
  }

  function back() {
    setStep((current) =>
      Math.max(current - 1, 1)
    );
  }

  return (
    <div className="mx-auto w-full max-w-2xl">
      <div className="mb-8">
        <div className="mb-3 flex items-center justify-between text-xs text-neutral-400">
          <span>
            Profile setup
          </span>

          <span>
            {step}/{TOTAL_STEPS}
          </span>
        </div>

        <div className="h-1 overflow-hidden rounded-full bg-neutral-800">
          <motion.div
            className="h-full bg-[linear-gradient(135deg,#7A3028,#A56243,#C18A62)]"
            animate={{
              width:
                `${(step / TOTAL_STEPS) * 100}%`,
            }}
          />
        </div>
      </div>

      {step > 1 && (
        <button
          onClick={back}
          className="mb-6 flex items-center gap-2 text-sm text-neutral-400 transition hover:text-white"
        >
          <ArrowLeft size={16} />
          Back
        </button>
      )}

      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{
            opacity: 0,
            x: 35,
          }}
          animate={{
            opacity: 1,
            x: 0,
          }}
          exit={{
            opacity: 0,
            x: -35,
          }}
          transition={{
            duration: 0.25,
          }}
        >
          {step === 1 && (
            <ProfileNameStep
              data={formData}
              updateForm={updateForm}
              next={next}
            />
          )}

          {step === 2 && (
            <ProfileAvatarStep
              data={formData}
              updateForm={updateForm}
              next={next}
            />
          )}

          {step === 3 && (
            <ProfilePreferencesStep
              data={formData}
              updateForm={updateForm}
              next={next}
            />
          )}

          {step === 4 && (
            <ProfileReviewStep
              data={formData}
              onComplete={() =>
                onComplete(formData)
              }
            />
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}