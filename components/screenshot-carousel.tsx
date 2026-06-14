"use client";

import Image from "next/image";
import type { CSSProperties } from "react";
import { useEffect, useRef } from "react";
import { assetPath } from "@/lib/site";

type Screenshot = {
  src: string;
  alt: string;
};

type ScreenshotCarouselProps = {
  screenshots: Screenshot[];
};

const AUTO_SPEED = 32;

export function ScreenshotCarousel({ screenshots }: ScreenshotCarouselProps) {
  const viewportRef = useRef<HTMLDivElement>(null);
  const lastFrameRef = useRef<number | null>(null);
  const autoScrollLeftRef = useRef(0);

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
      if (groupWidth > 0 && autoScrollLeftRef.current >= groupWidth) {
        autoScrollLeftRef.current -= groupWidth;
        currentViewport.scrollLeft = autoScrollLeftRef.current;
      }

      if (groupWidth > 0) {
        autoScrollLeftRef.current += AUTO_SPEED * deltaSeconds;
        currentViewport.scrollLeft = autoScrollLeftRef.current;
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
      ref={viewportRef}
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
                loading={groupIndex === 0 && index < 3 ? "eager" : "lazy"}
                fetchPriority={groupIndex === 0 && index < 3 ? "high" : "auto"}
                preload={groupIndex === 0 && index < 3}
                style={{ "--screenshot-index": index } as CSSProperties}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
