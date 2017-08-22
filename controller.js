function Controller() {
	
	Controller.prototype.addEntry = function(Enum, TS, Sum) {
		
		// Formdan değerleri al
		
		var e = this.getCurrentEntryAsObject();
		var id = $("#input_id").val();
		
		// Öğle yemeğine denk geldiyse birden fazla aktiviteye böl
		
		var entries = new Array();
		
		if (
				e.getBegin().getHours() < 12 &&
				e.getEnd().getHours() > 12
		   ) {
			
			var e1 = e.clone();
			e1.setEnd(this.getTimeFromString("12:00"));
			entries.push(e1);
			
			var e2 = e.clone();
			e2.setBegin(this.getTimeFromString("13:00"));
			entries.push(e2);
		}
		else {
			entries.push(e);
		}
		
		// Timesheet'e kaydet
		
		for (n = 0; n < entries.length; n++) {
			
			if (id == "") {
				entries[n].setID(Enum.getNext());
				TS.addEntry(entries[n]);
			} else {
				entries[n].setID(id);
				TS.modifyEntry(entries[n]);
			}
			
		}
		
		TS.saveToLocalStorage();
		
		// Özetleri tekrar oluşturup ekranı tazele
		
		Sum.build(TS);
		this.paintAll(TS, Sum);		
		this.clearEntry();
		
	}
	
	Controller.prototype.clearEntry = function () {
		$("#input_id").val("");
		$("#input_begin").val("");
		$("#input_end").val("");
		$("#input_har").val("");
		$("#input_har_txt").html("");
		this.saveCurrentEntryToLocalStorage();
	}
	
	Controller.prototype.clearTimesheet = function (TS, ST, F, Enum) {
		
		if (confirm("Clear entries?") == false) return;
		
		TS.clear();
		ST.build(TS);
		this.paintAll(TS, ST);
		this.flush(ST, F);
		Enum.setCurrent(0);
		
	}
	
	Controller.prototype.editEntry = function (ID, TS) {
		if (!this.isFormEmpty() && confirm("Clear current entry?") == false) return;
		this.clearEntry();
		var e = TS.getEntry(ID);
		this.paintEntry(e);
	}
	
	Controller.prototype.flush = function(ST, P, F) {
		F.buildAsFlush(ST);
		P.buildAsProj(F);
		this.paintSummary(P, "project", false, "Project");
		this.paintSummary(F, "flush", true, "Issue");
	}
	
	Controller.prototype.getCurrentEntryAsObject = function() {
		var e = new Entry();
		e.setID($("#input_id").val());
		e.setHar($("#input_har").val());
		e.setBegin(this.getTimeFromField("input_begin"));
		e.setEnd(this.getTimeFromField("input_end"));
		return e;
	}
	
	Controller.prototype.getHarHtml = function (Har) {
		return "<a href=http://www.dummydomain.com/browse/" + Har + " target=_blank>" + Har + "</a>";
	}
	
	Controller.prototype.getTimeFromField = function (FieldName) {
		var str = $("#" + FieldName).val();
		return this.getTimeFromString(str);
	}
	
	Controller.prototype.getTimeFromString = function (S) {		
		var ret = new Date();
		ret.setHours(S.substring(0,2), S.substring(3,5), 0, 0);
		return ret;
	}
	
	Controller.prototype.getFormattedDate = function (D) {
		
		var s = "";
		s += D.getHours();
		s += ":";
		
		var m = "" + D.getMinutes();
		while (m.length < 2) m = "0" + m;
		s += m;
		
		return s;
		
	}
	
	Controller.prototype.getFormattedTime = function (D) {
		
		var ret = "";
		var hour = 0;
		var minute = 0;
		var remain = D;
		
		while (remain > 0) {
			
			if (remain >= 3600000) {
				hour += 1;
				remain -= 3600000;
			}
			else {
				minute = remain / 60000;
				remain = 0;
			}
			
		}
		
		if (hour > 0) ret += hour + "h ";
		if (minute > 0) ret += minute + "m";
		
		return ret;
		
	}
	
	Controller.prototype.isFormEmpty = function () {
		return $("#input_har").val() == "" &&
		$("#input_begin").val() == "" &&
		$("#input_end").val() == "";
	}
	
	Controller.prototype.loadCurrentEntryFromLocalStorage = function () {
	  var e = new Entry();
	  e.loadFromLocalStorage();
	  if (e.getHar() != "") this.paintEntry(e);
	}
	
	Controller.prototype.paintEntry = function (E) {
		
		var id = E.getID();
		
		if (id == null || id == 0) {
			$("#input_id").val( "" );
		} else {
			$("#input_id").val( id );
		}
		
		$("#input_har").val ( E.getHar() );
		jira.putIssueName( E.getHar(), "input_har_txt" );
		
		this.setTimeToField("input_begin", E.getBegin());
		this.setTimeToField("input_end", E.getEnd());
	}
	
	Controller.prototype.paintSummary = function (STT, ID, WithPost, Title) {
		
		var id = "#" + ID;
		
		var s = "";
		
		var se = STT.getSumEntries();
		
		s += "<table class='table table-striped'><thead><tr><th>" + Title + "</th><th>Time</th>";
		
		if (WithPost) s += "<th></th>";
		
		s += "</tr></thead><tbody>";
		
		for (n = 0; n < se.length; n++) {
			s += "<tr>";
			
			s += "<td>";
			s += this.getHarHtml(se[n].getHar());
			s += "</td>";
			
			s += "<td>";
			s += this.getFormattedTime(se[n].getDuration());
			s += "</td>";
			
			if (WithPost) {
				var postSpanId = "post_" + se[n].getHar();
				
				s += "<td>";
				s += "<span id=" + postSpanId + ">";
				s += "<button class='btn btn-sm btn-default' onClick='cont.postWorkLog(\"" + se[n].getHar() + "\", " + se[n].getDuration() + ", \"" + postSpanId + "\")'><span class='glyphicon glyphicon-send'></span></button>";
				s += "</span>";
				s += "</td>";
			}
			
			s += "</tr>";
			
		}
		
		s += "</tbody></table>";
		
		$( id ).html( s );
		
	}
	
	Controller.prototype.paintTimesheet = function (TS) {
		
		var s = "";
		
		s += "<table class='table table-striped'><thead><tr>";
		s += "<th>ID</th>";
		s += "<th>HAR</th>";
		s += "<th>Text</th>";
		s += "<th>Begin</th>";
		s += "<th>End</th>";
		s += "<th>Time</th>";
		s += "<th>Operation</th>";
		s += "</tr></thead><tbody>";
		
		var e = TS.getEntries();
		
		for (n = 0; n < e.length; n++) {
			
			s += "<tr>";
			
			s += "<td>";
			s += e[n].getID();
			s += "</td>";
			
			s += "<td>";
			s += this.getHarHtml(e[n].getHar());
			s += "</td>";
			
			s += "<td><span id=har_txt_" + e[n].getID()  + "></td>";
			
			s += "<td>";
			s += this.getFormattedDate(e[n].getBegin());
			s += "</td>";
			
			s += "<td>";
			s += this.getFormattedDate(e[n].getEnd());
			s += "</td>";
			
			s += "<td>";
			s += this.getFormattedTime(e[n].getDuration());
			s += "</td>";
			
			s += "<td>";
			s += "<a href=# onclick='(cont.editEntry(" + e[n].getID() + ", tim, st));'><span class='glyphicon glyphicon-pencil'></span></a> ";
			s += "<a href=# onclick='(cont.rework(" + e[n].getID() + ", tim));'><span class='glyphicon glyphicon-repeat'></span></a> ";
			s += "<a href=# onclick='(cont.removeEntry(" + e[n].getID() + ", tim, st));'><span class='glyphicon glyphicon-trash'></span></a>";
			s += "</td>"
			
			s += "</tr>";
			
		}
		
		s += "</tbody></table>";
		
		$("#timesheet").html( s );
		
		for (n = 0; n < e.length; n++) {
			jira.putIssueName( e[n].getHar(), "har_txt_" + e[n].getID() );
		}
		
		
	}
	
	Controller.prototype.paintAll = function (TS, STT) {
		this.paintTimesheet(TS);
		this.paintSummary(STT, "summary", false, "Issue");
	}
	
	Controller.prototype.postWorkLog = function(HAR, Duration, ID) {
		$( "#" + ID ).html( "<span class='glyphicon glyphicon-hourglass'></span>" );
		jira.postWorklog(HAR, Duration / 1000, ID);
	}
	
	Controller.prototype.removeEntry = function (ID, TS, STT) {
		
		if (confirm("Remove entry?") == false) return;
		
		TS.removeEntry(ID);
		TS.saveToLocalStorage();
		
		STT.build(TS);
		this.paintAll(TS, STT);
	}
	
	Controller.prototype.rework = function (ID, TS) {
		
		if (!this.isFormEmpty() && confirm("Clear current entry?") == false) return;
		
		this.clearEntry();
		var e = TS.getEntry(ID);
		$("#input_har").val ( e.getHar() );
		jira.putIssueName( e.getHar(), "input_har_txt" );
		this.startTimer();
		
		this.saveCurrentEntryToLocalStorage();
	}
	
	Controller.prototype.saveCurrentEntryToLocalStorage = function () {
		var e = this.getCurrentEntryAsObject();
		e.saveToLocalStorage();
	}
	
	Controller.prototype.setTimeToField = function (FieldName, DT) {
		
		var fld = document.getElementById(FieldName);
		
		try {
		
			var h = DT.getHours() + "";
			while (h.length < 2) { h = "0" + h; }
			
			var m = DT.getMinutes() + "";
			while (m.length < 2) { m = "0" + m; }
			
			
			fld.value = h + ":" + m;
		
		} catch (err) { fld.value = ""; }
	}
	
	Controller.prototype.startTimer = function () {
		if ($("#input_begin").val() != "" && confirm("Clear current start?") == false) return;
		this.setTimeToField("input_begin", new Date());
		jira.putIssueName( $( "#input_har" ).val(), "input_har_txt" );
		this.saveCurrentEntryToLocalStorage();
	}
	
	Controller.prototype.stopTimer = function () {
		this.setTimeToField("input_end", new Date());
		this.saveCurrentEntryToLocalStorage();
	}
	
}