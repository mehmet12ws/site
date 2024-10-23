// server.js
const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());

let acceptedRequests = 0;
let blockedRequests = 0;

app.get('/stats', (req, res) => {
    res.json({ acceptedRequests, blockedRequests });
});

app.post('/accept', (req, res) => {
    acceptedRequests++;
    res.sendStatus(200);
});

app.post('/block', (req, res) => {
    blockedRequests++;
    res.sendStatus(200);
});

app.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
});
