var express = require('express');
var bcrypt = require('bcryptjs');
var app = express();
var Hospital = require('../models/hospital');
var jwt = require('jsonwebtoken');
var mdAutenticacion = require('../middlewares/autenticacion');
//var SEED = require('../config/config').SEED;

//obtener todos los hospitales
app.get('/', (req, res, next) => {
    Hospital.find({}, 'nombre img Usuario')
        .populate('usuario', 'nombre email')
        .exec(
            (error, Hospitals) => {
                if (error) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'error al cargar Hospitals ',
                        errors: error
                    });
                } else {
                    Hospital.count({}, (error, conteo) => {
                        return res.status(200).json({
                            ok: true,
                            Hospitals: Hospitals,
                            total: conteo
                        });
                    });

                }
            });
});



// crear Hospital
app.post('/', mdAutenticacion.verificaToken, (req, res) => {
    var body = req.body;
    var hospital = new Hospital({
        nombre: body.nombre,
        img: body.img,
        usuario: body.usuario
    });

    hospital.save((error, HospitalSave) => {
        if (error) {
            return res.status(400).json({
                ok: false,
                mensaje: 'error al guardar Hospital',
                errors: error
            });
        } else {
            return res.status(201).json({
                ok: true,
                Hospital: HospitalSave
            });
        }
    });

});


app.put('/:id', mdAutenticacion.verificaToken, (req, res) => {
    var id = req.params.id;
    var body = req.body;


    Hospital.findById(id, (error, user) => {
        if (error) {
            return res.status(500).json({
                ok: false,
                mensaje: 'error al buscar Hospital',
                errors: error
            });
        } else {
            if (!user) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'error NO existe el  Hospital para modificar ',
                    errors: { message: 'no existe el Hospital con el ID' }
                });
            }
            user.nombre = body.nombre;
            user.usuario = body.usuario;
            user.save((error, HospitalSave) => {
                if (error) {
                    return res.status(400).json({
                        ok: false,
                        mensaje: 'error al actualizar Hospital',
                        errors: error
                    });
                } else {
                    HospitalSave.password = ':)';
                    return res.status(201).json({
                        ok: true,
                        Hospital: HospitalSave
                    });
                }
            });
        }
    });

});

app.delete('/:id', mdAutenticacion.verificaToken, (req, res) => {
    var id = req.params.id;
    Hospital.findByIdAndRemove(id, (error, user) => {
        if (error) {
            return res.status(500).json({
                ok: false,
                mensaje: 'error al borrar Hospital',
                errors: error
            });
        } else {

            if (!user) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'error NO existe el  Hospital para borrar ',
                    errors: { message: 'no existe el Hospital con el ID' }
                });
            }

            return res.status(201).json({
                ok: true,
                Hospital: user
            });
        }
    });

});
module.exports = app;