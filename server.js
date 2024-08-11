async function login() {
    const password = document.getElementById('password').value;

    if (!password || !turnstileToken) {
        showMessage('Şifre veya Turnstile token boş olamaz.');
        return;
    }

    const sha512Password = sha512Encode(password);
    const mehmetToken = base64Encode(createToken('mehmet'));
    const mehmet12wsToken = base64Encode(createToken('mehmet12ws'));
    const ismyokawkToken = sha512Encode(turnstileToken + 'eYjsa4sa4sa');

    turnstile.reset();

    // Şifreyi POST verilerine ekleyerek görünür hale getirelim
    const payload = {
        password: sha512Password,
        ismyokawk: ismyokawkToken
    };

    try {
        const response = await fetch('/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'mehmet': mehmetToken,
                'mehmet12ws': mehmet12wsToken,
                'ismyokawk': ismyokawkToken
            },
            body: JSON.stringify(payload)
        });

        const responseText = await response.text();
        console.log('Sunucu Yanıtı:', responseText);

        let result;
        try {
            result = JSON.parse(responseText);
        } catch (e) {
            // JSON formatında değilse, düz metin olarak işleyin ve gösterin
            showMessage('Yanıt: ' + responseText, 'error');
            return;
        }

        if (response.ok) {
            window.location.href = '/homepage.html'; // Başarılıysa yönlendir
        } else {
            showMessage('Giriş hatası: ' + result.message);
        }
    } catch (error) {
        showMessage('Bir hata oluştu: ' + error.message);
    }
}
