const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: true,
}));

// Kullanıcının giriş yapıp yapmadığını kontrol eden bir middleware
function isAuthenticated(req, res, next) {
    if (req.session.authenticated) {
        return next();
    } else {
        res.redirect('/login.html');
    }
}

// Giriş yapılmış kullanıcılar için korunan bir route
app.get('/homepage.html', isAuthenticated, (req, res) => {
    res.sendFile(path.join(__dirname, 'homepage.html'));
});

// Giriş yapma işlemi
app.post('/login', (req, res) => {
    if (req.body.password === 'freakabiadamsın') {
        req.session.authenticated = true;
        res.json({ success: true });
    } else {
        res.status(401).json({ message: 'Giriş hatalı' });
    }
});

// Giriş çıkış işlemi
app.post('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.status(500).json({ message: 'Çıkış hatası' });
        }
        res.json({ success: true });
    });
});

// Diğer statik dosyalar
app.use(express.static(path.join(__dirname, 'public')));

app.listen(3000, () => {
    console.log('Sunucu 3000 portunda çalışıyor.');
});
