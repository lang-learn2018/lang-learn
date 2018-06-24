var JSdataCurrentDictionary;

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
		JSdataCurrentDictionary = JSON.parse(data);
		for(var i = 0; i < JSdataCurrentDictionary.length; i++) {
			if (JSdataCurrentDictionary[i].dictionary_word_inf != "") {
				var heb = JSdataCurrentDictionary[i].dictionary_word_inf + ") " + JSdataCurrentDictionary[i].dictionary_word_he+")";
			} else {
				var heb = JSdataCurrentDictionary[i].dictionary_word_he;
			}
			var checked = "";
			if (JSdataCurrentDictionary[i].raiting_user_check == 1) 
				checked = `<input type="checkbox" checked onchange="checkWord(${JSdataCurrentDictionary[i].dictionary_id}, this.checked)">`;
			if (JSdataCurrentDictionary[i].raiting_user_check == 0) 
				checked = `<input type="checkbox" onchange="checkWord(${JSdataCurrentDictionary[i].dictionary_id}, this.checked)">`;
			
			var raiting = "";
			var ratingTh = "";
			if (JSdataCurrentDictionary[i].raiting_sum != "null") {
				raiting = `<td class="text-center">${JSdataCurrentDictionary[i].raiting_sum}</td>`;
				ratingTh = `<th scope="col"  style="white-space:nowrap;" class="text-center">Rating
								<span id="raitingsort">
						      		<img style="cursor: pointer;" class="arrows" src="assets/img/arrow-up.png" height="13" width="13">
						      		<img style="cursor: pointer;" class="arrows" src="assets/img/arrow-down.png" height="13" width="13">
					      		</span>
							</th>`;
			}
			
			if(i == 0) {
				var html = `<table class="table table-striped"> 
					  <thead> 
					    <tr> 
					      <th scope="col"></th> 
					      <th  style="white-space:nowrap;" scope="col">Hebrew 
					      	<span id="hebrewsort">
					      		<img style="cursor: pointer;" class="arrows" src="assets/img/arrow-up.png" height="13" width="13">
					      		<img style="cursor: pointer;" class="arrows" src="assets/img/arrow-down.png" height="13" width="13">
					      	</span>
					      </th> 
					      <th style="white-space:nowrap;" scope="col">Engligh
							<span id="englishsort">
					      		<img style="cursor: pointer;" class="arrows" src="assets/img/arrow-up.png" height="13" width="13">
					      		<img style="cursor: pointer;" class="arrows" src="assets/img/arrow-down.png" height="13" width="13">
					      	</span>
					      </th> 
					      <th style="white-space:nowrap;" scope="col">Transcription
							<span id="transsort">
					      		<img style="cursor: pointer;" class="arrows" src="assets/img/arrow-up.png" height="13" width="13">
					      		<img style="cursor: pointer;" class="arrows" src="assets/img/arrow-down.png" height="13" width="13">
					      	</span>
					      </th> 
					      <th style="white-space:nowrap;" scope="col" style="white-space:nowrap;">Type
							<span>
					      		<img id="typeupsort" style="cursor: pointer;" onclick="sortBy(this.id)" class="arrows" src="assets/img/arrow-up.png" height="13" width="13">
					      		<img id="typedownsort" style="cursor: pointer;" onclick="sortBy(this.id)"  class="arrows" src="assets/img/arrow-down.png" height="13" width="13">
					      	</span>
					      </th> 
					      ${ratingTh} 
					    </tr> 
					  </thead>
					<tbody>`;
			}

			html+=`<tr> 
					<td>${checked}</td> 
					<td>${heb}</td> 
					<td>${JSdataCurrentDictionary[i].dictionary_word_en}</td> 
					<td>${JSdataCurrentDictionary[i].dictionary_word_tr}</td>
					<td>${setWordType(JSdataCurrentDictionary[i].dictionary_word_type)}</td> 
					${raiting} 
				   </tr>`;
		}
		html+='</tbody></table>';
		if (JSdataCurrentDictionary == "") {
		    html = '<div class="row" style="margin-top:25px;">\n' +
                '  <div class="col-sm-4"></div>\n' +
                '  <div class="col-sm-4"><div class="card" style="max-width: 500px;">\n' +
                '  <h5 class="card-header">Warning</h5>\n' +
                '  <div class="card-body">\n' +
                '    <h5 class="card-title">There is no such word in dictionary</h5>\n' +
                '    <p class="card-text">There is no word <span class="badge badge-warning">' +word +'</span> in' +
                ' dictionary.' +
                ' You' +
                ' can' +
                ' add' +
                ' it!</p>\n' +
                '    <button id="addbtn" class="btn btn-outline-primary" type="button" data-toggle="modal"\n' +
                '                    data-target="#addWordModal">Add</button>' +
                '  </div>\n' +
                '</div></div>\n' +
                '  <div class="col-sm-4"></div>\n' +
                '</div>';
        }
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

function startLearn() {
	if($("#startStop").hasClass("btn-success")){
		$("#startStop").removeClass("btn-success");
		$("#startStop").addClass("btn-danger");
		$("#startStop").html("Stop learning");
		$("#searchWord").attr("disabled", true);
		$("#addbtn").attr("disabled", true);
		$("#addbtn").removeClass("btn-outline-primary");
		$("#addbtn").addClass("btn-outline-secondary");
		$("#wordtype").attr("disabled", true);
		$("#wordcheck").attr("disabled", true);
		$("#wordstatus").attr("disabled", true);
	} else {
		$("#startStop").removeClass("btn-danger");
		$("#startStop").addClass("btn-success");
		$("#startStop").html("Start learning");
		$("#searchWord").attr("disabled", false);
		$("#addbtn").attr("disabled", false);
        $("#addbtn").removeClass("btn-outline-secondary");
        $("#addbtn").addClass("btn-outline-primary");
		$("#wordtype").attr("disabled", false);
		$("#wordcheck").attr("disabled", false);
		$("#wordstatus").attr("disabled", false);
	}
}

function sortBy(id){
	alert(id);
}









