import {
  useState,
} from "react";

import {
  AnimatePresence,
  motion,
} from "motion/react";

import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";

import LoginForm
  from "./LoginForm";

import RegisterForm
  from "./RegisterForm";

const LOGO_URL =
  "https://res.cloudinary.com/dydg39ukk/image/upload/v1788805959/twentyfourseven-white_qatrph.png";

export default function AuthDialog({
  open,
  onOpenChange,
  defaultMode = "login",
  onSuccess,
}) {
  const [mode, setMode] =
    useState(defaultMode);

  function complete() {
    onOpenChange(false);
    onSuccess?.();
  }

  return (
    <Dialog
      open={open}
      onOpenChange={
        onOpenChange
      }
    >
      <DialogContent
        className="
          max-h-[92vh]
          overflow-y-auto
          border-white/10
          bg-[#101010]
          p-0
          text-white
          shadow-2xl
          sm:max-w-[470px]
        "
      >
        <div className="p-7 sm:p-9">
          <img
            src={LOGO_URL}
            alt="24/7Box"
            className="h-9 w-auto object-contain"
          />

          <div className="mt-9">
            <p className="mb-2 text-xs font-extrabold uppercase tracking-[0.22em] text-[#FFD900]">
              {mode === "login"
                ? "Welcome back"
                : "Join 24/7Box"}
            </p>

            <h2 className="font-display text-3xl font-bold tracking-[-0.03em]">
              {mode === "login"
                ? "Your stories are waiting."
                : "Start your next story."}
            </h2>

            <p className="mt-2 text-sm leading-6 text-[#747474]">
              {mode === "login"
                ? "Sign in to continue watching, manage profiles and access your list."
                : "Create one main account and build personalized profiles for everyone watching."}
            </p>
          </div>

          <div className="mt-8">
            <AnimatePresence
              mode="wait"
            >
              <motion.div
                key={mode}
                initial={{
                  opacity: 0,
                  x: 16,
                }}
                animate={{
                  opacity: 1,
                  x: 0,
                }}
                exit={{
                  opacity: 0,
                  x: -16,
                }}
                transition={{
                  duration: 0.2,
                }}
              >
                {mode ===
                "login" ? (
                  <LoginForm
                    onSuccess={
                      complete
                    }
                    onSwitchMode={() =>
                      setMode(
                        "register"
                      )
                    }
                  />
                ) : (
                  <RegisterForm
                    onSuccess={
                      complete
                    }
                    onSwitchMode={() =>
                      setMode(
                        "login"
                      )
                    }
                  />
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}