isSessionExists = function(session) {
	var sessionExists = true;
	if (session.login == undefined || session.userid == undefined || session.username ==undefined){
		sessionExists = false;
	} 
	return sessionExists;
}