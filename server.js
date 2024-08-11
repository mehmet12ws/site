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

// Admin girişi
app.post('/admin-login', (req, res) => {
    const { password } = req.body;
    const hashedPassword = sha512Encode(password);

    const query = 'SELECT password FROM users WHERE username = ?';
    db.query(query, ['admin'], (err, results) => {
        if (err) {
            console.error('Veritabanı hatası:', err);
            return res.status(500).json({ message: 'Veritabanı hatası' });
        }

        if (results.length === 0 || results[0].password !== hashedPassword) {
            return res.status(401).json({ message: 'Geçersiz şifre' });
        }

        req.session.user = 'authenticated';
        res.status(200).json({ message: 'Giriş başarılı' });
    });
});

// Kullanıcı oluşturma
app.post('/create-user', (req, res) => {
    const { username, password, balance } = req.body;
    const query = 'INSERT INTO users (username, password, balance) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE password = ?, balance = ?';
    db.query(query, [username, password, balance, password, balance], (err) => {
        if (err) {
            console.error('Veritabanı hatası:', err);
            return res.status(500).json({ message: 'Veritabanı hatası' });
        }
        res.status(200).json({ message: 'Kullanıcı başarıyla oluşturuldu' });
    });
});

// Bakiye ekleme
app.post('/add-balance', (req, res) => {
    const { username, amount } = req.body;
    const query = 'UPDATE users SET balance = balance + ? WHERE username = ?';
    db.query(query, [amount, username], (err) => {
        if (err) {
            console.error('Veritabanı hatası:', err);
            return res.status(500).json({ message: 'Veritabanı hatası' });
        }
        res.status(200).json({ message: 'Bakiye başarıyla eklendi' });
    });
});

// Bakiye silme
app.post('/remove-balance', (req, res) => {
    const { username, amount } = req.body;
    const query = 'UPDATE users SET balance = balance - ? WHERE username = ?';
    db.query(query, [amount, username], (err) => {
        if (err) {
            console.error('Veritabanı hatası:', err);
            return res.status(500).json({ message: 'Veritabanı hatası' });
        }
        res.status(200).json({ message: 'Bakiye başarıyla silindi' });
    });
});

// Şifre değiştirme
app.post('/change-password', (req, res) => {
    const { username, password } = req.body;
    const query = 'UPDATE users SET password = ? WHERE username = ?';
    db.query(query, [password, username], (err) => {
        if (err) {
            console.error('Veritabanı hatası:', err);
            return res.status(500).json({ message: 'Veritabanı hatası' });
        }
        res.status(200).json({ message: 'Şifre başarıyla değiştirildi' });
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
