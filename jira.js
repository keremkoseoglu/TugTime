function Jira() {
	
	var username = "myusername";
	var password = "mypassword";
	
	Jira.prototype.postWorklog = function(Har, Duration, ResultId) {
		
		var postData = "";
		postData += "{\"author\": { \"name\": \"";
		postData += "myusername";
		postData += "\" },  \"issue\": { \"remainingEstimateSeconds\": 0, \"key\": \"";
		postData += Har;
		postData += "\" }, \"comment\": \"ABAP\", \"dateStarted\": \"";
		postData += new Date().toISOString().slice(0,10) + "T00:00:00.000+0000";
		postData += "\", \"timeSpentSeconds\": ";
		postData += Duration;
		postData += "}";
		
		
		$.ajax( {
			
			url: "http://www.dummydomain.com/rest/tempo-timesheets/3/worklogs/",
			
			type: "POST",
			
			contentType: "application/json",
			
			data: postData,
			
			beforeSend: function( xhr ) {
				xhr.setRequestHeader("Authorization", "Basic " + btoa(this.username + ":" + this.password));
			},
			
			success: function( response ) {
				$( "#" + ResultId ).html( "<span class='glyphicon glyphicon-ok'></span>" );
			},
			
			error: function(xhr, textStatus, errorThrown){
				$( "#" + ResultId ).html( "<span class='label label-danger'>" + errorThrown + "</span>");
			}
	
	} );
		
	}
	
	Jira.prototype.putIssueName = function(har, id) {
		
		$.ajax( {
			
			url: "http://www.dummydomain.com/rest/api/2/search",
			
			dataType: "json",
			
			data: {
				jql: "issuekey=" + har,
				startAt: "0",
				expand: "names,renderedFields,schema,transitions,operations,editmeta,changelog",
				maxResults: "1"
			},
			
			beforeSend: function( xhr ) {
				xhr.setRequestHeader("Authorization", "Basic " + btoa(this.username + ":" + this.password));
			},
			
			success: function( response ) {
				$( "#" + id ).html( response.issues[0].fields.summary );
			}
	
	} );
		
	}
	
}