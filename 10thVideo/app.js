const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
const path = require('path');
const userModel = require('./models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { Result } = require('postcss');



app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.render('index');
});

app.post('/create', (req, res) => {
    let { username, password, email, age } = req.body;

    bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(password, salt, async (err, hash) => {
            let createdUser = await userModel.create({
                username,
                password: hash,
                email,
                age
            });

            let token = jwt.sign({ email }, "token");
            res.cookie('token', token,);

            res.send(createdUser);
        });
    });
});
app.get('/login', (req, res) => {
    res.render('login');
});
app.post('/login', async (req, res) => {
    let user = await userModel.findOne({ email: req.body.email });
    if (!user) return res.send("Something is wrong");


    bcrypt.compare(req.body.password, user.password, (err, result) => {
        if (result) {
            let token = jwt.sign({ email: user.email }, "token");
            res.cookie('token', token,);
            return res.send("You are now logged in");
        } else { res.send("something is wrong"); }
    });

});

app.get('/logout', (req, res) => {
    res.cookie('token', "");
    res.redirect('/');
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});