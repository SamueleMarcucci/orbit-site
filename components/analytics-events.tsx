"use client";

import { useEffect } from "react";

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

function sendEvent(name: string, params: Record<string, string>) {
  window.dataLayer?.push({ event: name, ...params });
  window.gtag?.("event", name, params);
}

export function AnalyticsEvents() {
  useEffect(() => {
    function handleClick(event: MouseEvent) {
      const target = event.target instanceof Element ? event.target.closest<HTMLElement>("[data-analytics-event]") : null;
      if (!target) return;

      sendEvent(target.dataset.analyticsEvent || "site_click", {
        event_label: target.dataset.analyticsLabel || target.textContent?.trim() || "",
        link_url: target instanceof HTMLAnchorElement ? target.href : "",
      });
    }

    function handleSubmit(event: SubmitEvent) {
      const target = event.target instanceof HTMLElement ? event.target.closest<HTMLFormElement>("form[data-analytics-event]") : null;
      if (!target) return;

      sendEvent(target.dataset.analyticsEvent || "form_submit", {
        event_label: target.dataset.analyticsLabel || target.getAttribute("aria-label") || "",
      });
    }

    document.addEventListener("click", handleClick);
    document.addEventListener("submit", handleSubmit);
    return () => {
      document.removeEventListener("click", handleClick);
      document.removeEventListener("submit", handleSubmit);
    };
  }, []);

  return null;
}
