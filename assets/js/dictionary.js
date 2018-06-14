function saveWord() {
	var wordHb = $("#wordHb").val();
	var wordEn = $("#wordEn").val();
	var wordTr = $("#wordTr").val();
	var wordType = $("#wordType option:selected").val();
	if (fieldCheck("wordHb", wordHb) & fieldCheck("wordEn", wordEn) & fieldCheck("wordType", wordType)){

	}
}

function fieldCheck(fieldId, value){
	if(isFieldEmpty(value)) {
		if (!$("#"+fieldId).hasClass("is-invalid")){
			$("#"+fieldId).addClass("is-invalid");
		}
		return true;
	} else {
		if ($("#"+fieldId).hasClass("is-invalid")){
			$("#"+fieldId).removeClass("is-invalid");
		}
		return false;
	}

}

function isFieldEmpty(value) {
  value = value.replace(/\s/g,'');
  if (value == "") return true;
  return false;
}
