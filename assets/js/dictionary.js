function saveWord() {
	var wordHb = $("#wordHb").val();
	var wordEn = $("#wordEn").val();
	var wordTr = $("#wordTr").val();
	var wordType = $("#wordType option:selected").val();
	var wordInf = $("#wordInf").val();
	fieldCheck("wordInf", wordInf);
	
	if(fieldCheck("wordHb", wordHb) & fieldCheck("wordEn", wordEn) & fieldCheck("wordType", wordType) & (wordType == "verb" ^ wordInf == "")){
		var parameters = {word_he: wordHb, word_inf: wordInf, word_en: wordEn, word_tr: wordTr, word_type: wordType};
		$.post( '/saveword', parameters, function(data) {
			console.log(data);
		    $("#wordHb").val("");
		    $("#wordEn").val("");
	    	$("#wordTr").val("");
	    	$("#wordInf").val("");
		    $("#wordType option:first").attr('selected','selected');
			
		    if (data == 'success') {
				$('#modal-alert').val("");
				$('#addWordModal').hide();
				$('.modal-backdrop').remove();
				// $('body').removeClass("modal-open");

		    }
			if (data == 'exists') {
				$('#modal-alert').html("Word already exists!");
			}
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

function infinitiveToggle() {
	var wordType = $("#wordType option:selected").val();
	if (wordType == "verb") {
		$("#div-inf").css("display", "block");
	} else {
		$("#div-inf").css("display", "none");
		$("#div-inf").val("");
	}

}

function fillDictionaryTable(rating, checked, wordtypes, rowsCount=100){
	$.post( '/getdictionarytable', {rating: rating, checked: checked, wordtypes: wordtypes, rowsCount: rowsCount}, function(data) {
		$("#dictionary-table").val(data);
	});
}
















