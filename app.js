import express from 'express';
import sqlite3 from 'sqlite3';
import bodyParser from 'body-parser';

const app = express();

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));

// Database connection
function getDbConnection() {
    return new sqlite3.Database('db_web.db', (err) => {
        if (err) {
            console.error(err.message);
        }
    });
}

// Routes
app.get('/', (req, res) => {
    const db = getDbConnection();
    db.all('SELECT * FROM items', [], (err, rows) => {
        if (err) {
            throw err;
        }
        res.render('index', { datas: rows });
    });
    db.close();
});

app.get('/add_item', (req, res) => {
    res.render('add_item');
});

app.post('/add_item', (req, res) => {
    const { iname, quantity } = req.body;
    const db = getDbConnection();
    db.run('INSERT INTO items (INAME, QUANTITY) VALUES (?, ?)', [iname, quantity], (err) => {
        if (err) {
            throw err;
        }
        res.redirect('/');
    });
    db.close();
});

app.get('/edit_item/:id', (req, res) => {
    const db = getDbConnection();
    db.get('SELECT * FROM items WHERE ID = ?', [req.params.id], (err, row) => {
        if (err) {
            throw err;
        }
        res.render('edit_item', { datas: row });
    });
    db.close();
});

app.post('/edit_item/:id', (req, res) => {
    const { iname, quantity } = req.body;
    const db = getDbConnection();
    db.run('UPDATE items SET INAME = ?, QUANTITY = ? WHERE ID = ?', [iname, quantity, req.params.id], (err) => {
        if (err) {
            throw err;
        }
        res.redirect('/');
    });
    db.close();
});

app.get('/delete_item/:id', (req, res) => {
    const db = getDbConnection();
    db.run('DELETE FROM items WHERE ID = ?', [req.params.id], (err) => {
        if (err) {
            throw err;
        }
        res.redirect('/');
    });
    db.close();
});

// Run the server
app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});
