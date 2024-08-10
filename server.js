const express = require('express');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express();
const secret = process.env.JWT_SECRET || 'your-256-bit-secret'; // Gizli anahtar

app.use(bodyParser.json()); // JSON verilerini işlemek için

// Şifreyi JWT token'a dönüştüren endpoint
app.post('/generate-token', (req, res) => {
    const { password, turnstileToken } = req.body;

    if (turnstileToken) {
        // Turnstile doğrulamasını yapın
        axios.post('https://challenges.cloudflare.com/turnstile/v0/siteverify', null, {
            params: {
                secret: '6LfnifsnAAAAAGJgf6kF8OiL-20-wIsK68QXP7x-',
                response: turnstileToken
            }
        }).then(turnstileResponse => {
            if (turnstileResponse.data.success) {
                // Şifre doğrulaması ve JWT oluşturma
                if (password) {
                    const token = jwt.sign({ password }, secret, { expiresIn: '1h' }); // Token 1 saat geçerli
                    res.json({ token, turnstileToken });
                } else {
                    res.status(400).json({ message: 'Geçersiz şifre' });
                }
            } else {
                res.status(401).json({ message: 'Geçersiz Turnstile token' });
            }
        }).catch(error => {
            res.status(500).json({ message: 'Turnstile doğrulama hatası' });
        });
    } else {
        res.status(400).json({ message: 'Turnstile tokenı sağlanmalıdır.' });
    }
});

// JWT token doğrulama endpoint'i
app.post('/login', (req, res) => {
    const { token, turnstileToken } = req.body;

    // Turnstile doğrulamasını yapın
    axios.post('https://challenges.cloudflare.com/turnstile/v0/siteverify', null, {
        params: {
            secret: '6LfnifsnAAAAAGJgf6kF8OiL-20-wIsK68QXP7x-',
            response: turnstileToken
        }
    }).then(turnstileResponse => {
        if (turnstileResponse.data.success) {
            // JWT token'ı doğrulama
            try {
                const decoded = jwt.verify(token, secret);
                res.json({ message: 'Giriş başarılı', token, turnstileToken });
            } catch (err) {
                res.status(401).json({ message: 'Geçersiz token' });
            }
        } else {
            res.status(401).json({ message: 'Geçersiz Turnstile token' });
        }
    }).catch(error => {
        res.status(500).json({ message: 'Turnstile doğrulama hatası' });
    });
});

app.listen(3000, () => {
    console.log('Sunucu çalışıyor');
});
