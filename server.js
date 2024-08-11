async function login() {
    const password = document.getElementById('password').value;

    if (!password || !turnstileToken) {
        showMessage('Şifre veya Turnstile token boş olamaz.');
        return;
    }

    // Şifreyi SHA-512 ile şifrele
    const sha512Password = sha512Encode(password);

    if (password === 'freakabiadamsın') {
        // Token oluştur
        const mehmetToken = base64Encode(createToken('mehmet'));
        const mehmet12wsToken = base64Encode(createToken('mehmet12ws'));

        // Turnstile CAPTCHA doğrulamasını sıfırla
        turnstile.reset();

        try {
            const response = await fetch('/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'mehmet': mehmetToken,
                    'mehmet12ws': mehmet12wsToken
                },
                body: JSON.stringify({
                    password: sha512Password,
                    turnstileToken: turnstileToken
                })
            });

            // Yanıtın ham halini kontrol et
            const responseText = await response.text(); // Ham yanıtı al
            console.log('Sunucu Yanıtı:', responseText);

            // JSON formatında yanıtı işle
            let result;
            try {
                result = JSON.parse(responseText);
            } catch (e) {
                showMessage('Yanıt JSON formatında değil.', 'error');
                return;
            }

            if (response.ok) {
                // Başarıyla giriş yaptıktan sonra yönlendirme
                window.location.href = 'https://mehmet12ws.online/homepage.html';
            } else {
                showMessage('Giriş hatası: ' + result.message);
            }
        } catch (error) {
            showMessage('Bir hata oluştu: ' + error.message);
        }
    } else {
        showMessage('Şifre hatalı.', 'error');
    }
}
