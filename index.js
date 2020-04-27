// Librerías
const express = require('express')
const connectDB = require('./config/db')
const cors = require('cors')

// Crear el servidor
const app = express()

// Conectar la base de datos
connectDB()

// Habilitar express.json
app.use(express.json({ extended: true }))

// Definir un dominio(s) para las peticiones en un arreglo
const whiteList = [process.env.FRONTEND_URL];

// Opciones de CORS para dar acceso o no a los endpoint
const corsOptions = {
    origin: (origin, callback) => {
        // console.log(origin);
        // Revisar si la petición viene de un servidor que está en whiteList
        const permitido = whiteList.some(dominio => dominio === origin)

        if(permitido){
            callback(null, true)
        } else {
            callback(new Error('This site has been blocked by CORS policy.'))
        }
    }
}

// Habilitar CORS
app.use(cors(corsOptions))

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
