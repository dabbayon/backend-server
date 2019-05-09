var express = require('express');
var bcrypt = require('bcryptjs');
var app = express();
var Usuario = require('../models/usuario');
var jwt = require('jsonwebtoken');
var mdAutenticacion = require('../middlewares/autenticacion');
//var SEED = require('../config/config').SEED;

//obtener todos los usuarios
app.get('/', (req, res, next) => {
    Usuario.find({}, 'nombre email img role')
        .exec(
            (error, usuarios) => {
                if (error) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'error al cargar usuarios ',
                        errors: error
                    });
                } else {
                    return res.status(200).json({
                        ok: true,
                        usuarios: usuarios
                    });
                }
            });
});



// crear usuario
app.post('/', mdAutenticacion.verificaToken, (req, res) => {
    var body = req.body;
    var usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        img: body.img,
        role: body.role
    });

    usuario.save((error, usuarioSave) => {
        if (error) {
            return res.status(400).json({
                ok: false,
                mensaje: 'error al guardar usuario',
                errors: error
            });
        } else {
            return res.status(201).json({
                ok: true,
                usuario: usuarioSave
            });
        }
    });

});


app.put('/:id', mdAutenticacion.verificaToken, (req, res) => {
    var id = req.params.id;
    var body = req.body;


    Usuario.findById(id, (error, user) => {
        if (error) {
            return res.status(500).json({
                ok: false,
                mensaje: 'error al buscar usuario',
                errors: error
            });
        } else {
            if (!user) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'error NO existe el  usuario para modificar ',
                    errors: { message: 'no existe el usuario con el ID' }
                });
            }
            user.nombre = body.nombre;
            user.email = body.email;
            user.role = body.role;
            user.save((error, usuarioSave) => {
                if (error) {
                    return res.status(400).json({
                        ok: false,
                        mensaje: 'error al actualizar usuario',
                        errors: error
                    });
                } else {
                    usuarioSave.password = ':)';
                    return res.status(201).json({
                        ok: true,
                        usuario: usuarioSave
                    });
                }
            });
        }
    });

});

app.delete('/:id', mdAutenticacion.verificaToken, (req, res) => {
    var id = req.params.id;
    Usuario.findByIdAndRemove(id, (error, user) => {
        if (error) {
            return res.status(500).json({
                ok: false,
                mensaje: 'error al borrar usuario',
                errors: error
            });
        } else {

            if (!user) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'error NO existe el  usuario para borrar ',
                    errors: { message: 'no existe el usuario con el ID' }
                });
            }

            return res.status(201).json({
                ok: true,
                usuario: user
            });
        }
    });

});
module.exports = app;