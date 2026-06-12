import type { Metadata } from "next";
import { PageHero } from "@/components/page-hero";

export const metadata: Metadata = {
  title: "Privacy",
  description:
    "Live Orbit privacy policy for App Store data collection, location, analytics, diagnostics, support, subscriptions, backend requests, and AI-assisted content."
};

export default function PrivacyPage() {
  return (
    <>
      <PageHero
        code="PRIVACY/POLICY"
        title="Privacy Policy"
        body="Live Orbit is an iOS-only satellite watching app from Apps Made Better LLC. No account is required. The app minimizes data collection, but some data is collected to provide features, subscriptions, analytics, diagnostics, support, backend requests, and AI-assisted content."
      />
      <article className="legal-ledger">
        <section>
          <h2>Last updated</h2>
          <p>June 11, 2026.</p>
          <p>Company: Apps Made Better LLC, Texas, United States.</p>
          <p>
            Legal and privacy contact: <a href="mailto:founder@appsmadebetter.com">founder@appsmadebetter.com</a>.
          </p>
        </section>

        <section>
          <h2>Data types disclosed for App Store privacy labels</h2>
          <p>Live Orbit&apos;s App Store privacy answers should disclose data collection rather than saying the app collects no data.</p>
          <ul>
            <li><strong>Email address:</strong> collected only when you provide it for support, privacy, or data deletion requests. Used for app functionality and customer support. Linked to your identity when provided. Not used for tracking.</li>
            <li><strong>Precise location:</strong> used for app functionality such as observer position, visible pass calculations, local sky and AR alignment, weather or sky context, and ephemeris-related requests. Current review found no use of location for advertising or tracking.</li>
            <li><strong>Customer support data:</strong> support or privacy request text, optional email, issue context, and optional diagnostics. Used for app functionality and customer support. May be linked to your identity when submitted.</li>
            <li><strong>Device identifiers:</strong> Firebase, app instance, installation, or similar identifiers used for analytics, crash, and performance diagnostics. Current review found no Live Orbit account system linking these identifiers to a named user identity.</li>
            <li><strong>Purchase history:</strong> Apple StoreKit product or transaction state used for Live Orbit Pro access, restoring purchases, and subscription functionality. Apps Made Better LLC does not receive payment card details from Apple.</li>
            <li><strong>Product interaction:</strong> Firebase Analytics events such as app opens, screen opens and closes, feature use, search opened, passes opened, AR or Sky Mode opened, and support opened. Used for analytics. Current review found no use of product interaction data for tracking.</li>
            <li><strong>Crash data, performance data, and other diagnostics:</strong> Firebase Crashlytics, Firebase Performance Monitoring, MetricKit summaries, non-fatal errors, app logs, launch and network performance, and technical diagnostics. Used for app functionality, reliability, crash troubleshooting, and performance troubleshooting.</li>
          </ul>
        </section>

        <section>
          <h2>Local-only app data</h2>
          <p>Favorites, watchlists, recent searches, pass alerts, launch alerts, observing sessions, display preferences, notification preferences, language settings, AR/Sky safety acknowledgement, and caches are generally stored on your device.</p>
          <p>The app includes controls to clear temporary cached data or broader local app data. Clearing local data does not delete Apple purchase records or support emails, privacy requests, or diagnostics already sent off the device.</p>
        </section>

        <section>
          <h2>Permissions</h2>
          <p>Location is used, when allowed, for observer position, visible passes, sky alignment, AR pointing, weather and visibility context, and ephemeris-related calculations.</p>
          <p>Camera is used for AR views. Motion, compass, and device orientation data are used for AR and Sky Mode alignment. Calendar access is used only when you choose to save satellite pass events. Notifications are used for pass, launch, and major news alerts you choose to enable.</p>
        </section>

        <section>
          <h2>Analytics and diagnostics</h2>
          <p>Live Orbit uses Firebase Analytics, Firebase Crashlytics, Firebase Performance Monitoring, and Apple MetricKit for analytics, crash reporting, performance monitoring, non-fatal error reporting, and technical diagnostics.</p>
          <p>These signals help understand app flow, reliability, startup readiness, catalog loading, search latency, pass calculation, Find AR preparation, Sky Mode preparation, crashes, and performance issues.</p>
        </section>

        <section>
          <h2>Third-party services</h2>
          <p>Live Orbit uses or may use Apple StoreKit, Firebase/Google Analytics, Crashlytics, Firebase Performance Monitoring, Cloudflare/API backend services, OpenAI or AI-assisted services for Orbit Intelligence, satellite/weather/launch/news data providers, and Apple system services.</p>
          <p>Backend and third-party providers may receive normal request metadata such as IP address, request time, endpoint, app/device context, and requested subject identifiers. Exact provider retention periods and backend log retention require owner and attorney confirmation.</p>
        </section>

        <section>
          <h2>AI and Orbit Intelligence</h2>
          <p>Orbit Intelligence may use backend and AI-assisted systems to generate or refine informational satellite, launch, space, or source-backed summaries. Requests may include satellite identifiers, source snippets, selected context, or related app/backend data needed to provide the feature.</p>
          <p>AI-assisted content may be incomplete, inaccurate, or outdated. It is informational only and is not for navigation, safety, satellite operations, collision avoidance, emergency use, or professional reliance.</p>
        </section>

        <section>
          <h2>Subscriptions and refunds</h2>
          <p>Live Orbit Pro purchases are billed by Apple through the App Store. Apps Made Better LLC does not process App Store payments or refunds directly. Refund eligibility and refund requests are handled by Apple under Apple&apos;s App Store policies and applicable law.</p>
          <p>A free trial, if shown by Apple, converts to a paid subscription unless cancelled before the trial ends. Cancellation stops future renewal and may not automatically refund a past or current charge.</p>
        </section>

        <section>
          <h2>Tracking, ads, and marketing</h2>
          <p>Current app code review found no IDFA access, AppTrackingTransparency prompt, third-party advertising network use, in-app ad placements, or marketing email integration. App Store privacy answers should be revisited if advertising, marketing, tracking, or data broker integrations are added later.</p>
        </section>

        <section>
          <h2>Retention and deletion</h2>
          <p>Live Orbit retains information as long as reasonably necessary to provide the app, maintain subscriptions and diagnostics, respond to support or privacy requests, secure services, comply with law, and improve reliability.</p>
          <p>For no-account local data, use Settings to clear caches or broader local app data on your device. For support emails, diagnostics, privacy requests, or data already sent, contact <a href="mailto:founder@appsmadebetter.com">founder@appsmadebetter.com</a>.</p>
          <p>Specific retention periods for Firebase, Cloudflare/backend logs, API caches, OpenAI or AI-provider settings, support emails, diagnostics, and third-party providers require owner and attorney confirmation.</p>
        </section>

        <section>
          <h2>Children and international users</h2>
          <p>Live Orbit is not intended for children under 13. If the app is later directed to children under 13 or knowingly collects data from them, it needs a separate COPPA and minors privacy review before launch or release.</p>
          <p>Live Orbit may be used worldwide. Data may be processed in the United States and in service-provider regions. GDPR/UK GDPR, California/CCPA/CPRA, Texas privacy law, and other international privacy obligations require attorney review.</p>
        </section>
      </article>
    </>
  );
}
