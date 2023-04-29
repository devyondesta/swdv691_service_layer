const express = require("express");
const http = require('http');
const app = express();
const cors = require('cors');
const bodyParser = require("body-parser");
const routes = require("./app/routes/routes")

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
app.listen(PORT, () => console.log(`Server Running at port ${PORT}`));
