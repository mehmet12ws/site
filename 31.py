from flask import Flask, render_template, request, jsonify
import requests
import time

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('deneme.html')

@app.route('/send_request', methods=['POST'])
def send_request():
    api_key = request.form.get('apiKey')

    # 2Captcha API URL'leri
    create_task_url = "https://2captcha.com/in.php"
    get_result_url = "https://2captcha.com/res.php"

    # Turnstile için isteği oluşturma
    request_body = {
        "method": "turnstile",
        "key": api_key,
        "sitekey": "0x4AAAAAAABFlgIgsFUIYITx",  # Turnstile site key
        "pageurl": "https://me.miniclip.com/login",
        "json": 1
    }

    # İsteği gönderme
    response = requests.post(create_task_url, data=request_body)
    result = response.json()

    if result.get("status") == 1:
        task_id = result.get("request")

        # Sonucu kontrol etmek için biraz bekleme (örneğin 20 saniye)
        time.sleep(20)

        # Sonucu alma
        result_params = {
            "key": api_key,
            "action": "get",
            "id": task_id,
            "json": 1
        }
        result_response = requests.get(get_result_url, params=result_params)
        result_data = result_response.json()

        if result_data.get("status") == 1:
            return jsonify({"success": True, "gRecaptchaResponse": result_data.get("request")})
        else:
            return jsonify({"success": False, "message": result_data.get("request")})
    else:
        return jsonify({"success": False, "message": result.get("request")})

if __name__ == '__main__':
    app.run(debug=True)
