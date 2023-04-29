const mysql = require('mysql');


var mysqlConnection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'cinelit',
    multipleStatements: true
});

mysqlConnection.connect((err) => {
    if (!err)
        console.log('Connection Established Successfully');
    else
        console.log('Connection Failed!' + JSON.stringify(err, undefined, 2));
});


exports.search_movies = (req, res) => {
    const search_query = req.body.search_query;
    mysqlConnection.query('SELECT * FROM movies WHERE title LIKE ?', ['%' + search_query + '%'], (err, rows, fields) => {
        if (rows.length > 0) {
            return res.status(200).json({ result: rows });
        }
        else {
            return res.status(404).json({ result: "Result not found" });
        }
    });
}

exports.search_books = (req, res) => {
    const search_query = req.body.search_query;
    mysqlConnection.query('SELECT * FROM books WHERE title LIKE ?', ['%' + search_query + '%'], (err, rows, fields) => {
        if (rows.length > 0) {
            return res.status(200).json({ result: rows });
        }
        else {
            return res.status(404).json({ result: "Result not found" });
        }
    });
}

exports.get_followers = (req, res) => {
    const user_id = req.body.user_id;
    mysqlConnection.query('SELECT * FROM follower WHERE follower_id = ?', [user_id], (err, rows, fields) => {
        if (rows.length > 0) {
            return res.status(200).json({ result: rows, counts: rows.length });
        }
        else {
            return res.status(404).json({ result: "Result not found" });
        }
    });
}

exports.get_following = (req, res) => {
    const user_id = req.body.user_id;
    mysqlConnection.query('SELECT * FROM follower WHERE following_id = ?', [user_id], (err, rows, fields) => {
        if (rows.length > 0) {
            return res.status(200).json({ result: rows, counts: rows.length });
        }
        else {
            return res.status(404).json({ result: "Result not found" });
        }
    });
}

exports.get_joined_groups = (req, res) => {
    const user_id = req.body.user_id;
    mysqlConnection.query('SELECT * FROM group_members WHERE user_id = ?', [user_id], (err, rows, fields) => {
        if (rows.length > 0) {
            return res.status(200).json({ result: rows, counts: rows.length });
        }
        else {
            return res.status(404).json({ result: "Result not found" });
        }
    });
}

