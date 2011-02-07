LibLib.Player = Class.extend({
	init: function(element) {
		this.audioElement = element;
	},
	
	play: function(chapter) {
		canplayListener = function(evt) {
			this.audioElement.removeEventListener("canplay", canplayListener, false);
			this.audioElement.currentTime = 0.0;
			this.audioElement.play();
		};
	
		this.audioElement.addEventListener("canplay", canplayListener, false);
	},
	
	playAtPosition(chapter, position) {
	
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
		
		this.audioElement.bind("ended", function() {
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
		if(this.items.length > 0) {
			this._super(this.items[this.current], position);
		}
	},
	
	add : function(item) {
		if(item instanceof Book) {
			this.items.push(item.chapters);
		} else if(item instanceof Chapter) {
			this.items.push(item);
		}
	}
	
	getCurrent: function() {
		return this.items[this.current];
	}
	
	savePosition: function() {
		this.lastSavedPosition = this.audioElement.currentTime;
	}
});