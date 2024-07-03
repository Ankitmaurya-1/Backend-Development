const express = require('express');
const app = express();
const path = require('path');

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, "public")));

// Routes
app.get('/', (req, res) => {
    res.render('index');
});
app.get('/profile/:username', (req, res) => {

    res.send(`Hello ${req.params.username} How are you`);
});





// server
app.listen(3000, (req, res) => {
    console.log("Server listening on 3000");
});