"use client";

import { useActionState } from "react";
import { signIn, type LoginState } from "./actions";

const initialState: LoginState = { error: null };

export default function AdminLoginPage() {
  const [state, formAction, pending] = useActionState(signIn, initialState);

  return (
    <div className="flex min-h-screen items-center justify-center bg-cream px-5">
      <div className="w-full max-w-sm rounded-2xl border border-beige-border bg-ivory p-8 shadow-[0_1px_3px_rgba(43,38,34,0.06)]">
        <p className="font-body text-xs font-semibold tracking-[0.15em] text-terracotta uppercase">
          Admin
        </p>
        <h1 className="mt-2 font-heading text-2xl font-bold text-charcoal">Sign in</h1>

        <form action={formAction} className="mt-6 flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="email" className="font-body text-sm font-medium text-charcoal">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              autoComplete="email"
              suppressHydrationWarning
              className="rounded-lg border border-beige-border bg-cream px-4 py-3 font-body text-sm text-charcoal outline-none focus:border-sage"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="password" className="font-body text-sm font-medium text-charcoal">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              autoComplete="current-password"
              suppressHydrationWarning
              className="rounded-lg border border-beige-border bg-cream px-4 py-3 font-body text-sm text-charcoal outline-none focus:border-sage"
            />
          </div>

          {state.error && (
            <p role="alert" className="font-body text-sm text-terracotta-dark">
              {state.error}
            </p>
          )}

          <button
            type="submit"
            disabled={pending}
            className="mt-2 rounded-full bg-terracotta px-6 py-3 font-body text-sm font-medium text-ivory transition-colors hover:bg-terracotta-dark disabled:opacity-60"
          >
            {pending ? "Signing in…" : "Sign in"}
          </button>
        </form>
      </div>
    </div>
  );
}
