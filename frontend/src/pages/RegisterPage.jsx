import { useMemo, useState } from "react";
import {
  ArrowRight,
  CheckCircle2,
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

export default function RegisterPage() {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [form, setForm] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const passwordChecks = useMemo(
    () => ({
      length: form.password.length >= 8,
      number: /\d/.test(form.password),
      letter: /[A-Za-z]/.test(form.password),
    }),
    [form.password]
  );

  const passwordStrongEnough =
    passwordChecks.length &&
    passwordChecks.number &&
    passwordChecks.letter;

  function update(key, value) {
    setForm((current) => ({
      ...current,
      [key]: value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    if (!form.email.trim()) {
      setError("Enter your email address.");
      return;
    }

    if (!passwordStrongEnough) {
      setError("Use at least 8 characters with letters and a number.");
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError("The passwords do not match.");
      return;
    }

    setSubmitting(true);

    try {
      await register({
        email: form.email,
        password: form.password,
      });

      toast.success("Account created. Your Main Profile is ready.");
      navigate("/profiles", { replace: true });
    } catch (requestError) {
      if (requestError.response?.status === 409) {
        setError("An account already exists with this email. Sign in instead.");
      } else {
        setError(getBackendErrorMessage(requestError));
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <AuthSplitShell
      eyebrow="JOIN 24/7BOX"
      title="Create your account."
      description="Registration creates the MySQL account and a Main Profile automatically."
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
            autoComplete="new-password"
            value={form.password}
            onChange={(event) => update("password", event.target.value)}
            placeholder="Create a strong password"
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

        <div className="grid grid-cols-3 gap-2">
          <PasswordCheck active={passwordChecks.length} label="8+ chars" />
          <PasswordCheck active={passwordChecks.letter} label="Letter" />
          <PasswordCheck active={passwordChecks.number} label="Number" />
        </div>

        <Field label="Confirm password" icon={LockKeyhole}>
          <Input
            type={showPassword ? "text" : "password"}
            autoComplete="new-password"
            value={form.confirmPassword}
            onChange={(event) => update("confirmPassword", event.target.value)}
            placeholder="Repeat your password"
            className="h-12 rounded-xl border-white/10 bg-[#121212] pl-11 text-white focus-visible:border-[#FFD900] focus-visible:ring-[#FFD900]/20"
          />
        </Field>

        <Button
          type="submit"
          disabled={submitting}
          className="h-12 w-full rounded-xl bg-[#FFD900] font-extrabold text-black hover:bg-[#FFE347]"
        >
          {submitting ? (
            <>
              <Loader2 className="mr-2 size-4 animate-spin" />
              Creating account...
            </>
          ) : (
            <>
              Create account
              <ArrowRight className="ml-2 size-4" />
            </>
          )}
        </Button>
      </form>

      <div className="mt-6 rounded-xl border border-white/[0.07] bg-[#101010] p-4">
        <p className="flex items-start gap-2 text-xs leading-5 text-[#777]">
          <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-[#37D67A]" />
          Email/password access now uses Nganji's MySQL account and custom JWT.
          Firebase is no longer required for this path.
        </p>
      </div>

      <p className="mt-8 text-center text-sm text-[#777]">
        Already have an account?{" "}
        <Link
          to="/login"
          className="font-bold text-white transition hover:text-[#FFD900]"
        >
          Sign in
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

function PasswordCheck({ active, label }) {
  return (
    <div
      className={`rounded-lg border px-2.5 py-2 text-center text-[10px] font-bold uppercase tracking-wide ${
        active
          ? "border-[#37D67A]/20 bg-[#37D67A]/8 text-[#37D67A]"
          : "border-white/[0.06] bg-[#101010] text-[#555]"
      }`}
    >
      {label}
    </div>
  );
}
