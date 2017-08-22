function TimeSheet() {
	
	this.storageKey = "timesheet";
	this.entries = new Array();
	
	TimeSheet.prototype.addEntry = function(E) {
		this.entries.push(E);
	}
	
	TimeSheet.prototype.clear = function() {
		this.entries = new Array();
		this.saveToLocalStorage();
	}
	
	TimeSheet.prototype.getEntries = function () {
		return this.entries;
	}
	
	TimeSheet.prototype.getEntry = function (ID) {
		
		for (n = 0; n < this.entries.length; n++) {
			if (this.entries[n].getID() == ID) return this.entries[n];
		}
		
	}
	
	TimeSheet.prototype.getMaxId = function () {
		
		var ret = 0;
		
		for (n = 0; n < this.entries.length; n++) {
			if (this.entries[n].getID() > ret) ret = this.entries[n].getID();
		}
		
		return ret;
		
	}
	
	TimeSheet.prototype.loadFromLocalStorage = function () {
		
		this.entries = new Array();
		
		var content = localStorage.getItem(this.storageKey);
		var json = JSON.parse(content);
		
		if (json == null) return;
		
		for (n = 0; n < json.length; n++) {
			var e = new Entry();
			e.setBegin(new Date(json[n].begin));
			e.setEnd(new Date(json[n].end));
			e.setHar(json[n].har);
			e.setID(json[n].id);
			this.addEntry(e);
		}

	}
	
	TimeSheet.prototype.modifyEntry = function(E) {
		
		this.removeEntry(E.getID());
		this.entries.push(E);
	}
	
	TimeSheet.prototype.removeEntry = function (ID) {
		
		var index = -1;
		
		for (n = 0; n < this.entries.length; n++) {
			if (this.entries[n].getID() == ID) index = n;
		}
		
		if (index < 0) return;
		
		this.entries.splice(index, 1);
	}
	
	TimeSheet.prototype.saveToLocalStorage = function() {
		
		// JSON formatında dosya oluştur
		
		var content = "[";
		
		for (n = 0; n < this.entries.length; n++) {
			if (n > 0) content += ",";
			content += this.entries[n].getJsonSnippet();
		}
		
		content += "]";
		
		// Kaydet
		
		localStorage.setItem(this.storageKey, content);
		
	}
	
}