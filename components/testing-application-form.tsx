"use client";

import { FormEvent, useMemo, useState } from "react";
import { site } from "@/lib/site";

const interests = ["Satellite tracking", "Visible passes", "Sky Mode", "Launches and news", "General testing"];

function encodeBody(lines: string[]) {
  return lines.join("\n");
}

export function TestingApplicationForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [device, setDevice] = useState("");
  const [iosVersion, setIosVersion] = useState("");
  const [selectedInterest, setSelectedInterest] = useState(interests[0]);
  const [reason, setReason] = useState("");
  const [status, setStatus] = useState("");
  const [draftHref, setDraftHref] = useState("");

  const isReady = useMemo(() => {
    return name.trim() && email.trim() && device.trim() && reason.trim();
  }, [device, email, name, reason]);

  function buildHref() {
    const body = encodeBody([
      "Live Orbit TestFlight application",
      "",
      `Name: ${name.trim()}`,
      `Email: ${email.trim()}`,
      `Device: ${device.trim()}`,
      `iOS version: ${iosVersion.trim() || "Not provided"}`,
      `Main interest: ${selectedInterest}`,
      "",
      "Why I want to test Live Orbit:",
      reason.trim(),
      "",
      "Sent from liveorbitapp.com/testing"
    ]);

    return `mailto:${site.companyEmail}?subject=${encodeURIComponent("Live Orbit TestFlight application")}&body=${encodeURIComponent(body)}`;
  }

  function submitApplication(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!isReady) {
      setStatus("Please fill out your name, email, device, and why you want to test Live Orbit.");
      setDraftHref("");
      return;
    }

    const href = buildHref();
    setDraftHref(href);
    setStatus("Opening your email app with the application ready to send.");
    window.location.href = href;
  }

  return (
    <form className="apple-form" onSubmit={submitApplication} noValidate>
      <div className="form-grid two">
        <label>
          <span>Name</span>
          <input value={name} onChange={(event) => setName(event.target.value)} autoComplete="name" placeholder="Your name" required />
        </label>
        <label>
          <span>Email</span>
          <input value={email} onChange={(event) => setEmail(event.target.value)} autoComplete="email" inputMode="email" placeholder="you@example.com" required />
        </label>
      </div>

      <div className="form-grid two">
        <label>
          <span>iPhone model</span>
          <input value={device} onChange={(event) => setDevice(event.target.value)} placeholder="iPhone 15 Pro" required />
        </label>
        <label>
          <span>iOS version</span>
          <input value={iosVersion} onChange={(event) => setIosVersion(event.target.value)} placeholder="iOS 18" />
        </label>
      </div>

      <fieldset>
        <legend>What do you want to test?</legend>
        <div className="segmented-options">
          {interests.map((interest) => (
            <label key={interest}>
              <input type="radio" name="interest" value={interest} checked={selectedInterest === interest} onChange={() => setSelectedInterest(interest)} />
              <span>{interest}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <label>
        <span>Why do you want to test Live Orbit?</span>
        <textarea value={reason} onChange={(event) => setReason(event.target.value)} placeholder="Tell me how you would use it, what you want to try, or what kind of feedback you can give." required />
      </label>

      <div className="form-actions">
        <button type="submit">Apply for TestFlight</button>
        {draftHref ? (
          <a href={draftHref}>Open email draft again</a>
        ) : null}
      </div>

      {status ? <p className="form-status" role="status">{status}</p> : null}
    </form>
  );
}
