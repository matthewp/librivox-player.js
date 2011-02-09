LibLib.Player = Class.extend({
	init: function(element) {
		this.audioElement = element;
	},
	
	play: function(chapter) {
		var thisPlayer = this;

		var canplayListener = function(evt) {
			thisPlayer.audioElement.removeEventListener("canplay", canplayListener, false);
			thisPlayer.audioElement.currentTime = 0.0;
			thisPlayer.audioElement.play();
		};
			
		thisPlayer.audioElement.addEventListener("canplay", canplayListener, false);
		thisPlayer.audioElement.src = chapter.link;
	},
	
	playAtPosition: function(chapter, position) {
		var thisPlayer = this;

		var canplayListener = function(evt) {
			thisPlayer.audioElement.removeEventListener("canplay", canplayListener, false);
			thisPlayer.audioElement.currentTime = position;
			thisPlayer.audioElement.play();
		};
			
		thisPlayer.audioElement.addEventListener("canplay", canplayListener, false);
		thisPlayer.audioElement.src = chapter.link;
	},
	
	pause: function() {
		this.audioElement.pause;
	},
	
	paused: function() {
		return this.audioElement.paused;
	},

	addListener: function(event, callback) {
		this.audioElement.addEventListener(event, callback, false);
	}
});

LibLib.Queue = LibLib.Player.extend({
	lastSavedPosition: 0,

	init: function(element) {
		this._super(element);
		this.items = [];
		this.current = 0;

		var thisQueue = this;
		
		this.audioElement.addEventListener("ended", function() {
			if(thisQueue.items.length > 0 && thisQueue.items.length - 1 != thisQueue.current) {
				thisQueue.current++;
				thisQueue.play();
			}
		});
	},
	
	play: function(items) {
		if(items != null) {
			this.clear();
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
			for(var i = 0; i < item.chapters.length; i++) {
				this.items.push(item.chapters[i]);
			}
		} else if(item instanceof LibLib.Chapter) {
			this.items.push(item);
		}
	},

	clear: function() {
		this.items = [];
	},
	
	getCurrent: function() {
		return this.items[this.current];
	},
	
	savePosition: function() {
		this.lastSavedPosition = this.audioElement.currentTime;
	}
});


