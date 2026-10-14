import "./not-found.css";
import Link from "next/link";
import { nav } from "@/lib/data/nav";
import { Container } from "@/components/ui/Container";
import { Avatar } from "@/components/home/sceneParts";

/** Branded 404: the site's character looks around for the page. Wordless — the only text is the status code and the structural nav. */
export default function NotFound() {
  return (
    <section className="py-16 sm:py-24">
      <Container className="flex flex-col items-center text-center">
        <svg viewBox="-60 -236 120 242" aria-hidden="true" className="nf-look h-52 w-auto overflow-visible sm:h-64">
          <Avatar x={0} y={0} pose="rest" />
          <g className="nf-q">
            <circle cx="30" cy="-214" r="16" className="fill-ivory stroke-terracotta" strokeWidth="2" />
            <text x="30" y="-207" textAnchor="middle" className="fill-terracotta font-heading" fontSize="20" fontWeight="700">?</text>
          </g>
        </svg>
        <h1 className="mt-6 font-heading text-7xl font-bold tracking-tight text-charcoal sm:text-8xl">404</h1>
        <span aria-hidden="true" className="mt-4 block h-[3px] w-20 bg-gradient-to-r from-terracotta to-sage" />
        <nav className="mt-8 flex flex-wrap justify-center gap-3">
          {nav.map((n, i) => (
            <Link
              key={n.href}
              href={n.href}
              className={`inline-flex min-h-12 items-center rounded-full border px-6 font-body text-sm font-semibold focus-visible:ring-2 focus-visible:ring-terracotta focus-visible:outline-none ${i === 0 ? "border-terracotta bg-terracotta text-ivory" : "border-beige-border bg-ivory text-charcoal hover:border-sage"}`}
            >
              {n.label}
            </Link>
          ))}
        </nav>
      </Container>
    </section>
  );
}
