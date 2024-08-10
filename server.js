const express = require('express');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const app = express();

const secret = 'your-256-bit-secret'; // Aynı gizli anahtarı kullanın

// Base64 ile kodlanmış şifre
const base64Password = Buffer.from('Xx4424Xs44d').toString('base64'); // Base64 şifreli şifreniz

const payload = {
    password: base64Password // Base64 kodlanmış şifre
};

// JWT token oluşturma
const token = jwt.sign(payload, secret, { expiresIn: '1h' }); // Token 1 saat geçerli

app.use(bodyParser.json()); // JSON verileri işlemek için

app.post('/login', (req, res) => {
    const { password } = req.body;
    const encodedPassword = Buffer.from(password).toString('base64');

    // JWT token oluşturma (gizli anahtar ve Base64 kodlanmış şifre ile)
    const userToken = jwt.sign({ password: encodedPassword }, secret, { expiresIn: '1h' });

    if (userToken) {
        res.json({ token: userToken });
    } else {
        res.status(401).json({ message: 'Geçersiz şifre' });
    }
});

app.listen(3000, () => {
    console.log('Sunucu çalışıyor');
});
