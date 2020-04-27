// Rutas para proyectos
const express = require('express')
const router = express.Router()
const proyectosController = require('../controllers/proyectosController')
const { check } = require('express-validator')
const auth = require('../middlewares/auth')

// Crea un proyecto
// api/proyectos
router.post('/',
    auth,
    [
        check('nombre', 'El nombre del proyecto es obligatorio').not().isEmpty()
    ],
    proyectosController.crearProyecto
)

// Obtener proyectos
router.get('/',
    auth,
    proyectosController.obtenerProyectosPorUsuario
)

// Actualizar proyecto
router.put('/:id',
    auth,
    [
        check('nombre', 'El nombre del proyecto es obligatorio').not().isEmpty()
    ],
    proyectosController.actualizarProyecto
)

// Eliminar proyecto
router.delete('/:id',
    auth,
    proyectosController.eliminarProyecto
)

module.exports = router