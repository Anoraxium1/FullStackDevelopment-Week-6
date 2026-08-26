// module to start node server listening for requests on port 3000

const server = require('./server');

const PORT = 3000;

server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});