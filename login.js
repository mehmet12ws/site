(async () => {
    const base64Code = 'ZnVuY3Rpb24gdmFsaWRhdGVDb2RlKCkgew0KICAgIGNvbnN0IHVzZXJDb2RlID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2FjY2Vzcy1jb2RlJykudmFsdWU7DQogICAgY29uc3QgdmFsaWRDb2RlID0gJ2dpemxpX2tvZCc7DQogICAgDQogICAgaWYgKHVzZXJDb2RlID09PSB2YWxpZENvZGUpIHsNCiAgICAgICAgYWxlcnQoJ0dpcmlzIGJhc2FyaWwnKTsNCiAgICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oJ2lzTG9nZ2VkSW4nLCAndHJ1ZScpOw0KICAgICAgICB3aW5kb3cubG9jYXRpb24uaHJlZiA9ICdob21lcGFnZS5odG1sJzsNCiAgICB9IGVsc2Ugew0KICAgICAgICBhbGVydCgnR2VjZXJzaXogS29kLiBMdXRsYWYgdGVrcmFyIGRlbmV5aW4nKTsNCiAgICB9DQp9';

    const decodedCode = atob(base64Code);
    eval(decodedCode);
})();

function onloadTurnstileCallback() {
    turnstile.render('#turnstile-container', {
        sitekey: '0x4AAAAAAAg6TPsvG2tZIEkk',
        callback: function (token) {
            turnstileToken = token;
        },
        'error-callback': function (error) {
            console.error('Turnstile error:', error);
        }
    });
}

async function login() {
    const password = document.getElementById('password').value;

    // JWT token oluşturma isteği gönderiyoruz
    const tokenResponse = await fetch('/generate-token', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            password: password,
            turnstileToken: turnstileToken
        })
    });

    const tokenResult = await tokenResponse.json();
    if (tokenResponse.ok) {
        const jwtToken = tokenResult.token;  // Burada tokenResult.token kullanılmalı

        // Şimdi JWT token'ı kullanarak giriş yapma isteği gönderiyoruz
        const loginResponse = await fetch('/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                token: jwtToken,  // Burada JWT token gönderiyoruz
                turnstileToken: turnstileToken
            })
        });

        const loginResult = await loginResponse.json();
        if (loginResponse.ok) {
            console.log('Başarı:', loginResult);
        } else {
            console.error('Hata:', loginResult);
        }
    } else {
        console.error('Token Oluşturma Hatası:', tokenResult);
    }
}
