const express = require('express');
const path = require('path');
const app = express();
const fs = require('fs');
const { render } = require('ejs');
const { log } = require('console');





app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    fs.readdir(`./files`, (err, files) => {
        res.render('index', { files: files });
    });

});
app.post('/create', (req, res) => {

    fs.writeFile(`./files/${req.body.title.split(' ').join('')}.txt`, req.body.details, (err) => {
        if (err) throw err;

        res.redirect('/');
    });

});
app.get('/file/:filename', (req, res) => {
    fs.readFile(`./files/${req.params.filename}`, "utf-8", (err, filedata) => {
        res.render("show", { filename: req.params.filename, filedata: filedata });
    });
});
app.get('/edit/:filename', (req, res) => {
    res.render("edit", { filename: req.params.filename });
});
app.post('/edit', (req, res) => {
    fs.rename(`./files/${req.body.previous}`, `./files/${req.body.new}`, (err) => {
        res.redirect('/');
    });
});
app.get('/delete/:filename', (req, res) => {
    fs.unlink(`./files/${req.params.filename}`, (err) => {
        if (err) throw err;

        res.redirect('/');
    });
});



app.listen(3000, (req, res) => {
    console.log("Server listening on 3000");
});