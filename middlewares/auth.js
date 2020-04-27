const jwt = require('jsonwebtoken')

module.exports = function(req, res, next) {
    // Leer token del header
    const token = req.header('x-auth-token')

    // Revisar si no hay token
    if(!token) {
        return res.status(401).json({ msg: 'No hay Token, permiso no autorizado'})
    }

    // Validar token
    try {
        const cifrado = jwt.verify(token, process.env.SECRET_KEY)
        req.usuario = cifrado.usuario
        next()
    } catch (error) {
        res.status(401).json({ msg: 'Token no válido' })
    }
}