const Database = require('better-sqlite3');
const db = new Database('tmp/db.sqlite3');

try {
  const students = db.prepare('SELECT * FROM students').all();
  console.log('Students:', students);
} catch (err) {
  console.error(err);
} finally {
  db.close();
}
