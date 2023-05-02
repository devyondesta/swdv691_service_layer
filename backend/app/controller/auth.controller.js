const jwt = require('jsonwebtoken');
const mysql = require('mysql');
const authJWT = require('../middleware/authJWT')
const multer = require('multer')
const sharp = require('sharp')
var randomstring = require("randomstring");

const upload = multer({ limits: { fileSize: 4000000 } }).single('profile')

var mysqlConnection = mysql.createConnection({
    host: 'sql9.freemysqlhosting.net',
    user: 'sql9615594',
    password: 'tc5hfpHlTT',
    database: 'sql9615594',
    multipleStatements: true
});

mysqlConnection.connect((err) => {
    if (!err)
        console.log('Connection Established Successfully');
    else
        console.log('Connection Failed!' + JSON.stringify(err, undefined, 2));
});


exports.register = (req, res) => {
    upload(req, res, async function (err) {
        if (err || req.file === undefined) {
            console.log(err)
            res.send("File size is too large")
        } else {
            mysqlConnection.query('SELECT * FROM users WHERE email = ?', [req.body.email], async (err, rows, fields) => {
                if (rows.length > 0) {
                    return res.status(404).json({ emailExist: "Email already exist" });
                }
                else {
                    let fileName = randomstring.generate(10) + ".jpeg"
                    var image = await sharp(req.file.buffer)
                        .jpeg({
                            quality: 40,
                        }).toFile('./app/uploads/' + fileName)
                        .catch(err => { console.log('error: ', err) });
                    console.log(fileName);
                    let stmt = `INSERT INTO users(username,email,password,profile_image,bio) VALUES(?,?,?,?,?)`;
                    let data = [req.body.username, req.body.email, req.body.password, fileName, req.body.bio];

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
    });

}

exports.login = (req, res) => {
    mysqlConnection.query('SELECT * FROM users WHERE email = ? and password = ?', [req.body.email, req.body.password], (err, rows, fields) => {
        if (rows.length > 0) {
            let token = jwt.sign({
                user_id: rows[0].id,
                email: rows[0].email,
                username: rows[0].username,
                profile_image: rows[0].profile_image,
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
