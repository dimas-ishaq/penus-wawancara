const Database = require('better-sqlite3');
const db = new Database('tmp/db.sqlite3');

try {
  const info = db.prepare('PRAGMA table_info(students)').all();
  console.log('Students Table Info:', info);
} catch (err) {
  console.error(err);
} finally {
  db.close();
}
