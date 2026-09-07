import {
  Loader2,
} from "lucide-react";

import {
  Button,
} from "@/components/ui/button";

export default function GoogleAuthButton({
  loading,
  onClick,
}) {
  return (
    <Button
      type="button"
      variant="outline"
      onClick={onClick}
      disabled={loading}
      className="
        h-12
        w-full
        rounded-xl
        border-white/10
        bg-white
        text-sm
        font-bold
        text-black
        hover:bg-[#f1f1f1]
        hover:text-black
      "
    >
      {loading ? (
        <Loader2
          className="mr-2 size-4 animate-spin"
        />
      ) : (
        <svg
          className="mr-3 size-5"
          viewBox="0 0 24 24"
        >
          <path
            fill="#4285F4"
            d="M21.35 12.24c0-.74-.07-1.46-.2-2.15H12v4.07h5.23a4.47 4.47 0 0 1-1.94 2.93v2.64h3.14c1.84-1.69 2.92-4.18 2.92-7.49Z"
          />

          <path
            fill="#34A853"
            d="M12 21.73c2.63 0 4.83-.87 6.44-2.36l-3.14-2.64c-.87.58-1.98.93-3.3.93-2.54 0-4.69-1.72-5.46-4.02H3.29v2.72A9.73 9.73 0 0 0 12 21.73Z"
          />

          <path
            fill="#FBBC05"
            d="M6.54 13.64A5.84 5.84 0 0 1 6.23 12c0-.57.11-1.12.31-1.64V7.64H3.29A9.72 9.72 0 0 0 2.27 12c0 1.56.37 3.03 1.02 4.36l3.25-2.72Z"
          />

          <path
            fill="#EA4335"
            d="M12 6.34c1.43 0 2.71.49 3.72 1.45l2.79-2.79A9.35 9.35 0 0 0 12 2.27a9.73 9.73 0 0 0-8.71 5.37l3.25 2.72c.77-2.3 2.92-4.02 5.46-4.02Z"
          />
        </svg>
      )}

      Continue with Google
    </Button>
  );
}