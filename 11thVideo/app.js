const express = require('express');
const app = express();
const userModel = require('./models/user');
const postModel = require('./models/post');

// Middleware to parse JSON requests


// Routes 
app.get('/', (req, res) => {
    res.send('Hello, World!');
});
app.get('/create', async (req, res) => {
    let user = await userModel.create({
        username: "Ankit",
        age: 17,
        email: "ankit@example.com"
    });
    res.send(user);
});

app.get('/post/create', async (req, res) => {
    let post = await postModel.create({
        postdata: "Hello world this is a post data!",
        user: "668e8ab73650261b497129be"
    });

    let user = await userModel.findOne({ _id: "668e8ab73650261b497129be" });
    user.posts.push(post._id);
    await user.save();


    res.send({ post, user });
});

app.listen(3000, (req, res) => { console.log('listening on port 3000'); });