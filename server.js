const express = require('express');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const app = express();

const secret = 'your-256-bit-secret'; // Gizli anahtarınız

app.use(bodyParser.json()); // JSON verileri işlemek için

// JWT token oluşturma endpoint'i
app.post('/generate-token', (req, res) => {
    const { password, turnstileToken } = req.body;

    if (password && turnstileToken) {
        // JWT token oluşturma
        const token = jwt.sign({ password, turnstileToken }, secret, { expiresIn: '1h' }); // Token 1 saat geçerli
        res.json({ token });
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
        const turnstileFromToken = decoded.turnstileToken;

        // Turnstile token doğrulaması yapılmalıdır
        // Burada şifre doğrulaması yapabilirsiniz (önceden belirlenen şifre ile karşılaştırabilirsiniz)
        if (passwordFromToken === 'Xx4424Xs44d' && turnstileFromToken === turnstileToken) {
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
