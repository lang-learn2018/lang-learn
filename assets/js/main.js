/*function getStrings(){
	$.post('/getstrings', {}, function (data) {
		console.log(data);
    	strings = JSON.parse(data);
    });
}*/

function setLanguage(lang){
    $.post('/setlanguage', {language:lang}, function (data) {
    	if(data == "success") location.reload();
    });
}

