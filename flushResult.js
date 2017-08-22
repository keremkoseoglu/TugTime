function FlushResult() {
	
	this.totalEntryDuration = 0;
	this.sumEntries = new Array();
	
	FlushResult.prototype.calculate = function (Direction, SumEntries) {
		
		this.totalEntryDuration = 0;
		this.sumEntries = new Array();
		
		for (n = 0; n < SumEntries.length; n++) {
			
			// Duration'u hesapla
			
			var currDuration = 0;
			var currSecond = SumEntries[n].duration / 1000;
			var currMinute = currSecond / 60;
			
			for (currLoop = 0; currLoop < 32; currLoop++) {
				if ( currMinute >= (currLoop * 15) &&
				     currMinute <= ((currLoop + 1) * 15) ) {
					
					if (Direction == 0) {
						currMinute = (currLoop - 1) * 15;
					}
					else {
						currMinute = (currLoop + 1) * 15;
					}
					
					currLoop = 9999;
				}
			}
			
			var currDuration = currMinute * 60000;
			
			// Yeni Entry olarak ekle
			
			if (currDuration > 0) {
				var se = new SumEntry();
				se.setHar(SumEntries[n].getHar());
				se.setDuration(currDuration);
				this.sumEntries.push(se);
				
				this.totalEntryDuration += currDuration;
			}
		}
		
	}
	
	FlushResult.prototype.getTotalEntryDuration = function () { return this.totalEntryDuration; }
	FlushResult.prototype.getSumEntries = function() { return this.sumEntries; }
	
}