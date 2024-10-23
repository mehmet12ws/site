const express = require('express');
const cors = require('cors');
const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

let stats = {
    acceptedRequests: 0,
    blockedRequests: 0,
};

// İstatistikleri almak için
app.get('/stats', (req, res) => {
    res.json(stats);
});

// Kabul edilen istekleri artırmak için
app.post('/accept', (req, res) => {
    stats.acceptedRequests++;
    res.sendStatus(200);
});

// Engellenen istekleri artırmak için
app.post('/block', (req, res) => {
    stats.blockedRequests++;
    res.sendStatus(200);
});

// Sunucuyu başlat
app.listen(port, () => {
    console.log(`Sunucu http://localhost:${port} adresinde çalışıyor`);
});
