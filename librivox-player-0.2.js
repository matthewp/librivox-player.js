/* Simple JavaScript Inheritance
 * By John Resig http://ejohn.org/
 * MIT Licensed.
 */
// Inspired by base2 and Prototype
(function(){
  var initializing = false, fnTest = /xyz/.test(function(){xyz;}) ? /\b_super\b/ : /.*/;
  // The base Class implementation (does nothing)
  this.Class = function(){};
  
  // Create a new Class that inherits from this class
  Class.extend = function(prop) {
    var _super = this.prototype;
    
    // Instantiate a base class (but only create the instance,
    // don't run the init constructor)
    initializing = true;
    var prototype = new this();
    initializing = false;
    
    // Copy the properties over onto the new prototype
    for (var name in prop) {
      // Check if we're overwriting an existing function
      prototype[name] = typeof prop[name] == "function" && 
        typeof _super[name] == "function" && fnTest.test(prop[name]) ?
        (function(name, fn){
          return function() {
            var tmp = this._super;
            
            // Add a new ._super() method that is the same method
            // but on the super-class
            this._super = _super[name];
            
            // The method only need to be bound temporarily, so we
            // remove it when we're done executing
            var ret = fn.apply(this, arguments);        
            this._super = tmp;
            
            return ret;
          };
        })(name, prop[name]) :
        prop[name];
    }
    
    // The dummy class constructor
    function Class() {
      // All construction is actually done in the init method
      if ( !initializing && this.init )
        this.init.apply(this, arguments);
    }
    
    // Populate our constructed prototype object
    Class.prototype = prototype;
    
    // Enforce the constructor to be what we expect
    Class.constructor = Class;

    // And make this class extendable
    Class.extend = arguments.callee;
    
    return Class;
  };
})();


var LibLib = {}


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


LibLib.Player = Class.extend({
	init: function(element) {
		this.audioElement = element;
	},
	
	play: function(chapter) {
		var canplayListener = function(evt) {
			this.audioElement.removeEventListener("canplay", canplayListener, false);
			this.audioElement.currentTime = 0.0;
			this.audioElement.play();
		};
	
		this.audioElement.src = chapter.link;
		this.audioElement.addEventListener("canplay", canplayListener, false);
	},
	
	playAtPosition: function(chapter, position) {
		var canplayListener = function(evt) {
			this.audioElement.removeEventListener("canplay", canplayListener, false);
			this.audioElement.currentTime = position;
			this.audioElement.play();
		};
	
		this.audioElement.src = chapter.link;
		this.audioElement.addEventListener("canplay", canplayListener, false);
	},
	
	pause: function() {
		this.audioElement.pause;
	},
	
	paused: function() {
		return this.audioElement.paused;
	}
});

LibLib.Queue = LibLib.Player.extend({
	lastSavedPosition: 0,

	init: function(element) {
		this._super(element);
		this.items = [];
		this.current = 0;
		
		this.audioElement.addEventListener("ended", function() {
			if(this.items.length > 0 && this.items.length - 1 != this.current) {
				this.current++;
				this.play();
			}
		});
	},
	
	play: function(items) {
		if(items != null) {
			this.add(items);
			this.current = 0;
		}
		
		if(this.items.length > 0) {
			this._super(this.items[this.current]);
		}
	},
	
	playAtPosition: function(position) {
		if(position == null) {
			this._super(this.items[this.current], this.lastSavedPosition);
		}

		if(this.items.length > 0) {
			this._super(this.items[this.current], position);
		}
	},
	
	add: function(item) {
		if(item instanceof LibLib.Book) {
			this.items.push(item.chapters);
		} else if(item instanceof LibLib.Chapter) {
			this.items.push(item);
		}
	},
	
	getCurrent: function() {
		return this.items[this.current];
	},
	
	savePosition: function() {
		this.lastSavedPosition = this.audioElement.currentTime;
	}
});


