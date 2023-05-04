const express = require("express");
const http = require('http');
const app = express();
// const serverles = require("serverless-http");
const cors = require('cors');
const bodyParser = require("body-parser");
const routes = require("./app/routes/routes");

app.use(express.static('./app/uploads/'));

app.use('/images', express.static('./app/uploads/'));

app.use(
    bodyParser.urlencoded({
        extended: false
    })
);
app.use(bodyParser.json());

var corsOptions = {
    origin: "*"
}
app.use(cors(corsOptions));
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use(routes);


const PORT = 8000;
const server = http.createServer(app);
server.listen(PORT, () => console.log(`Server runnung at port ${PORT}`));
// app.listen(PORT, () => console.log(`Server Running at port ${PORT}`));

// module.exports = app
// module.exports.handler = serverles(app);