const http = require('http');
const app = require('./app');

const port = process.env.PORT || 9090;

const server = http.createServer(app);

server.listen(port, ()=>{
    console.log(`server is listening on ${port}`)
});