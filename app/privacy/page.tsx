import type { Metadata } from "next";
import Link from "next/link";
export const metadata: Metadata = {
  title: "Privacy",
  description:
    "Live Orbit privacy policy for App Store privacy labels, location, analytics, diagnostics, support, purchases, identifiers, and local app data."
};

export default function PrivacyPage() {
  return (
    <article className="minimal-page">
      <header>
        <Link href="/">Live Orbit</Link>
        <h1>Privacy</h1>
        <p>Live Orbit is an iOS-only satellite watching app from Apps Made Better LLC. No account is required.</p>
      </header>

      <div className="minimal-ledger">
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
          <p>The App Store privacy label for Live Orbit lists nine collected data types: Email Address, Customer Support, Precise Location, Device ID, Purchase History, Product Interaction, Crash Data, Performance Data, and Other Diagnostic Data.</p>
          <p>The App Store privacy label lists Email Address and Customer Support as data linked to you when you provide them. It lists Location, Identifiers, Purchases, Usage Data, and Diagnostics as data not linked to you.</p>
          <p>Live Orbit does not use the listed data for third-party advertising, developer advertising, marketing, product personalization, or tracking.</p>
        </section>

        <section>
          <h2>Data linked to you</h2>
          <p>The following data may be collected and linked to your identity:</p>
          <ul>
            <li><strong>Email Address:</strong> collected only if you provide it for support, privacy, or data deletion requests. Used for app functionality, including responding to you and handling support or privacy requests.</li>
            <li><strong>Customer Support:</strong> support or privacy request text, optional email address, issue details, app or device context, and optional diagnostics you choose to include. Used for app functionality and customer support.</li>
          </ul>
        </section>

        <section>
          <h2>Data not linked to you</h2>
          <p>The following data may be collected but is not linked to your identity in Live Orbit&apos;s App Store privacy label:</p>
          <ul>
            <li><strong>Precise Location:</strong> used for app functionality, including observer position, pass calculations, AR and Sky Mode alignment, alerts, weather or sky context, and related feature requests.</li>
            <li><strong>Device ID:</strong> used for app functionality, including app reliability, diagnostics, crash reporting, performance monitoring, fraud prevention, security, and service operation.</li>
            <li><strong>Purchase History:</strong> used for app functionality, including StoreKit subscriptions, entitlement checks, restoring purchases, and Live Orbit Pro access.</li>
            <li><strong>Product Interaction:</strong> used for analytics, including understanding app opens, screen or feature use, search, passes, AR or Sky Mode, support entry points, and similar product usage signals.</li>
            <li><strong>Crash Data:</strong> used for app functionality, including crash troubleshooting, reliability, and quality improvement.</li>
            <li><strong>Performance Data:</strong> used for app functionality, including launch performance, network performance, feature performance, and reliability monitoring.</li>
            <li><strong>Other Diagnostic Data:</strong> used for app functionality, including non-fatal errors, app logs, diagnostics, and technical troubleshooting.</li>
          </ul>
        </section>

        <section>
          <h2>Information you provide</h2>
          <p>If you contact support or submit a privacy or data deletion request, we may receive your email address, message text, issue details, device or app context, and any diagnostics you choose to include.</p>
          <p>We use this information for app functionality, customer support, privacy request handling, troubleshooting, reliability, security, and legal compliance. An email address you provide for support or privacy requests is linked to your identity because it identifies how to reply to you.</p>
          <p>We do not use support email addresses or customer support submissions for third-party advertising, developer advertising, marketing email, product personalization, or tracking.</p>
        </section>

        <section>
          <h2>Location and permissions</h2>
          <p>Live Orbit may ask for precise location to calculate visible passes, observer position, local sky alignment, AR and Sky Mode pointing, weather or sky context, alerts, and other location-based satellite features.</p>
          <p>Camera access is used for AR views. Motion, compass, and device orientation data are used for AR and Sky Mode alignment. Calendar access is used only if you choose to save satellite pass events. Notifications are used for pass, launch, and major news alerts you choose to enable.</p>
          <p>Some location-based features may involve app or backend requests that include your location, approximate location, coordinates, observer context, or derived sky context when needed to provide the feature. Exact backend logging and retention for location-bearing requests requires owner and attorney confirmation.</p>
          <p>Live Orbit&apos;s App Store privacy label lists Precise Location as used for App Functionality and not linked to your identity. Location, camera, motion, calendar, and notification permissions can be changed in iOS Settings.</p>
        </section>

        <section>
          <h2>Analytics, diagnostics, and identifiers</h2>
          <p>Live Orbit uses Firebase Analytics, Firebase Crashlytics, Firebase Performance Monitoring, and Apple MetricKit for analytics, crash reporting, performance monitoring, non-fatal error reporting, and technical diagnostics.</p>
          <p>These services may collect product interaction data, crash data, performance data, app logs, app instance identifiers, installation identifiers, device or app identifiers, OS and device information, network performance, launch performance, screen or feature usage, and other technical diagnostics.</p>
          <p>Product Interaction is used for Analytics. Device ID, Crash Data, Performance Data, and Other Diagnostic Data are used for App Functionality. These categories are listed as not linked to your identity in Live Orbit&apos;s App Store privacy label.</p>
          <p>We do not use product interaction data, device identifiers, crash data, performance data, or other diagnostic data for tracking across apps or websites owned by other companies.</p>
        </section>

        <section>
          <h2>Subscriptions and purchases</h2>
          <p>Live Orbit Pro purchases are handled by Apple StoreKit through the App Store. Apple processes App Store payments, purchase confirmations, subscription status, billing periods, taxes, trials, cancellations, and refunds under Apple&apos;s policies and applicable law.</p>
          <p>Live Orbit may process Apple-provided product, transaction, purchase history, subscription state, entitlement, and restore-purchase information to provide Pro access, restore purchases, prevent purchase errors, and support subscription functionality.</p>
          <p>Purchase History is used for App Functionality and is listed as not linked to your identity in Live Orbit&apos;s App Store privacy label. Apps Made Better LLC does not receive your full payment card number from Apple and does not process App Store payments or refunds directly.</p>
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
          <h2>Tracking</h2>
          <p>Live Orbit&apos;s App Store privacy label says the listed data is not used for tracking. Live Orbit does not currently use IDFA, App Tracking Transparency prompts, third-party advertising SDKs, or in-app advertising.</p>
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
      </div>
    </article>
  );
}
