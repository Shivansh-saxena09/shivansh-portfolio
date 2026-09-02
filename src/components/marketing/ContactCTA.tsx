"use client";

import { useState } from "react";
import type { ContactInfo } from "@/lib/data/site";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";

/**
 * Contact CTA (CLAUDE.md → /marketing): WhatsApp / email are the primary,
 * always-working paths. The form below is a real UI but has nowhere to
 * persist a submission yet — until Supabase is wired up, submitting it
 * opens a prefilled mailto: as a working fallback rather than silently
 * doing nothing.
 */
export function ContactCTA({ contact }: { contact: ContactInfo }) {
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
    <section className="border-t border-beige-border/70 bg-cream py-20 sm:py-24">
      <Container>
        <div className="lg:grid lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <h2 className="font-heading text-3xl text-charcoal sm:text-4xl">
              Let&apos;s talk about your next campaign
            </h2>
            <p className="mt-4 max-w-md font-body text-base leading-relaxed text-warm-grey">
              Fastest way to reach me is WhatsApp or email — or use the form.
            </p>

            <div className="mt-8 flex flex-col gap-4 sm:flex-row lg:flex-col lg:items-start">
              <Button
                href={contact.whatsapp}
                variant="primary"
                className="js-whatsapp-cta w-full sm:w-auto lg:w-full"
              >
                Message on WhatsApp
              </Button>
              <Button
                href={`mailto:${contact.email}`}
                variant="secondary"
                className="w-full sm:w-auto lg:w-full"
              >
                Send an Email
              </Button>
            </div>
          </div>

          <form
            onSubmit={handleSubmit}
            className="glass-card mt-12 grid gap-5 rounded-2xl px-6 py-8 shadow-lg sm:px-8 lg:col-span-7 lg:mt-0"
          >
            <div className="grid gap-2">
              <label htmlFor="name" className="relative z-10 font-body text-sm font-medium text-charcoal">
                Name
              </label>
              <input
                id="name"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="relative z-10 rounded-lg border border-beige-border bg-cream px-4 py-3 font-body text-sm text-charcoal outline-none focus:border-sage"
              />
            </div>

            <div className="grid gap-2">
              <label htmlFor="email" className="relative z-10 font-body text-sm font-medium text-charcoal">
                Email
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="relative z-10 rounded-lg border border-beige-border bg-cream px-4 py-3 font-body text-sm text-charcoal outline-none focus:border-sage"
              />
            </div>

            <div className="grid gap-2">
              <label htmlFor="message" className="relative z-10 font-body text-sm font-medium text-charcoal">
                What are you looking to run?
              </label>
              <textarea
                id="message"
                required
                rows={4}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="relative z-10 resize-none rounded-lg border border-beige-border bg-cream px-4 py-3 font-body text-sm text-charcoal outline-none focus:border-sage"
              />
            </div>

            <button
              type="submit"
              className="relative z-10 mt-2 w-full rounded-full bg-terracotta px-8 py-4 font-body text-sm font-medium text-ivory transition-colors hover:bg-terracotta-dark sm:w-fit"
            >
              Send
            </button>
          </form>
        </div>
      </Container>
    </section>
  );
}
