httpRequest = function(url, success, failure) {
	var xmlhttp;
	if (window.XMLHttpRequest) {
		xmlhttp = new XMLHttpRequest();
	} else {
		xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
	}
	
	xmlhttp.onreadystatechange = function() {
		if(xmlhttp.readyState == 4 && xmlhttp.status == 200) {
			success(xmlhttp.responseXML);
		} else {
			failure();
		}
	}
	xmlhttp.open("GET",url,true);
	xmlhttp.send();
}