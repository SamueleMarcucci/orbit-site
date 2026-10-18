import Link from 'next/link';
import { SatelliteVisibilityLab } from '@/components/satellite-visibility-lab';
import { breadcrumbJsonLd, canonical, JsonLd, pageMetadata } from '@/lib/seo';
import { site } from '@/lib/site';
import './visibility.css';

const path = '/tools/satellite-visibility/';
const nasaSource = 'https://www.nasa.gov/missions/station/spot-the-station-frequently-asked-questions/';
const heavensAboveSource = 'https://www.heavens-above.com/FAQ.aspx?alt=0&cul=en&lat=0&lng=0&loc=Unspecified&tz=UCT';

export const metadata = pageMetadata({
  title: 'Why Can’t I See a Satellite? Visibility Lab',
  description: 'Try three satellite spotting conditions: horizon, sunlight, and a dark observer sky. Learn why a satellite on a tracker may not be visible outside.',
  path,
});

export default function SatelliteVisibilityPage() {
  return <article className="guide-article visibility-page wrap">
    <JsonLd data={[
      breadcrumbJsonLd([{ name: 'Live Orbit', path: '/' }, { name: 'Satellite visibility lab', path }]),
      { '@type': 'WebPage', '@id': `${canonical(path)}#page`, url: canonical(path), name: 'Satellite visibility lab', description: 'An interactive illustration of three conditions that favor visual satellite observing.', isPartOf: { '@id': `${site.url}/#website` }, publisher: { '@id': 'https://appsmadebetter.com/#organization' }, citation: [nasaSource, heavensAboveSource] },
    ]} />
    <nav className="guide-breadcrumb" aria-label="Breadcrumb"><Link href="/">Live Orbit</Link><span aria-hidden="true">/</span><Link href="/guides/">Learning tools</Link></nav>
    <header>
      <p className="eyebrow">SATELLITE VISIBILITY LAB</p>
      <h1>On the tracker.<br />But can you see it?</h1>
      <p className="guide-summary">A satellite can pass above you without being visible. Explore three conditions that favor a sighting: a clear line above your horizon, sunlight reaching the satellite, and a dark enough sky where you are.</p>
      <p className="visibility-scope">A teaching illustration, not a pass prediction. No location, live orbital data, weather, or brightness measurements are used.</p>
    </header>
    <section className="visibility-interactive" aria-labelledby="try-title">
      <h2 id="try-title">What makes a visual pass possible?</h2>
      <SatelliteVisibilityLab />
    </section>
    <div className="guide-body">
      <section aria-labelledby="horizon-title"><h2 id="horizon-title">1. Above your horizon</h2><p>Your horizon is the edge of the sky you can see from your observing place. An orbit line on a globe may continue around Earth while the satellite is out of your line of sight. Even above the geometric horizon, trees, buildings, or hills can block the predicted path.</p><p>For an actual pass, check the start direction and the highest part of the path. Choose an observing spot with an open view in that direction.</p></section>
      <section aria-labelledby="sunlight-title"><h2 id="sunlight-title">2. Sunlight reaches the satellite</h2><p>Most visual satellite observing relies on reflected sunlight. You can be in twilight or darkness while a satellite high above you is still sunlit. That is why the hours after sunset or before sunrise often offer useful viewing opportunities.</p><p>A satellite can also enter Earth’s shadow partway through a pass and fade from view. A continuous calculated orbit does not mean a continuous visible streak across the sky.</p></section>
      <section aria-labelledby="darkness-title"><h2 id="darkness-title">3. Your sky gives it enough contrast</h2><p>A dark observer sky helps a small moving light stand out. Darkness is not a universal on/off threshold: particularly bright satellites can sometimes be seen in brighter twilight, and high-latitude summer viewing can differ from the usual dawn-or-dusk pattern.</p><p>Being above the horizon and sunlit is still not a brightness estimate. Distance, the object’s size and orientation, reflecting surfaces, and viewing angle can affect what you see. Cloud and glare add limits the diagram does not assess.</p></section>
      <section className="visibility-worksheet" aria-labelledby="worksheet-title"><h2 id="worksheet-title">Take the question outside</h2><p>Use a current local pass prediction, then write down what happened separately from what was predicted. A missed sighting is useful evidence when the time, direction, sky conditions, and uncertainties are recorded.</p><p><Link className="text-link" href="/guides/satellite-observing-checklist/">Open the printable observing worksheet <span aria-hidden="true">→</span></Link></p><p>The worksheet prints from your browser or saves as a PDF. Leave unavailable values blank and keep an uncertain or missed sighting in your notes.</p></section>
      <section className="guide-sources" aria-labelledby="sources-title"><h2 id="sources-title">Sources and scope</h2><p>Reviewed October 18, 2026 by <a href="https://appsmadebetter.com/">Apps Made Better LLC</a>, the publisher of Live Orbit. This model explains conditions, not a real orbit or an observing forecast.</p><ul><li><a href={nasaSource}>NASA: Spot the Station frequently asked questions</a> — reflected sunlight, pass timing, Earth’s shadow, and the local horizon.</li><li><a href={heavensAboveSource}>Heavens-Above: satellite prediction and brightness FAQ</a> — illumination, observer darkness, viewing exceptions, and brightness limits.</li></ul></section>
      <aside className="guide-next" aria-labelledby="next-title"><h2 id="next-title">Plan one real observing session</h2><Link href="/guides/how-to-see-iss/">How to see the International Space Station <span aria-hidden="true">→</span></Link><Link href="/guides/visible-satellite-passes/">Understand visible satellite passes <span aria-hidden="true">→</span></Link><Link href="/guides/identify-satellite-night-sky/">Investigate a moving light in the night sky <span aria-hidden="true">→</span></Link></aside>
      <div className="guide-download"><a className="download-button" href={site.appStoreUrl} data-analytics-event="app_store_cta_click" data-analytics-label="Visibility lab download">Explore Live Orbit on the App Store</a><p>Satellite tracking on iPhone and iPad. Free with in-app purchases. Predictions are estimates.</p></div>
    </div>
  </article>;
}
