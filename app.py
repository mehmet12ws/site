@app.route('/send_request', methods=['POST'])
def send_request():
    api_key = request.form.get('apiKey')
    print(f"Received API Key: {api_key}")

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

    response = requests.post(create_task_url, data=request_body)
    print(f"Create Task Response: {response.text}")
    
    result = response.json()
    print(f"Parsed JSON Result: {result}")

    if result.get("status") == 1:
        task_id = result.get("request")
        print(f"Task ID: {task_id}")

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
        print(f"Result Response: {result_response.text}")
        
        result_data = result_response.json()
        if result_data.get("status") == 1:
            return jsonify({"success": True, "gRecaptchaResponse": result_data.get("request")})
        else:
            return jsonify({"success": False, "message": result_data.get("request")})
    else:
        return jsonify({"success": False, "message": result.get("request")})
