function Entry() {
	
	this.storageKey = "entry";
	
	this.begin = Date();
	this.end = Date();
	this.duration = 0;
	this.id = 0;
	this.har = "";
	
	Entry.prototype.clone = function() {
		var ret = new Entry();
		ret.setBegin(this.getBegin());
		ret.setEnd(this.getEnd());
		ret.setHar(this.getHar());
		ret.setID(this.getID());
		return ret;
	}
	
	Entry.prototype.getBegin = function () {
		return this.begin;
	}
	
	Entry.prototype.getEnd = function () {
		return this.end;
	}
	
	Entry.prototype.getDuration = function() {
		return this.duration;
	}
	
	Entry.prototype.getHar = function () {
		return this.har;
	}
	
	Entry.prototype.getID = function() {
		return this.id;
	}
	
	Entry.prototype.getProj = function() {
		return this.har.substring(0, 3);
	}
	
	Entry.prototype.getJsonSnippet = function() {
		var content = "";
		content += "{";
		
		try {
		content += '"begin":"' + this.begin.toJSON() + '",';
		} catch(err) {}
		
		try {
		content += '"end":"' + this.end.toJSON() + '",';
		} catch(err) {}
		
		content += '"duration":"' + this.duration + '",';
		content += '"id":"' + this.id + '",';
		content += '"har":"' + this.har + '"';
		content += "}";
		return content;
	}
	
	Entry.prototype.loadFromLocalStorage = function () {
		
	  try {
		  var content = localStorage.getItem(this.storageKey);
		  var json = JSON.parse(content);
	  } catch (err) { return; }
		
	  try { this.setBegin(new Date(json[0].begin)); } catch (err) {}
	  try { this.setEnd(new Date(json[0].end)); } catch (err) {}
	  try { this.setHar(json[0].har); } catch (err) {}
	  try { this.setID(json[0].id); } catch (err) {}
		
	}
	
	Entry.prototype.saveToLocalStorage = function () {
		
		var content = "[";
		content += this.getJsonSnippet();
		content += "]";
		
		localStorage.setItem(this.storageKey, content);
		
	}
	
	Entry.prototype.setBegin = function (B) {
		this.begin = B;
		this.duration = this.end - this.begin;
	}
	
	Entry.prototype.setEnd = function (E) {
		
		if (this.begin <= E) {
			this.end = E; 
			this.duration = this.end - this.begin;
		}
		
	}
	
	Entry.prototype.setHar = function (HAR) {
		this.har = HAR.toUpperCase();
	}
	
	Entry.prototype.setID = function(ID) {
		this.id = ID;
	}
	
}

