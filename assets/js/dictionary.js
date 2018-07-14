var JSdataCurrentDictionary;
var JSdataCurrentPlay;
var gameType;
var gameStrings;

function saveWord() {
    var wordHb = $("#wordHb").val();
    var wordEn = $("#wordEn").val();
    var wordTr = $("#wordTr").val();
    var wordType = $("#wordType option:selected").val();
    var wordInf = $("#wordInf").val();
    fieldCheck("wordInf", wordInf);
    if(fieldCheck("wordHb", wordHb) & fieldCheck("wordEn", wordEn) & fieldCheck("wordType", wordType) & (wordType == "verb" ^ wordInf == "")){
        var parameters = {word_he: wordHb, word_inf: wordInf, word_translate: wordTr, word_lang: "en", word_tr: wordTr, word_type: wordType};
        $.post( '/saveword', parameters, function(data) {
            $("#wordHb").val("");
            $("#wordEn").val("");
            $("#wordTr").val("");
            $("#wordInf").val("");
            $("#wordType option:first").attr('selected','selected');
            if (data == 'success') {
                $('#modal-alert').val("");
                $('#addWordModal').hide();
                $('.modal-backdrop').remove();

            }
            else if (data == 'exists') {
                $('#modal-alert').html("Word exists!");
            }
            else if (data == 'adding_denied') {
                $('#modal-alert').html("Access denied!");
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
        var html = fillTableHead()
                   .then(response => document.getElementById("dictionary-table").innerHTML = response+fillTableBody()+"</tbody></table></div>");

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
        getFilterSettings();
    });
}
function getFilterSettings(){
    $.post( '/getfiltersettings', {}, function(data) {
        $('#filterSetting').html(data);
    });
}
fillDictionaryTable("", "", "", 100);

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
        getCardPlayType().then(response => document.getElementById("dictionary-table").innerHTML = response) ;
        //$("#dictionary-table").html(cardHTML);
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
        var htmlTable = fillTableHead()
                   .then(response => document.getElementById("dictionary-table").innerHTML = response+fillTableBody()+"</tbody></table></div>");
        $("#dictionary-table").html(htmlTable);
    }
}

function fillTableBody() {
    var rowsLength = JSdataCurrentDictionary.length;
    var row, html = "";

    for (var i = 0; i < rowsLength; i++) {
        row = JSdataCurrentDictionary[i];
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

        if (JSdataCurrentDictionary[i].raiting_sum != "null") {
            raiting = `<td class="text-center">${JSdataCurrentDictionary[i].raiting_sum}</td>`;

        }

        html+=`<tr>
					<td>${checked}</td>
					<td>${heb}</td>
					<td>${JSdataCurrentDictionary[i]["dictionary_word_"+getCookie("language")]}</td>
					<td>${JSdataCurrentDictionary[i].dictionary_word_tr}</td>
					<td>${setWordType(JSdataCurrentDictionary[i].dictionary_word_type)}</td>
					${raiting}
				   </tr>`;

    }
    return html;
}

function fillTableHead() {

    return new Promise(function(resolve, reject) {

        $.post( '/gettablehead', {}, function(data) {
            resolve(data);
        });

    });
}

function getCardPlayType() {
    return new Promise(function(resolve, reject) {

        $.post( '/getcardplaytype', {}, function(data) {
            resolve(data);
        });

    });

}
function cardPlayStart(){
    gameType = $("#radio-random-game").is(":checked");
    $.post( '/cardplaystart', {}, function(data) {
        $("#dictionary-table .card").html(data);
    });
}

function getFirstWordCardPlay(lang, gameType) {
    $.post( '/getfirstcardres', {}, function(data) {
        var dataArray = data.split(",");
        gameStrings = [dataArray[4],dataArray[5],dataArray[6]];
        if(JSdataCurrentPlay = JSdataCurrentDictionary){
            var stat = `
                <p>
                    <h4>${dataArray[0]}:</h4>
                    <strong>${dataArray[1]}:</strong>
                    <span id="total-word" class="text-dark">${JSdataCurrentPlay.length}</span><br>
                    <strong>${dataArray[2]}:</strong>
                    <span id="cur-word" class="text-primary">0</span><br>
                    <strong>${dataArray[3]}:</strong>
                    <span id="corr-word" class="text-success">0</span>/<span id="wrong-word" class="text-danger">0</span>
                </p>`;
            $("#play-stat").html(stat);
            getNextCardPlay(getCookie("language"));
        }
    });
   }


function getNextCardPlay(lang, hit = null, wordId = null) {
    if (hit != null && wordId != null) {
        $.post('/setwordstat', { hit:hit, wordId:wordId }, function (data) {});
    }
    var current = $("#cur-word").html();
    current = parseInt(current);
    $("#cur-word").html(++current);
    if (hit == true) {
        var correct = $("#corr-word").html();
        correct = parseInt(correct);
        $("#corr-word").html(++correct);

    }
    if (hit == false) {
        var correct = $("#wrong-word").html();
        correct = parseInt(correct);
        $("#wrong-word").html(++correct);
    }

    if (JSdataCurrentPlay.length > 0) {
        if (gameType)
            var index = Math.floor(Math.random() * JSdataCurrentPlay.length);
        else
            var index = 0;

        var currentCard = JSdataCurrentPlay[index];
        if (lang) {
            var firstWord = currentCard.dictionary_word_he;
            if (currentCard.dictionary_word_inf != "")
                firstWord = currentCard.dictionary_word_inf + ") " + currentCard.dictionary_word_he + ")";
            firstWord = `<h3>${firstWord}</h3>`;
            if (currentCard.dictionary_word_tr != "")
                firstWord = `${firstWord}<small class="text-muted">${currentCard.dictionary_word_tr}</small>`;
            var secondWord = currentCard['dictionary_word_'+lang];
        } else {
            var firstWord = `<h3>${currentCard['dictionary_word_'+lang]}</h3>`;
            var secondWord = currentCard.dictionary_word_he;
            if (currentCard.dictionary_word_inf != "")
                secondWord = currentCard.dictionary_word_inf + ") " + secondWord + ")";
            if (currentCard.dictionary_word_tr != "")
                secondWord = `${secondWord} ${currentCard.dictionary_word_tr}`;
        }
        var html = `
            <div class="card-body text-center">
                ${firstWord}<br><br>
                <strong class="text-info" style="cursor:pointer;" onclick="changeContent(this, '${secondWord}')">${gameStrings[0]}</strong>
                <br><br>
                <button onclick="getNextCardPlay('${lang}', false, '${currentCard.dictionary_id}')"
                type="button"
                class="btn btn-outline-danger">${gameStrings[1]}</button>
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                <button onclick="getNextCardPlay('${lang}', true, '${currentCard.dictionary_id}')" type="button" class="btn btn-outline-success">${gameStrings[2]}</button>
            </div>`;
        JSdataCurrentPlay.splice(index, 1);
    } else {
        var html = `GAME OVER`;
    }
    $("#dictionary-table .card").html(html);

}
function changeContent(t, content) {
    $(t).html(content);
}

