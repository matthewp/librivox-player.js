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
			var items = xmlDoc.getElementsByTagName("item");
			var books = new Array(items.length);
			for(var i = 0; i < items.length; i++) {
				var id = items[i].getElementsByTagName("id")[0].text;
				var title = items[i].getElementsByTagName("title")[0].text;
				var category = items[i].getElementsByTagName("Category")[0].text;
				var genre = items[i].getElementsByTagName("Genre")[0].text;
				var rssurl = items[i].getElementsByTagName("rssurl")[0].text;
				books[i] = new Book(id, title, category, genre, rssurl);
			}
			success(books);
		});
};


