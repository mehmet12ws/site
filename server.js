const express = require('express');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');

const app = express();
const secret = 'your-256-bit-secret'; // Gizli anahtar

app.use(bodyParser.json()); // JSON verilerini işlemek için

// Şifreyi JWT token'a dönüştüren endpoint
app.post('/generate-token', (req, res) => {
    const { password, turnstileToken } = req.body;

    if (!password || !turnstileToken) {
        return res.status(400).json({ message: 'Şifre ve Turnstile tokenı gereklidir.' });
    }

    // Şifreyi JWT token'a dönüştürme
    const token = jwt.sign({ password }, secret, { expiresIn: '1h' }); // Token 1 saat geçerli

    // JWT token'ı JSON yanıtında döndür
    res.json({ token });
});

app.listen(3000, () => {
    console.log('Sunucu çalışıyor');
});
