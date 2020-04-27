// Rutas para tareas
const express = require('express')
const router = express.Router()
const tareasController = require('../controllers/tareasController')
const { check } = require('express-validator')
const auth = require('../middlewares/auth')

// Crea una tarea
// api/tareas
router.post('/',
    auth,
    [
        check('nombre', 'El nombre de la tarea es obligatorio').not().isEmpty(),
        check('proyecto', 'Proyecto obligatorio').not().isEmpty(),
    ],
    tareasController.crearTarea
)

// Obtener tareas por proyecto
router.get('/',
    auth,
    tareasController.obtenerTareas
)

// Actualizar tarea
router.put('/:id',
    auth,
    [
        check('nombre', 'El nombre de la tarea es obligatorio').not().isEmpty(),
        check('proyecto', 'Proyecto obligatorio').not().isEmpty(),
    ],
    tareasController.actualizarTarea
)

// Eliminar tarea
router.delete('/:id',
    auth,
    tareasController.eliminarTarea
)

module.exports = router
