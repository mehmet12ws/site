const express = require('express');
const path = require('path');
const session = require('express-session');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const CryptoJS = require('crypto-js');

// MySQL veritabanı bağlantısı
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'sifre',
    database: 'kullanicilar'
});

db.connect((err) => {
    if (err) {
        console.error('Veritabanı bağlantısı başarısız:', err);
    } else {
        console.log('Veritabanına başarıyla bağlanıldı.');
    }
});

const app = express();
app.use(bodyParser.json());

// Oturum yönetimi
app.use(session({
    secret: 'gizliAnahtar',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}));

// Şifreleme fonksiyonları
function sha512Encode(str) {
    const hash = CryptoJS.algo.SHA512.create();
    hash.update(str);
    return CryptoJS.enc.Base64.stringify(hash.finalize());
}

function base64Encode(str) {
    return CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(str));
}

function md5Encode(str) {
    return CryptoJS.MD5(str).toString();
}

function createToken(prefix) {
    const charset = 'ABCDEasdassa4a4?Asesadsa4a?sedFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()-_=+[]{}|;:,.<>?';
    let token = prefix;
    for (let i = 0; i < 100; i++) {
        token += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    return token;
}

// Şifre belirleme işlemi
app.post('/set-password', (req, res) => {
    const { password } = req.body;

    if (!password) {
        return res.status(400).json({ message: 'Şifre boş olamaz.' });
    }

    // Şifreleme işlemleri
    const sha512First = sha512Encode(password);
    const base64Encoded = base64Encode(sha512First);
    const md5Encoded = md5Encode(base64Encoded);
    const finalSha512 = sha512Encode(md5Encoded);

    const query = 'INSERT INTO users (username, password) VALUES (?, ?) ON DUPLICATE KEY UPDATE password = ?';
    db.query(query, ['admin', finalSha512, finalSha512], (err) => {
        if (err) {
            console.error('Veritabanı hatası:', err);
            return res.status(500).json({ message: 'Veritabanı hatası' });
        }
        res.status(200).json({ message: 'Şifre başarıyla kaydedildi.' });
    });
});

// Giriş işlemi
app.post('/login', (req, res) => {
    const { password } = req.body;
    const mehmetToken = base64Encode(createToken('mehmet'));
    const mehmet12wsToken = base64Encode(createToken('mehmet12ws'));
    const ismyokawkToken = sha512Encode('eYjsa4sa4sa'); // Örnek sabit değer

    if (!password) {
        return res.status(400).json({ message: 'Şifre boş olamaz.' });
    }

    // Şifreleme işlemleri
    const sha512First = sha512Encode(password);
    const base64Encoded = base64Encode(sha512First);
    const md5Encoded = md5Encode(base64Encoded);
    const finalSha512 = sha512Encode(md5Encoded);

    const query = 'SELECT password FROM users WHERE username = ?';
    db.query(query, ['admin'], (err, results) => {
        if (err) {
            console.error('Veritabanı hatası:', err);
            return res.status(500).json({ message: 'Veritabanı hatası' });
        }

        if (results.length === 0) {
            return res.status(401).json({ message: 'Geçersiz kullanıcı' });
        }

        const user = results[0];

        if (finalSha512 === user.password) {
            req.session.user = 'authenticated';
            res.status(200).json({ message: 'Giriş başarılı', redirectUrl: '/homepage.html' });
        } else {
            res.status(401).json({ message: 'Geçersiz şifre' });
        }
    });
});

// Korumalı sayfaya erişim
app.get('/homepage.html', (req, res) => {
    if (req.session.user) {
        res.sendFile(path.join(__dirname, 'public', 'homepage.html'));
    } else {
        res.redirect('/login.html');
    }
});

// Diğer statik dosyalar
app.use(express.static('public'));

// Sunucuyu başlat
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Sunucu ${PORT} portunda çalışıyor.`);
});
