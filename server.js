require('dotenv').config();
const http = require("http");
const path = require("path");
const uuid = require("uuid/v4");
const fileUpload = require("express-fileupload");
const fs = require("fs");
const express = require('express');
const app = express();
const server = http.createServer(app);
const port = process.env.PORT;

app.use(express.static('data'));

app.use(fileUpload({
    limits: { fileSize: 50 * 1024 * 1024 }
}));

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', process.env.ACCESS_ORIGINS);
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Cache-Control');
    next();
});

app.post('/demos-api/media/upload', (req, res) => {
    const file = req.files.file;
    const filenameParts = file.name.split('.');
    const extension = filenameParts.pop();
    const filename = filenameParts.join('.');
    const path = uuid() + '.' + extension;

    file.mv('./data/uploads/' + path, function(err) {
        if (err) {
            return res.status(500).send(err);
        }

        res.json({
            status: 'success',
            filename,
            url: process.env.MEDIA_URL + path
        });
    });
});

server.listen(port, () => console.log(`Example app listening on port ${port}!`));







