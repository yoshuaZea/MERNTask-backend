// Rutas para crear usuarios
const express = require('express')
const router = express.Router()
const usuariosController = require('../controllers/usuariosContoller')
const { check } = require('express-validator')

// Crea un usuario
// api/usuarios
router.post('/',
    [
        // Express validator
        check('nombre', 'El nombre es obligatorio').not().isEmpty(),
        check('email', 'Agrega un email válido').isEmail(),
        check('password', 'El password debe ser mínimo de 6 caracteres').isLength({ min: 6 })
    ],
    usuariosController.crearUsuario
)

module.exports = router
