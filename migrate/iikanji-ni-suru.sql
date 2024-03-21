-- CAUTION 開発用なのでバックアップはしません

-- 一時テーブルの作成
CREATE TABLE IF NOT EXISTS temp_entraid_info (
	client_id TEXT NOT NULL,
	authority TEXT NOT NULL UNIQUE,
	created_at TIMESTAMP DEFAULT (datetime(CURRENT_TIMESTAMP,'localtime')),
	updated_at TIMESTAMP DEFAULT (datetime(CURRENT_TIMESTAMP,'localtime'))
);

-- 既存のデータを一時テーブルに移行
INSERT INTO temp_entraid_info (client_id, authority)
SELECT client_id, authority
FROM entraid_info;

-- 既存のテーブルを削除
DROP TABLE entraid_info;

-- 一時テーブルの名前を変更
ALTER TABLE temp_entraid_info RENAME TO entraid_info;
