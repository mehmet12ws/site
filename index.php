<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

// İstek sayısını saklamak için bir dosya kullanıyoruz
$countFile = 'request_count.txt';
$statusFile = 'request_status.txt';

// İstek sayısını güncelle
if (file_exists($countFile)) {
    $count = (int)file_get_contents($countFile);
} else {
    $count = 0;
}
$count++;
file_put_contents($countFile, $count);

// İstek bilgileri ve durumunu loglamak için zaman ve IP bilgilerini al
date_default_timezone_set('Europe/Istanbul');
$time = date('Y-m-d H:i:s');
$ip = $_SERVER['HTTP_CF_CONNECTING_IP'] ?? $_SERVER['REMOTE_ADDR'];
$method = $_SERVER['REQUEST_METHOD'];

// İstek geçme veya bloklanma durumu (örnek: sadece GET isteklerine izin veriliyorsa)
$status = ($method === "GET") ? "Geçti" : "Bloklandı";
file_put_contents($statusFile, $status);

// HTML İçeriği
?>
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
        
        .footer {
            font-size: 12px;
            color: #7f8fa6;
            margin-top: 20px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="title">Hoş Geldiniz!</div>
        <div class="message">Gelen İstek Sayısı: <?php echo $count; ?></div>
        <div class="message">Son İstek Durumu: <?php echo $status; ?></div>
        <div class="footer">mehmet12ws - Güvenlik Önlemleri Aktif</div>
    </div>
</body>
</html>
