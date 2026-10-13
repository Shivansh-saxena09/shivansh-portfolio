import { notFound } from "next/navigation";

// Unmatched URLs inside the site render (site)/not-found.tsx within the site layout.
export default function Missing() {
  notFound();
}
