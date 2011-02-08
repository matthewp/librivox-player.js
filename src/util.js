LibLib.httpRequest = function(url, success, failure) {
	LibLib.xmlhttp;
	if (window.XMLHttpRequest) {
		LibLib.xmlhttp = new XMLHttpRequest();
	} else {
		LibLib.xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
	}
	
	LibLib.xmlhttp.onreadystatechange = function() {
		if(this.readyState == 4 && this.status == 200) {
			success(LibLib.xmlhttp.responseXML.documentElement);
		} else {
			if(failure != null) {
				failure();
			}
		}
	}
	LibLib.xmlhttp.open("GET",url);
	LibLib.xmlhttp.send();
};

LibLib.abortRequest = function() {
	if(LibLib.xmlhttp != null) {
		LibLib.xmlhttp.abort();
	}
};


