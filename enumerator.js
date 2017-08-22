function Enumerator() {
	
	this.x = 0;
	
	Enumerator.prototype.getNext = function() {
		this.x++;
		return this.x;
	}
	
	Enumerator.prototype.setCurrent = function(Current) {
		this.x = Current;
	}
	
}