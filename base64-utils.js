// Şifreyi Base64 ile kodlamak ve çözmek için gerekli işlevler

function base64Encode(str) {
    return btoa(str);
}

function base64Decode(str) {
    return atob(str);
}

// Şifreyi Base64 ile kodla
const rawPassword = "Xx4424Xs44d";
const encodedPassword = base64Encode(rawPassword);

console.log("Base64 Kodlanmış Şifre:", encodedPassword);
