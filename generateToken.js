const jwt = require('jsonwebtoken');
const Buffer = require('buffer').Buffer;

const secret = 'your-256-bit-secret'; // Güvenli bir şekilde saklayın

// Base64 ile kodlanmış şifre
const base64Password = 'WHg0NDI0WHM0NGR8'; // 

const payload = {
    password: base64Password // 
};

// JWT token oluşturma
const token = jwt.sign(payload, secret, { expiresIn: '1h' }); // Token 1 saat geçerli

// Token'ı Base64 ile şifreleme
const base64Token = Buffer.from(token).toString('base64');

console.log('JWT Token:', token);
console.log('Base64 Encoded JWT Token:', base64Token);
