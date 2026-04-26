const Database = require('better-sqlite3');
const db = new Database('tmp/db.sqlite3');

try {
  const insert = db.prepare('INSERT OR REPLACE INTO students (nisn, name, class, major_code, status, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?)');
  insert.run('0061112221', 'Ahmad Faisal', 'XII RPL 1', 'RPL', 'Lulus', new Date().toISOString(), new Date().toISOString());
  console.log('Inserted student Ahmad Faisal');
} catch (err) {
  console.error(err);
} finally {
  db.close();
}
