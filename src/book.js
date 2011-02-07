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
		httpRequest(this.rssurl, function(xmlDoc) {
			var items = xmlDoc.getElementsByTagName("item");
			var chaps = new Array(items.length);
			for(var i = 0; i < items.length; i++) {
				var title = items[i].getElementsByTagName("title")[0].text;
				var link = items[i].getElementsByTagName("link")[0].text;
				chaps[i] = new Chapter(title, link);
			}
			this.chapters = chaps;
			success();
		}, failure());
	}
});

LibLib.Chapter = Class.extend({
	init: function(title, link, bookTitle) {
		this.title = title;
		this.link = link;
		this.bookTitle = bookTitle;
	}
});