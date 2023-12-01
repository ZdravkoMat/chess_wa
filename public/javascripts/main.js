let from = '';
let to = '';
let isAlternate = false;

$(document).ready(function() {
	$('#colorChangeBtn').click(toggleColors);
	$('.square').click(squareClick);
	$('#undo').click(undo);
	$('#redo').click(redo);
	$(document).keydown(shortcuts)
});

function move(from, to) {
	$.ajax({
		method: 'GET',
		url: `/game/play/move/${from}/${to}`,

		success: function (result) {
			removeSelection()
			updateBoard()
		}
	});
}

function undo() {
	$.ajax({
		method: 'GET',
		url: '/game/play/undo',

		success: function (result) {
			removeSelection()
			updateBoard()
		}
	});
}

function redo() {
	$.ajax({
		method: 'GET',
		url: '/game/play/redo',

		success: function (result) {
			removeSelection()
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
			for (const square in squares) $(`#${square} .piece`).html(squares[square].piece)
			removePlayerPanelState()
			$(`.player_panel.${result.board.turn}`).addClass('turn')
			$(`.player_panel.${(result.board.advantage > 0) ? 'white' : 'black'} .advantage`).addClass('has_advantage').html((result.board.advantage != 0) ? `+${Math.abs(result.board.advantage)}` : '')
			$('#winner').html(result.board.winner)
			$('.player_panel.white > .capture_stack > .pieces').html(result.board.capture_stack.white)
			$('.player_panel.black > .capture_stack > .pieces').html(result.board.capture_stack.black)
			if(result.board.checked != '') $(`#${result.board.checked}`).addClass('checked')
		}
	});
}

function moveOptions(from) {
	$.ajax({
		method: 'GET',
		url: `/moveOptionsJson/${from}`,
		dataType: 'json',

		success: function (move_options) {
			$(`#${from}`).addClass('selected')
			move_options.forEach(coord => $(`#${coord}`).addClass('move_option') )
		}
	});
}

function shortcuts(e) {
	if (e.which === 37) undo(); //left arrow key
	else if (e.which === 39) redo(); //right arrow key
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
	const square = this;
	if (from == '') {
		from = square.id
		moveOptions(from)
	}
	else {
		to = square.id
		move(from, to)
		from = ''
		to = ''
	}
}

function removeSelection() {
	$('.selected').removeClass('selected')
	$('.move_option').removeClass('move_option')
}

function removePlayerPanelState() {
	$('.turn').removeClass('turn')
	$('.has_advantage').html('').removeClass('has_advantage')
}

