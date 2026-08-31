"use client";

import { useState } from "react";
import { contact } from "@/content/site";
import { Button } from "@/components/ui/Button";

/**
 * Contact CTA (CLAUDE.md → /marketing): WhatsApp / email are the primary,
 * always-working paths. The form below is a real UI but has nowhere to
 * persist a submission yet — until Supabase is wired up, submitting it
 * opens a prefilled mailto: as a working fallback rather than silently
 * doing nothing.
 */
export function ContactCTA() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const subject = encodeURIComponent(`Portfolio inquiry from ${name || "website visitor"}`);
    const body = encodeURIComponent(`${message}\n\n— ${name} (${email})`);
    window.location.href = `mailto:${contact.email}?subject=${subject}&body=${body}`;
  };

  return (
    <section className="border-t border-beige-border/70 bg-cream px-6 py-20 sm:px-10">
      <div className="mx-auto max-w-4xl">
        <h2 className="font-heading text-3xl text-charcoal sm:text-4xl">
          Let&apos;s talk about your next campaign
        </h2>
        <p className="mt-4 max-w-2xl font-body text-base leading-relaxed text-warm-grey">
          Fastest way to reach me is WhatsApp or email — or use the form below.
        </p>

        <div className="mt-8 flex flex-col gap-4 sm:flex-row">
          <Button href={contact.whatsapp} variant="primary">
            Message on WhatsApp
          </Button>
          <Button href={`mailto:${contact.email}`} variant="secondary">
            Send an Email
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="mt-12 grid max-w-xl gap-5">
          <div className="grid gap-2">
            <label htmlFor="name" className="font-body text-sm font-medium text-charcoal">
              Name
            </label>
            <input
              id="name"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="rounded-lg border border-beige-border bg-ivory px-4 py-3 font-body text-sm text-charcoal outline-none focus:border-sage"
            />
          </div>

          <div className="grid gap-2">
            <label htmlFor="email" className="font-body text-sm font-medium text-charcoal">
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="rounded-lg border border-beige-border bg-ivory px-4 py-3 font-body text-sm text-charcoal outline-none focus:border-sage"
            />
          </div>

          <div className="grid gap-2">
            <label htmlFor="message" className="font-body text-sm font-medium text-charcoal">
              What are you looking to run?
            </label>
            <textarea
              id="message"
              required
              rows={4}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="resize-none rounded-lg border border-beige-border bg-ivory px-4 py-3 font-body text-sm text-charcoal outline-none focus:border-sage"
            />
          </div>

          <button
            type="submit"
            className="mt-2 w-fit rounded-full bg-terracotta px-8 py-4 font-body text-sm font-medium text-ivory transition-colors hover:bg-terracotta-dark"
          >
            Send
          </button>
        </form>
      </div>
    </section>
  );
}
