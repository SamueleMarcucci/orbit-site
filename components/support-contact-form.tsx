"use client";

import { FormEvent, useMemo, useState } from "react";
import { supportPaths } from "@/lib/content";
import { site } from "@/lib/site";

export function SupportContactForm() {
  const [topic, setTopic] = useState(supportPaths[0].subject);
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("");
  const [draftHref, setDraftHref] = useState("");

  const selectedPath = supportPaths.find((path) => path.subject === topic) ?? supportPaths[0];
  const isReady = useMemo(() => email.trim() && message.trim(), [email, message]);

  function buildHref() {
    const body = [
      selectedPath.title,
      "",
      `Reply email: ${email.trim()}`,
      "",
      "Message:",
      message.trim(),
      "",
      "Sent from liveorbitapp.com/support"
    ].join("\n");

    return `mailto:${site.supportEmail}?subject=${encodeURIComponent(selectedPath.subject)}&body=${encodeURIComponent(body)}`;
  }

  function submitSupport(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!isReady) {
      setStatus("Please add your email and a short message first.");
      setDraftHref("");
      return;
    }

    const href = buildHref();
    setDraftHref(href);
    setStatus("Opening your email app with the message ready to send.");
    window.location.href = href;
  }

  return (
    <form className="apple-form support-form" onSubmit={submitSupport} noValidate>
      <fieldset>
        <legend>What do you need?</legend>
        <div className="support-choice-list">
          {supportPaths.map((path) => (
            <label key={path.subject}>
              <input type="radio" name="support-topic" value={path.subject} checked={topic === path.subject} onChange={() => setTopic(path.subject)} />
              <span>
                <strong>{path.title}</strong>
                <small>{path.body}</small>
              </span>
            </label>
          ))}
        </div>
      </fieldset>

      <label>
        <span>Email</span>
        <input value={email} onChange={(event) => setEmail(event.target.value)} autoComplete="email" inputMode="email" placeholder="you@example.com" required />
      </label>

      <label>
        <span>Message</span>
        <textarea value={message} onChange={(event) => setMessage(event.target.value)} placeholder="Tell me what happened or what you need help with." required />
      </label>

      <div className="form-actions">
        <button type="submit">Open email draft</button>
        {draftHref ? (
          <a href={draftHref}>Open email draft again</a>
        ) : null}
      </div>

      {status ? <p className="form-status" role="status">{status}</p> : null}
    </form>
  );
}
