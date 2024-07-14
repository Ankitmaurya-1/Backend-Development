const express = require('express');
const app = express();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const userModel = require("./models/user");
const postModel = require("./models/post");

// Middleware to parse JSON request bodies
app.set('view engine', 'ejs');
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

mongoose.connect('mongodb://127.0.0.1:27017/miniproject');

app.get('/', (req, res) => {
    res.render('index');
});

app.get('/like/:id', isLoggedIn, async (req, res) => {
    let post = await postModel.findOne({ _id: req.params.id }).populate('user');
    if (post.likes.indexOf(req.user.userid) === -1) {
        post.likes.push(req.user.userid);
    } else {
        post.likes.splice(post.likes.indexOf(req.user.userid), 1);
    }
    await post.save();
    res.redirect('/profile');
});

app.get('/profile', isLoggedIn, async (req, res) => {
    let user = await userModel.findOne({ email: req.user.email }).populate("posts");
    res.render('profile', { user });
});

app.post('/post', isLoggedIn, async (req, res) => {
    let user = await userModel.findOne({ email: req.user.email });

    let post = await postModel.create({
        user: user._id,
        content: req.body.content,
    });

    user.posts.push(post._id);
    await user.save();
    res.redirect('/profile');
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
            res.redirect("/profile");
        });
    });
});

app.post('/login', async (req, res) => {
    let { email, password } = req.body;
    let user = await userModel.findOne({ email });
    if (!user) {
        return res.status(400).send('Something is wrong');
    }

    bcrypt.compare(password, user.password, (err, result) => {
        if (result) {
            let token = jwt.sign({ email: email, userid: user._id }, "token");
            res.cookie("token", token);
            res.redirect('/profile');
        } else {
            res.status(400).send('Something is wrong');
        }
    });
});

app.get('/logout', (req, res) => {
    res.clearCookie("token");
    res.redirect('/login');
});

app.post('/delete-post/:id', isLoggedIn, async (req, res) => {
    let postId = req.params.id;
    let user = await userModel.findOne({ email: req.user.email });

    // Remove the post from the user's posts array
    user.posts.pull(postId);
    await user.save();

    // Delete the post from the posts collection
    await postModel.findByIdAndDelete(postId);

    res.redirect('/profile');
});

function isLoggedIn(req, res, next) {
    let token = req.cookies.token;
    if (!token) return res.redirect('/login');
    else {
        let data = jwt.verify(token, "token");
        req.user = data;
    }
    next();
}

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
