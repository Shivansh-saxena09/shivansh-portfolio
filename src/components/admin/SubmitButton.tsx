"use client";

import { useFormStatus } from "react-dom";
import { ButtonLoader } from "@/components/loaders/Loaders";
import { useDelayed } from "@/components/loaders/useDelayed";

export function SubmitButton({
  children = "Save",
  pendingLabel = "Saving…",
  variant = "primary",
  className = "",
}: {
  children?: React.ReactNode;
  pendingLabel?: string;
  variant?: "primary" | "danger" | "secondary";
  className?: string;
}) {
  const { pending } = useFormStatus();
  // Loader only once the wait passes ~300ms, so quick saves never flash it.
  const late = useDelayed(pending);
  const styles =
    variant === "primary"
      ? "bg-terracotta text-ivory hover:bg-terracotta-dark"
      : variant === "danger"
        ? "bg-transparent text-terracotta-dark border border-terracotta/40 hover:bg-terracotta/10"
        : "bg-transparent text-charcoal border border-beige-border hover:border-sage";

  return (
    <button
      type="submit"
      disabled={pending}
      className={`inline-flex items-center justify-center gap-2 rounded-full px-5 py-2.5 font-body text-sm font-medium transition-colors disabled:opacity-60 ${styles} ${className}`}
    >
      {late && <ButtonLoader />}
      {pending ? pendingLabel : children}
    </button>
  );
}
