CREATE TABLE dzikr (
  id INTEGER PRIMARY KEY,
  arabic TEXT NOT NULL,
  latin TEXT,
  translation TEXT NOT NULL,
  source TEXT,
  count INTEGER NOT NULL,
  category TEXT NOT NULL,
  description TEXT,
  note TEXT
);
