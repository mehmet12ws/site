const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const crypto = require('crypto');

const app = express();
const secret = 'your-256-bit-secret'; // Gizli anahtar

app.use(bodyParser.json()); // JSON verilerini işlemek için

// JWT'yi oluşturmak için yardımcı fonksiyon
function createToken(payload) {
    const header = JSON.stringify({ alg: 'HS256', typ: 'JWT' });
    const encodedHeader = Buffer.from(header).toString('base64url');
    const encodedPayload = Buffer.from(JSON.stringify(payload)).toString('base64url');
    const signature = crypto
        .createHmac('sha256', secret)
        .update(`${encodedHeader}.${encodedPayload}`)
        .digest('base64url');
    return `${encodedHeader}.${encodedPayload}.${signature}`;
}

// JWT'yi doğrulamak için yardımcı fonksiyon
function verifyToken(token) {
    const [header, payload, signature] = token.split('.');
    const expectedSignature = crypto
        .createHmac('sha256', secret)
        .update(`${header}.${payload}`)
        .digest('base64url');
    
    if (expectedSignature !== signature) {
        throw new Error('Geçersiz token');
    }
    const decodedPayload = Buffer.from(payload, 'base64url').toString();
    return JSON.parse(decodedPayload);
}

// Şifreyi JWT token'a dönüştüren endpoint
app.post('/generate-token', (req, res) => {
    const { password, turnstileToken } = req.body;

    if (turnstileToken) {
        // Özel şifre kontrolü
        if (password) {
            const token = createToken({ password });
            res.json({ token, turnstileToken });
        } else {
            res.status(400).json({ message: 'Geçersiz şifre' });
        }
    } else {
        res.status(400).json({ message: 'Turnstile tokenı sağlanmalıdır.' });
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
            return res.status(401).json({ message: 'Geçersiz Turnstile token' });
        }

        // JWT token'ı doğrulama
        try {
            const decoded = verifyToken(token);
            const passwordFromToken = decoded.password;

            // Token'dan çıkan şifreyi doğrulama
            if (passwordFromToken) {
                res.json({ message: 'Giriş başarılı', token, turnstileToken });
            } else {
                res.status(401).json({ message: 'Geçersiz şifre' });
            }
        } catch (err) {
            res.status(401).json({ message: 'Geçersiz token' });
        }
    } catch (err) {
        res.status(401).json({ message: 'Geçersiz Turnstile token' });
    }
});

app.listen(3000, () => {
    console.log('Sunucu çalışıyor');
});
