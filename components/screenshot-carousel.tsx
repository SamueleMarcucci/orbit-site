"use client";

import Image from "next/image";
import type { CSSProperties } from "react";
import { useEffect, useMemo, useRef, useState } from "react";
import { assetPath } from "@/lib/site";

type Screenshot = {
  src: string;
  alt: string;
};

type ScreenshotCarouselProps = {
  screenshots: Screenshot[];
};

const AUTO_ADVANCE_MS = 3600;
const RESUME_DELAY_MS = 5000;
const SWIPE_THRESHOLD = 44;

function getVisibleCount() {
  if (window.innerWidth < 640) {
    return 1;
  }

  if (window.innerWidth < 1040) {
    return 2;
  }

  return 3;
}

export function ScreenshotCarousel({ screenshots }: ScreenshotCarouselProps) {
  const lastInteractionRef = useRef(-RESUME_DELAY_MS);
  const isDraggingRef = useRef(false);
  const dragStartXRef = useRef(0);
  const [visibleCount, setVisibleCount] = useState(3);
  const [activePage, setActivePage] = useState(0);

  const pages = useMemo(() => {
    const chunks: Screenshot[][] = [];

    for (let index = 0; index < screenshots.length; index += visibleCount) {
      const chunk = screenshots.slice(index, index + visibleCount);

      while (chunk.length < visibleCount && screenshots.length > 0) {
        chunk.push(screenshots[chunk.length % screenshots.length]);
      }

      chunks.push(chunk);
    }

    return chunks;
  }, [screenshots, visibleCount]);
  const normalizedActivePage = pages.length > 0 ? activePage % pages.length : 0;

  useEffect(() => {
    function syncVisibleCount() {
      setVisibleCount(getVisibleCount());
    }

    syncVisibleCount();
    window.addEventListener("resize", syncVisibleCount);
    return () => window.removeEventListener("resize", syncVisibleCount);
  }, []);

  useEffect(() => {
    if (pages.length <= 1 || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    const intervalId = window.setInterval(() => {
      const now = performance.now();
      if (!isDraggingRef.current && now - lastInteractionRef.current >= RESUME_DELAY_MS) {
        setActivePage((page) => (page + 1) % pages.length);
      }
    }, AUTO_ADVANCE_MS);

    return () => window.clearInterval(intervalId);
  }, [pages.length]);

  return (
    <div
      className="download-screenshots"
      aria-label="Live Orbit screenshots"
      data-visible-count={visibleCount}
      onPointerDown={(event) => {
        isDraggingRef.current = true;
        lastInteractionRef.current = performance.now();
        dragStartXRef.current = event.clientX;
        event.currentTarget.setPointerCapture(event.pointerId);
      }}
      onPointerUp={(event) => {
        const deltaX = event.clientX - dragStartXRef.current;
        isDraggingRef.current = false;
        lastInteractionRef.current = performance.now();
        event.currentTarget.releasePointerCapture(event.pointerId);

        if (Math.abs(deltaX) >= SWIPE_THRESHOLD && pages.length > 1) {
          setActivePage((page) => (deltaX < 0 ? page + 1 : page - 1 + pages.length) % pages.length);
        }
      }}
      onPointerCancel={() => {
        isDraggingRef.current = false;
        lastInteractionRef.current = performance.now();
      }}
    >
      <div className="download-screenshot-stage">
        {pages.map((page, pageIndex) => (
          <div
            className="download-screenshot-page"
            data-active={pageIndex === normalizedActivePage}
            key={`${pageIndex}-${page.map((screenshot) => screenshot.src).join("-")}`}
            aria-hidden={pageIndex !== normalizedActivePage}
          >
            {page.map((screenshot, index) => (
              <Image
                key={`${screenshot.src}-${pageIndex}`}
                src={assetPath(screenshot.src)}
                alt={pageIndex === normalizedActivePage ? screenshot.alt : ""}
                width={1242}
                height={2688}
                loading={pageIndex === 0 ? "eager" : "lazy"}
                fetchPriority={pageIndex === 0 ? "high" : "auto"}
                preload={pageIndex === 0}
                style={{ "--screenshot-index": index } as CSSProperties}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
