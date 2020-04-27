const Usuario = require('../models/Usuarios')
const bcryptjs = require('bcryptjs')
const { validationResult } = require('express-validator')
const jwt = require('jsonwebtoken')

exports.autenticarUsuario = async (req, res) => {
    // Revisar si hay errores
    const errores = validationResult(req)
    if(!errores.isEmpty()){
        return res.status(400).json({ errores: errores.array() })
    }

    // Extraer datos
    const { email, password } = req.body

    try {
        // Revisar que sea un usuario registrado
        let usuario = await Usuario.findOne({ email })
        if(!usuario) {
            return res.status(400).json({ msg: 'El usuario no está registrado' })
        }

        // Verificar el password
        const passCorrecto = await bcryptjs.compare(password, usuario.password)
        if(!passCorrecto) {
            return res.status(400).json({ msg: 'Usuario o contraseña incorrecto' })
        }

        // Si todo es correcto, crear el JWT
        // Crear y firmar el JWT
        const payload = {
            usuario: {
                id: usuario.id,
                nombre: usuario.nombre
            }
        }

        // Firmar JWT
        jwt.sign(payload, process.env.SECRET_KEY, {
            expiresIn: 3600 // 1 hora en segundos
        }, (error, token) => {
            if(error) throw error
            
            // Mensaje de confirmación
            res.json({ token })
        })

    } catch (error) {
        res.status(500).json({ msg: 'Hubo un error inesperado (ERR-1)'})
    }
}

// Obtiene que usuario está autenticado
exports.usuarioAutenticado = async (req, res) => {
    try {
        // Extraer id de usuario y consultar
        const idUsuario = req.usuario.id
        const usuario = await Usuario.findById(idUsuario).select('-password') // Excluir el password
        res.json({ usuario })
        
    } catch (error) {
        console.log(error)
        res.status(500).json({ msg: 'Hubo un error (LOG-1)'})
    }
}