const Proyecto = require('../models/Proyecto')
const { validationResult } = require('express-validator')

// Crear un nuevo proyecto
exports.crearProyecto = async (req, res) => {
    
    // Revisar si hay errores
    const errores = validationResult(req)
    if(!errores.isEmpty()){
        return res.status(400).json({ errores: errores.array() })
    }

    try {
        // Crear un proyecto
        const proyecto = new Proyecto(req.body)

        // Guardar el creador via JWT
        proyecto.creador = req.usuario.id

        // Guadar proyecto
        await proyecto.save()

        // Retornar respuesta
        res.json(proyecto)
        
    } catch (error) {
        console.log(error)
        res.status(500).json({ msg: 'Hubo un error inesperado (ERR-2)'})
    }
}

// Obtiene proyectos del usuario actual
exports.obtenerProyectosPorUsuario = async (req, res) => {
    try {
        // Obtener datos del usuario del JWT
        const { id } = req.usuario
        
        // Consultar proyectos
        const proyectos = await Proyecto.find({ creador: id }).sort({ creado: -1 })

        res.json({ proyectos })

    } catch (error) {
        console.log(error)
        res.status(500).json({ msg: 'Hubo un error inesperado (ERR-3)'})
    }
}

// Actualizar un proyecto
exports.actualizarProyecto = async (req, res) => {
    // Revisar si hay errores
    const errores = validationResult(req)
    if(!errores.isEmpty()){
        return res.status(400).json({ errores: errores.array() })
    }

    // Extraer la información del proyecto
    const { nombre } = req.body
    const nuevoProyecto = {}

    if(nombre) nuevoProyecto.nombre = nombre

    try {
        // Revisar el ID
        const id = req.params.id
        let proyecto = await Proyecto.findById(id)

        // Si el proyecto existe o no
        if(!proyecto) return res.status(404).json({ msg: 'No se encontró el proyecto' })

        // Verificar el creador del proyecto
        if(proyecto.creador.toString() !== req.usuario.id) return res.status(401).json({ msg: 'Proyecto no autorizado' })

        // Actualizar el proyecto
        proyecto = await Proyecto.findByIdAndUpdate({ 
                _id: id
            }, {
                $set: nuevoProyecto
            }, {
                new: true
            }
        )

        res.json({ proyecto })

    } catch (error) {
        console.log(error)
        res.status(500).json({ msg: 'Hubo un error inesperado (ERR-4)'})
    }
}

// Eliminar un proyecto
exports.eliminarProyecto =  async (req, res) => {
    try {
        // Revisar el ID
        const id = req.params.id
        let proyecto = await Proyecto.findById(id)

        // Si el proyecto existe o no
        if(!proyecto) return res.status(404).json({ msg: 'No se encontró el proyecto' })

        // Verificar el creador del proyecto
        if(proyecto.creador.toString() !== req.usuario.id) return res.status(401).json({ msg: 'Proyecto no autorizado' })

        // Actualizar el proyecto
        await Proyecto.deleteOne({ _id: id, creador: req.usuario.id })
        await Proyecto.findOneAndRemove({ _id: id, creador: req.usuario.id })

        res.json({ msg: 'Proyecto eliminado' })

    } catch (error) {
        console.log(error)
        res.status(500).json({ msg: 'Hubo un error inesperado (ERR-4)'})
    }
}