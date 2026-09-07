import { useState } from "react";

import {
  Eye,
  EyeOff,
  Loader2,
} from "lucide-react";

import {
  useForm,
} from "react-hook-form";

import {
  zodResolver,
} from "@hookform/resolvers/zod";

import { z } from "zod";
import { toast } from "sonner";

import {
  Button,
} from "@/components/ui/button";

import {
  Input,
} from "@/components/ui/input";

import {
  Label,
} from "@/components/ui/label";

import {
  useAuth,
} from "@/hooks/useAuth";

import {
  getFirebaseErrorMessage,
} from "@/utils/firebaseErrors";

import GoogleAuthButton
  from "./GoogleAuthButton";

const schema = z.object({
  email: z
    .string()
    .email(
      "Enter a valid email address."
    ),

  password: z
    .string()
    .min(
      6,
      "Enter your password."
    ),
});

export default function LoginForm({
  onSuccess,
  onSwitchMode,
}) {
  const {
    login,
    loginWithGoogle,
    resetPassword,
  } = useAuth();

  const [
    showPassword,
    setShowPassword,
  ] = useState(false);

  const [
    googleLoading,
    setGoogleLoading,
  ] = useState(false);

  const {
    register,
    handleSubmit,
    getValues,

    formState: {
      errors,
      isSubmitting,
    },
  } = useForm({
    resolver:
      zodResolver(schema),

    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(data) {
    try {
      await login(data);

      toast.success(
        "Welcome back to 24/7Box."
      );

      onSuccess?.();
    } catch (error) {
      toast.error(
        getFirebaseErrorMessage(
          error
        )
      );
    }
  }

  async function handleGoogle() {
    setGoogleLoading(true);

    try {
      await loginWithGoogle();

      toast.success(
        "Signed in successfully."
      );

      onSuccess?.();
    } catch (error) {
      toast.error(
        getFirebaseErrorMessage(
          error
        )
      );
    } finally {
      setGoogleLoading(false);
    }
  }

  async function handleReset() {
    const email =
      getValues("email");

    if (!email) {
      toast.error(
        "Enter your email first."
      );

      return;
    }

    try {
      await resetPassword(email);

      toast.success(
        "Password reset email sent."
      );
    } catch (error) {
      toast.error(
        getFirebaseErrorMessage(
          error
        )
      );
    }
  }

  return (
    <div>
      <GoogleAuthButton
        loading={googleLoading}
        onClick={handleGoogle}
      />

      <div className="my-6 flex items-center gap-4">
        <div className="h-px flex-1 bg-white/10" />

        <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#747474]">
          or
        </span>

        <div className="h-px flex-1 bg-white/10" />
      </div>

      <form
        onSubmit={
          handleSubmit(onSubmit)
        }
        className="space-y-5"
      >
        <div>
          <Label
            htmlFor="login-email"
            className="mb-2 block text-sm text-[#B8B8B8]"
          >
            Email
          </Label>

          <Input
            id="login-email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            {...register("email")}
            className="
              h-12
              rounded-xl
              border-white/10
              bg-[#151515]
              px-4
              text-white
              placeholder:text-[#5d5d5d]
              focus-visible:border-[#FFD900]
              focus-visible:ring-[#FFD900]/20
            "
          />

          {errors.email && (
            <p className="mt-2 text-xs text-[#FF5252]">
              {
                errors.email
                  .message
              }
            </p>
          )}
        </div>

        <div>
          <div className="mb-2 flex items-center justify-between">
            <Label
              htmlFor="login-password"
              className="text-sm text-[#B8B8B8]"
            >
              Password
            </Label>

            <button
              type="button"
              onClick={
                handleReset
              }
              className="text-xs font-semibold text-[#FFD900] hover:text-[#FFE347]"
            >
              Forgot password?
            </button>
          </div>

          <div className="relative">
            <Input
              id="login-password"
              type={
                showPassword
                  ? "text"
                  : "password"
              }
              autoComplete="current-password"
              placeholder="Your password"
              {...register(
                "password"
              )}
              className="
                h-12
                rounded-xl
                border-white/10
                bg-[#151515]
                px-4
                pr-12
                text-white
                placeholder:text-[#5d5d5d]
                focus-visible:border-[#FFD900]
                focus-visible:ring-[#FFD900]/20
              "
            />

            <button
              type="button"
              onClick={() =>
                setShowPassword(
                  (value) =>
                    !value
                )
              }
              className="absolute right-4 top-1/2 -translate-y-1/2 text-[#747474] hover:text-white"
              aria-label={
                showPassword
                  ? "Hide password"
                  : "Show password"
              }
            >
              {showPassword ? (
                <EyeOff
                  size={18}
                />
              ) : (
                <Eye size={18} />
              )}
            </button>
          </div>

          {errors.password && (
            <p className="mt-2 text-xs text-[#FF5252]">
              {
                errors.password
                  .message
              }
            </p>
          )}
        </div>

        <Button
          disabled={isSubmitting}
          className="
            h-12
            w-full
            rounded-xl
            bg-[#FFD900]
            font-extrabold
            text-[#070707]
            hover:bg-[#FFE347]
          "
        >
          {isSubmitting ? (
            <>
              <Loader2
                className="mr-2 size-4 animate-spin"
              />
              Signing in...
            </>
          ) : (
            "Sign in"
          )}
        </Button>
      </form>

      <p className="mt-7 text-center text-sm text-[#747474]">
        New to 24/7Box?

        <button
          type="button"
          onClick={onSwitchMode}
          className="ml-2 font-bold text-white hover:text-[#FFD900]"
        >
          Create account
        </button>
      </p>
    </div>
  );
}