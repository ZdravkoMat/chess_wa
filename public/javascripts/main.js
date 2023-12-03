let from = '';
let to = '';
let current_game_theme = 0;
const game_themes = ['game_theme_0', 'game_theme_1']

$(document).ready(function() {
	$('.square').click(squareClick);
	$('#undo').click(undo);
	$('#redo').click(redo);
	$('#colorChangeBtn').click(nextGameTheme);
	$(document).keydown(shortcuts);
	updateBoard();
	connectWebSocket()
});

function move(from, to) {
	$.ajax({
		method: 'GET',
		url: `/game/play/move/${from}/${to}`,

		success: function (result) {
			clearSelection()
			updateBoard()
		}
	});
}

function undo() {
	$.ajax({
		method: 'GET',
		url: '/game/play/undo',

		success: function (result) {
			clearSelection()
			updateBoard()
		}
	});
}

function undoTo() {
	const move = this
	$.ajax({
		method: 'GET',
		url: `/game/play/undoTo/${move.id}`,

		success: function (result) {
			clearSelection()
			updateBoard()
		}
	});
}

function redoSteps() {
	const redo_move = this.id
	let current_move = $('.move.current').attr('id')
	current_move = (current_move == null) ? '0' : current_move
	$.ajax({
		method: 'GET',
		url: `/game/play/redoSteps/${parseInt(redo_move) - current_move}`,

		success: function (result) {
			clearSelection()
			updateBoard()
		}
	});
}

function redo() {
	$.ajax({
		method: 'GET',
		url: '/game/play/redo',

		success: function (result) {
			clearSelection()
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
			clearInfoPanel()
			const squares = result.board.squares
			for (const square in squares) $(`#${square} .piece`).html(squares[square].piece)
			const moves = result.board.moves
			const current_move = moves.length
			for (const move in moves) $('#moves').append(`<div id="${parseInt(move)+1}" class="move ${(move == (current_move-1)) ? "current" : ""}">${moves[move]}</div>`)
			const redo_moves = result.redo_moves
			for (const move in redo_moves) $('#moves').append(`<div id="${current_move + parseInt(move) + 1}" class="redo_move">${redo_moves[move]}</div>`)
			$(`.player_panel.${result.board.turn}`).addClass('turn')
			$(`.player_panel.${(result.board.advantage > 0) ? 'white' : 'black'} .advantage`).addClass('has_advantage').html((result.board.advantage != 0) ? `+${Math.abs(result.board.advantage)}` : '')
			const winner = result.board.winner
			$('#winner').html((winner != '') ? winner.charAt(0).toUpperCase() + winner.slice(1) + ' has won the game!' : '')
			$('.player_panel.white > .capture_stack > .pieces').html(result.board.capture_stack.white)
			$('.player_panel.black > .capture_stack > .pieces').html(result.board.capture_stack.black)
			if(result.board.checked != '') $(`#${result.board.checked}`).addClass('checked')
			$('.move').click(undoTo)
			$('.redo_move').click(redoSteps)
		}
	});
}

function moveOptions(from) {
	$.ajax({
		method: 'GET',
		url: `/moveOptionsJson/${from}`,
		dataType: 'json',

		success: function (move_options) {
			$(`#${from}`).append('<div class="selected"></div>')
			move_options.forEach(coord => $(`#${coord}`).append('<div class="move_option"></div>'))
		}
	});
}

function connectWebSocket() {
	var websocket = new WebSocket("ws://localhost:9000/websocket");
	websocket.setTimeout

	websocket.onopen = function(event) {
		console.log("Connection established!");
		websocket.send("Trying to connect");
		console.log("Message sent!");
	};

	websocket.onclose = function(event) {
		console.log("Connection closed!");
	};

	websocket.onerror = function(event) {
		console.log("Error: " + event.data);
	};

	websocket.onmessage = function(event) {
		if (typeof e.data === "string") {
            console.log('String message received: ' + e.data);
        }
        else if (e.data instanceof ArrayBuffer) {
            console.log('ArrayBuffer received: ' + e.data);
        }
        else if (e.data instanceof Blob) {
            console.log('Blob received: ' + e.data);
        }
	};
}

function shortcuts(e) {
	if (e.which === 37) undo() //left arrow key
	else if (e.which === 39) redo() //right arrow key
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

function clearSelection() {
	$('.selected').remove()
	$('.move_option').remove()
}

function clearInfoPanel() {
	$('.turn').removeClass('turn')
	$('.has_advantage').html('').removeClass('has_advantage')
	$('#moves').empty()
}

function nextGameTheme() {
	current_game_theme++
	current_game_theme = (current_game_theme >= game_themes.length) ? 0 : current_game_theme
	$('#game_theme').removeClass()
	$('#game_theme').addClass(game_themes[current_game_theme])
}
