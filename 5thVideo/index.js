const express = require('express');
const path = require('path');
const app = express();
const fs = require('fs');
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';



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
        console.log('The file has been saved!');
        res.redirect('/');
    });

});

app.listen(3000, (req, res) => {
    console.log("Server listening on 3000");
});