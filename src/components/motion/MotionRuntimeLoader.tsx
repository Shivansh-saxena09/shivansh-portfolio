"use client";

import dynamic from "next/dynamic";

// Separate chunk, fetched after hydration so it never competes with first paint or the first click.
const MotionRuntime = dynamic(() => import("@/components/motion/MotionRuntime").then((m) => m.MotionRuntime), { ssr: false });

export function MotionRuntimeLoader() {
  return <MotionRuntime />;
}
