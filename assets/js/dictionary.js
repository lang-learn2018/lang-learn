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
	fillDictionaryTable("", "", "", "", value);
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

function fillDictionaryTable(rating, checked, wordType, rowsCount=100, word=null){
	if(word == null) word = $('#searchWord').val();
	$.post( '/getdictionarytable', {rating: rating, checked: checked, wordType: wordType, rowsCount: rowsCount, word: word}, function(data) {
		
		console.log(wordType)
		var JSdata = JSON.parse(data);
		for(var i = 0; i < JSdata.length; i++) {
			if (JSdata[i].dictionary_word_inf != "") {
				var heb = JSdata[i].dictionary_word_inf + ") " + JSdata[i].dictionary_word_he+")";
			} else {
				var heb = JSdata[i].dictionary_word_he;
			}
			var checked = "";
			if (JSdata[i].raiting_user_check == 1) 
				checked = `<input type="checkbox" checked onchange="checkWord(${JSdata[i].dictionary_id}, this.checked)">`;
			if (JSdata[i].raiting_user_check == 0) 
				checked = `<input type="checkbox" onchange="checkWord(${JSdata[i].dictionary_id}, this.checked)">`;
			
			var raiting = "";
			var ratingTh = "";
			if (JSdata[i].raiting_sum != "null") {
				raiting = `<td class="text-center">${JSdata[i].raiting_sum}</td>`;
				ratingTh = `<th scope="col"  class="text-center">Rating</th>`;
			}
			
			if(i == 0) {
				var html = `<table class="table table-striped"> 
					  <thead> 
					    <tr> 
					      <th scope="col"></th> 
					      <th scope="col">Hebrew</th> 
					      <th scope="col">Engligh</th> 
					      <th scope="col">Transcription</th> 
					      <th scope="col">Type</th> 
					      ${ratingTh} 
					    </tr> 
					  </thead>
					<tbody>`;
			}

			html+=`<tr> 
					<td>${checked}</td> 
					<td>${heb}</td> 
					<td>${JSdata[i].dictionary_word_en}</td> 
					<td>${JSdata[i].dictionary_word_tr}</td>
					<td>${setWordType(JSdata[i].dictionary_word_type)}</td> 
					${raiting} 
				   </tr>`;
		}
		html+='</tbody></table>';
		$("#dictionary-table").html(html);
		getFilterSettings();
	});
}

function getFilterSettings(){
	$.post( '/getfiltersettings', {}, function(data) {
		$('#filterSetting').html(data);
	});
}

fillDictionaryTable("", "", "", 100);

function checkWord(wordID, checked) {
	$.post( '/checkWord', { wordID, checked }, function(data) {
		console.log(data);
	});
}

function setWordType(typeCode) {
	if(typeCode == "verb") return "Verb";
	if(typeCode == "noun") return "Noun";
	if(typeCode == "adj") return "Adjective";
	if(typeCode == "frss") return "Frase";
	if(typeCode == "other") return "Other";
}












