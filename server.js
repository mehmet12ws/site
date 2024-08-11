const express = require('express');
const bodyParser = require('body-parser');
const crypto = require('crypto');

const app = express();
app.use(bodyParser.json());

app.post('/login', (req, res) => {
    const { password } = req.body;
    const mehmetToken = req.headers['mehmet'];
    const mehmet12wsToken = req.headers['mehmet12ws'];
    const ismyokawkToken = req.headers['ismyokawk'];

    // Şifre doğrulama (SHA-512 ile şifrelenmiş 'freakabiadamsın')
    const expectedPassword = sha512Encode('freakabiadamsın');

    console.log('Gelen Şifre:', password);
    console.log('Beklenen Şifre:', expectedPassword);
    console.log('ismyokawk Token:', ismyokawkToken);

    if (password === expectedPassword) {
        res.json({ message: 'Başarıyla giriş yaptınız.' });
    } else {
        res.status(400).json({ message: 'Şifre hatalı.' });
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
