let from = '';
let to = '';
let isAlternate = false;

$(document).ready(function() {
	$('#colorChangeBtn').on('click', function() {
		toggleColors(); // Call the function when the button is clicked
	});

	$('.square').on('click', function() {
		if (from == '') {
			from = this.id
			$(this).addClass('selected')
			moveOptions(from)
		}
		else {
			to = this.id
			$.get('/game/play/move/' + from + '/' + to, function(data) {
				updateBoard()
				$('.selected').removeClass('selected')
				$('.move_option').removeClass('move_option')
				from = ''
				to = ''
			});
		}
	});
});

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

function updateBoard() {
	$('.checked').removeClass('checked')
	$.ajax({
		method: 'GET',
		url: '/boardJson',
		dataType: 'json',

		success: function (result) {
			const squares = result.board.squares
			for (const square in squares) {
				$('#' + square + ' .piece').html(squares[square].piece)
			}
			$('#turn').html(result.board.turn)
			$('#advantage').html(result.board.advantage)
			$('#winner').html(result.board.winner)
			$('.capture_stack.white').html(result.board.capture_stack.white)
			$('.capture_stack.black').html(result.board.capture_stack.black)
			if(result.board.checked != '') {
				$('#' + result.board.checked).addClass('checked')
			}
		}
	});
}

function moveOptions(from) {
	$.ajax({
		method: 'GET',
		url: '/moveOptionsJson/' + from,
		dataType: 'json',

		success: function (move_options) {
			move_options.forEach(coord => $('#' + coord).addClass('move_option') )
		}
	});
}
