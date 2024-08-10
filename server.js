const express = require('express');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const app = express();

const secret = 'your-256-bit-secret'; // Aynı gizli anahtarı kullanın

app.use(bodyParser.json()); // JSON verileri işlemek için

app.post('/login', (req, res) => {
    const { jwtToken } = req.body;

    try {
        // JWT token'ını doğrulama
        const decoded = jwt.verify(jwtToken, secret);
        // Token'dan şifreyi al
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
