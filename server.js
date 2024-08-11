const express = require('express');
const path = require('path');
const session = require('express-session');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const bcrypt = require('bcrypt');

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

// Şifre belirleme işlemi
app.post('/set-password', async (req, res) => {
    const { password } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        const query = 'INSERT INTO users (username, password) VALUES (?, ?) ON DUPLICATE KEY UPDATE password = ?';
        db.query(query, ['admin', hashedPassword, hashedPassword], (err) => {
            if (err) {
                console.error('Veritabanı hatası:', err);
                return res.status(500).json({ message: 'Veritabanı hatası' });
            }

            res.status(200).json({ message: 'Şifre başarıyla kaydedildi.' });
        });
    } catch (error) {
        console.error('Şifre kaydetme hatası:', error);
        res.status(500).json({ message: 'Şifre kaydedilemedi' });
    }
});

// Giriş işlemi
app.post('/login', (req, res) => {
    const { password } = req.body;

    const query = 'SELECT password FROM users WHERE username = ?';
    db.query(query, ['admin'], (err, results) => {
        if (err) {
            res.status(500).json({ message: 'Veritabanı hatası' });
            return;
        }

        if (results.length === 0) {
            res.status(401).json({ message: 'Geçersiz kullanıcı' });
            return;
        }

        const user = results[0];

        bcrypt.compare(password, user.password, (err, isMatch) => {
            if (err) {
                res.status(500).json({ message: 'Şifre doğrulama hatası' });
                return;
            }

            if (isMatch) {
                req.session.user = 'authenticated';
                res.status(200).json({ message: 'Giriş başarılı', redirectUrl: '/homepage.html' });
            } else {
                res.status(401).json({ message: 'Geçersiz şifre' });
            }
        });
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
