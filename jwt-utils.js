// JWT ve Base64 Kodlama için gerekli kütüphaneyi dahil edin
// CryptoJS kütüphanesini kullanarak JWT oluşturacağız
// Token oluşturma ve doğrulama işlevlerini burada tanımlıyoruz

function base64UrlEncode(str) {
    return btoa(str).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function base64UrlDecode(str) {
    str = str.replace(/-/g, '+').replace(/_/g, '/');
    switch (str.length % 4) {
        case 0: break;
        case 2: str += '=='; break;
        case 3: str += '='; break;
        default: throw 'Illegal base64url string!';
    }
    return atob(str);
}

function createJwtToken(payload, secret) {
    const header = {
        alg: "HS256",
        typ: "JWT"
    };

    const encodedHeader = base64UrlEncode(JSON.stringify(header));
    const encodedPayload = base64UrlEncode(JSON.stringify(payload));

    const signature = CryptoJS.HmacSHA256(encodedHeader + "." + encodedPayload, secret).toString(CryptoJS.enc.Base64)
        .replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');

    return `${encodedHeader}.${encodedPayload}.${signature}`;
}

const secret = "your-256-bit-secret"; // Güvenli bir şekilde saklanmalı

// Şifreyi payload olarak ekle
const payload = {
    password: "Xx4424Xs44d"
};

// JWT token oluşturma
const jwtToken = createJwtToken(payload, secret);

console.log("JWT Token:", jwtToken);
