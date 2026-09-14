import { useState } from "react";
import {
  ArrowRight,
  Eye,
  EyeOff,
  Loader2,
  LockKeyhole,
  Mail,
} from "lucide-react";
import { Link, useNavigate } from "react-router";
import { toast } from "sonner";

import AuthSplitShell from "@/components/auth/AuthSplitShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/useAuth";
import { getBackendErrorMessage } from "@/services/backendAuthService";

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  function update(key, value) {
    setForm((current) => ({
      ...current,
      [key]: value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    if (!form.email.trim() || !form.password) {
      setError("Enter both your email and password.");
      return;
    }

    setSubmitting(true);

    try {
      await login(form);
      toast.success("Welcome back to 24/7Box.");
      navigate("/profiles", { replace: true });
    } catch (requestError) {
      const status = requestError.response?.status;

      if (status === 401) {
        setError(
          "That email/password combination did not match an account. If you have not registered yet, create an account first."
        );
      } else {
        setError(getBackendErrorMessage(requestError));
      }
    } finally {
      setSubmitting(false);
    }
  }

  function explainGoogle() {
    toast.info(
      "Google sign-in needs a secure /api/auth/google endpoint before it can issue the same backend JWT. It is intentionally not faked in the browser."
    );
  }

  return (
    <AuthSplitShell
      eyebrow="WELCOME BACK"
      title="Sign in to keep watching."
      description="Use the same account credentials stored by the 24/7Box Node.js + MySQL backend."
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="rounded-xl border border-[#FF5252]/20 bg-[#FF5252]/8 px-4 py-3 text-sm leading-6 text-[#ff8d8d]">
            {error}
          </div>
        )}

        <Field label="Email" icon={Mail}>
          <Input
            type="email"
            autoComplete="email"
            value={form.email}
            onChange={(event) => update("email", event.target.value)}
            placeholder="you@example.com"
            className="h-12 rounded-xl border-white/10 bg-[#121212] pl-11 text-white focus-visible:border-[#FFD900] focus-visible:ring-[#FFD900]/20"
          />
        </Field>

        <Field label="Password" icon={LockKeyhole}>
          <Input
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
            value={form.password}
            onChange={(event) => update("password", event.target.value)}
            placeholder="Your password"
            className="h-12 rounded-xl border-white/10 bg-[#121212] px-11 text-white focus-visible:border-[#FFD900] focus-visible:ring-[#FFD900]/20"
          />

          <button
            type="button"
            onClick={() => setShowPassword((current) => !current)}
            className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-2 text-[#666] transition hover:text-white"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
          </button>
        </Field>

        <Button
          type="submit"
          disabled={submitting}
          className="h-12 w-full rounded-xl bg-[#FFD900] font-extrabold text-black hover:bg-[#FFE347]"
        >
          {submitting ? (
            <>
              <Loader2 className="mr-2 size-4 animate-spin" />
              Signing in...
            </>
          ) : (
            <>
              Sign in
              <ArrowRight className="ml-2 size-4" />
            </>
          )}
        </Button>
      </form>

      <div className="my-6 flex items-center gap-4">
        <div className="h-px flex-1 bg-white/[0.08]" />
        <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#555]">
          Other ways
        </span>
        <div className="h-px flex-1 bg-white/[0.08]" />
      </div>

      <button
        type="button"
        onClick={explainGoogle}
        className="flex h-12 w-full items-center justify-center gap-3 rounded-xl border border-white/10 bg-[#101010] text-sm font-semibold text-[#bbb] transition hover:border-white/20 hover:text-white"
      >
        <GoogleMark />
        Continue with Google
        <span className="rounded-full bg-white/[0.06] px-2 py-0.5 text-[9px] uppercase tracking-wide text-[#666]">
          backend OAuth needed
        </span>
      </button>

      <p className="mt-8 text-center text-sm text-[#777]">
        New to 24/7Box?{" "}
        <Link
          to="/register"
          className="font-bold text-white transition hover:text-[#FFD900]"
        >
          Create an account
        </Link>
      </p>
    </AuthSplitShell>
  );
}

function Field({ label, icon: Icon, children }) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs font-semibold text-[#8b8b8b]">
        {label}
      </span>

      <div className="relative">
        <Icon
          size={16}
          className="pointer-events-none absolute left-4 top-1/2 z-10 -translate-y-1/2 text-[#666]"
        />
        {children}
      </div>
    </label>
  );
}

function GoogleMark() {
  return (
    <svg viewBox="0 0 24 24" className="size-4" aria-hidden="true">
      <path
        fill="currentColor"
        d="M21.6 12.23c0-.7-.06-1.38-.18-2.03H12v3.84h5.39a4.61 4.61 0 0 1-2 3.02v2.5h3.24c1.9-1.75 2.97-4.33 2.97-7.33Z"
      />
      <path
        fill="currentColor"
        opacity=".8"
        d="M12 22c2.7 0 4.98-.9 6.64-2.44l-3.24-2.5c-.9.6-2.05.96-3.4.96-2.61 0-4.82-1.77-5.61-4.14H3.04v2.58A10 10 0 0 0 12 22Z"
      />
      <path
        fill="currentColor"
        opacity=".6"
        d="M6.39 13.88A6 6 0 0 1 6.08 12c0-.65.11-1.29.31-1.88V7.54H3.04A10 10 0 0 0 2 12c0 1.61.39 3.14 1.04 4.46l3.35-2.58Z"
      />
      <path
        fill="currentColor"
        opacity=".4"
        d="M12 5.98c1.47 0 2.79.5 3.83 1.5l2.87-2.88A9.62 9.62 0 0 0 12 2a10 10 0 0 0-8.96 5.54l3.35 2.58C7.18 7.75 9.39 5.98 12 5.98Z"
      />
    </svg>
  );
}
