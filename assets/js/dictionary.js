function saveWord() {
	var wordHb = $("#wordHb").val();
	var wordEn = $("#wordEn").val();
	var wordTr = $("#wordTr").val();
	var wordType = $("#wordType option:selected").val();
	alert(wordEn);
	
	//if(fieldCheck("wordHb", wordHb) & fieldCheck("wordEn", wordEn) & fieldCheck("wordType", wordType)){
		var parameters = {word_he: wordHb, word_en: wordEn, word_tr: wordTr, word_type: wordType};
		console.log(parameters.word_he);
		$.post( '/saveword', parameters, function(data) {
		    alert(data);
		});

		// $.ajax({
		// 	type: "POST",
  //               url: "/saveword",
  //               data: JSON.stringify({word_he: wordHb, word_en: wordEn, word_tr: wordTr, word_type: wordType}),
  //               dataType: "json",
  //               contentType: "application/json",
  //               success: function(data){ 
  //                   console.log(data);
  //                },
		// });
	//}
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
