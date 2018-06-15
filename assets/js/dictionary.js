function saveWord() {
	var wordHb = $("#wordHb").val();
	var wordEn = $("#wordEn").val();
	var wordTr = $("#wordTr").val();
	var wordType = $("#wordType option:selected").val();
	
	if(fieldCheck("wordHb", wordHb) & fieldCheck("wordEn", wordEn) & fieldCheck("wordType", wordType)){
		var parameters = {word_he: wordHb, word_en: wordEn, word_tr: wordTr, word_type: wordType};
		console.log(parameters.word_he);
		$.post( '/saveword', parameters, function(data) {
		    $("#wordHb").val("");
		    $("#wordEn").val("");
		    $("#wordTr").val("");
		    $("#wordType option:first").attr('selected','selected');
		});
	}
}

function fieldCheck(fieldId, value){
	if(isFieldEmpty(value)) {
		if (!$("#"+fieldId).hasClass("is-invalid")){
			$("#"+fieldId).addClass("is-invalid");
		}
		return false;
	} else {
		if ($("#"+fieldId).hasClass("is-invalid")){
			$("#"+fieldId).removeClass("is-invalid");
		}
		return true;
	}

}

function isFieldEmpty(value) {
  value = value.replace(/\s/g,'');
  if (value == "") return true;
  return false;
}

function fillModalHb(value) {
	$("#wordHb").val(value);
}