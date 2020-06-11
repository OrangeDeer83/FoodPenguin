window.onload = function(){
	var list = document.getElementById("info");
	var xhr = new XMLHttpRequest();
	xhr.open("GET", "http://114.35.143.250:5000/api/list_store");
	xhr.onload = function(){
		var store = xhr.responseText;
		var store_json = JSON.parse(store);
		var add = "";
        var d = new Date();
        var time = "";
        if (d.getHours() < 10) {
            time += "0" + d.getHours();
        }
        else{
            time += d.getHours();
        }
        if (d.getMinutes() < 10) {
            time += "0" + d.getMinutes();
        }
        else{
            time += d.getMinutes();
        }
        if (d.getSeconds() < 10) {
            time += "0" +d.getSeconds();
        }
        else{
            time += d.getSeconds();
        }
		for (var i = 0; i < store_json.data.length; i++) {
            alert(store_json);
			add += "<div class='col-sm-12 col-md-6 col-lg-4 col-xl-3'><div class='pic'><img src='http://114.35.143.250/Food_Penguin/api/static/img/store/" + store_json.data[i][8] + "?v=" + time + "'  onclick='please_login();''></div><p>" + store_json.data[i][1] + "</p></div>";
		}
		list.innerHTML = add;
	}
	xhr.send();
}

function please_login(){
	alert("請先登入，謝謝!");
}

function login_detect(){
	var id = document.getElementById("account_id").value;
    var pw = document.getElementById("account_pw").value;
    var type = document.getElementById("account_type").value;
    var pass = true;
    var reg = /^[a-zA-Z0-9]+$/
    if (pass) {
        if (!reg.test(pw)) {
        pass = false;
        alert("密碼請輸入英文(大、小寫)及數字!!!");
        }
    }
    if (pass) {
    	var xhr = new XMLHttpRequest();
		xhr.open("POST", "http://114.35.143.250:5000/api/Login");
		xhr.setRequestHeader('Content-Type', 'application/json');
		var json = {"account_id": id,"account_pw": pw, "account_type": type};
		var myjson = JSON.stringify(json);		//JSON轉JSON字串
		xhr.send(myjson);
        xhr.onload = function(){
            var rsp = xhr.responseText;
            var rsp_json = JSON.parse(rsp)		//JSON字串轉JSON
            if (rsp_json.rsp_code == "200") {
                alert("登入成功!!!");
                if (type == "1") {
                	window.location.href='http://114.35.143.250:5000/Food_Penguin/Customer';        //放你要跳過去的網址	
                }
                else if (type == "2") {
                	window.location.href='http://114.35.143.250:5000/Food_Penguin/Deliver';        //放你要跳過去的網址	
                }
                else if (type == "3") {
                	window.location.href='http://114.35.143.250:5000/Food_Penguin/Store';        //放你要跳過去的網址	
                }
            }
            else {
                alert("帳號或密碼輸入錯誤!!!");
            }
        }
    }
}