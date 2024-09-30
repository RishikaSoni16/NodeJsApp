import sqlite3 from 'sqlite3';

const db = new sqlite3.Database('db_web.db', (err) => {
    if (err) {
        console.error(err.message);
    }
});

db.serialize(() => {
    db.run("DROP TABLE IF EXISTS items");
    db.run(`CREATE TABLE items (
        ID INTEGER PRIMARY KEY AUTOINCREMENT,
        INAME TEXT,
        QUANTITY TEXT
    )`);
});

db.close();
