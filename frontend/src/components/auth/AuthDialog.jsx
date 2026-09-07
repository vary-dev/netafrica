import {
  useState,
} from "react";

import {
  X,
  Eye,
  EyeOff,
} from "lucide-react";

import { motion } from "motion/react";

import { useAuth } from "@/hooks/useAuth";

export function AuthDialog({
  open,
  onClose,
}) {
  const {
    login,
    register,
    loginWithGoogle,
  } = useAuth();

  const [mode, setMode] =
    useState("login");

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [showPassword, setShowPassword] =
    useState(false);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  if (!open) return null;

  async function handleSubmit(event) {
    event.preventDefault();

    setLoading(true);
    setError("");

    try {
      if (mode === "login") {
        await login(email, password);
      } else {
        await register(email, password);
      }

      onClose();
    } catch (error) {
      setError(
        error.message ||
          "Authentication failed."
      );
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogle() {
    setLoading(true);
    setError("");

    try {
      await loginWithGoogle();

      onClose();
    } catch (error) {
      setError(
        error.message ||
          "Google sign-in failed."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/75 p-4 backdrop-blur-md">
      <motion.div
        initial={{
          opacity: 0,
          scale: 0.96,
          y: 20,
        }}
        animate={{
          opacity: 1,
          scale: 1,
          y: 0,
        }}
        className="relative w-full max-w-md rounded-2xl border border-white/10 bg-[#101010] p-7 shadow-2xl"
      >
        <button
          onClick={onClose}
          className="absolute right-5 top-5 text-neutral-400 hover:text-white"
        >
          <X size={20} />
        </button>

        <p className="text-sm font-medium text-[#C18A62]">
          WELCOME
        </p>

        <h2 className="mt-2 text-3xl font-bold">
          {mode === "login"
            ? "Continue watching"
            : "Start your story"}
        </h2>

        <p className="mt-2 text-sm text-neutral-400">
          {mode === "login"
            ? "Sign in to access your profiles."
            : "Create your main account."}
        </p>

        <button
          onClick={handleGoogle}
          disabled={loading}
          className="mt-7 flex h-12 w-full items-center justify-center rounded-xl border border-white/15 bg-white text-sm font-semibold text-black"
        >
          Continue with Google
        </button>

        <div className="my-6 flex items-center gap-4">
          <div className="h-px flex-1 bg-white/10" />
          <span className="text-xs text-neutral-500">
            OR
          </span>
          <div className="h-px flex-1 bg-white/10" />
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-4"
        >
          <input
            type="email"
            value={email}
            onChange={(event) =>
              setEmail(
                event.target.value
              )
            }
            placeholder="Email address"
            className="h-12 w-full rounded-xl border border-neutral-700 bg-[#191919] px-4 outline-none transition focus:border-[#A56243]"
          />

          <div className="relative">
            <input
              type={
                showPassword
                  ? "text"
                  : "password"
              }
              value={password}
              onChange={(event) =>
                setPassword(
                  event.target.value
                )
              }
              placeholder="Password"
              className="h-12 w-full rounded-xl border border-neutral-700 bg-[#191919] px-4 pr-12 outline-none transition focus:border-[#A56243]"
            />

            <button
              type="button"
              onClick={() =>
                setShowPassword(
                  (current) =>
                    !current
                )
              }
              className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400"
            >
              {showPassword ? (
                <EyeOff size={18} />
              ) : (
                <Eye size={18} />
              )}
            </button>
          </div>

          {error && (
            <p className="text-sm text-red-400">
              {error}
            </p>
          )}

          <button
            disabled={loading}
            className="h-12 w-full rounded-xl bg-[linear-gradient(135deg,#7A3028,#A56243,#C18A62)] font-semibold disabled:opacity-50"
          >
            {loading
              ? "Please wait..."
              : mode === "login"
                ? "Sign in"
                : "Create account"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-neutral-400">
          {mode === "login"
            ? "New here?"
            : "Already have an account?"}

          <button
            onClick={() =>
              setMode(
                mode === "login"
                  ? "register"
                  : "login"
              )
            }
            className="ml-2 font-medium text-white"
          >
            {mode === "login"
              ? "Create account"
              : "Sign in"}
          </button>
        </p>
      </motion.div>
    </div>
  );
}