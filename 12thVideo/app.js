const express = require('express');
const app = express();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const userModel = require("./models/user");
const postModel = require("./models/post");

// Middleware to parse JSON request bodies

app.set('view engine', 'ejs');
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());



app.get('/', (req, res) => {
    res.render('index');
});
app.get('/profile', isLoggedIn, (req, res) => {

});
app.get('/login', (req, res) => {
    res.render('login');
});
app.post('/register', async (req, res) => {
    let { email, password, username, name, age } = req.body;
    let user = await userModel.findOne({ email });
    if (user) {
        return res.status(400).send('Email already exists');
    }

    bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(password, salt, async (err, hash) => {
            let user = await userModel.create({
                username,
                password: hash,
                email,
                name,
                age
            });

            let token = jwt.sign({ email: email, userid: user._id }, "token");
            res.cookie("token", token);
            res.send("Registred");
        });
    });
});
app.post('/login', async (req, res) => {
    let { email, password } = req.body;
    let user = await userModel.findOne({ email });
    if (!user) {
        return res.status(400).send('something is wrong');
    }

    bcrypt.compare(password, user.password, (err, result) => {
        if (result) {
            let token = jwt.sign({ email: email, userid: user._id }, "token");
            res.cookie("token", token);
            res.send("Logged in");
        } else {
            res.status(400).send('something is wrong');
        }
    });
});

app.get('/logout', (req, res) => {
    res.clearCookie("token");
    res.redirect('/login');
});

function isLoggedIn(req, res, next) {
    let token = req.cookies.token;
    if (!token) return res.send('you must be logged in');
    else {

        res.send("you are now logged in");
    }
    next();
}

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});