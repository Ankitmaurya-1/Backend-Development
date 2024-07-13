const express = require('express');
const app = express();
const userModel = require('./models/user');
const postModel = require('./models/post');



app.get("/", (req, res) => {
    res.send("Hello, World!");
});
app.get("/create", async (req, res) => {
    let user = await userModel.create({
        age: 17,
        email: 'ankit@example.com',
        username: 'Ankit'
    });
    res.send(user);
});
app.get("/post/create", async (req, res) => {
    let post = await postModel.create({
        postdata: "Hello Everyone this is post data",
        user: "6691e59a464ab116cb698827"
    });

    let user = await userModel.findOne({ _id: "6691e59a464ab116cb698827" });
    user.posts.push(post._id);
    await user.save();
    res.send(post, user);
});

app.listen(3000, () => {
    console.log("Server is running on port 3000");
});