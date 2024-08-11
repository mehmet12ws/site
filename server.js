const express = require('express');
const path = require('path');
const session = require('express-session');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

// Oturum yönetimi
app.use(session({
    secret: 'gizliAnahtar',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: true } // HTTPS kullanıyorsanız `secure: true` yapın
}));

// Giriş işlemi
app.post('/login', (req, res) => {
    const { password, ismyokawk } = req.body;

    // Şifre doğrulama
    const correctPasswordHash = 'correctHashedPassword'; // Doğru şifrenin hash değeri (Bu değeri kendinize göre belirleyin)
    
    if (password === correctPasswordHash) { 
        req.session.user = 'authenticated';
        res.status(200).json({ message: 'Giriş başarılı', redirectUrl: '/homepage.html' });
    } else {
        res.status(401).json({ message: 'Geçersiz şifre' });
    }
});

// Korumalı sayfaya erişim
app.get('/homepage.html', (req, res) => {
    if (req.session.user) { 
        res.sendFile(path.join(__dirname, 'public', 'homepage.html'));
    } else {
        res.redirect('/login.html'); // Giriş yapılmadıysa yönlendir
    }
});

// Diğer statik dosyalar
app.use(express.static('public'));

function sha512Encode(input) {
    // Sha512 hashing fonksiyonu
}

// Sunucuyu başlat
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Sunucu ${PORT} portunda çalışıyor.`);
});
