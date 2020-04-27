// Librerías
const express = require('express')
const connectDB = require('./config/db')
const cors = require('cors')

// Crear el servidor
const app = express()

// Conectar la base de datos
connectDB()

// Habilitar CORS
app.use(cors())

// Habilitar express.json
app.use(express.json({ extended: true }))

// Importar rutas
app.use('/api/usuarios', require('./routes/usuarios'))
app.use('/api/auth', require('./routes/auth'))
app.use('/api/proyectos', require('./routes/proyectos'))
app.use('/api/tareas', require('./routes/tareas'))

//SERVIDOR Y PUERTO PARA HEROKU
const host = process.env.HOST || '0.0.0.0';
const port = process.env.PORT || 3000;

// Arrancar el servidor
app.listen(port, host, () => {
    console.log(`El servidor está ejecutándose en el puerto ${port}`)
})
