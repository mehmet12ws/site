const express = require('express');
const bodyParser = require('body-parser');
const crypto = require('crypto');
const session = require('express-session');
const app = express();

app.use(bodyParser.json());
app.use(session({
    secret: 'your-secret-key', // Oturum anahtarınızı buraya koyun
    resave: false,
    saveUninitialized: true
}));

app.post('/login', (req, res) => {
    const password = req.body.password;
    const ismyokawkToken = req.body.ismyokawk;
    const mehmetToken = req.headers['mehmet'];
    const mehmet12wsToken = req.headers['mehmet12ws'];

    const expectedPassword = sha512Encode('freakabiadamsın');
    const expectedIsmyokawkToken = sha512Encode('turnstileToken' + 'eYjsa4sa4sa');

    if (password === expectedPassword && ismyokawkToken === expectedIsmyokawkToken) {
        // Başarıyla giriş yaptı, oturum token'ı oluştur
        req.session.authenticated = true; // Oturumda doğrulama bilgisi ayarla
        res.json({ message: 'Başarıyla giriş yaptınız.' });
    } else {
        res.status(400).json({ message: 'Şifre veya başlıklar hatalı.' });
    }
});

app.get('/homepage.html', (req, res) => {
    if (req.session.authenticated) {
        // Giriş yapmış kullanıcı için sayfayı gönder
        res.sendFile(__dirname + '/homepage.html');
    } else {
        // Giriş yapılmamışsa erişim engelle
        res.redirect('/login.html');
    }
});

app.use(express.static(__dirname)); // Statik dosyaları sun

function sha512Encode(str) {
    const hash = crypto.createHash('sha512');
    hash.update(str);
    return hash.digest('base64');
}

app.listen(3000, () => {
    console.log('Sunucu başlatıldı');
});
