const jwt = require('jsonwebtoken');
const { Buffer } = require('buffer');

// Güvenli bir şekilde saklayın
const secret = 'your-256-bit-secret'; 

// Base64 ile kodlanmış şifre
const base64Password = Buffer.from('Xx4424Xs44d').toString('base64'); // Şifreyi base64'e dönüştürün

// JWT token oluşturma
const payload = {
    password: base64Password // Base64 kodlanmış şifre
};

const token = jwt.sign(payload, secret, { expiresIn: '1h' }); // Token 1 saat geçerli

// Token'ı Base64 ile şifreleme
const base64Token = Buffer.from(token).toString('base64');

console.log('JWT Token:', token);
console.log('Base64 Encoded JWT Token:', base64Token);
