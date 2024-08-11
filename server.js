const express = require('express');
const bodyParser = require('body-parser');
const crypto = require('crypto');

const app = express();
app.use(bodyParser.json());

app.post('/login', (req, res) => {
    const password = req.body.password;
    const ismyokawkToken = req.body.ismyokawk;
    const mehmetToken = req.headers['mehmet'];
    const mehmet12wsToken = req.headers['mehmet12ws'];

    // Şifre doğrulama (SHA-512 ile şifrelenmiş 'freakabiadamsın')
    const expectedPassword = sha512Encode('freakabiadamsın');

    // Tokenleri oluşturma ve şifreleme
    const expectedIsmyokawkToken = sha512Encode('turnstileToken' + 'eYjsa4sa4sa');

    console.log('Gelen Şifre:', password);
    console.log('Beklenen Şifre:', expectedPassword);
    console.log('ismyokawk Token:', ismyokawkToken);

    // Doğru şifre ve başlıkların kontrolü
    if (password === expectedPassword && ismyokawkToken === expectedIsmyokawkToken) {
        res.json({ message: 'Başarıyla giriş yaptınız.' });
    } else {
        res.status(400).json({ message: 'Şifre veya başlıklar hatalı.' });
    }
});

function sha512Encode(str) {
    const hash = crypto.createHash('sha512');
    hash.update(str);
    return hash.digest('base64');
}

app.listen(3000, () => {
    console.log('Sunucu başlatıldı');
});
