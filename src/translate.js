// team_seven Code Translator
//
// translate.js
// jquery for html drop-down selection to interact with code translation

$(document).ready(function(){
    $('#codeform').submit(function(e) {
        e.preventDefault();
        data = $('#given_code').val();
        languageFrom = $('#language-from').val();
        languageTo = $('#language-to').val();
        $.ajax({
            url: "/api/translate?txt="+data,
            data: {from: languageFrom, to: languageTo}
        })
        .done(function(result){
            $("#result").val(result);
            // console.log(result);
          });
    });
});
