const Tareas = require('../models/Tareas')
const Proyecto = require('../models/Proyecto')
const { validationResult } = require('express-validator')


// Crear un nuevo proyecto
exports.crearTarea = async (req, res) => {
    
    // Revisar si hay errores
    const errores = validationResult(req)
    if(!errores.isEmpty()){
        return res.status(400).json({ errores: errores.array() })
    }
    
    try {
        // Extraer proyecto y comprobar si existe
        const { proyecto } = req.body

        // Comprobar si existe proyecto
        const proyectoUsuario = await Proyecto.findById(proyecto)
        if(!proyectoUsuario) return res.status(404).json({ msg: 'Proyecto no encontrado' })

        // Verificar el creador del proyecto
        if(proyectoUsuario.creador.toString() !== req.usuario.id) return res.status(401).json({ msg: 'Proyecto no autorizado' })

        // Crear la tarea
        const tarea = new Tareas(req.body)
        await tarea.save()

        res.json({ tarea })
        
    } catch (error) {
        console.log(error)
        res.status(500).json({ msg: 'Hubo un error inesperado (ERR-5)'})
    }
}

// Obtiene tareas por proyecto
exports.obtenerTareas = async (req, res) => {
    try {
        // Extraer proyecto y comprobar si existe
        const { proyecto } = req.query

        // Comprobar si existe proyecto
        const proyectoUsuario = await Proyecto.findById(proyecto)
        if(!proyectoUsuario) return res.status(404).json({ msg: 'Proyecto no encontrado' })

        // Verificar el creador del proyecto
        if(proyectoUsuario.creador.toString() !== req.usuario.id) return res.status(401).json({ msg: 'Proyecto no autorizado' })
        
        // Buscar tareas por proyecto
        const tareas = await Tareas.find({ proyecto })

        res.json({ tareas })

    } catch (error) {
        console.log(error)
        res.status(500).json({ msg: 'Hubo un error inesperado (ERR-6)'})
    }
}

// Actualizar tarea
exports.actualizarTarea = async (req, res) => {
    // Revisar si hay errores
    const errores = validationResult(req)
    if(!errores.isEmpty()){
        return res.status(400).json({ errores: errores.array() })
    }

    try {
        // Extraer proyecto y comprobar si existe
        const { proyecto, nombre, estado } = req.body
        const tareaId = req.params.id

        // Revisar si existe la tarea
        let tarea = await Tareas.findById(tareaId)
        if(!tarea) return res.status(404).json({ msg: 'Tarea no encontrada' })

        // Verificar el creador del proyecto
        const proyectoUsuario = await Proyecto.findById(proyecto)
        if(proyectoUsuario.creador.toString() !== req.usuario.id) return res.status(401).json({ msg: 'Proyecto no autorizado' })

        // Crear un objeto con la nueva información
        const nuevaTarea = {}
        nuevaTarea.nombre = nombre
        nuevaTarea.estado = estado

        // Guardar cambios de la tarea
        tarea = await Tareas.findOneAndUpdate({ _id: tareaId}, nuevaTarea, { new: true })

        res.json({ tarea })        

    } catch (error) {
        console.log(error)
        res.status(500).json({ msg: 'Hubo un error inesperado (ERR-7)'})
    }
}

// Eliminar tarea
exports.eliminarTarea = async (req, res) => {
    try {
        // Extraer proyecto y comprobar si existe
        const { proyecto } = req.query
        const tareaId = req.params.id

        // Revisar si existe la tarea
        let tarea = await Tareas.findById(tareaId)
        if(!tarea) return res.status(404).json({ msg: 'Tarea no encontrada' })

        // Verificar el creador del proyecto
        const proyectoUsuario = await Proyecto.findById(proyecto)
        if(proyectoUsuario.creador.toString() !== req.usuario.id) return res.status(401).json({ msg: 'Proyecto no autorizado' })

        // Eliminar tarea
        await Tareas.findOneAndRemove({ _id: tareaId})

        res.json({ msg: 'Tarea eliminada' })        

    } catch (error) {
        console.log(error)
        res.status(500).json({ msg: 'Hubo un error inesperado (ERR-7)'})
    }
}