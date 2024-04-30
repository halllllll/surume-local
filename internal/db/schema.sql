-- schema.sql
PRAGMA foreign_keys=true;

CREATE TABLE IF NOT EXISTS entraid_info (
	client_id TEXT NOT NULL,
	authority TEXT NOT NULL UNIQUE,
	localhost_port INTEGER NOT NULL,
	created_at TIMESTAMP DEFAULT (datetime(CURRENT_TIMESTAMP,'localtime')),
	updated_at TIMESTAMP DEFAULT (datetime(CURRENT_TIMESTAMP,'localtime'))
);

CREATE TRIGGER IF NOT EXISTS update_lasttime AFTER UPDATE ON entraid_info
BEGIN
	UPDATE entraid_info SET updated_at = CURRENT_TIMESTAMP;
END;

CREATE TABLE IF NOT EXISTS system (
	app_name TEXT NOT NULL,
	version_major INTEGER NOT NULL,
	version_minor INTEGER NOT NULL
);

-- autoincrementは不要
CREATE TABLE IF NOT EXISTS user (
	user_id TEXT PRIMARY KEY NOT NULL UNIQUE
);

-- folder id (in ms world called "driveitem")
CREATE TABLE IF NOT EXISTS folder_id (
	account_id TEXT NOT NULL,
	folder_id TEXT NOT NULL UNIQUE,
	folder_name TEXT NOT NULL,
	site_id TEXT NOT NULL,
	FOREIGN KEY(account_id) REFERENCES user(user_id)
);

-- fireのみ履歴
CREATE TABLE IF NOT EXISTS fire_history (
	account_id TEXT REFERENCES user(user_id) ON UPDATE CASCADE,
	send_to TEXT NOT NULL,
	success INTEGER(1),
	url TEXT,
	at TIMESTAMP DEFAULT (datetime(CURRENT_TIMESTAMP,'localtime'))
);