const express = require('express');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const app = express();

const secret = 'your-256-bit-secret'; // Güvenli bir şekilde saklayın

// Base64 ile kodlanmış şifre
const base64Password = 'WHg0NDI0WHM0NGR8'; // 

const payload = {
    password: base64Password // Base64 kodlanmış şifre
};

// JWT token oluşturma
const token = jwt.sign(payload, secret, { expiresIn: '1h' }); // Token 1 saat geçerli

// Token'ı Base64 ile şifreleme
const base64Token = Buffer.from(token).toString('base64');

app.use(bodyParser.json()); // JSON verileri işlemek için

app.post('/login', (req, res) => {
    const { password } = req.body;
    const encodedPassword = Buffer.from(password).toString('base64');

    // JWT token oluşturma (gizli anahtar ve Base64 kodlanmış şifre ile)
    const userToken = jwt.sign({ password: encodedPassword }, secret, { expiresIn: '1h' });
    const base64UserToken = Buffer.from(userToken).toString('base64');

    if (base64UserToken === base64Token) {
        res.json({ success: true });
    } else {
        res.json({ success: false, message: 'Geçersiz şifre' });
    }
});

app.listen(3000, () => {
    console.log('Sunucu çalışıyor');
});
