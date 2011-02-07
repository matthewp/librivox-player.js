LibLib.httpRequest = function(url, success, failure) {
	LibLib.xmlhttp;
	if (window.XMLHttpRequest) {
		LibLib.xmlhttp = new XMLHttpRequest();
	} else {
		LibLib.xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
	}
	
	LibLib.xmlhttp.onreadystatechange = function() {
		if(LibLib.xmlhttp.readyState == 4 && LibLib.xmlhttp.status == 200) {
			success(LibLib.xmlhttp.responseXML);
		} else {
			failure();
		}
	}
	LibLib.xmlhttp.open("GET",url,true);
	LibLib.xmlhttp.send();
}

LibLib.abortRequest = function() {
	if(LibLib.xmlhttp != null) {
		LibLib.xmlhttp.abort();
	}
}