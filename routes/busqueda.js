var express = require('express');
var app = express();
var hospital = require('../models/hospital');
var medico = require('../models/medico');
var usuario = require('../models/medico');

app.get('/todo/:busqueda', (req, res, next) => {
    var busqueda = req.params.busqueda;
    var regex = new RegExp(busqueda, 'i');
    Promise.all(
            [buscarHospitales(busqueda, regex),
                buscarMedicos(busqueda, regex),
                buscarUsuarios(busqueda.regex)
            ])
        .then(respuestas => {
            return res.status(200).json({
                ok: true,
                Hospitals: respuestas[0],
                medicos: respuestas[1],
                usuarios: respuestas[2]
            });
        });
});


app.get('/coleccion/:tabla/:busqueda', (req, res, next) => {
    var tabla = req.params.tabla;
    var busqueda = req.params.busqueda;
    var regex = new RegExp(busqueda, 'i');
    var rtdo;
    switch (tabla) {
        case 'usuario':
            rtdo = buscarUsuarios(busqueda, regex);
            break;
        case 'medico':
            rtdo = buscarMedicos(busqueda, regex);
            //console.log(rtdo);
            break;
        case 'hospital':
            rtdo = buscarHospitales(busqueda, regex);
            break;
    }

    rtdo.then(data => {
        return res.status(200).json({
            ok: true,
            tabla: data
        });
    })

});

// peticiones asyncronas
function buscarHospitales(busqueda, regex) {
    return new Promise((resolve, reject) => {
        hospital.find({ nombre: regex })
            .populate('usuario', 'nombre email')
            .exec((error, hospitales) => {
                if (error) {
                    reject('Error al cargar hospitales', error);
                } else {
                    resolve(hospitales);
                }
            });
    });
}

// peticiones asyncronas
function buscarMedicos(busqueda, regex) {
    return new Promise((resolve, reject) => {
        medico.find({ nombre: regex })
            .populate('usuario', 'nombre email')
            .populate('hospital', 'nombre')
            .exec((error, medicos) => {
                if (error) {
                    reject('Error al cargar medicos', error);
                } else {
                    resolve(medicos);
                }
            });
    })

}


function buscarUsuarios(busqueda, regex) {
    return new Promise((resolve, reject) => {
        usuario.find({}, 'nombre email role')
            .or([{ 'nombre': regex }, { 'email': regex }])
            .exec((error, usuarios) => {
                if (error) {
                    reject('Error al cargar usuarios', error);
                } else {
                    resolve(usuarios);
                }
            });
    })

}
module.exports = app;