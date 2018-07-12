var JSdataCurrentDictionary;
var JSdataCurrentPlay;

function fillDictionaryTable(rating, checked, wordType, dict, word=null, rowsCount=100){
    if(word == null) word = $('#searchWord').val();
    $.post( '/getdictionarytable', {rating: rating, checked: checked, wordType: wordType, rowsCount: rowsCount, dict: dict, word: word}, function(data) {
        JSdataCurrentDictionary = JSON.parse(data);
        var html = fillTableHead()
                   .then(response => document.getElementById("dictionary-table").innerHTML = response+fillTableBody()+"</tbody></table></div>");

        if (JSdataCurrentDictionary == "") html = 'Empty!';
   
        getFilterSettings();
    });
}

function fillTableHead() {
    return new Promise(function(resolve, reject) {
        $.post( '/gettablehead', {}, function(data) {
            resolve(data);
        });
    });
}

function fillTableBody() {
    var rowsLength = JSdataCurrentDictionary.length;
    var row, html = "";

    for (var i = 0; i < rowsLength; i++) {
        row = JSdataCurrentDictionary[i];
        var checked = "";
        if (JSdataCurrentDictionary[i].raiting_user_check == 1)
            checked = `<input type="checkbox" checked onchange="checkWord(${JSdataCurrentDictionary[i].dictionary_id}, this.checked)">`;
        if (JSdataCurrentDictionary[i].raiting_user_check == 0)
            checked = `<input type="checkbox" onchange="checkWord(${JSdataCurrentDictionary[i].dictionary_id}, this.checked)">`;

        html+=` <tr id="${JSdataCurrentDictionary[i].dictionary_id}">
					<td>
                        ${checked}
                    </td>
					<td>
                        <input class="word_he" value="${JSdataCurrentDictionary[i].dictionary_word_he}">
                    </td>
                    <td>
                        <input class="word_inf" value="${JSdataCurrentDictionary[i].dictionary_word_inf}">
                    </td>
					<td>
                        <input class="word_${getCookie("language")}" value="${JSdataCurrentDictionary[i]["dictionary_word_"+getCookie("language")]}">
                    </td>
					<td>
                        <input class="word_tr" value="${JSdataCurrentDictionary[i].dictionary_word_tr}">
                    </td>
					<td>
                        <input class="word_type" value="${setWordType(JSdataCurrentDictionary[i].dictionary_word_type)}">
                    </td>
					<td>
                        <input class="user_id" value="${JSdataCurrentDictionary[i].dictionary_user_id}">
                    </td>
                    <td>
                        <div class="btn-group" data-toggle="buttons">
                          <button class="btn btn-danger btn-sm" onclick="deleteWord(${JSdataCurrentDictionary[i].dictionary_id})">
                            Delete
                          </button>
                          <button class="btn btn-success btn-sm" onclick="saveWord(${JSdataCurrentDictionary[i].dictionary_id})">
                            Save
                          </button>
                        </div>
                    </td>
				</tr>`;

    }
    return html;
}

function getFilterSettings(){
    $.post( '/getfiltersettings', {}, function(data) {
        $('#filterSetting').html(data);
    });
}

fillDictionaryTable("", "", "");

function deleteWord(id){
    var conf = confirm("Are you realy wont to delete this word?");
    if (conf){
        $.post( '/setdeleteword', { id: id }, function(data) {
            alert(data);
        });
    }
}

function saveWord(id){
    var word_he = $("#"+id+" .word_he").val();
    var word_inf = $("#"+id+" .word_inf").val();
    var word_translate = $("#"+id+" .word_"+getCookie('language')).val();
    var word_lang = getCookie('language');
    var word_transcription = $("#"+id+" .word_tr").val();
    var word_type = $("#"+id+" .word_type").val();
    var word_user_id = $("#"+id+" .user_id").val();
    
    var parameters = {word_he: word_he, word_inf: word_inf, word_translate: word_translate, word_lang: word_lang, word_tr: word_transcription, word_type: word_type, word_user_id: word_user_id};
    
    alert(JSON.stringify(parameters));
    $.post( '/saveword', parameters, function(data) {
        alert(data);
    });

}