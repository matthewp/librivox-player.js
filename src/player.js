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


