const express = require('express');
const bodyParser = require('body-parser');
const crypto = require('crypto');
const path = require('path');
const app = express();

app.use(bodyParser.json());
app.use(express.static(__dirname));

// Giriş İşlemi
app.post('/login', (req, res) => {
    const password = req.body.password;
    const ismyokawkToken = req.body.ismyokawk;
    const mehmetToken = req.headers['mehmet'];
    const mehmet12wsToken = req.headers['mehmet12ws'];

    const expectedPassword = sha512Encode('freakabiadamsın');
    const expectedIsmyokawkToken = sha512Encode('eYjsa4sa4sa');

    if (password === expectedPassword && ismyokawkToken === expectedIsmyokawkToken) {
        res.json({ message: 'Başarıyla giriş yaptınız.' }); // JSON formatında yanıt
    } else {
        res.status(400).json({ message: 'Şifre veya başlıklar hatalı.' }); // JSON formatında yanıt
    }
});

// Sayfa Yönlendirme
app.get('/homepage.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'homepage.html'));
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
