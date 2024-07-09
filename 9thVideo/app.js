const express = require('express');
const app = express();
const jwt = require("jsonwebtoken");
const cookieParser = require('cookie-parser');

app.use(cookieParser());



app.get('/', function (req, res) {
    let token = jwt.sign({ email: "mail@ankit-dev.com" }, "secret-token");
    res.cookie('token', token);
    res.send('Jwt token set done !');
});

app.get('/about', (req, res) => {
    let data = jwt.verify(req.cookies.token, "secret-token");
    console.log(data);
});

app.listen(3000, (req, res) => {
    console.log('Server is running on port 3000');

});