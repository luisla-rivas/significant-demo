const express = require('express');
const path = require('path');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const port = 3000;

// Servir archivos estáticos desde el directorio 'public'
app.use(express.static(path.join(__dirname, 'public')));

// Redirigir a video.html en la ruta raíz
app.get('/', (req, res) => {
    res.redirect('/index.html');
});

const server = http.createServer(app);
const io = socketIo(server);

let userCount = 0;

io.on('connection', (socket) => {
    userCount++;
    io.emit('userCount', userCount); // Emitir el número de usuarios conectados a todos los clientes
    console.log('Nuevo cliente conectado. Usuarios conectados:', userCount);

    socket.on('command', (command) => {
        console.log('Comando recibido:', command);
        
        // Reenviar el comando a todos los clientes
        io.emit('command', command);
    });

    socket.on('disconnect', () => {
        userCount--;
        io.emit('userCount', userCount); // Emitir el número de usuarios conectados a todos los clientes
        console.log('Cliente desconectado. Usuarios conectados:', userCount);
    });
});

server.listen(port, () => {
    console.log(`Servidor escuchando en http://localhost:${port}`);
});

console.log('Servidor socket.io configurado');
