const express = require('express');
const app = express();


app.use((req, res, next) => {
    console.log("This is my first time of middleware");
    next();
});
app.use((req, res, next) => {
    console.log("This is my second time before about page of middleware");
    next();
});
app.get('/', (req, res) => {
    res.send('Hello, world!');
});
app.get('/about', (req, res, next) => {
    return next();
});

// error handling middleware
app.use((req, res, next) => {
    res.status(404).send('Page Not Found');
});

app.listen(3000, (req, res) => {
    console.log('Server is running on port 3000');  // Server is listening on port 3000
});

// express.js is a minimal and flexible Node.js web application framework that provides a robust set of features for web and mobile applications. It is designed to be flexible, modular, and easy to extend.