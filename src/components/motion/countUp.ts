/** Splits "₹254 CPL" / "7.76L" / "3+" / "6,445" into an animatable number + its exact final text. */
export function numberParts(raw: string) {
  const m = raw.match(/^(\D*?)([\d,]*\.?\d+)(.*)$/);
  if (!m) return null;
  const dec = (m[2].split(".")[1] ?? "").length;
  const comma = m[2].includes(",");
  const v = parseFloat(m[2].replace(/,/g, ""));
  const fmt = (x: number) => m[1] + (comma ? Math.round(x).toLocaleString("en-IN") : x.toFixed(dec)) + m[3];
  return { v, fmt };
}

/** Counts a node up from 0 to its text once (ease-out), always ending on the exact original text. */
export function countUp(node: Element, delay = 0, duration = 1300) {
  const text = node.textContent ?? "";
  const p = numberParts(text);
  if (!p || !p.v) return;
  node.textContent = p.fmt(0);
  const t0 = performance.now() + delay;
  const step = (now: number) => {
    const k = Math.min(1, Math.max(0, (now - t0) / duration));
    node.textContent = k < 1 ? p.fmt(p.v * (1 - (1 - k) ** 3)) : text;
    if (k < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}
