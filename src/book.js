LibLib.Chapter = Class.extend({
	init: function(title, link, bookTitle) {
		this.title = title;
		this.link = link;
		this.bookTitle = bookTitle;
	}
});

LibLib.Book = Class.extend({
	init: function(id, title, category, genre, rssurl) {
		this.id = id;
		this.title = title;
		this.category = category;
		this.genre = genre;
		this.rssurl = rssurl;
		this.chapters = [];
	},
	
	getChapterCount: function() {
		return this.chapters.length;
	},
	
	getChapter: function(index) {
		return this.chapters[index];
	},
	
	loadChapters: function(success, failure) {
		var thisBook = this;

		callback = function() {
			if(failure != null) {
				failure();			
			}
		};
	
		LibLib.httpRequest(this.rssurl, function(xmlDoc) {
			var items = xmlDoc.getElementsByTagName("item");
			var chaps = new Array(items.length);
			for(var i = 0; i < items.length; i++) {
				var title = items[i].getElementsByTagName("title")[0].firstChild.nodeValue;
				var link = items[i].getElementsByTagName("link")[0].firstChild.nodeValue;
				chaps[i] = new LibLib.Chapter(title, link);
			}
			thisBook.chapters = chaps;
			success();
		}, callback());
	}
});


