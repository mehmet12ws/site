let turnstileToken = '';

function onloadTurnstileCallback() {
    turnstile.render('#turnstile-container', {
        sitekey: '0x4AAAAAAAg6TPsvG2tZIEkk',
        callback: function (token) {
            turnstileToken = token;
        },
        'error-callback': function (error) {
            showMessage('Turnstile doğrulama hatası: ' + error.message);
        }
    });
}

function showMessage(message, type = 'error') {
    const messageElement = document.getElementById('message');
    messageElement.className = type === 'error' ? 'error-message' : 'success-message';
    messageElement.textContent = message;
}

async function login() {
    const password = document.getElementById('password').value;

    if (!password || !turnstileToken) {
        showMessage('Şifre veya Turnstile token boş olamaz.');
        return;
    }

    turnstile.reset();

    try {
        // Token oluşturma isteği
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
            const jwtToken = tokenResult.token;

            // Token'i ekranda göster
            showMessage(`JWT Token: ${jwtToken}`, 'success');
            
            // Token'i tarayıcıda sakla (örneğin, localStorage kullanarak)
            localStorage.setItem('jwtToken', jwtToken);

            // Giriş yapma isteği
            const loginResponse = await fetch('/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    token: jwtToken,
                    turnstileToken: turnstileToken
                })
            });

            const loginResult = await loginResponse.json();
            if (loginResponse.ok) {
                showMessage('Başarıyla giriş yaptınız.', 'success');
                window.location.href = 'homepage.html';
            } else {
                showMessage('Giriş hatası: ' + loginResult.message);
            }
        } else {
            showMessage('Token oluşturma hatası: ' + tokenResult.message);
        }
    } catch (error) {
        showMessage('Bir hata oluştu: ' + error.message);
    }
}
