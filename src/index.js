const http = require('http');

const { PORT = 3002 } = process.env;

const onRequest = (req, res) => {
  res.setHeader('Content-Type', 'text/html');
  res.writeHead(200);
  res.end('Hello World\n');
};

const server = http.createServer(onRequest);

server.listen(PORT, 'localhost', () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
