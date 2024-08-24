fetch('/send_request', {
    method: 'POST',
    body: formData
})
.then(response => {
    if (!response.ok) {
        throw new Error('Network response was not ok');
    }
    return response.json();
})
.then(data => {
    var resultDiv = document.getElementById('result');
    if (data.success) {
        resultDiv.innerHTML = `<p>CAPTCHA başarıyla çözüldü: ${data.gRecaptchaResponse}</p>`;
    } else {
        resultDiv.innerHTML = `<p>CAPTCHA çözme hatası: ${data.message}</p>`;
    }
})
.catch(error => {
    console.error('Hata:', error);
    document.getElementById('result').innerHTML = `<p>İstek sırasında bir hata oluştu: ${error.message}</p>`;
});
