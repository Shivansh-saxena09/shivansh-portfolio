"use client";

import { useFormStatus } from "react-dom";

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
      className={`rounded-full px-5 py-2.5 font-body text-sm font-medium transition-colors disabled:opacity-60 ${styles} ${className}`}
    >
      {pending ? pendingLabel : children}
    </button>
  );
}
