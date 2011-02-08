LibLib.Search = function(type, term, success) {
		var xmllocation = "http://librivox.org/newcatalog/search_xml.php?extended=1&";
		switch(type) {
			case "simple":
				xmllocation += "simple=" + term;
				break;
			case "genre":
				xmllocation += "genre=" + term;
		}
		
		LibLib.httpRequest(xmllocation, function(xmlDoc) {
			var items = xmlDoc.getElementsByTagName("book");
			var books = new Array(items.length);
			for(var i = 0; i < items.length; i++) {
				var id = items[i].getElementsByTagName("id")[0].firstChild.nodeValue;
				var title = items[i].getElementsByTagName("title")[0].firstChild.nodeValue;
				var category = items[i].getElementsByTagName("Category")[0].firstChild.nodeValue;
				var genre = items[i].getElementsByTagName("Genre")[0].firstChild.nodeValue;
				var rssurl = items[i].getElementsByTagName("rssurl")[0].firstChild.nodeValue;
				books[i] = new LibLib.Book(id, title, category, genre, rssurl);
			}
			success(books);
		});
};


