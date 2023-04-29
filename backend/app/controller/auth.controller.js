const jwt = require('jsonwebtoken');
const mysql = require('mysql');
const authJWT = require('../middleware/authJWT')

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


exports.register = (req, res) => {
    console.log(req.body);
    mysqlConnection.query('SELECT * FROM users WHERE email = ?', [req.body.email], (err, rows, fields) => {
        if (rows.length > 0) {
            return res.status(404).json({ emailnotfound: "Email already exist" });
        }
        else {
            let stmt = `INSERT INTO users(username,email,password,bio) VALUES(?,?,?,?)`;
            let data = [req.body.username, req.body.email, req.body.password, req.body.bio];

            mysqlConnection.query(stmt, data, (err, results, fields) => {
                if (err) {
                    return console.error(err.message);
                }
                console.log('Insert Id:' + results.insertId);
            });

            return res.status(200).json({ success: "Registered successfully" });
        }
    });

}

exports.login = (req, res) => {
    mysqlConnection.query('SELECT * FROM users WHERE email = ? and password = ?', [req.body.email, req.body.password], (err, rows, fields) => {
        if (rows.length > 0) {
            let token = jwt.sign({
                user_id: rows[0].id,
                email: rows[0].email,
                username: rows[0].username,
                profile: rows[0].profile,
                bio: rows[0].bio
            }, 'secret');
            return res.status(200).json({ token: token });
        }
        else {
            return res.status(404).json({ emailnotfound: "Email not found" });
        }
    });
}

exports.verify = (req, res) => {
    const authResponse = authJWT(req, res);
    if (authResponse.login) {
        res.status(200).json({ success: "Authorized user", access: true, data: authResponse.data });
    } else {
        res.status(404).json({ error: "Unauthorized user", access: false });
    }
}