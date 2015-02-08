const FIELD_HEIGHT = 21;
const FIELD_WIDTH = 19;

const KEY_LEFT = 37;
const KEY_UP = 38;
const KEY_RIGHT = 39;
const KEY_DOWN = 40;
const KEY_SPACE = 32;

const keys = [KEY_LEFT, KEY_RIGHT, KEY_UP, KEY_DOWN, KEY_SPACE];

var isPause = false;
var gameSpeed = 100;
var gameIntervalId;

var x = 0;
var y = 0;
var zmSize = 1;

var new_x = 0;
var new_y = 0;

var d = 2;
var dx = [0, -1, 0, 1];
var dy = [-1, 0, 1, 0];

var field;

function setRandomNewCell() {
	getCell(new_x, new_y).removeClass("game-zm-food");
		
	var freeCellsCount = 0;
	var freeCells = new Array();
	for (var i = 0; i < FIELD_HEIGHT; ++i) {
		for (var j = 0; j < FIELD_WIDTH; ++j) {
			if (field[i][j] == 0) {
				freeCells[freeCellsCount] = { x: i, y: j };
				freeCellsCount ++;
			}
		}
	}
	
	var pos = Math.floor((Math.random() * freeCellsCount));
	new_x = freeCells[pos].x;
	new_y = freeCells[pos].y;
	
	getCell(new_x, new_y).addClass("game-zm-food");
}

function getCell(x, y) {
	return $("#game-row-" + x + " > #game-cell-" + y);
}

function gameStep() {
	getCell(x, y).removeClass("game-zm-head");
	
	x += dx[d];
	y += dy[d];
	if (x < 0) x = FIELD_HEIGHT-1;
	if (x > FIELD_HEIGHT-1) x = 0;
	if (y < 0) y = FIELD_WIDTH-1;
	if (y > FIELD_WIDTH-1) y = 0;
	
	var tailIncrease = x == new_x && y == new_y;
	if (tailIncrease) {
		zmSize ++;
	}
	
	for (var i = 0; i < FIELD_HEIGHT; ++i) {
		for (var j = 0; j < FIELD_WIDTH; ++j) {
			var cell = getCell(i, j);
			
			if (field[i][j] > 0) {
				field[i][j] ++;
				cell.addClass("game-zm-tail");
			}
			
			if (field[i][j] > zmSize) {
				field[i][j] = 0;
				cell.removeClass("game-zm-tail");
			}					
		}
	}
	
	if (tailIncrease) {
		setRandomNewCell();
	}
	
	field[x][y] = 1;
	getCell(x, y).addClass("game-zm-head");
}

function setMoveLeft() {
	if (d != 2)
		d = 0;
}

function setMoveUp() {
	if (d != 3)
		d = 1;
}

function setMoveRight() {
	if (d != 0)
		d = 2;
}

function setMoveDown() {
	if (d != 1)
		d = 3;
}

function pauseGame() {
	isPause = true;
	clearInterval(gameIntervalId);
}

function playGame() {
	isPause = false;
	gameIntervalId = setInterval(gameStep, gameSpeed);
}

function initField() {
	field = [];
	for (var i = 0; i < FIELD_HEIGHT; ++i) {
		field[i] = [];
		for (var j = 0; j < FIELD_WIDTH; ++j) {
			field[i][j] = 0;
		}
	}
}

function loadPage() {	
	var grid = document.getElementById('game-grid');

	for (var i = 0; i < FIELD_HEIGHT; ++i) {
		var row = document.createElement('div');
		row.id = "game-row-" + i;
		row.className = 'grid-row';
		
		for (var j = 0; j < FIELD_WIDTH; ++j) {
		
			var cell = document.createElement('div');
			cell.id = "game-cell-" + j;
			cell.className = 'grid-cell';
			row.appendChild(cell);
		}
		
		grid.appendChild(row);
	}
	
	initField();
	setRandomNewCell();
		
	$(document).keydown(function(e) {
		if (!isPause) {			
			if (e.keyCode == KEY_LEFT)
				setMoveLeft();
			else if (e.keyCode == KEY_UP)
				setMoveUp();
			else if (e.keyCode == KEY_RIGHT)
				setMoveRight();
			else if (e.keyCode == KEY_DOWN)
				setMoveDown();
		}
		
		if (e.keyCode == KEY_SPACE) {
			if (isPause)
				playGame();
			else
				pauseGame();
		}
			
		if (keys.indexOf(e.keyCode) != -1)
			return false;
	})
	
	playGame();
}