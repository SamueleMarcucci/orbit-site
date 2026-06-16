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

const WRAP_AROUND = true;
const LOOP_COPIES = 3;
const AUTO_SPEED_PX_PER_SECOND = 42;
const START_EASE_MS = 900;

function readVisibleScreenshotCount() {
  if (window.innerWidth < 640) {
    return 1;
  }

  if (window.innerWidth < 1040) {
    return 2;
  }

  return 3;
}

function easeOutCubic(progress: number) {
  return 1 - Math.pow(1 - progress, 3);
}

export function ScreenshotCarousel({ screenshots }: ScreenshotCarouselProps) {
  const carouselRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [visibleCount, setVisibleCount] = useState(3);

  const hasScreenshots = screenshots.length > 0;
  const loopGroups = useMemo(
    () => Array.from({ length: LOOP_COPIES }, (_, groupIndex) => groupIndex),
    [],
  );

  useEffect(() => {
    function syncVisibleCount() {
      setVisibleCount(readVisibleScreenshotCount());
    }

    syncVisibleCount();
    window.addEventListener("resize", syncVisibleCount);
    return () => window.removeEventListener("resize", syncVisibleCount);
  }, []);

  useEffect(() => {
    const carousel = carouselRef.current;
    const track = trackRef.current;
    const firstLoop = track?.querySelector<HTMLElement>(".download-screenshot-loop");

    if (!carousel || !track || !firstLoop || !hasScreenshots || screenshots.length <= visibleCount || !WRAP_AROUND) {
      return;
    }

    const carouselElement = carousel;
    const trackElement = track;
    const firstLoopElement = firstLoop;
    const reduceMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reduceMotionQuery.matches) {
      return;
    }

    let animationFrame = 0;
    let loopWidth = 0;
    let offset = 0;
    let lastTime = 0;
    let startTime = 0;

    function measureLoopWidth() {
      const trackStyle = window.getComputedStyle(trackElement);
      const gap = Number.parseFloat(trackStyle.columnGap || trackStyle.gap || "0") || 0;
      loopWidth = firstLoopElement.getBoundingClientRect().width + gap;
    }

    const resizeObserver = new ResizeObserver(measureLoopWidth);
    resizeObserver.observe(carouselElement);
    resizeObserver.observe(firstLoopElement);
    measureLoopWidth();

    function animate(time: number) {
      if (startTime === 0) {
        startTime = time;
      }

      if (lastTime === 0) {
        lastTime = time;
      }

      const deltaSeconds = (time - lastTime) / 1000;
      const rampProgress = Math.min((time - startTime) / START_EASE_MS, 1);
      const speed = AUTO_SPEED_PX_PER_SECOND * easeOutCubic(rampProgress);
      lastTime = time;

      if (loopWidth > 0) {
        offset = (offset + speed * deltaSeconds) % loopWidth;
        carouselElement.style.setProperty("--carousel-slide-x", `${-offset.toFixed(2)}px`);
      }

      animationFrame = window.requestAnimationFrame(animate);
    }

    animationFrame = window.requestAnimationFrame(animate);

    return () => {
      window.cancelAnimationFrame(animationFrame);
      resizeObserver.disconnect();
      carouselElement.style.removeProperty("--carousel-slide-x");
    };
  }, [hasScreenshots, screenshots.length, visibleCount]);

  if (!hasScreenshots) {
    return null;
  }

  return (
    <div
      className="download-screenshots"
      aria-label="Live Orbit screenshots"
      data-visible-count={visibleCount}
      data-wrap-around={WRAP_AROUND}
      ref={carouselRef}
    >
      <div className="download-screenshot-viewport">
        <div className="download-screenshot-track" ref={trackRef} aria-hidden="true">
          {loopGroups.map((groupIndex) => (
            <div className="download-screenshot-loop" key={groupIndex}>
              {screenshots.map((screenshot, screenshotIndex) => (
                <div
                  className="download-screenshot-cell"
                  key={`${screenshot.src}-${groupIndex}`}
                  style={{ "--screenshot-index": screenshotIndex % 6 } as CSSProperties}
                >
                  <div className="download-screenshot-frame">
                    <Image
                      src={assetPath(screenshot.src)}
                      alt=""
                      width={744}
                      height={1610}
                      loading={groupIndex === 0 && screenshotIndex === 0 ? "eager" : "lazy"}
                      fetchPriority={groupIndex === 0 && screenshotIndex === 0 ? "high" : "auto"}
                      preload={groupIndex === 0 && screenshotIndex === 0}
                      sizes="(max-width: 639px) 78vw, 360px"
                      draggable={false}
                    />
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
      <div className="sr-only">
        {screenshots.map((screenshot) => (
          <div key={screenshot.src}>{screenshot.alt}</div>
        ))}
      </div>
    </div>
  );
}
