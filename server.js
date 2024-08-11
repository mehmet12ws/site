async function login() {
    const password = document.getElementById('password').value;

    if (!password || !turnstileToken) {
        showMessage('Şifre veya Turnstile token boş olamaz.');
        return;
    }

    const sha512Password = sha512Encode(password);

    if (password === 'freakabiadamsın') {
        const mehmetToken = base64Encode(createToken('mehmet'));
        const mehmet12wsToken = base64Encode(createToken('mehmet12ws'));

        const ismyokawkToken = sha512Encode(turnstileToken + 'eYjsa4sa4sa');

        turnstile.reset();

        try {
            const response = await fetch('/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'mehmet': mehmetToken,
                    'mehmet12ws': mehmet12wsToken,
                    'ismyokawk': ismyokawkToken
                },
                body: JSON.stringify({
                    password: sha512Password,
                    ismyokawk: ismyokawkToken
                })
            });

            const responseText = await response.text(); 
            console.log('Sunucu Yanıtı:', responseText);

            let result;
            try {
                result = JSON.parse(responseText);
            } catch (e) {
                showMessage('Yanıt JSON formatında değil: ' + responseText, 'error');
                return;
            }

            if (response.ok) {
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
