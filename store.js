var list_json;
var count;
var old_name;
var call_order;
var pic_flag = false;

window.onload = function(){
	get_store_info();
	list_menu_update();
	change_page(1);
}

function change_page(num){
	for (var i = 1; i < 3; i++) {
		if (i == num) {
			document.getElementById("info" + i).setAttribute("style", "default");	
		}
		else{
			document.getElementById("info" + i).setAttribute("style", "display:none");	
		}
	}
	if (num == 2) {
		list_order_s();
		call_order = setInterval(list_order_s,60000);
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

function update_onoffline(){
	var status = document.getElementById("status").value;
	var xhr = new XMLHttpRequest();
	xhr.open("POST", "http://114.35.143.250:5000/api/update_onoffline");
	xhr.setRequestHeader('Content-Type', 'application/json');
	if (status == "上線") {
			xhr.send(JSON.stringify({"status": "1"}));
		}
	else if (status == "下線") {
		xhr.send(JSON.stringify({"status": "0"}));
	}
	xhr.onload = function(){
		var rsp_json = JSON.parse(xhr.responseText);
		if (rsp_json.rsp_code == "200") {
			if (status == "上線") {
				alert("已上線");
			}
			else if (status == "下線") {
				alert("已下線");
			}
			else {
				alert("錯誤");
			}
		}
		else {
			alert("狀態更新失敗，請再試一次");
		}
	}
}

function get_store_info(){
	var item = ["name", "addr", "tel", "start_hour", "start_min", "end_hour", "end_min", "pic", "online"];
	var xhr = new XMLHttpRequest();
	xhr.open("GET", "http://114.35.143.250:5000/api/get_store_info");
	xhr.send();
	xhr.onload = function(){
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
		var rsp = xhr.responseText;
		var rsp_json = JSON.parse(rsp);
		for (var i = 0; i < 7; i++) {
				document.getElementById(item[i]).setAttribute("value", rsp_json[item[i]]);
		}
		document.getElementById("pic").setAttribute("src", "http://114.35.143.250/Food_Penguin/api/static/img/store/" + rsp_json[item[7]] + "?v=" + time);
		document.getElementById("status").getElementsByTagName("option")[rsp_json["online"]].selected = true;
	}
}

function detect_pic(){
	var reg = /(\.jpg)|(\.jpeg)|(\.png)$/;
	if (!reg.test(document.getElementById("photo").value)) {
			alert("請上傳正確的圖片!!!");
			if (pic_flag) {
				document.getElementById("pic_btn").outerHTML = "";
			}
		}
	else {
		if (!pic_flag) {
			pic_flag = true;
			var btn = document.createElement("input");
			btn.setAttribute("id", "pic_btn");
			btn.setAttribute("type", "submit");
			btn.setAttribute("value", "上傳");
			document.getElementById("update_photo").appendChild(btn);
		}
	}
}

function update_store_info(){
	var item = ["name", "addr", "tel", "start_hour", "start_min", "end_hour", "end_min"];
	var correct = false;
	var xhr = new XMLHttpRequest();
	xhr.open("POST", "http://114.35.143.250:5000/api/update_store_info");
	xhr.setRequestHeader('Content-Type', 'application/json');
	var name = document.getElementById("name").value;
	var addr = document.getElementById("addr").value;
	var tel = document.getElementById("tel").value;
	var start_hour = document.getElementById('start_hour').value;
	var start_min = document.getElementById('start_min').value;
	var end_hour = document.getElementById('end_hour').value;
	var end_min = document.getElementById('end_min').value;
	var reg = /^[0-9\(\)]*$/
	if (start_hour > 23 || start_hour < 0 || start_min > 59 || start_min < 0 || end_hour > 23 || end_hour < 0 || end_min > 59 || end_min < 0) {
		alert("請輸入正確的時間，0~23時、0~59分");
	}
	else if (name == "" || addr == "" || tel == "" || start_hour == "" || start_min == "" || end_hour == "" || end_min == "") {
		alert("請勿輸入空值!!!");
	}
	else if (!reg.test(tel)) {
		alert("電話請輸入數字!!!");
	}
	else {
		correct = true;
	}
	if (correct) {
		var json = {"name": name, "addr": addr, "tel": tel, "start_hour": start_hour, "start_min": start_min, "end_hour": end_hour, "end_min": end_min};
		xhr.send(JSON.stringify(json));
		xhr.onload = function(){
			var rsp = xhr.responseText;
			var rsp_json = JSON.parse(rsp);
			if (rsp_json.rsp_code == "200") {
				alert("修改成功");
				window.location.href="http://114.35.143.250:5000/Food_Penguin/Store";
			}
			else {
				alert("修改失敗");
			}
		}
	}
}

function list_menu_update(){
	document.getElementById("list");
	var xhr = new XMLHttpRequest();
	xhr.open("GET", "http://114.35.143.250:5000/api/list_menu_update");
	xhr.onload = function(){
		var menu_json = JSON.parse(xhr.responseText);
		var add = "";
		for (var i = 0; i < menu_json.food.length; i++) {
			add += "<tr><td id='name_" + i + "'>" + menu_json.food[i][0] + "</td><td id='price_" + i + "'>$" + menu_json.food[i][1] + "</td><td><button class='btn btn-warning' onclick='change(" + i + ");' id='change_" + i + "'>修改</button>  <button class='btn btn-danger' onclick='delete_menu(" + i + ");'  id='del_" + i + "'>刪除</button></td></tr>";
		}
		add += "<tr><td id='name_" + menu_json.food.length + "'></td><td id='price_" + menu_json.food.length + "'></td><td><button class='btn btn-warning' id='add' onclick='add(" + menu_json.food.length + ");'>新增</button></td></tr>";
		document.getElementById("menu").innerHTML = add;
	}
	xhr.send();
}

function change(num){
	document.getElementById("del_" + num).setAttribute("style", "display: none");
	var btn = document.getElementById("change_" + num);
	btn.innerHTML = "上傳";
	btn.setAttribute("onclick", "update_menu(" + num + ");");
	//名稱部分
	var name = document.getElementById("name_" + num);
	old_name = name.innerHTML;
	name.innerHTML = "<input type='text' id='name_add" + num + "' value='" + old_name + "' required='required'>";
	//價格部分
	var price = document.getElementById("price_" + num);
	var old_price = price.innerHTML;
	old_price = old_price.replace("$", "");
	price.innerHTML = "$<input type='text' id='price_add" + num + "' value='" + old_price + "' required='required'>";
}

function add(num){
	for (var i = 0; i < num; i++) {
		document.getElementById("del_" + i).setAttribute("style", "display: none");
		document.getElementById("change_" + i).setAttribute("style", "display: none");
	}
	var btn = document.getElementById("add");
	old_name = "";
	btn.setAttribute("onclick", "update_menu(" + num + ");");
	btn.innerHTML = "確定新增";
	btn.setAttribute("class", "btn btn-danger");
	document.getElementById("name_" + num).innerHTML = "<input type='text' id='name_add" + num + "' required='required'>";
	document.getElementById("price_" + num).innerHTML = "$<input type='text' id='price_add" + num + "'' required='required'>";
}

function update_menu(num){
	var name = document.getElementById("name_add" + num).value;
	var price = document.getElementById("price_add" + num).value;
	var correct = false;
	var xhr = new  XMLHttpRequest();
	xhr.open("POST", "http://114.35.143.250:5000/api/update_store_menu");
	xhr.setRequestHeader('Content-Type', 'application/json');
	if (price == "" || name == "") {
		alert("請勿輸入空值");
	}
	else if (price > 10000 || price < 0) {
		alert("價格請勿超過9999元或是低於0元");
	}
	else {
		correct = true;
	}
	if (correct) {
		xhr.send(JSON.stringify({"old_name": old_name, "name": name, "price": price}));
		xhr.onload = function(){
			var rsp = JSON.parse(xhr.responseText);
			if (rsp.rsp_code == "201") {
				alert("修改成功!!!");
				list_menu_update();
			}
			else if(rsp.rsp_code == "401") {
				alert("修改失敗，請再試一次!");
			}
			else if(rsp.rsp_code == "200") {
				alert("新增成功!!!");
				list_menu_update();
			}
			else {
				alert("新增失敗，請再試一次!");
			}
		}
	}
}

function delete_menu(num){
	var old_name = document.getElementById("name_" + num).innerHTML;
	var check = confirm("確定要刪除" + old_name + "嗎?");
	if (check == true) {
		var xhr = new XMLHttpRequest();
		xhr.open("POST", "http://114.35.143.250:5000/api/delete_menu");
		xhr.setRequestHeader('Content-Type', 'application/json');
		xhr.send(JSON.stringify({"name": old_name}));
		xhr.onload = function(){
			var rsp = JSON.parse(xhr.responseText);
			if (rsp.rsp_code == "200") {
				alert("刪除成功!!!");
				list_menu_update();
			}
			else {
				alert("刪除失敗，請再試一次!");
			}
		}
	}
	
}

function list_order_s(){
	var xhr = new XMLHttpRequest;
	xhr.open("GET", "http://114.35.143.250:5000/api/list_order");
	xhr.onload = function(){
		list_json = JSON.parse(xhr.responseText);
		var add = "";
		count = 0;
		for (var i = list_json.order.length - 1; i >= 0; i--) {
			add += "<tr><td><p type='button' data-toggle='modal' data-target='#customerModal' id='customer_" + list_json.order[i][0] + "' onclick='get_order_s2c(" + list_json.order[i][0] + ");'>" + list_json.order[i][3] + "</p></td><td><p type='button' data-toggle='modal' data-target='#orderModal' onclick='get_order(" + list_json.order[i][0] + ");'>查看</p></td>	<td><p type='button' data-toggle='modal' data-target='#delieverModal' id='deliever_" + list_json.order[i][0] + "' onclick='get_order_s2d(" + list_json.order[i][0] + ");'>" + list_json.order[i][2]+ "</p></td><td><p id='status_" + list_json.order[i][0] + "'>"
			switch(list_json.order[i][4]) {
				case  1 :
					add += "餐點製作中</p></td>";
					count += 1;
					break;
				case  2:
					add += "餐點製作完成</p></td>";
						break;
				case  3:
					add += "送餐中</p></td>";
					break;
				case  4:
					add += "餐點已送達</p></td>";
					break;
				case 5:
					add += "完成</p></td>";
					break;
				default:
					add += "未知狀態</p></td>";
				}
			if (list_json.order[i][4] == "1") {
				add += "<td id='order_" + list_json.order[i][0] + "'><button class='btn btn-warning' onclick='update_order_status(" + list_json.order[i][0] + ");'>餐點完成</button></td></tr>";
			}
			else {
				add += "<td></td></tr>";
			}
		}
		if (count > 0) {
				alert("有" + count + "個訂單需製作");
		}
		document.getElementById("order_list").innerHTML = add;
	}
	xhr.send();
}

function get_order_s2d(id){
	var xhr = new XMLHttpRequest;
	xhr.open("POST", "http://114.35.143.250:5000/api/get_order");
	xhr.setRequestHeader('Content-Type', 'application/json');
	xhr.send(JSON.stringify({"ID": id}));
	xhr.onload = function(){
		var detail = JSON.parse(xhr.responseText);
		var add = "<p>" + document.getElementById("deliever_" + id).innerHTML + "</p><p>電話：" + detail.order[2] + "</p>";
		document.getElementById("deliever_detail").innerHTML = add;
	}
}

function get_order(id){
	var xhr = new XMLHttpRequest;
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

function get_order_s2c(id){
	var xhr = new XMLHttpRequest;
	xhr.open("POST", "http://114.35.143.250:5000/api/get_order");
	xhr.setRequestHeader('Content-Type', 'application/json');
	xhr.send(JSON.stringify({"ID": id}));
	xhr.onload = function(){
		var detail = JSON.parse(xhr.responseText);
		var add = "<p>" + document.getElementById("customer_" + id).innerHTML + "</p><p>電話：" + detail.order[3] + "</p><p>地址：" + detail.order[4] + "</p>";
		document.getElementById("customer_detail").innerHTML = add;
	}
}

function update_order_status(id){
	var xhr = new XMLHttpRequest;
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
			alert("已通知送貨員取餐，仍有" + (count - 1) + "個餐點需製作");
			list_order_s();
			/*document.getElementById("status_" + id).innerHTML = "餐點製作完成";
			document.getElementById("order_" + id).innerHTML = "";*/
		}
		else {
			alert("訂單流程錯誤，請聯繫客服人員，謝謝!");
		}
	}
}