function register_detect(){
	var id = document.getElementById("account_id").value;
    var pw = document.getElementById("account_pw").value;
    var type = document.getElementById("account_type").value;
    var pass = true;
    var reg = /^[a-zA-Z0-9]+$/
    if (pass) {
        if (!reg.test(pw)) {
        pass = false;
        alert("密碼請使用英文(大、小寫)及數字!!!");
        }
    }
    if (pass) {
    	var xhr = new XMLHttpRequest();
		xhr.open("POST", "http://114.35.143.250:5000/api/Register");
		xhr.setRequestHeader('Content-Type', 'application/json');
		var json = {"account_id": id,"account_pw": pw, "account_type": type};
		var myjson = JSON.stringify(json);		//JSON轉JSON字串
		xhr.send(myjson);
        xhr.onload = function(){
            var rsp = xhr.responseText;
            var rsp_json = JSON.parse(rsp)		//JSON字串轉JSON
            if (rsp_json.rsp_code == "200") {
                alert("註冊成功!!!");
                window.location.href="http://114.35.143.250:5000/Food_Penguin/Index";       //放要跳過去的網址
            }
            else {
                alert("此帳號已存在!!!");
            }
        }
    }
}