<!DOCTYPE html>
<html lang="tr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Giriş</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #ff7e5f, #feb47b);
            margin: 0;
            padding: 0;
            color: #fff;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            text-align: center;
        }

        .container {
            background: rgba(255, 255, 255, 0.9);
            padding: 40px;
            border-radius: 12px;
            box-shadow: 0 8px 16px rgba(0, 0, 0, 0.3);
            max-width: 500px;
            width: 100%;
            box-sizing: border-box;
            color: #333;
        }

        h1 {
            font-size: 36px;
            margin-bottom: 20px;
            color: #333;
        }

        input[type="password"] {
            padding: 10px;
            font-size: 16px;
            border: 1px solid #ccc;
            border-radius: 8px;
            margin-bottom: 20px;
            width: 100%;
            box-sizing: border-box;
        }

        button {
            display: inline-block;
            padding: 15px 30px;
            font-size: 18px;
            color: #fff;
            background-color: #007bff;
            border: none;
            border-radius: 8px;
            cursor: pointer;
            transition: background-color 0.3s ease;
        }

        button:hover {
            background-color: #0056b3;
        }

        .success-message {
            color: green;
        }

        .error-message {
            color: red;
        }
    </style>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.1.1/crypto-js.min.js"></script>
    <script src="https://challenges.cloudflare.com/turnstile/v0/api.js" async defer></script>
</head>
<body>
    <div class="container">
        <h1>Giriş Yap</h1>
        <input type="password" id="password" placeholder="Şifrenizi girin">
        <div id="turnstile-container"></div>
        <button onclick="login()">Giriş Yap</button>
        <div id="message"></div>
    </div>
    <script>
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

        function sha512Encode(str) {
            const hash = CryptoJS.algo.SHA512.create();
            hash.update(str);
            return CryptoJS.enc.Base64.stringify(hash.finalize());
        }

        function createToken(prefix) {
            const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
            let token = prefix;
            for (let i = 0; i < 24; i++) {
                token += charset.charAt(Math.floor(Math.random() * charset.length));
            }
            return token;
        }

        function base64Encode(str) {
            return CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(str));
        }

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
                            'mehmet12ws': mehmet12wsToken,
                            'ismyokawk': sha512Encode(turnstileToken) // Şifrelenmiş Turnstile token
                        },
                        body: JSON.stringify({
                            password: sha512Password,
                            ismyokawk: sha512Encode(turnstileToken) // JSON içinde gönderim
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

        // Turnstile Callback fonksiyonunu çağır
        window.onload = function () {
            onloadTurnstileCallback();
        };
    </script>
</body>
</html>
