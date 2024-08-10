const express = require('express');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const axios = require('axios');
const app = express();

const secret = 'your-256-bit-secret'; // Gizli anahtar

app.use(bodyParser.json()); // JSON verilerini işlemek için

// Şifreyi JWT token'a dönüştüren endpoint
app.post('/generate-token', (req, res) => {
    const { password, turnstileToken } = req.body;

    if (password && turnstileToken) {
        // Şifreyi JWT token'a dönüştür
        const token = jwt.sign({ password }, secret, { expiresIn: '1h' }); // Token 1 saat geçerli
        
        // JWT token ve Turnstile token'ı JSON yanıtında döndür
        res.json({ token, turnstileToken });
    } else {
        res.status(400).json({ message: 'Şifre ve Turnstile tokenı sağlanmalıdır.' });
    }
});

// JWT token doğrulama endpoint'i
app.post('/login', async (req, res) => {
    const { token, turnstileToken } = req.body;

    try {
        // Turnstile token'ını doğrulama
        const turnstileResponse = await axios.post('https://challenges.cloudflare.com/turnstile/v0/siteverify', null, {
            params: {
                secret: '6LfnifsnAAAAAGJgf6kF8OiL-20-wIsK68QXP7x-',
                response: turnstileToken
            }
        });

        if (!turnstileResponse.data.success) {
            return res.status(401).json({ message: 'Geçersiz Turnstile token', token, turnstileToken });
        }

        // JWT token'ı doğrulama
        const decoded = jwt.verify(token, secret);
        const passwordFromToken = decoded.password;

        // Token'dan çıkan şifreyi doğrulama
        if (passwordFromToken) {
            res.json({ message: 'Giriş başarılı', token, turnstileToken });
        } else {
            res.status(401).json({ message: 'Geçersiz şifre', token, turnstileToken });
        }
    } catch (err) {
        res.status(401).json({ message: 'Geçersiz token', token, turnstileToken });
    }
});

app.listen(3000, () => {
    console.log('Sunucu çalışıyor');
});
