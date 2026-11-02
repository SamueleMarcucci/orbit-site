import { events, contentDigest } from "../.generated/events-data.ts";
import { createHandler } from "./handler.ts";
import { INDEXNOW_ORIGIN_KEY_URL, notificationURLs, notifyIndexNow } from "./indexnow.ts";

const handle = createHandler(events, { revision: contentDigest });
export default {
  fetch: handle,
  async scheduled(controller) {
    // Search notification only. Publication never depends on cron delivery.
    // Same-zone fetches can bypass Worker routes. Read the key from the same
    // explicit GitHub origin used by the proxy; IndexNow still verifies SITE.
    const result = await notifyIndexNow(notificationURLs(events, controller.scheduledTime), fetch, INDEXNOW_ORIGIN_KEY_URL);
    if (result.urls.length) console.info(JSON.stringify({ kind: "events-indexnow", scheduledTimeUTC: new Date(controller.scheduledTime).toISOString(), ...result }));
  },
} satisfies ExportedHandler<Env>;
