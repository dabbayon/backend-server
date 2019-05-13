var express = require('express');
var app = express();
var fs = require('fs');
const path = require('path');

app.get('/:tipo/:img', (req, res, next) => {
    var tipo = req.params.tipo;
    var img = req.params.img;
    var pathimage = path.resolve(__dirname, `../uploads/${tipo}/${img}`);
    if (fs.existsSync(pathimage)) {
        res.sendFile(pathimage);
    } else {
        var pathNoImage = path.resolve(__dirname, '../assets/no-img.jpg');
        res.sendFile(pathNoImage);

    }

    // res.status(200).json({
    //     ok: true,
    //     mensaje: 'peticion realizada correctament'
    // })
});
module.exports = app;