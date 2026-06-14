"use client";

import Image from "next/image";
import type { PointerEvent } from "react";
import { useEffect, useRef } from "react";
import { assetPath } from "@/lib/site";

type Screenshot = {
  src: string;
  alt: string;
};

type ScreenshotCarouselProps = {
  screenshots: Screenshot[];
};

const AUTO_SPEED = 58;
const RESUME_DELAY_MS = 5000;
const RESUME_RAMP_MS = 2600;

function easeOutCubic(progress: number) {
  return 1 - Math.pow(1 - progress, 3);
}

export function ScreenshotCarousel({ screenshots }: ScreenshotCarouselProps) {
  const viewportRef = useRef<HTMLDivElement>(null);
  const lastFrameRef = useRef<number | null>(null);
  const lastInteractionRef = useRef<number>(-Infinity);
  const dragStateRef = useRef<{ pointerId: number; startX: number; startScrollLeft: number } | null>(null);

  function markInteraction() {
    lastInteractionRef.current = performance.now();
  }

  function handlePointerDown(event: PointerEvent<HTMLDivElement>) {
    markInteraction();
    if (event.pointerType !== "mouse") {
      return;
    }

    dragStateRef.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startScrollLeft: event.currentTarget.scrollLeft
    };
    event.currentTarget.setPointerCapture(event.pointerId);
  }

  function handlePointerMove(event: PointerEvent<HTMLDivElement>) {
    const dragState = dragStateRef.current;
    if (!dragState || dragState.pointerId !== event.pointerId) {
      return;
    }

    markInteraction();
    event.currentTarget.scrollLeft = dragState.startScrollLeft - (event.clientX - dragState.startX);
  }

  function handlePointerEnd(event: PointerEvent<HTMLDivElement>) {
    const dragState = dragStateRef.current;
    if (!dragState || dragState.pointerId !== event.pointerId) {
      return;
    }

    markInteraction();
    dragStateRef.current = null;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  }

  useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    let frameId = 0;

    function animate(now: number) {
      const currentViewport = viewportRef.current;
      const group = currentViewport?.querySelector<HTMLElement>(".download-screenshot-group");
      if (!currentViewport || !group) {
        frameId = requestAnimationFrame(animate);
        return;
      }

      const lastFrame = lastFrameRef.current ?? now;
      const deltaSeconds = Math.min((now - lastFrame) / 1000, 0.05);
      lastFrameRef.current = now;

      const groupWidth = group.scrollWidth;
      if (groupWidth > 0 && currentViewport.scrollLeft >= groupWidth) {
        currentViewport.scrollLeft -= groupWidth;
      }

      const idleMs = now - lastInteractionRef.current;
      let speed = AUTO_SPEED;
      if (idleMs < RESUME_DELAY_MS) {
        speed = 0;
      } else if (idleMs < RESUME_DELAY_MS + RESUME_RAMP_MS) {
        const rampProgress = (idleMs - RESUME_DELAY_MS) / RESUME_RAMP_MS;
        speed = AUTO_SPEED * easeOutCubic(rampProgress);
      }

      if (speed > 0 && groupWidth > 0) {
        currentViewport.scrollLeft += speed * deltaSeconds;
      }

      frameId = requestAnimationFrame(animate);
    }

    frameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frameId);
  }, []);

  return (
    <div
      className="download-screenshots"
      aria-label="Live Orbit screenshots"
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerEnd}
      onPointerCancel={handlePointerEnd}
      onTouchStart={markInteraction}
      onWheel={markInteraction}
      onKeyDown={markInteraction}
      ref={viewportRef}
      tabIndex={0}
    >
      <div className="download-screenshot-track">
        {[0, 1].map((groupIndex) => (
          <div className="download-screenshot-group" key={groupIndex} aria-hidden={groupIndex === 1}>
            {screenshots.map((screenshot, index) => (
              <Image
                key={`${screenshot.src}-${groupIndex}`}
                src={assetPath(screenshot.src)}
                alt={groupIndex === 0 ? screenshot.alt : ""}
                width={1242}
                height={2688}
                priority={groupIndex === 0 && index < 3}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
