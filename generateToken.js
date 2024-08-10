const express = require('express');
const jwt = require('jsonwebtoken');
const app = express();

const secret = 'your-256-bit-secret'; // Aynı gizli anahtarı kullanın

// Base64 ile kodlanmış şifre
const base64Password = 'WHg0NDI0WHM0NGR8'; // 

const payload = {
    password: base64Password // Base64 kodlanmış şifre
};

// JWT token oluşturma
const token = jwt.sign(payload, secret, { expiresIn: '1h' }); // Token 1 saat geçerli

// Token'ı Base64 ile şifreleme
const base64Token = Buffer.from(token).toString('base64');

app.get('/get-token', (req, res) => {
    res.json({ token: base64Token });
});

app.use(express.static('public')); // 'public' klasöründen dosyalar sunulacak

app.listen(3000, () => {
    console.log('Sunucu çalışıyor');
});
