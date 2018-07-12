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

function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for(var i = 0; i <ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

function setWordType(typeCode) {
    if(typeCode == "verb") return "Verb";
    if(typeCode == "noun") return "Noun";
    if(typeCode == "adj") return "Adjective";
    if(typeCode == "frss") return "Frase";
    if(typeCode == "other") return "Other";
}

function checkWord(wordID, checked) {
    $.post( '/checkWord', { wordID, checked }, function(data) {
        console.log(data);
    });
}

function sortBy(field, order, elem){
    $( ".arrows" ).each(function(  ) {
        $(this).removeClass("text-success")
    });
    $(elem).addClass("text-success");
    if (order) {
        JSdataCurrentDictionary.sort(function (a, b) {
            return b[field] > a[field] ? -1 : 1;
        });
    } else {
        JSdataCurrentDictionary.sort(function (a, b) {
            return b[field] < a[field] ? -1 : 1;
        });
    }
    var html = fillTableBody();
    $("#dictionary-table tbody").html(html);
}