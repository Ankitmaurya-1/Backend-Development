const express = require('express');
const app = express();
const userModel = require('./userModel');


app.get('/', (req, res) => {
    res.send('Hello, World!');
});

app.get('/create', async (req, res) => {
    let createdUser = await userModel.create({
        name: 'John Doe',
        email: 'johndoe@example.com',
        username: 'password#$%%'
    });
    res.send(createdUser);
});

app.get('/update', async (req, res) => {

    let updatedUser = await userModel.findOneAndUpdate(
        { email: 'johndoe@example.com' }, { name: "Ankit" }, { new: true }
    );
    res.send(updatedUser);
});
app.get('/read', async (req, res) => {

    let user = await userModel.find();
    res.send(user);
});

app.get('/delete', async (req, res) => {
    let deletedUser = await userModel.findOneAndDelete({ name: "John Doe" });
    res.send(deletedUser);

});

app.listen(3000, (req, res) => {
    console.log('Server is running on port 3000');
});