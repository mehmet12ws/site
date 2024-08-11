const express = require('express');
const bodyParser = require('body-parser');
const crypto = require('crypto');
const session = require('express-session');
const app = express();

app.use(bodyParser.json());
app.use(express.static(__dirname));
app.use(session({
    secret: 'your-secret-key', // Oturum anahtarınızı buraya koyun
    resave: false,
    saveUninitialized: true
}));

// Giriş İşlemi
app.post('/login', (req, res) => {
    const password = req.body.password;
    const ismyokawkToken = req.body.ismyokawk;
    const mehmetToken = req.headers['mehmet'];
    const mehmet12wsToken = req.headers['mehmet12ws'];

    const expectedPassword = sha512Encode('freakabiadamsın');
    const expectedIsmyokawkToken = sha512Encode('eYjsa4sa4sa'); // Turnstile token ile uyumlu token

    if (password === expectedPassword && ismyokawkToken === expectedIsmyokawkToken) {
        req.session.authenticated = true; // Oturumda doğrulama bilgisi ayarla
        res.json({ message: 'Başarıyla giriş yaptınız.' });
    } else {
        res.status(400).json({ message: 'Şifre veya başlıklar hatalı.' });
    }
});

// Sayfa Yönlendirme
app.get('/homepage.html', (req, res) => {
    if (req.session.authenticated) {
        res.sendFile(__dirname + '/homepage.html');
    } else {
        res.redirect('/login.html');
    }
});

// Şifreyi SHA-512 ile şifreleme
function sha512Encode(str) {
    const hash = crypto.createHash('sha512');
    hash.update(str);
    return hash.digest('base64');
}

// Sunucuyu başlatma
app.listen(3000, () => {
    console.log('Sunucu başlatıldı');
});
