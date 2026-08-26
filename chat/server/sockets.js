// module to contain socket implementation

function initializeSockets(io) {
  io.on('connection', (socket) => {
    console.log('Client connected:', socket.id);

    socket.on('chat message', (message) => {
      io.emit('chat message', message);
    });

    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id);
    });
  });
}

module.exports = initializeSockets;