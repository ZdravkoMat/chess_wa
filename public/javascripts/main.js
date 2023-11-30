let from = '';
let to = '';
let isAlternate = false;

$(document).ready(function() {
	$('.square').click(squareClick);
	$('#undo').click(undo);
	$('#redo').click(redo);
	$('#colorChangeBtn').click(toggleColors);
});

function move(from, to) {
	$.ajax({
		method: 'GET',
		url: `/game/play/move/${from}/${to}`,

		success: function (result) {
			updateBoard()
		}
	});
}

function moveOptions(from) {
	$.ajax({
		method: 'GET',
		url: `/moveOptionsJson/${from}`,
		dataType: 'json',

		success: function (move_options) {
			move_options.forEach(coord => $('#' + coord).addClass('move_option') )
		}
	});
}

function undo() {
	$.ajax({
		method: 'GET',
		url: '/game/play/undo',

		success: function (result) {
			updateBoard()
		}
	});
}

function redo() {
	$.ajax({
		method: 'GET',
		url: '/game/play/redo',

		success: function (result) {
			updateBoard()
		}
	});
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

function squareClick() {
	if (from == '') {
		from = this.id
		$(this).addClass('selected')
		moveOptions(from)
	}
	else {
		to = this.id
		move(from, to)
		$('.selected').removeClass('selected')
		$('.move_option').removeClass('move_option')
		from = ''
		to = ''
	}
}

