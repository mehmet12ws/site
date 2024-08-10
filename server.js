const express = require('express');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const app = express();

const secret = 'your-256-bit-secret'; // Gizli anahtarınız

app.use(bodyParser.json()); // JSON verileri işlemek için

// JWT token oluşturma endpoint'i
app.post('/generate-token', (req, res) => {
    const { password } = req.body;

    if (password) {
        // JWT token oluşturma
        const token = jwt.sign({ password }, secret, { expiresIn: '1h' }); // Token 1 saat geçerli
        res.json({ token });
    } else {
        res.status(400).json({ message: 'Şifre sağlanmalıdır.' });
    }
});

// Giriş yapma endpoint'i
app.post('/login', (req, res) => {
    const { token } = req.body; // Burada token, şifrenin şifrelenmiş hali olacak

    try {
        // JWT token'ını doğrulama
        const decoded = jwt.verify(token, secret);
        const passwordFromToken = decoded.password;

        // Burada şifre doğrulaması yapabilirsiniz (önceden belirlenen şifre ile karşılaştırabilirsiniz)
        if (passwordFromToken === 'Xx4424Xs44d') {
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
