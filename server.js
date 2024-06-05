const express = require('express');
const path = require('path');
const http = require('http');
const socketIo = require('socket.io');
const fs = require('fs');

const app = express();
const port = 3000; //
const server = http.createServer(app);
const io = socketIo(server);
//const PORT = process.env.PORT || 3000;
const videoPath = path.join(__dirname, 'Public', 'demo.mp4');


// Servir archivos estáticos desde el directorio 'public'
app.use(express.static(path.join(__dirname, 'public')));

// Redirigir a video.html en la ruta raíz
app.get('/', (req, res) => {
    res.redirect('/index.html');
});

let userCount = 0;
let videoCount = 0;

// Namespace for commands
const controlNamespace = io.of('/control');
controlNamespace.on('connection', (socket) => {
    userCount++;
    socket.emit('userCount', userCount); // Emitir el número de usuarios conectados a todos los clientes
    console.log('Nuevo usuario en la sesión. Usuarios conectados:', userCount);
    
    socket.on('command', (command) => {
        console.log('Comando recibido:', command);
        
        // Reenviar el comando a todos los clientes
        socket.broadcast.emit('command', command); 
        if (command === 'ready') {
            videoCount++;
            console.log('Nuevo usuario en canal de video. Conectados:', videoCount);
        }
        if (command === 'play') {
            console.log('Comando reenviado:', command);
        }
          
    });

    socket.on('disconnect', () => {
        userCount--;
        socket.emit('userCount', userCount); // Emitir el número de usuarios conectados a todos los clientes
        console.log('Client disconnected from socket /control');
    });

});



// Namespace for video streaming
const videoNamespace = io.of('/video');
videoNamespace.on('connection', (socket) => {
    const videoPath = path.join(__dirname, 'Public', 'demo.mp4');
    let videoStream = null;

    socket.on('play', () => {
        videoStream = fs.createReadStream(videoPath); //, { highWaterMark: 1024 });

        bytesRead = 0;
        console.log('Streaming video...');
        videoStream.on('data', (chunk) => {
            bytesRead += chunk.length;
            socket.broadcast.emit('videoData', chunk);
            console.log(`Video streaming: ${bytesRead} bytes`);
            
        });

        videoStream.on('end', () => {
            console.log(`Video stream ended at ${bytesRead} bytes`);
            socket.emit('videoEnd');
        });
    
        videoStream.on('error', (err) => {
            console.log('VideoStream Error at ${bytesRead} bytes');
            console.error('Error reading video file:', err);
        });

    });

    socket.on('pause', () => {
        videoStream.pause();
        console.log(`Video stream paused at ${bytesRead} bytes`);
        socket.emit('videoPause');
    });

    socket.on('resume', () => {
        videoStream.resume();
        console.log(`Video stream resumed at ${bytesRead} bytes`);
        socket.emit('videoResume');
    });

    socket.on('disconnect', () => {
        videoCount--;
    });


});

server.listen(port, () => {
    console.log(`Servidor escuchando en http://localhost:${port}`);
});

console.log('Servidor socket.io configurado');