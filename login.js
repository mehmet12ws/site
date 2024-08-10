function validateCode() {
    const userCode = document.getElementById('access-code').value;
    const validCode = 'gizli_kod';

    if (userCode === validCode) {
        alert('Giriş başarılı!');
        window.location.href = 'homepage.html';
    } else {
        alert('Geçersiz kod. Lütfen tekrar deneyin.');
    }
}
