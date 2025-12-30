CREATE DATABASE IF NOT EXISTS my_notes_db;
USE my_notes_db;

CREATE TABLE IF NOT EXISTS notes (
    id VARCHAR(50) PRIMARY KEY,
    content TEXT,
    color VARCHAR(20),
    x INT,
    y INT,
    created_at DATETIME,
    updated_at DATETIME
);

CREATE TABLE IF NOT EXISTS editor_content (
    id INT PRIMARY KEY AUTO_INCREMENT,
    content LONGTEXT,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Insert initial row for editor content if not exists
INSERT INTO editor_content (id, content)
SELECT * FROM (SELECT 1, '') AS tmp
WHERE NOT EXISTS (
    SELECT id FROM editor_content WHERE id = 1
) LIMIT 1;
