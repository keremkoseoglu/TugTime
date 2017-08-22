function SumTimeSheet() {
	
	this.sumEntries = new Array();
	
	SumTimeSheet.prototype.build = function (TS) {
		
		this.sumEntries = new Array();
		
		var harFound = false;
		
		var tsEntries = TS.getEntries();
		
		for (t = 0; t < tsEntries.length; t++) {
			
			harFound = false;
			
			for (n = 0; n < this.sumEntries.length; n++) {
				
				if (this.sumEntries[n].getHar() == tsEntries[t].getHar()) {
					harFound = true;
					this.sumEntries[n].addDuration(tsEntries[t].getDuration());
				}
			}
			
			if (!harFound) {
				var se = new SumEntry();
				se.setHar(tsEntries[t].getHar());
				se.setDuration(tsEntries[t].getDuration());
				this.sumEntries.push(se);
			}
			
		}
	}
	
	SumTimeSheet.prototype.buildAsFlush = function (STT) {
		
		//------------------------------
		// hazırlık
		//------------------------------
		
		this.sumEntries = new Array();
		var sume = STT.getSumEntries();
		var totalEntryDuration = 0;
		
		//------------------------------
		// loop içinde 15 dakikaya yuvarlayarak topla. 8 saati geçiyorsa aşağı yuvarla.
		//------------------------------
		
		if (sume != null) {
			var fr = new FlushResult();
			fr.calculate(1, sume);
			if (fr.getTotalEntryDuration() >= 28800000) fr.calculate(0, sume);
			totalEntryDuration = fr.getTotalEntryDuration();
			
			var fse = fr.getSumEntries();
			
			for (n = 0; n < fse.length; n++) {
				this.sumEntries.push(fse[n]);
			}
		}
		
		//------------------------------
		// 8 saatten kalanları 2064'e gir (Varsa kendisine, yoksa yeni ekle)
		//------------------------------
		
		var se = new SumEntry();
		se.setHar("HAR-2064");
		se.setDuration(28800000 - totalEntryDuration);
		this.sumEntries.push(se);
		
	}
	
	SumTimeSheet.prototype.buildAsProj = function (STT) {
		
		//------------------------------
		// hazırlık
		//------------------------------
		
		this.sumEntries = new Array();
		var sume = STT.getSumEntries();
		var totalEntryDuration = 0;
		
		//------------------------------
		// Aktiviteleri projelere ayırıp kümüle et
		//------------------------------
		
		var projFound = false;
		
		for (t = 0; t < sume.length; t++) {
			
			projFound = false;
			
			for (n = 0; n < this.sumEntries.length; n++) {
				
				if (this.sumEntries[n].getProj() === sume[t].getProj()) {
					projFound = true;
					this.sumEntries[n].addDuration(sume[t].getDuration());
				}
			}
			
			if (!projFound) {
				var se = new SumEntry();
				se.setHar(sume[t].getProj());
				se.setDuration(sume[t].getDuration());
				this.sumEntries.push(se);
			}
			
		}
		
	}
	
	SumTimeSheet.prototype.getSumEntries = function () {
		return this.sumEntries;
	}

	
}