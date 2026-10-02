CREATE TABLE IF NOT EXISTS blobs (
  store TEXT NOT NULL,
  key   TEXT NOT NULL,
  value TEXT NOT NULL,
  etag  TEXT NOT NULL,
  PRIMARY KEY (store, key)
);
