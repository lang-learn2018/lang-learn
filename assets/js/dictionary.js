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
		
		
		var JSdata = JSON.parse(data);
		console.log(JSdata.length);

		var html = '<table class="table table-striped"> \
					  <thead> \
					    <tr> \
					      <th scope="col"></th> \
					      <th scope="col">Hebrew</th> \
					      <th scope="col">Engligh</th> \
					      <th scope="col">Type</th> \
					      <th scope="col"  class="text-center">Rating</th> \
					    </tr> \
					  </thead>\
					<tbody>';
		for(var i = 0; i < JSdata.length; i++) {
			if (JSdata[i].dictionary_word_inf != "") {
				var heb = JSdata[i].dictionary_word_inf + ") " + JSdata[i].dictionary_word_he+")";
			} else {
				var heb = JSdata[i].dictionary_word_he;
			}
			if (JSdata[i].raiting_user_check == "true") {
				var checked = "checked";
			} else {
				var checked = "";
			}
			html+='<tr> \
					<td><input type="checkbox" ' + checked + ' onchange="checkWord(JSdata[i].dictionary_id)"></td> \
					<td>' + heb + '</td> \
					<td>' + JSdata[i].dictionary_word_en + '</td> \
					<td>' + JSdata[i].dictionary_word_type + '</td> \
					<td class="text-center">' + JSdata[i].raiting_sum + '</td> \
				   </tr>';
		}
		html+='</tbody></table>';
		$("#dictionary-table").html(html);
	});
}

fillDictionaryTable("", "", "", 100);

function checkWord(wordID){
	$.post( '/checkWord', {word_id:wordID});
}













