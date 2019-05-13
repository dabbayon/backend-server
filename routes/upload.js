var express = require('express');
var fileUpload = require('express-fileupload');
var Hospital = require('../models/hospital');
var Medico = require('../models/medico');
var Usuario = require('../models/usuario');
var fs = require('fs');
const bodyParser = require('body-parser');
var app = express();

app.use(fileUpload());
// app.use(express.limit(5000000));
app.use(bodyParser.json({ limit: '50mb', extended: true }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true, parameterLimit: 50000 }));

app.put('/:tipo/:id', (req, res, next) => {

    var tipo = req.params.tipo;
    var id = req.params.id;
    var imagen = req.body.imagen;
    // tipos
    var tipoValidos = ['hospitales', 'medicos', 'usuarios'];
    if (tipoValidos.indexOf(tipo) === -1) {
        return res.status(400).json({
            ok: false,
            mensaje: 'Tipo no valido',
            errors: { message: "Tipo de coleccion no valida" }
        });
    }
    //console.log(req.body.imagen);
    if (!req.files) {
        //if (Object.keys(req.files).length == 0) {
        console.log(imagen);
        return res.status(400).json({
            ok: false,
            mensaje: 'N subir',
            data: imagen,
            errors: { message: "Debe seleccionar una imagen" }
        });
    }
    var archivo = req.files.imagen;
    var nombre = archivo.name.split('.');
    var ext = nombre[nombre.length - 1];
    var extensionesValidas = ["png", "jpg", "jpeg", "gif"];
    if (extensionesValidas.indexOf(ext) === -1) {
        return res.status(400).json({
            ok: false,
            mensaje: 'Extension no valida',
            errors: { message: "Las extenciones validas son " + extensionesValidas.join(" , ") }
        });
    }

    var nombreArchivo = `${id}-${new Date().getMilliseconds()}.${ ext}`;
    var path = `./uploads/${ tipo }/${ nombreArchivo}`;
    archivo.mv(path, error => {
        if (error) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Debe seleccionar archivos para subir',
                errors: error
            });
        }
        uploadByType(tipo, id, nombreArchivo);

    });

    res.status(200).json({
        ok: true,
        mensaje: 'peticion realizada correctament',
        archivo: "el archivo fue subido a " + path
    })
});


function uploadByType(tipo, id, nombreArchivo) {

    switch (tipo) {
        case 'hospitales':
            Hospital.findById(id, (error, hospitalDB) => {
                if (!hospitalDB) {
                    return res.status(400).json({
                        ok: false,
                        errors: 'No existe hospital' + error
                    });

                }

                var pathOld = './uploads/hospitales' + hospitalDB.imagen;
                if (fs.existsSync(pathOld)) {
                    fs.unlink(pathOld);
                }
                hospitalDB.imagen = nombreArchivo;
                hospitalDB.save((error, hospitalUpdate) => {
                    if (error) {
                        return res.status(400).json({
                            ok: false,
                            errors: error
                        });
                    }
                    return res.status(200).json({
                        ok: false,
                        hospitalActualizado: hospitalUpdate
                    });
                })
            });
            break;
        case 'medicos':
            Medico.findById(id, (error, medicoDB) => {

                if (!medicoDB) {
                    return res.status(400).json({
                        ok: false,
                        errors: 'No existe medico' + error
                    });

                }
                var pathOld = './uploads/usuarios' + medicoDB.imagen;
                if (fs.existsSync(pathOld)) {
                    fs.unlink(pathOld);
                }
                medicoDB.imagen = nombreArchivo;
                medicoDB.save((error, medicoUpdate) => {
                    if (error) {
                        return res.status(400).json({
                            ok: false,
                            errors: error
                        });
                    }
                    return res.status(200).json({
                        ok: false,
                        medicoActualizado: medicoUpdate
                    });
                })
            });
            break;
        case 'usuarios':
            Usuario.findById(id, (error, usuarioDB) => {

                if (!usuarioDB) {
                    return res.status(400).json({
                        ok: false,
                        errors: 'No existe usuario' + error
                    });

                }
                var pathOld = './uploads/usuarios' + usuarioDB.imagen;
                if (fs.existsSync(pathOld)) {
                    fs.unlink(pathOld);
                }
                usuarioDB.imagen = nombreArchivo;
                usuarioDB.save((error, usuarioUpdate) => {
                    if (error) {
                        return res.status(400).json({
                            ok: false,
                            errors: error
                        });
                    }
                    return res.status(200).json({
                        ok: false,
                        usuarioActualizado: usuarioUpdate
                    });
                })
            });
            break;
    }

}

module.exports = app;