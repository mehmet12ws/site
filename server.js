const express = require('express');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const app = express();

const secret = 'your-256-bit-secret'; // Aynı gizli anahtarı kullanın

// Base64 ile kodlanmış şifre
const base64Password = Buffer.from('Xx4424Xs44d').toString('base64'); // Base64 şifreli şifreniz

app.use(bodyParser.json()); // JSON verileri işlemek için

app.post('/login', (req, res) => {
    const { password, turnstileToken } = req.body;

    // Turnstile token'ı doğrulama işlemini burada yapmalısınız
    // Bu örnekte, doğrulama yapılmıyor, sadece token'ı kontrol ediyoruz

    if (!turnstileToken) {
        return res.status(400).json({ message: 'Turnstile doğrulaması eksik' });
    }

    // Şifreyi Base64 ile kodlayarak karşılaştırma
    const encodedPassword = Buffer.from(password).toString('base64');

    if (encodedPassword === base64Password) {
        // JWT token oluşturma
        const token = jwt.sign({ password: encodedPassword }, secret, { expiresIn: '1h' }); // Token 1 saat geçerli
        res.json({ token }); // Token'ı JSON yanıtı olarak gönderiyoruz
    } else {
        res.status(401).json({ message: 'Geçersiz şifre' });
    }
});

app.listen(3000, () => {
    console.log('Sunucu çalışıyor');
});
