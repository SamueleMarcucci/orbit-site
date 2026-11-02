import { events, contentDigest } from "../.generated/events-data.ts";
import { createHandler } from "./handler.ts";
import { notificationURLs, notifyIndexNow } from "./indexnow.ts";

const handle = createHandler(events, { revision: contentDigest });
export default {
  fetch: handle,
  async scheduled(controller) {
    // Search notification only. Publication never depends on cron delivery.
    const result = await notifyIndexNow(notificationURLs(events, controller.scheduledTime));
    if (result.urls.length) console.info(JSON.stringify({ kind: "events-indexnow", scheduledTimeUTC: new Date(controller.scheduledTime).toISOString(), ...result }));
  },
} satisfies ExportedHandler<Env>;
