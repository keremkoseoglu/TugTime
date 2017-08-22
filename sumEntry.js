function SumEntry() {
	
	this.duration = 0;
	this.har = "";
	
	SumEntry.prototype.addDuration = function (D) {
		this.duration += D;
	}
	
	SumEntry.prototype.getDuration = function () {
		return this.duration;
	}
	
	SumEntry.prototype.getHar = function () {
		return this.har;
	}
	
	SumEntry.prototype.getProj = function () {
		return this.har.substring(0, 3);
	}
	
	SumEntry.prototype.setDuration = function (D) {
		this.duration = D;
	}
	
	SumEntry.prototype.setHar = function (H) {
		this.har = H;
	}
	
}