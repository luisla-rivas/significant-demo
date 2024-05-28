const express = require('express');
const path = require('path');
const https = require('https');
const fs = require('fs');
const socketIo = require('socket.io');
const cors = require('cors');

const app = express();
const port = 3000;

// Configuración de CORS
const corsOptions = {
    origin: '*',
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type'],
    credentials: true,
};

app.use(cors(corsOptions));

// Servir archivos estáticos desde el directorio 'public'
app.use(express.static(path.join(__dirname, 'public')));

// Redirigir a video.html en la ruta raíz
app.get('/', (req, res) => {
    res.redirect('/index.html');
});

// Leer los certificados SSL
const privateKey = fs.readFileSync('key.pem', 'utf8');
const certificate = fs.readFileSync('cert.pem', 'utf8');
const credentials = { key: privateKey, cert: certificate };

const server = https.createServer(credentials, app);
const io = socketIo(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST']
    }
});

let userCount = 0;

io.on('connection', (socket) => {
    userCount++;
    io.emit('userCount', userCount); // Emitir el número de usuarios conectados a todos los clientes
    console.log('Nuevo cliente conectado. Usuarios conectados:', userCount);

    socket.on('command', (command) => {
        console.log('Comando recibido:', command);
        
        // Reenviar el comando de reproducción o pausa a todos los clientes
        if (command.action === 'play') {
            io.emit('playVideo');
        } else if (command.action === 'pause') {
            io.emit('pauseVideo');
        }
    });

    socket.on('disconnect', () => {
        userCount--;
        io.emit('userCount', userCount); // Emitir el número de usuarios conectados a todos los clientes
        console.log('Cliente desconectado. Usuarios conectados:', userCount);
    });
});

server.listen(port, () => {
    console.log(`Servidor escuchando en https://localhost:${port}`);
});

console.log('Servidor socket.io configurado');
