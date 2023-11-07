var form = document.getElementById("myForm");
var button = document.getElementById("submitButton");
var squares = document.querySelectorAll(".square");
var mouse_state = "select";
var from = "";
var to = "";

button.addEventListener("click", function() {
    var fromValue = document.getElementById("from").value;
    var toValue = document.getElementById("to").value;
    var url = "";

    if(fromValue == "" || toValue == ""){
        url = "/game/play/move/empty/empty"
    } else {
        url = "/game/play/move/" + fromValue + "/" + toValue;
    }

    window.location.href = url;
});

squares.forEach(square => {
	square.addEventListener("click", () => {
		if (mouse_state == "select") {
			from = square.id
			const selected = document.getElementById(from);
			selected.style.backgroundColor = "lightblue";
			mouse_state = "move";
			// window.location.href = "/game/play/move/options/" + from;
		} else {
			to = square.id
			mouse_state = "select"
			window.location.href = "/game/play/move/" + from + "/" + to;
		}
	});
});

