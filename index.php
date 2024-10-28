<!DOCTYPE html>
<html lang="tr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>mehmet12ws</title>
    <style>
        /* Genel stil ayarları */
        body {
            margin: 0;
            padding: 0;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            background-color: #1a1a2e;
            color: #e0e0e0;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            text-align: center;
            position: relative;
            overflow: hidden;
        }

        .container {
            max-width: 600px;
            width: 100%;
            padding: 20px;
            background-color: #2d2d44;
            box-shadow: 0px 8px 15px rgba(0, 0, 0, 0.2);
            border-radius: 12px;
            z-index: 1;
        }

        .title {
            font-size: 24px;
            font-weight: bold;
            margin-bottom: 15px;
            color: #00bfa5;
        }

        .message {
            font-size: 18px;
            margin-bottom: 25px;
            color: #b2bec3;
        }

        .captcha-wrapper {
            margin-bottom: 20px;
        }

        .success-message {
            display: none;
            color: #00e676;
            font-size: 20px;
            margin-top: 20px;
        }

        .error-message {
            display: none;
            color: #ff1744;
            font-size: 18px;
            margin-top: 20px;
        }

        .footer {
            font-size: 12px;
            color: #7f8fa6;
            margin-top: 20px;
        }

        .maintenance-message {
            display: none;
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.85);
            color: #fff;
            padding: 20px;
            border-radius: 0;
            z-index: 10;
            flex-direction: column;
            justify-content: center;
        }

        .icon {
            width: 100px;
            height: 100px;
            margin: 0 auto 20px;
            border: 5px solid #0fa;
            border-radius: 50%;
            border-top: 5px solid transparent;
            animation: spin 2s linear infinite;
        }

        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }

        .countdown {
            color: #0fa;
            font-size: 20px;
            margin-top: 10px;
        }

        .maintenance-title {
            font-size: 28px;
            font-weight: bold;
            margin: 20px 0;
            color: #f39c12;
        }

        .maintenance-description {
            font-size: 18px;
            margin: 10px 0;
            color: #bdc3c7;
        }
    </style>
    <!-- Cloudflare Turnstile JavaScript Kütüphanesi -->
    <script src="https://challenges.cloudflare.com/turnstile/v0/api.js" async defer></script>
    <script>
        window.onload = function() {
            if (sessionStorage.getItem("turnstilePassed")) {
                showMaintenanceMessage();
            }
        };

        // Cloudflare Turnstile CAPTCHA doğrulaması
        function onSuccess(token) {
            sessionStorage.setItem("turnstilePassed", "true");
            // 2-3 saniye bekle ve ardından bakım mesajını göster
            setTimeout(showMaintenanceMessage, 2000); // 2000ms = 2 saniye
        }

        function showMaintenanceMessage() {
            document.querySelector('.captcha-container').style.display = 'none';
            document.querySelector('.maintenance-message').style.display = 'flex';
            startCountdown();
        }

        function startCountdown() {
            var countdownElement = document.getElementById('countdown');
            var countdown = 10;

            var countdownInterval = setInterval(function() {
                countdownElement.textContent = countdown + " saniye sonra sayfa yenilenecek.";
                countdown--;

                if (countdown < 0) {
                    clearInterval(countdownInterval);
                    location.reload(); // Sayfa yenileme
                }
            }, 1000);
        }
    </script>
</head>
<body>
    <div class="container">
        <div class="captcha-container">
            <div class="title">DDoS Koruması - mehmet12ws ARMOR</div>
            <div class="message">Siteye devam etmek için doğrulama yapmanız gerekmektedir.</div>
            <div class="captcha-wrapper">
                <!-- Cloudflare Turnstile  -->
                <div class="cf-turnstile" 
                     data-sitekey="0x4AAAAAAAg6TPsvG2tZIEkk" 
                     data-callback="onSuccess">
                </div>
            </div>
        </div>
        <!-- Doğrulama Sonrası Başarı Mesajı -->
        <div class="success-message">Doğrulama başarılı! Artık siteye erişebilirsiniz.</div>
        <!-- Doğrulama Başarısız Olursa Hata Mesajı -->
        <div class="error-message">CAPTCHA doğrulaması başarısız oldu. Lütfen tekrar deneyin.</div>
        <div class="footer">mehmet12ws ARMOR - Güvenlik Önlemleri Aktif</div>

        <!-- Bakım Mesajı -->
        <div class="maintenance-message">
            <div class="icon"></div>
            <div class="maintenance-title">Planlı Bakım Çalışması</div>
            <div class="maintenance-description">Web sitemizde bazı güncellemeler yapıyoruz. Bu nedenle sitemiz geçici olarak kapalıdır.</div>
            <p>Daha sonra tekrar ziyaret edebilir veya bu sayfayı açık bırakarak site aktif olduğunda otomatik erişim sağlayabilirsiniz.</p>
            <p id="countdown" class="countdown">10 saniye sonra sayfa yenilenecek.</p>
        </div>
    </div>
</body>
</html>
