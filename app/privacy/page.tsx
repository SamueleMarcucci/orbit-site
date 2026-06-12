import type { Metadata } from "next";
import { PageHero } from "@/components/page-hero";

export const metadata: Metadata = {
  title: "Privacy",
  description:
    "Live Orbit privacy policy for location, permissions, analytics, diagnostics, support, subscriptions, backend requests, AI-assisted content, and local app data."
};

export default function PrivacyPage() {
  return (
    <>
      <PageHero
        code="PRIVACY/POLICY"
        title="Privacy Policy"
        body="Live Orbit is an iOS-only satellite watching app from Apps Made Better LLC. No account is required. We minimize data collection, but some data is collected or processed to provide app features, subscriptions, analytics, diagnostics, support, backend requests, and AI-assisted Orbit Intelligence."
      />
      <article className="legal-ledger">
        <section>
          <h2>Last updated</h2>
          <p>June 12, 2026.</p>
          <p>Live Orbit is provided by Apps Made Better LLC, a Texas company.</p>
          <p>
            Legal and privacy requests: <a href="mailto:founder@appsmadebetter.com">founder@appsmadebetter.com</a>.
          </p>
        </section>

        <section>
          <h2>Summary</h2>
          <p>Live Orbit does not require a user account. Favorites, watchlists, recent searches, observing sessions, settings, and similar app data are generally stored on your device.</p>
          <p>The app uses Apple, Firebase/Google, Cloudflare, OpenAI or AI-assisted services, and satellite, weather, launch, and news data providers to operate the app and related services.</p>
          <p>We do not currently use third-party advertising SDKs, IDFA, App Tracking Transparency prompts, in-app ads, or marketing email systems in the reviewed app code. If that changes, this policy and App Store privacy disclosures must be updated.</p>
        </section>

        <section>
          <h2>Information you provide</h2>
          <p>If you contact support or submit a privacy or data deletion request, we may receive your email address, message text, issue details, device or app context, and any diagnostics you choose to include.</p>
          <p>We use this information for app functionality, customer support, privacy request handling, troubleshooting, reliability, security, and legal compliance. An email address you provide for support or privacy requests is linked to your identity because it identifies how to reply to you.</p>
          <p>We do not use support email addresses for third-party advertising, developer advertising, marketing email, product personalization, or tracking.</p>
        </section>

        <section>
          <h2>Location and permissions</h2>
          <p>Live Orbit may ask for precise location to calculate visible passes, observer position, local sky alignment, AR and Sky Mode pointing, weather or sky context, alerts, and other location-based satellite features.</p>
          <p>Camera access is used for AR views. Motion, compass, and device orientation data are used for AR and Sky Mode alignment. Calendar access is used only if you choose to save satellite pass events. Notifications are used for pass, launch, and major news alerts you choose to enable.</p>
          <p>Some location-based features may involve app or backend requests that include your location, approximate location, coordinates, observer context, or derived sky context when needed to provide the feature. Exact backend logging and retention for location-bearing requests requires owner and attorney confirmation.</p>
          <p>Location, camera, motion, calendar, and notification permissions can be changed in iOS Settings.</p>
        </section>

        <section>
          <h2>Analytics, diagnostics, and identifiers</h2>
          <p>Live Orbit uses Firebase Analytics, Firebase Crashlytics, Firebase Performance Monitoring, and Apple MetricKit for analytics, crash reporting, performance monitoring, non-fatal error reporting, and technical diagnostics.</p>
          <p>These services may collect product interaction data, crash data, performance data, app logs, app instance identifiers, installation identifiers, device or app identifiers, OS and device information, network performance, launch performance, screen or feature usage, and other technical diagnostics.</p>
          <p>We use this information for analytics and app functionality, including understanding reliability, startup readiness, catalog loading, search latency, pass calculation, AR/Sky Mode preparation, crashes, non-fatal errors, and performance problems.</p>
          <p>Because Live Orbit has no account system, reviewed app code does not link Firebase device or app instance identifiers to a named Live Orbit account. Firebase or other service providers may still process identifiers as described in their own terms and privacy documentation.</p>
          <p>Reviewed app code does not use product interaction data, device identifiers, crash data, or performance data for tracking across apps or websites owned by other companies.</p>
        </section>

        <section>
          <h2>Subscriptions and purchases</h2>
          <p>Live Orbit Pro purchases are handled by Apple StoreKit through the App Store. Apple processes App Store payments, purchase confirmations, subscription status, billing periods, taxes, trials, cancellations, and refunds under Apple&apos;s policies and applicable law.</p>
          <p>Live Orbit may process Apple-provided product, transaction, purchase history, subscription state, entitlement, and restore-purchase information to provide Pro access, restore purchases, prevent purchase errors, and support subscription functionality.</p>
          <p>Apps Made Better LLC does not receive your full payment card number from Apple and does not process App Store payments or refunds directly.</p>
        </section>

        <section>
          <h2>Backend, APIs, and AI-assisted features</h2>
          <p>Live Orbit uses Cloudflare and API backend services for catalog data, snapshots, ephemeris data, insights, Orbit Intelligence, legal pages, app status, security, caching, and reliability.</p>
          <p>Backend requests may include normal request metadata such as IP address, request time, endpoint, headers, app version, device or app context, requested satellite or object identifiers, and other data needed to provide the requested feature.</p>
          <p>Orbit Intelligence is an AI-assisted informational feature. It may use OpenAI or other AI-assisted backend services to generate or refine satellite, launch, space, news, or source-backed summaries. Requests may include satellite identifiers, source snippets, selected context, app or backend context, and related feature data needed to respond.</p>
          <p>AI-assisted content may be incomplete, inaccurate, or outdated. It is not for navigation, safety, satellite operations, collision avoidance, emergency use, or professional reliance.</p>
        </section>

        <section>
          <h2>Local app data</h2>
          <p>Favorites, watchlists, recent searches, pass alerts, launch alerts, observing sessions, display preferences, notification preferences, language settings, AR/Sky safety acknowledgement, and caches are generally stored locally on your device.</p>
          <p>The app includes controls to clear temporary cached data and broader local app data. Clearing local data on your device does not delete Apple purchase records or support emails, privacy requests, diagnostics, analytics, crash reports, performance reports, or backend logs already sent off the device.</p>
        </section>

        <section>
          <h2>App Store privacy data categories</h2>
          <p>Based on the reviewed app facts, Live Orbit&apos;s App Store privacy disclosures should not say that no data is collected. The likely disclosed categories include:</p>
          <ul>
            <li><strong>Email address:</strong> optional support, privacy, or data deletion contact. Used for app functionality and customer support. Linked to identity when provided. Not used for tracking.</li>
            <li><strong>Precise location:</strong> used for app functionality such as observer position, pass calculations, alerts, AR/Sky Mode, weather or sky context, and related feature requests. Not used for advertising or tracking in reviewed app code.</li>
            <li><strong>Customer support:</strong> issue text, optional email, request context, and optional diagnostics. Used for app functionality and customer support. May be linked to identity when submitted.</li>
            <li><strong>Device identifiers:</strong> Firebase, app instance, installation, or similar identifiers used for analytics, crash reporting, diagnostics, and performance monitoring. Reviewed app code does not link these identifiers to a Live Orbit account because there are no accounts.</li>
            <li><strong>Purchase history:</strong> Apple StoreKit product, transaction, subscription, restore, and entitlement state. Used for app functionality.</li>
            <li><strong>Product interaction:</strong> analytics events such as app opens, screen opens, feature use, search opened, passes opened, AR/Sky Mode opened, support opened, and similar usage signals. Used for analytics and app improvement. Not used for tracking in reviewed app code.</li>
            <li><strong>Crash data, performance data, and diagnostics:</strong> Firebase Crashlytics, Firebase Performance Monitoring, MetricKit summaries, non-fatal errors, app logs, launch and network performance, and technical diagnostics. Used for app functionality, reliability, crash troubleshooting, and performance troubleshooting.</li>
          </ul>
        </section>

        <section>
          <h2>Retention and deletion</h2>
          <p>We retain information as long as reasonably necessary to provide Live Orbit, maintain subscriptions and diagnostics, respond to support or privacy requests, secure services, comply with law, and improve reliability.</p>
          <p>For no-account local data, use in-app Settings controls to clear caches or broader local app data on your device. For support emails, diagnostics, privacy requests, or data already sent, contact <a href="mailto:founder@appsmadebetter.com">founder@appsmadebetter.com</a>.</p>
          <p>Specific retention periods for Firebase, Cloudflare/backend logs, API caches, OpenAI or other AI-provider settings, support emails, diagnostics, and third-party providers require owner and attorney confirmation.</p>
        </section>

        <section>
          <h2>Children and international users</h2>
          <p>Live Orbit is not intended for children under 13. If Live Orbit is later directed to children under 13 or knowingly collects data from them, it needs a separate COPPA and children&apos;s privacy review before launch or release.</p>
          <p>Live Orbit may be used worldwide. Data may be processed in the United States and in service-provider regions. GDPR, UK GDPR, California privacy law, Texas privacy law, and other international privacy obligations require review by a licensed attorney.</p>
        </section>

        <section>
          <h2>Attorney and owner review</h2>
          <p>This policy is a product privacy notice, not legal advice. Apps Made Better LLC should have this policy reviewed by a licensed attorney before launch, especially for privacy-law coverage, children&apos;s privacy, international users, subscriptions and refunds, AI disclosures, data-source licensing, retention, and deletion procedures.</p>
        </section>
      </article>
    </>
  );
}
