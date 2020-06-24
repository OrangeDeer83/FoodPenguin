var store_json;
var menu_num;
var list_json;
var call_order;

window.onload = function(){
	list_store();
	get_customer_info();
	change_page(1);
}

function change_page(num){
	for (var i = 1; i < 4; i++) {
		if (i == num) {
			document.getElementById("info" + i).setAttribute("style", "default");
		}
		else{
			document.getElementById("info" + i).setAttribute("style", "display:none");	
		}
	}
	if (num == 3) {
		list_order_c();
		clearInterval(call_order);
		call_order = setInterval(list_order_c,60000);
	}
	else {
		clearInterval(call_order);
	}
}

function logout(){
	var xhr = new XMLHttpRequest();
	xhr.open("GET", "http://114.35.143.250:5000/api/Logout");
	xhr.onload = function(){
		var rsp_json = JSON.parse(xhr.responseText);
		if (rsp_json.rsp_code == "200") {
			alert("登出成功");
			window.location.href="http://114.35.143.250:5000/Food_Penguin/Index";
		}
		else {
			alert("登出失敗");
		}
	}
	xhr.send();
}

function get_customer_info(){
	var item = ["firstName", "lastName", "tel", "addr"];
	var xhr = new XMLHttpRequest();
	xhr.open("GET", "http://114.35.143.250:5000/api/get_customer_info");
	xhr.send();
	xhr.onload = function(){
		var rsp = xhr.responseText;
		var rsp_json = JSON.parse(rsp);
		for (var i = 0; i < 4; i++) {
			document.getElementById(item[i]).setAttribute("value", rsp_json[item[i]]);
			if (i == 2 && rsp_json[item[2]] == "") {
				document.getElementById(item[i]).setAttribute("value", "( )");
			}
		}
	};
}

function update_customer_info(){
	var item = ["firstName", "lastName", "tel", "addr"];
	var correct = false;
	var xhr = new XMLHttpRequest();
	xhr.open("POST", "http://114.35.143.250:5000/api/update_customer_info");
	xhr.setRequestHeader('Content-Type', 'application/json');
	var reg = /^[0-9\(\)]*$/;
	var firstName = document.getElementById('firstName').value;
	var lastName = document.getElementById('lastName').value;
	var tel = document.getElementById('tel').value;
	var addr = document.getElementById('addr').value;
	if (firstName == "" || lastName == "" || tel == "" || addr == "") {
		alert("所有欄位皆須填寫!!!");
	}
	else if (!reg.test(tel)) {
		alert("電話請輸入數字!!!");
	}
	else{
		correct = true;
	}
	if (correct) {
		var json = {"firstName": firstName, "lastName": lastName, "tel": tel, "addr": addr};
		xhr.send(JSON.stringify(json));
		xhr.onload = function(){
			var rsp = xhr.responseText;
			var rsp_json = JSON.parse(rsp);
			if (rsp_json.rsp_code == "200") {
				alert("修改成功");
			}
			else {
				alert("修改失敗");
			}
		}
	}
}

function list_store(){
	var list = document.getElementById("info1");
	var xhr = new XMLHttpRequest();
	xhr.open("GET", "http://114.35.143.250:5000/api/list_store");
	xhr.onload = function(){
		var store = xhr.responseText;
		store_json = JSON.parse(store);
		var add = "<div class='col-12 col-md-12 text-center py-5'><h1>熱門餐廳</h1></div>";
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
			add += "<div class='col-sm-12 col-md-6 col-lg-4 col-xl-3' onclick='list_menu_purchase(\"" + store_json.data[i][0] +  "\");'><div class='pic'><img src='http://114.35.143.250/Food_Penguin/api/static/img/store/" + store_json.data[i][8] + "?v= " + time + "' type='button' data-toggle='modal' data-target='#menuModal'></div><a href='#' type='button' data-toggle='modal' data-target='#menuModal'>" + store_json.data[i][1] + "</a></div>";
		}
		list.innerHTML = add;
	}
	xhr.send();
}


function list_menu_purchase(id){
	var xhr = new XMLHttpRequest();
	xhr.open("POST", "http://114.35.143.250:5000/api/list_menu_purchase");
	xhr.setRequestHeader('Content-Type', 'application/json');
	xhr.send(JSON.stringify({"storeId": id}));
	for (var  i = 0; i < store_json.data.length; i++) {
		if (store_json.data[i][0] == id) {
			document.getElementById("store_name").innerHTML = store_json.data[i][1];
			document.getElementById("store_tel").innerHTML = "電話：" + store_json.data[i][2];
			document.getElementById("store_addr").innerHTML = "地址：" + store_json.data[i][3];
			document.getElementById("store_time").innerHTML = "營業時間：" + store_json.data[i][4] + ":" + store_json.data[i][5] + "-" + store_json.data[i][6] + ":" + store_json.data[i][7];
			break;
		}	
	}
	document.getElementById("submit").setAttribute("onclick", "send_order(" + id + ");");
	var add = "";
	xhr.onload = function(){
		var menu_json = JSON.parse(xhr.responseText);
		for (menu_num = 0; menu_num < menu_json.food.length; menu_num++) {
			add += "<tr><td id='name_" + menu_num + "'>" + menu_json.food[menu_num][0] + "</td><td id='price_" + menu_num + "'>" + menu_json.food[menu_num][1] + "</td><td><input type='text' class='form-control' id='amount_" + menu_num + "' value='0'></td></tr>";
		}
		document.getElementById("menu").innerHTML = add;
		document.getElementById("submit").setAttribute("onclick", "send_order(\'" + id + "\');");
	}
}

function send_order(id){
	var order = new Array();
	var j = 0;
	var price;
	var purchase = false;
	var amount = 0;
	for (var i = 0; i < menu_num; i++) {
		amount = document.getElementById("amount_" + i).value;
		if (amount == 0) {
			continue;
		}
		else if (amount < 0) {
			purchase = false;
			break;
		}
		else{
			purchase = true;
			order[j] = new Array();
			order[j][0] = document.getElementById("name_" + i).innerHTML;
			order[j][1] = document.getElementById("price_" + i).innerHTML;
			order[j][2] = amount;
			j++;
		}
	}
	if (purchase) {
		var xhr = new XMLHttpRequest();
		xhr.open("POST", "http://114.35.143.250:5000/api/send_order");
		xhr.setRequestHeader('Content-Type', 'application/json');	
		xhr.send(JSON.stringify({"storeId": id, "order": order}));
		xhr.onload = function(){
			var rsp_json = JSON.parse(xhr.responseText);
			if (rsp_json.rsp_code == "200") {
				alert("成功訂餐!!!");
			}
			else if(rsp_json.rsp_code == "404") {
				alert("目前沒有送貨員在線，請稍後再試一次");
			}
			else if(rsp_json.rsp_code == "405") {
				alert("很抱歉，您選擇的餐廳目前尚未營業");
			}
			else if(rsp_json.rsp_code == "403") {
				alert("請先填入基本資料再進行點餐");
			}
			else {
				alert("訂餐失敗，請再試一次");
			}
		}
	}
	else if (amount < 0) {
		alert("請勿輸入負數!!!");
	}
	else {
		alert("請選擇想要購買的商品!!!");
	}

}

function list_order_c(){
	var xhr = new XMLHttpRequest();
	xhr.open("GET", "http://114.35.143.250:5000/api/list_order");
	xhr.send();
	xhr.onload = function(){
		list_json = JSON.parse(xhr.responseText);
		var add = "";
		var count = 0;
		for (var i = list_json.order.length - 1; i >= 0; i--) {
			add += "<tr><td><p type='button' data-toggle='modal' data-target='#storeModal' id='store_" + list_json.order[i][0] + "' onclick='get_order_c2s(" + list_json.order[i][0] + ");'>" + list_json.order[i][1] + "</p></td><td><p type='button' data-toggle='modal' data-target='#orderModal' onclick='get_order(" + list_json.order[i][0] + ");'>查看</p></td>	<td><p type='button' data-toggle='modal' data-target='#delieverModal' id='deliever_" + list_json.order[i][0] + "' onclick='get_order_c2d(" + list_json.order[i][0] + ");'>" + list_json.order[i][2]+ "</p></td><td><p id='status_" + list_json.order[i][0] + "'>";
			switch(list_json.order[i][4]) {
				case 1:
					add += "餐點製作中</p></td>";
					break;
				case 2:
					add += "餐點製作完成</p></td>";
					break;
				case 3:
					add += "送餐中</p></td>";
					break;
				case 4:
					add += "餐點已送達</p></td>";
					count += 1;
					break;
				case 5:
					add += "完成</p></td>";
					break;
				default:
					add += "未知狀態</p></td>";
				}
			if (list_json.order[i][4] == "4") {
				add += "<td id='order_" + list_json.order[i][0] + "'><button class='btn btn-warning' onclick='update_order_status(" + list_json.order[i][0] + ");'>收到</button></td></tr>";
			}
			else {
				add += "<td></td></tr>";
			}
		}
		if (count > 0) {
			alert("有" + count + "個餐點已送達");
		}
		document.getElementById("order_list").innerHTML = add;
	}
	
}

function get_order_c2s(id){
	var xhr = new XMLHttpRequest();
	xhr.open("POST", "http://114.35.143.250:5000/api/get_order");
	xhr.setRequestHeader('Content-Type', 'application/json');
	xhr.send(JSON.stringify({"ID": id}));
	xhr.onload = function(){
		var detail = JSON.parse(xhr.responseText);
		var add = "<p>" + document.getElementById("store_" + id).innerHTML + "</p><p>電話：" + detail.order[0] + "</p><p>地址：" + detail.order[1] + "</p>";
		document.getElementById("store_detail").innerHTML = add;
	}
}

function get_order(id){
	var xhr = new XMLHttpRequest();
	xhr.open("POST", "http://114.35.143.250:5000/api/get_order");
	xhr.setRequestHeader('Content-Type', 'application/json');
	xhr.send(JSON.stringify({"ID": id}));
	xhr.onload = function(){
		var detail = JSON.parse(xhr.responseText);
		var add = "";
		var total = 0;
		for (var i = 0; i < detail.order[5].length; i++) {
			add += "<tr><td>" + detail.order[5][i][0] + "</td><td>" + detail.order[5][i][1] + "</td><td>" + detail.order[5][i][2] + "</td></tr>";
			total += parseInt(detail.order[5][i][1]) * parseInt(detail.order[5][i][2]);
		}
		document.getElementById("order_detail").innerHTML = add;
		document.getElementById("total").innerHTML = "$" + total;
	}
}

function get_order_c2d(id){
	var xhr = new XMLHttpRequest();
	xhr.open("POST", "http://114.35.143.250:5000/api/get_order");
	xhr.setRequestHeader('Content-Type', 'application/json');
	xhr.send(JSON.stringify({"ID": id}));
	xhr.onload = function(){
		var detail = JSON.parse(xhr.responseText);
		var add = "<p>" + document.getElementById("deliever_" + id).innerHTML + "</p><p>電話：" + detail.order[2] + "</p>";
		document.getElementById("deliever_detail").innerHTML = add;
	}
}

function update_order_status(id){
	var xhr = new XMLHttpRequest();
	xhr.open("POST", "http://114.35.143.250:5000/api/update_order_status");
	xhr.setRequestHeader('Content-Type', 'application/json');
	var status = 0;	
	for (var i = 0; i < list_json.order.length; i++) {
		if (id == list_json.order[i][0]) {
			status = list_json.order[i][4] + 1;
		}
	}
	xhr.send(JSON.stringify({"ID": id, "status": status}));
	xhr.onload = function(){
		var rsp = JSON.parse(xhr.responseText);
		if (rsp.rsp_code == "200") {
			alert("感謝您使用FoodPenguin，期待您的下次使用～");
			list_order_c();
			/*
			document.getElementById("status_" + id).innerHTML = "完成";
			document.getElementById("order_" + id).innerHTML = "";*/
		}
		else {
			alert("訂單流程錯誤，請聯繫客服人員，謝謝!");
		}
	}
}