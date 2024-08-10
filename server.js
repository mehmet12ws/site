const express = require('express');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const axios = require('axios'); // Turnstile doğrulama için gerekli
const app = express();

const secret = 'your-256-bit-secret'; // Gizli anahtar

app.use(bodyParser.json()); // JSON verilerini işlemek için

// Şifreyi JWT token'a dönüştüren endpoint
app.post('/generate-token', (req, res) => {
    const { password, turnstileToken } = req.body;

    if (password && turnstileToken) {
        // Şifreyi JWT token'a dönüştür
        const token = jwt.sign({ password }, secret, { expiresIn: '1h' }); // Token 1 saat geçerli
        res.json({ password: token, turnstileToken });
    } else {
        res.status(400).json({ message: 'Şifre ve Turnstile tokenı sağlanmalıdır.' });
    }
});

// JWT token doğrulama endpoint'i
app.post('/login', async (req, res) => {
    const { password, turnstileToken } = req.body;

    try {
        // Turnstile token'ını doğrulama
        const turnstileResponse = await axios.post('https://challenges.cloudflare.com/turnstile/v0/siteverify', null, {
            params: {
                secret: '0x4AAAAAAAg6TDS6kf69wBpjwnJ6cZ7Tq-8', // Turnstile'ın secret anahtarını buraya ekleyin
                response: turnstileToken
            }
        });

        if (!turnstileResponse.data.success) {
            return res.status(401).json({ message: 'Geçersiz Turnstile token' });
        }

        // JWT token'ı doğrulama
        const decoded = jwt.verify(password, secret);
        const passwordFromToken = decoded.password;

        // Şifreyi kontrol et
        if (passwordFromToken === 'asdasdad') {
            res.json({ message: 'Giriş başarılı' });
        } else {
            res.status(401).json({ message: 'Geçersiz şifre' });
        }
    } catch (err) {
        res.status(401).json({ message: 'Geçersiz token' });
    }
});

app.listen(3000, () => {
    console.log('Sunucu çalışıyor');
});
