"use client";

import { useEffect, useState } from "react";

/** True only once `active` has stayed true for `ms`, so fast actions never flash a loader. */
export function useDelayed(active: boolean, ms = 300) {
  const [late, setLate] = useState(false);
  useEffect(() => {
    if (!active) return;
    const t = setTimeout(() => setLate(true), ms);
    return () => {
      clearTimeout(t);
      setLate(false);
    };
  }, [active, ms]);
  return active && late;
}

/** Brief "just finished" flag after `pending` goes true → false (drives success/error states). */
export function useJustFinished(pending: boolean, ms = 2600) {
  const [seenPending, setSeenPending] = useState(false);
  const [flash, setFlash] = useState(false);
  if (pending && !seenPending) setSeenPending(true);
  if (!pending && seenPending) {
    setSeenPending(false);
    setFlash(true);
  }
  useEffect(() => {
    if (!flash) return;
    const t = setTimeout(() => setFlash(false), ms);
    return () => clearTimeout(t);
  }, [flash, ms]);
  return flash;
}
