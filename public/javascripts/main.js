var form = document.getElementById("myForm");
var button = document.getElementById("submitButton");

button.addEventListener("click", function() {
    var fromValue = document.getElementById("from").value;
    var toValue = document.getElementById("to").value;
    var url = "";

    if(fromValue == "" || toValue == ""){
        url = "/play/move/empty/empty"
    } else {
        url = "/play/move/" + fromValue + "/" + toValue;
    }
    
    window.location.href = url;
});