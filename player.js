var Player = Class.extend({
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
	}
});

var Queue = Player.extend({
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
	
	play: function() {
		if(this.items.length > 0) {
			this._super(this.items[this.current]);
		}
	},
	
	add : function(item) {
		if(item instanceof Book) {
			this.items.push(item.chapters);
		} else if(item instanceof Chapter) {
			this.items.push(item);
		}
	}
});