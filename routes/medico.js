var express = require('express');
var bcrypt = require('bcryptjs');
var app = express();
var medico = require('../models/medico');
var jwt = require('jsonwebtoken');
var mdAutenticacion = require('../middlewares/autenticacion');
//var SEED = require('../config/config').SEED;

//obtener todos los medicoes
app.get('/', (req, res, next) => {
    medico.find({}, 'nombre img Usuario Hospital')
        .populate('usuario', 'nombre email')
        .populate('hospital')
        .exec(
            (error, medicos) => {
                if (error) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'error al cargar medicos ',
                        errors: error
                    });
                } else {
                    medico.count({}, (error, conteo) => {
                        return res.status(200).json({
                            ok: true,
                            medicos: medicos,
                            total: conteo
                        });
                    });


                }
            });
});



// crear medico
app.post('/', mdAutenticacion.verificaToken, (req, res) => {
    var body = req.body;
    var Medico = new medico({
        nombre: body.nombre,
        img: body.img,
        usuario: body.usuario,
        hospital: body.hospital
    });

    Medico.save((error, medicoSave) => {
        if (error) {
            return res.status(400).json({
                ok: false,
                mensaje: 'error al guardar medico',
                errors: error
            });
        } else {
            return res.status(201).json({
                ok: true,
                medico: medicoSave
            });
        }
    });

});


app.put('/:id', mdAutenticacion.verificaToken, (req, res) => {
    var id = req.params.id;
    var body = req.body;


    medico.findById(id, (error, med) => {
        if (error) {
            return res.status(500).json({
                ok: false,
                mensaje: 'error al buscar medico',
                errors: error
            });
        } else {
            if (!med) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'error NO existe el  medico para modificar ',
                    errors: { message: 'no existe el medico con el ID' }
                });
            }
            med.nombre = body.nombre;
            med.usuario = body.usuario;
            med.hospital = body.hospital;

            med.save((error, medicoSave) => {
                if (error) {
                    return res.status(400).json({
                        ok: false,
                        mensaje: 'error al actualizar medico',
                        errors: error
                    });
                } else {
                    medicoSave.password = ':)';
                    return res.status(201).json({
                        ok: true,
                        medico: medicoSave
                    });
                }
            });
        }
    });

});

app.delete('/:id', mdAutenticacion.verificaToken, (req, res) => {
    var id = req.params.id;
    medico.findByIdAndRemove(id, (error, med) => {
        if (error) {
            return res.status(500).json({
                ok: false,
                mensaje: 'error al borrar medico',
                errors: error
            });
        } else {

            if (!med) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'error NO existe el  medico para borrar ',
                    errors: { message: 'no existe el medico con el ID' }
                });
            }

            return res.status(201).json({
                ok: true,
                medico: med
            });
        }
    });

});
module.exports = app;