# Live Orbit analytics events

Use anonymous IDs only. Do not send names, emails, phone numbers, precise addresses, auth tokens, or raw location coordinates.

Every app event should include:

- `event_name`
- `source`: `app`
- `platform`: `ios`
- `app_version`
- `anonymous_id`: stable anonymous install ID
- `session_id`: app launch/session ID
- `feature`
- `target_type`
- `target_id`
- `target_name`
- `metadata`: small, sanitized context

## Core app events

```text
app.opened
app.backgrounded
app.foregrounded
app.data_refresh.started
app.data_refresh.completed
app.data_refresh.failed
```

## Satellite and map

```text
app.satellite.opened
app.satellite.closed
app.satellite.shared
app.satellite.favorite_added
app.satellite.favorite_removed
app.satellite.note_added
app.satellite.note_updated
app.map.filter_opened
app.map.filter_changed
app.map.index_changed
app.map.globe_rotated
app.map.time_mode_started
app.map.time_mode_changed
app.map.time_mode_live_returned
```

## Search

```text
app.search.opened
app.search.submitted
app.search.result_opened
app.search.empty_result
```

## Passes

```text
app.pass.search_started
app.pass.search_completed
app.pass.opened
app.pass.shared
app.pass.notification_set
app.pass.notification_removed
```

## Sky and AR

```text
app.sky.opened
app.sky.focused_satellite
app.sky.satellite_tapped
app.sky.closed
app.ar.opened
app.ar.satellite_found
app.ar.direction_hint_used
app.ar.closed
```

## News and launches

```text
app.news.opened
app.news.filter_changed
app.article.opened
app.article.shared
app.launch.opened
app.launch.shared
app.reentry.opened
```

## Insights and settings

```text
app.insights.opened
app.insights.breakdown_opened
app.insights.trend_opened
app.settings.opened
app.settings.changed
app.help.article_opened
app.support.contact_opened
```

## Suggested metadata

Satellite:

```json
{
  "orbit_class": "LEO",
  "object_type": "payload",
  "source": "space-track",
  "is_above_horizon": true
}
```

Search:

```json
{
  "query_length": 27,
  "result_count": 1,
  "matched_alias": "international space station"
}
```

Passes:

```json
{
  "peak_elevation": 74,
  "duration_seconds": 665,
  "visible": true
}
```

Do not send raw user location. If needed, send broad status only:

```json
{
  "location_mode": "current",
  "permission_state": "authorized"
}
```
