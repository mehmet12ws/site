const express = require('express');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const app = express();

const secret = 'your-256-bit-secret'; // Gizli anahtar

app.use(bodyParser.json()); // JSON verilerini işlemek için

// JWT token oluşturma endpoint'i
app.post('/generate-token', (req, res) => {
    const { password, turnstileToken } = req.body;

    if (password && turnstileToken) {
        // JWT token oluşturma
        const token = jwt.sign({ password }, secret, { expiresIn: '1h' }); // Token 1 saat geçerli
        res.json({ token, turnstileToken });
    } else {
        res.status(400).json({ message: 'Şifre ve Turnstile tokenı sağlanmalıdır.' });
    }
});

// Giriş yapma endpoint'i
app.post('/login', (req, res) => {
    const { token, turnstileToken } = req.body;

    try {
        // JWT token'ını doğrulama
        const decoded = jwt.verify(token, secret);
        const passwordFromToken = decoded.password;

        // Turnstile token doğrulaması yapılmalıdır
        if (passwordFromToken === 'Xx4424Xs44d' && turnstileToken) {
            res.json({ message: 'Giriş başarılı' });
        } else {
            res.status(401).json({ message: 'Geçersiz şifre veya Turnstile token' });
        }
    } catch (err) {
        res.status(401).json({ message: 'Geçersiz token' });
    }
});

app.listen(3000, () => {
    console.log('Sunucu çalışıyor');
});
