const Database = require('better-sqlite3');
const db = new Database('tmp/db.sqlite3');

try {
  const settings = db.prepare('SELECT * FROM settings').all();
  console.log('Settings:', settings);
} catch (err) {
  console.error(err);
} finally {
  db.close();
}
