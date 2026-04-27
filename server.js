const express = require('express');
const { exec } = require('child_process');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 2010;

// Middlewares
app.use(cors());
app.use(express.json());

// Rutas estáticas
app.use(express.static(path.join(__dirname, 'public')));
app.use('/admin', express.static(path.join(__dirname, 'admin')));

// Endpoint para realizar el commit y push a GitHub
app.post('/api/commit', (req, res) => {
    // El comando agrega todos los cambios, hace commit y sube al repositorio remoto.
    const command = `git add . && git commit -m "Actualización desde el CMS Panel de Control" && git push`;

    exec(command, (error, stdout, stderr) => {
        if (error) {
            console.error(`Error de Git: ${error.message}`);
            // Si el error es simplemente que no hay nada para subir, devolvemos un éxito con mensaje.
            if (stdout.includes('nothing to commit') || stderr.includes('nothing to commit') || error.message.includes('nothing to commit')) {
                return res.status(200).json({ success: true, message: 'No hay cambios nuevos pendientes de subir.' });
            }
            return res.status(500).json({ success: false, error: 'Ocurrió un error al intentar subir a GitHub.' });
        }

        console.log(`Git output: ${stdout}`);
        res.status(200).json({ success: true, message: '¡Los cambios se han sincronizado con éxito!' });
    });
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`========================================`);
    console.log(`🚀 Servidor local BEES10 iniciado`);
    console.log(`🌐 Web Pública: http://localhost:${PORT}`);
    console.log(`⚙️  Admin Panel:  http://localhost:${PORT}/admin`);
    console.log(`========================================`);
});
