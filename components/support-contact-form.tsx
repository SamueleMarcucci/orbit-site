import { supportPaths } from "@/lib/content";
import { site } from "@/lib/site";

export function SupportContactForm() {
  return (
    <form className="apple-form support-form" action={`https://formsubmit.co/${site.companyEmail}`} method="POST">
      <input type="hidden" name="_subject" value="Live Orbit support request" />
      <input type="hidden" name="_template" value="table" />
      <input type="hidden" name="_next" value={`${site.url}/support/thanks/`} />
      <input type="text" name="_honey" className="hidden-field" tabIndex={-1} autoComplete="off" />

      <fieldset>
        <legend>What do you need?</legend>
        <div className="support-choice-list">
          {supportPaths.map((path, index) => (
            <label key={path.subject}>
              <input type="radio" name="support_topic" value={path.title} defaultChecked={index === 0} />
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
        <input type="email" name="email" autoComplete="email" inputMode="email" placeholder="you@example.com" required />
      </label>

      <label>
        <span>Message</span>
        <textarea name="message" placeholder="Tell me what happened or what you need help with." required />
      </label>

      <div className="form-actions">
        <button type="submit">Send message</button>
        <p className="form-note">You will see a confirmation page after submitting.</p>
      </div>
    </form>
  );
}
