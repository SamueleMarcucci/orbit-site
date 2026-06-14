import { site } from "@/lib/site";

const interests = ["Satellite tracking", "Visible passes", "Sky Mode", "Launches and news", "General testing"];

export function TestingApplicationForm() {
  return (
    <form className="apple-form submission-form" action={`https://formsubmit.co/${site.companyEmail}`} method="POST" data-analytics-event="testflight_application_submit" data-analytics-label="TestFlight application">
      <input type="hidden" name="_subject" value="Live Orbit TestFlight application" />
      <input type="hidden" name="_template" value="table" />
      <input type="hidden" name="_next" value={`${site.url}/testing/thanks/`} />
      <input type="text" name="_honey" className="hidden-field" tabIndex={-1} autoComplete="off" />

      <div className="form-grid two">
        <label>
          <span>Name</span>
          <input name="name" autoComplete="name" placeholder="Your name" required />
        </label>
        <label>
          <span>Email</span>
          <input type="email" name="email" autoComplete="email" inputMode="email" placeholder="you@example.com" required />
        </label>
      </div>

      <div className="form-grid two">
        <label>
          <span>iPhone model</span>
          <input name="iphone_model" placeholder="iPhone 15 Pro" required />
        </label>
        <label>
          <span>iOS version</span>
          <input name="ios_version" placeholder="iOS 18" />
        </label>
      </div>

      <fieldset>
        <legend>What do you want to test?</legend>
        <div className="segmented-options">
          {interests.map((interest, index) => (
            <label key={interest}>
              <input type="radio" name="testing_focus" value={interest} defaultChecked={index === 0} />
              <span>{interest}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <label>
        <span>Why do you want to test Live Orbit?</span>
        <textarea name="message" placeholder="Tell me how you would use it, what you want to try, or what kind of feedback you can give." required />
      </label>

      <div className="form-actions">
        <button type="submit">Submit application</button>
        <p className="form-note">You will see a confirmation page after submitting.</p>
      </div>
    </form>
  );
}
