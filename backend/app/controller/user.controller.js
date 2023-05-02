const mysql = require('mysql');
const multer = require('multer')
const sharp = require('sharp')
var randomstring = require("randomstring");

const upload_group = multer({ limits: { fileSize: 4000000 } }).single('image');

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

exports.get_groups = (req, res) => {
    mysqlConnection.query('SELECT * FROM groups', [true],(err, rows, fields) => {
        console.log(err);
        // if (rows.length > 0) {
        //     return res.status(200).json({ result: rows });
        // }
        // else {
        //     return res.status(404).json({ result: "Result not found" });
        // }
    });
}


exports.get_movies = (req, res) => {
    mysqlConnection.query('SELECT * FROM movies', (err, rows, fields) => {
        if (rows.length > 0) {
            return res.status(200).json({ result: rows });
        }
        else {
            return res.status(404).json({ result: "Result not found" });
        }
    });
}

exports.get_books = (req, res) => {
    mysqlConnection.query('SELECT * FROM books', (err, rows, fields) => {
        if (rows.length > 0) {
            return res.status(200).json({ result: rows });
        }
        else {
            return res.status(404).json({ result: "Result not found" });
        }
    });
}

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


exports.create_group = (req, res) => {
    upload_group(req, res, async function (err) {
        if (err || req.file === undefined) {
            console.log(err)
            res.send("File size is too large")
        } else {
            var group_id = req.body.group_id;
            mysqlConnection.query('SELECT * FROM groups WHERE group_id = ?', [group_id], async (err, rows, fields) => {
                console.log(err);
                if (err) {
                    return res.status(404).json({ groupExist: "Group ID already exist" });
                }
                else {
                    let fileName = randomstring.generate(10) + ".jpeg"
                    var image = await sharp(req.file.buffer)
                        .jpeg({
                            quality: 40,
                        }).toFile('./app/uploads/' + fileName)
                        .catch(err => { console.log('error: ', err) });
                    console.log(fileName);
                    let stmt = `INSERT INTO groups(group_id,group_name,image) VALUES(?,?,?)`;
                    let data = [req.body.group_id, req.body.group_name, fileName];

                    mysqlConnection.query(stmt, data, (err, results, fields) => {
                        if (err) {
                            return console.error(err.message);
                        }
                        console.log('Insert Id:' + results.insertId);
                    });

                    return res.status(200).json({ success: "Group created successfully" });
                }
            });
        }
    });
}

exports.get_followers = (req, res) => {
    const user_id = req.body.user_id;
    mysqlConnection.query('SELECT * FROM follower WHERE follower_id = ?', [user_id], (err, rows, fields) => {
        return res.status(200).json({ result: rows, counts: rows.length });
    });
}

exports.get_following = (req, res) => {
    const user_id = req.body.user_id;
    mysqlConnection.query('SELECT * FROM follower WHERE following_id = ?', [user_id], (err, rows, fields) => {
        return res.status(200).json({ result: rows, counts: rows.length });
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

