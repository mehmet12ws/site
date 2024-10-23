<script>
    // IP ve istek sayısını yönetmek için basit bir API işlevi
    async function logRequest() {
        try {
            const response = await fetch('https://your-server-api-endpoint/log', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    timestamp: new Date(),
                    // Burada, IP'yi almak için gerekli bir API çağrısı yapılabilir
                })
            });

            if (response.ok) {
                const data = await response.json();
                // İstek sayısını güncelle
                document.getElementById('request-info').innerText = `
                    Toplam İstek: ${data.total_requests}
                    Engellenen İstek: ${data.blocked_requests}
                    İzin Verilen İstek: ${data.allowed_requests}
                `;
            } else {
                console.error('IP kaydedilemedi:', response.status);
            }
        } catch (error) {
            console.error('Hata:', error);
        }
    }

    window.onload = function() {
        logRequest();
    };
</script>
