CREATE TABLE IF NOT EXISTS analytics_sessions (
  session_id TEXT PRIMARY KEY,
  anonymous_id TEXT NOT NULL,
  first_seen_at TEXT NOT NULL,
  last_seen_at TEXT NOT NULL,
  event_count INTEGER NOT NULL DEFAULT 0,
  source TEXT,
  platform TEXT,
  app_version TEXT,
  country TEXT
);

CREATE TABLE IF NOT EXISTS analytics_events (
  id TEXT PRIMARY KEY,
  created_at TEXT NOT NULL,
  event_name TEXT NOT NULL,
  anonymous_id TEXT NOT NULL,
  session_id TEXT NOT NULL,
  page_path TEXT,
  page_title TEXT,
  referrer TEXT,
  source TEXT NOT NULL,
  platform TEXT NOT NULL,
  app_version TEXT,
  feature TEXT NOT NULL,
  target_type TEXT,
  target_id TEXT,
  target_name TEXT,
  metadata_json TEXT NOT NULL DEFAULT '{}',
  ip_hash TEXT,
  user_agent_hash TEXT,
  country TEXT
);

CREATE INDEX IF NOT EXISTS idx_events_created_at ON analytics_events(created_at);
CREATE INDEX IF NOT EXISTS idx_events_session_created ON analytics_events(session_id, created_at);
CREATE INDEX IF NOT EXISTS idx_events_anonymous_created ON analytics_events(anonymous_id, created_at);
CREATE INDEX IF NOT EXISTS idx_events_event_name_created ON analytics_events(event_name, created_at);
CREATE INDEX IF NOT EXISTS idx_events_target_created ON analytics_events(target_type, target_id, created_at);
CREATE INDEX IF NOT EXISTS idx_sessions_last_seen ON analytics_sessions(last_seen_at);
CREATE INDEX IF NOT EXISTS idx_sessions_anonymous ON analytics_sessions(anonymous_id);
