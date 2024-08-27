document.getElementById('captchaForm').addEventListener('submit', function(event) {
    event.preventDefault();
    
    const siteKey = document.getElementById('captcha_sitekey').value;
    const pageUrl = document.getElementById('captcha_page_url').value;
    const apiKey = '9243ef65a854e0801b510d306e952dfc'; // Buraya 2Captcha API anahtarınızı ekleyin

    const url = `https://2captcha.com/in.php?key=${apiKey}&method=userrecaptcha&googlekey=${siteKey}&pageurl=${pageUrl}&json=1`;

    fetch(url, {
        method: 'GET',
    })
    .then(response => response.json())
    .then(data => {
        if (data.status === 1) {
            const captchaId = data.request;
            document.getElementById('result').textContent = 'CAPTCHA çözülüyor, lütfen bekleyin...';
            checkCaptchaResult(apiKey, captchaId);
        } else {
            document.getElementById('result').textContent = 'CAPTCHA isteği başarısız: ' + data.request;
        }
    });
});

function checkCaptchaResult(apiKey, captchaId) {
    const url = `https://2captcha.com/res.php?key=${apiKey}&action=get&id=${captchaId}&json=1`;
    setTimeout(() => {
        fetch(url, {
            method: 'GET',
        })
        .then(response => response.json())
        .then(data => {
            if (data.status === 1) {
                document.getElementById('result').textContent = 'CAPTCHA Çözüldü: ' + data.request;
            } else if (data.request === 'CAPCHA_NOT_READY') {
                document.getElementById('result').textContent = 'CAPTCHA çözülüyor, lütfen bekleyin...';
                checkCaptchaResult(apiKey, captchaId); // Sonuç hazır değilse tekrar dene
            } else {
                document.getElementById('result').textContent = 'CAPTCHA Çözülemedi: ' + data.request;
            }
        });
    }, 5000); // 5 saniye bekleyin
}
