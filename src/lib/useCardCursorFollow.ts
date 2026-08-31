"use client";

import { useState, type MouseEvent } from "react";
import { useMotionValue, useSpring } from "framer-motion";

/**
 * Shared "this card is clickable" interaction (cursor-follow badge +
 * hover state) — extracted from CaseStudyCard once a second card type
 * (ProjectPreviewCard) needed the same pattern, so the mouse-tracking
 * logic lives in one place instead of two.
 */
export function useCardCursorFollow() {
  const [hovered, setHovered] = useState(false);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 300, damping: 30, mass: 0.5 });
  const springY = useSpring(mouseY, { stiffness: 300, damping: 30, mass: 0.5 });

  function handleMouseMove(e: MouseEvent<HTMLElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    mouseX.set(e.clientX - rect.left);
    mouseY.set(e.clientY - rect.top);
  }

  return {
    hovered,
    springX,
    springY,
    cardHandlers: {
      onMouseEnter: () => setHovered(true),
      onMouseLeave: () => setHovered(false),
      onMouseMove: handleMouseMove,
    },
  };
}
