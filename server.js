const express = require('express');
const bodyParser = require('body-parser');
const http = require('http');
const WebSocket = require('ws');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

const port = 3000;

let lastReceivedMessage = "";

app.use(express.static('public'));
app.use(bodyParser.json());

app.post('/sendStatus', (req, res) => {
    // WebSocket üzerinden tüm bağlı istemcilere veriyi gönder
    wss.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify(req.body));
        }
    });
    // Eğer WebSocket üzerinden bir mesaj alındıysa onu response olarak gönder
    if (lastReceivedMessage) {
        res.status(200).send( lastReceivedMessage);
    } else {
        // Eğer WebSocket üzerinden mesaj alınmadıysa boş bir yanıt gönder
        res.status(200).send('No WebSocket message received');
    }
});

wss.on('connection', ws => {
    console.log('New client connected');
    ws.on('message', function message(data) {
        lastReceivedMessage = data
  });
});

server.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
