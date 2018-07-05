function setLanguage(lang){
    $.post('/setlanguage', {language:lang}, function (data) {
    	if(data == "success") location.reload();
    });
}