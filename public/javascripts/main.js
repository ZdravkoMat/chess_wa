var form = document.getElementById("myForm");
var button = document.getElementById("submitButton");
var squares = document.querySelectorAll(".square");
var mouse_state = "select";
var from = "";
var to = "";
var isAlternate = false;

// Function to toggle colors
function toggleColors() {
    $('.square').each(function() {
        if (isAlternate) {
            $(this).toggleClass('alternate_color_scheme', false);
        } else {
            $(this).toggleClass('alternate_color_scheme', true);
        }
    });
    isAlternate = !isAlternate; // Toggle color scheme
}

// Event listener for the button
$('#colorChangeBtn').on('click', function() {
	toggleColors(); // Call the function when the button is clicked
});

document.getElementById('colorChangeBtn').addEventListener('click', function() {
	toggleColor(); // Call the function when the button is clicked
});

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

