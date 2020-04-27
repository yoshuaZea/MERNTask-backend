// Rutas para autenticar usuarios
const express = require('express')
const router = express.Router()
const { check } = require('express-validator')
const authController = require('../controllers/authController')
const auth = require('../middlewares/auth')

// Iniciar sesión
// api/auth
router.post('/',
    [
        // Express validator
        check('email', 'Agrega un email válido').isEmail(),
        check('password', 'El password debe ser mínimo de 6 caracteres').isLength({ min: 6 })
    ],
    authController.autenticarUsuario
)

// Obtiene el usuario autenticado
router.get('/', 
    auth,
    authController.usuarioAutenticado
)

module.exports = router
