const express = require('express');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express();
const secret = 'your-256-bit-secret'; // Gizli anahtar
const turnstileSecret = '6LfnifsnAAAAAGJgf6kF8OiL-20-wIsK68QXP7x-'; // Turnstile gizli anahtarı

app.use(bodyParser.json()); // JSON verilerini işlemek için

// Şifreyi JWT token'a dönüştüren endpoint
app.post('/generate-token', (req, res) => {
    const { password, turnstileToken } = req.body;

    if (turnstileToken) {
        // Turnstile token'ını doğrulama
        axios.post('https://challenges.cloudflare.com/turnstile/v0/siteverify', null, {
            params: {
                secret: turnstileSecret,
                response: turnstileToken
            }
        }).then(turnstileResponse => {
            if (!turnstileResponse.data.success) {
                return res.status(401).json({ message: 'Geçersiz Turnstile token' });
            }

            // Şifreyi JWT token'a dönüştürme
            const token = jwt.sign({ password }, secret, { expiresIn: '1h' }); // Token 1 saat geçerli

            // JWT token'ı JSON yanıtında döndür
            res.json({ token });
        }).catch(err => {
            res.status(500).json({ message: 'Turnstile doğrulama hatası' });
        });
    } else {
        res.status(400).json({ message: 'Turnstile tokenı sağlanmalıdır.' });
    }
});

// JWT token doğrulama endpoint'i
app.post('/login', (req, res) => {
    const { token, turnstileToken } = req.body;

    if (turnstileToken) {
        // Turnstile token'ını doğrulama
        axios.post('https://challenges.cloudflare.com/turnstile/v0/siteverify', null, {
            params: {
                secret: turnstileSecret,
                response: turnstileToken
            }
        }).then(turnstileResponse => {
            if (!turnstileResponse.data.success) {
                return res.status(401).json({ message: 'Geçersiz Turnstile token' });
            }

            try {
                // JWT token'ı doğrulama
                const decoded = jwt.verify(token, secret);
                res.json({ message: 'Giriş başarılı', decoded });
            } catch (err) {
                res.status(401).json({ message: 'Geçersiz token' });
            }
        }).catch(err => {
            res.status(500).json({ message: 'Turnstile doğrulama hatası' });
        });
    } else {
        res.status(400).json({ message: 'Turnstile tokenı sağlanmalıdır.' });
    }
});

app.listen(3000, () => {
    console.log('Sunucu çalışıyor');
});
