const Usuario = require('../models/Usuarios')
const bcryptjs = require('bcryptjs')
const { validationResult } = require('express-validator')
const jwt = require('jsonwebtoken')

exports.crearUsuario = async (req, res) => {

    // Revisar si hay errores
    const errores = validationResult(req)
    if(!errores.isEmpty()){
        return res.status(400).json({ errores: errores.array() })
    }

    // Extraer mail y password
    const { email, password } = req.body

    try {
        // Revisar que el usuario registrado sea único
        let usuario = await Usuario.findOne({ email });
        
        if(usuario){
            return res.status(400).json({ msg: 'El usuario ya se encuentra registrado' })
        }

        // Crea el nuevo usuario
        usuario = new Usuario(req.body)

        // Hashear password
        const salt = await bcryptjs.genSalt(10)
        usuario.password = await bcryptjs.hash(password, salt)

        // Guardar el usuario
        await usuario.save()

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
        // console.log(error)
        if(error.code === 11000) res.status(400).json({ msg: 'El email ya se encuentra registrado' })
        else res.status(400).json({ msg: 'Hubo un error al crear el usuario' })
    }
}