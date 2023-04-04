$(document).ready(function(){
    $('#codeform').submit(function(e) {
        e.preventDefault();
        data = $('#given_code').val();
        $.ajax({url: "/api/translate?txt="+data})
        .done(function(result){
            $("#result").val(result);
            // console.log(result);
          });
    });
});