const express = require('express');
const crypto = require('crypto');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

app.use(bodyParser.json());

function sha512Encode(str) {
    return crypto.createHash('sha512').update(str).digest('base64');
}

function base64Encode(str) {
    return Buffer.from(str, 'utf8').toString('base64');
}

function createToken(prefix) {
    const charset = 'ABCDEasdassa4a4?Asesadsa4a?sedFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()-_=+[]{}|;:,.<>?';
    let token = prefix;
    for (let i = 0; i < 100; i++) {
        token += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    return token;
}

app.get('/get-hash', (req, res) => {
    const hashedPassword = sha512Encode('freakabiadamsın');
    res.json({ hashedPassword });
});

app.post('/login', (req, res) => {
    const { password, turnstileToken } = req.body;

    if (sha512Encode(password) === sha512Encode('freakabiadamsın')) {
        const mehmetToken = base64Encode(createToken('mehmet'));
        const mehmet12wsToken = base64Encode(createToken('mehmet12ws'));
        const ismyokawkToken = sha512Encode(turnstileToken + 'eYjsa4sa4sa');

        res.json({ 
            success: true, 
            message: 'Giriş başarılı!',
            tokens: { mehmetToken, mehmet12wsToken, ismyokawkToken } 
        });
    } else {
        res.status(401).json({ success: false, message: 'Şifre hatalı.' });
    }
});

app.listen(port, () => {
    console.log(`Sunucu ${port} portunda çalışıyor`);
});
