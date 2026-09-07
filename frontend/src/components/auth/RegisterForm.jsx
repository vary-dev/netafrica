import { useState } from "react";

import {
  Check,
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

const schema = z
  .object({
    name: z
      .string()
      .trim()
      .min(
        2,
        "Enter your name."
      )
      .max(60),

    email: z
      .string()
      .email(
        "Enter a valid email."
      ),

    password: z
      .string()
      .min(
        8,
        "Use at least 8 characters."
      )
      .regex(
        /[A-Z]/,
        "Include one uppercase letter."
      )
      .regex(
        /[0-9]/,
        "Include one number."
      ),

    confirmPassword:
      z.string(),
  })
  .refine(
    (data) =>
      data.password ===
      data.confirmPassword,
    {
      message:
        "Passwords do not match.",
      path: [
        "confirmPassword",
      ],
    }
  );

export default function RegisterForm({
  onSuccess,
  onSwitchMode,
}) {
  const {
    register: createAccount,
    loginWithGoogle,
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
    watch,

    formState: {
      errors,
      isSubmitting,
    },
  } = useForm({
    resolver:
      zodResolver(schema),

    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const password =
    watch("password");

  async function onSubmit(data) {
    try {
      await createAccount({
        name: data.name,
        email: data.email,
        password:
          data.password,
      });

      toast.success(
        "Your 24/7Box account is ready."
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
        "Your account is ready."
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

  const hasLength =
    password.length >= 8;

  const hasUppercase =
    /[A-Z]/.test(password);

  const hasNumber =
    /[0-9]/.test(password);

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
        className="space-y-4"
      >
        <div>
          <Label
            htmlFor="register-name"
            className="mb-2 block text-sm text-[#B8B8B8]"
          >
            Your name
          </Label>

          <Input
            id="register-name"
            placeholder="Patrick"
            {...register("name")}
            className="h-12 rounded-xl border-white/10 bg-[#151515] focus-visible:border-[#FFD900] focus-visible:ring-[#FFD900]/20"
          />

          {errors.name && (
            <p className="mt-2 text-xs text-[#FF5252]">
              {
                errors.name
                  .message
              }
            </p>
          )}
        </div>

        <div>
          <Label
            htmlFor="register-email"
            className="mb-2 block text-sm text-[#B8B8B8]"
          >
            Email
          </Label>

          <Input
            id="register-email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            {...register("email")}
            className="h-12 rounded-xl border-white/10 bg-[#151515] focus-visible:border-[#FFD900] focus-visible:ring-[#FFD900]/20"
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
          <Label
            htmlFor="register-password"
            className="mb-2 block text-sm text-[#B8B8B8]"
          >
            Password
          </Label>

          <div className="relative">
            <Input
              id="register-password"
              type={
                showPassword
                  ? "text"
                  : "password"
              }
              autoComplete="new-password"
              {...register(
                "password"
              )}
              className="h-12 rounded-xl border-white/10 bg-[#151515] pr-12 focus-visible:border-[#FFD900] focus-visible:ring-[#FFD900]/20"
            />

            <button
              type="button"
              onClick={() =>
                setShowPassword(
                  (value) =>
                    !value
                )
              }
              className="absolute right-4 top-1/2 -translate-y-1/2 text-[#747474]"
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

          <div className="mt-3 grid gap-2 text-xs">
            <PasswordRule
              valid={hasLength}
              text="At least 8 characters"
            />

            <PasswordRule
              valid={hasUppercase}
              text="One uppercase letter"
            />

            <PasswordRule
              valid={hasNumber}
              text="One number"
            />
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

        <div>
          <Label
            htmlFor="confirm-password"
            className="mb-2 block text-sm text-[#B8B8B8]"
          >
            Confirm password
          </Label>

          <Input
            id="confirm-password"
            type="password"
            autoComplete="new-password"
            {...register(
              "confirmPassword"
            )}
            className="h-12 rounded-xl border-white/10 bg-[#151515] focus-visible:border-[#FFD900] focus-visible:ring-[#FFD900]/20"
          />

          {errors.confirmPassword && (
            <p className="mt-2 text-xs text-[#FF5252]">
              {
                errors
                  .confirmPassword
                  .message
              }
            </p>
          )}
        </div>

        <Button
          disabled={isSubmitting}
          className="mt-2 h-12 w-full rounded-xl bg-[#FFD900] font-extrabold text-[#070707] hover:bg-[#FFE347]"
        >
          {isSubmitting ? (
            <>
              <Loader2
                className="mr-2 size-4 animate-spin"
              />

              Creating account...
            </>
          ) : (
            "Create account"
          )}
        </Button>
      </form>

      <p className="mt-7 text-center text-sm text-[#747474]">
        Already have an account?

        <button
          type="button"
          onClick={onSwitchMode}
          className="ml-2 font-bold text-white hover:text-[#FFD900]"
        >
          Sign in
        </button>
      </p>
    </div>
  );
}

function PasswordRule({
  valid,
  text,
}) {
  return (
    <div
      className={
        valid
          ? "flex items-center gap-2 text-[#37D67A]"
          : "flex items-center gap-2 text-[#747474]"
      }
    >
      <Check size={13} />

      {text}
    </div>
  );
}