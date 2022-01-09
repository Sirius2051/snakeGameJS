// Globals
var speed = 120,
	size = 15,
	x = true,
	y = true,
	xd = 0,
	yd = 0,
	score = 0,
	score_text = "Score: ";
// Obj class to universal properties and methods
class Obj {
	constructor() {
		this.size = size;
	}
	clash(obj) {
		var dx = Math.abs(this.x - obj.x),
			dy = Math.abs(this.y - obj.y);
		if(dx >= 0 && dx < size && dy >= 0 && dy < size) {
			return true;
		}
		else {
			return false;
		}
	}
}
// Snake
class Snake extends Obj {
	constructor(x, y) {
		super();
		this.x = x;
		this.y = y;
		this.next = null;
	}
	//
	draw(ctx) {
		if(this.next != null) {
			this.next.draw(ctx);
		}		
		ctx.fillStyle = '#f00';
		ctx.fillRect(this.x, this.y, this.size, this.size);
	}
	axes(x, y) {
		if(this.next != null) {
			this.next.axes(this.x, this.y);
		}
		this.x = x;
		this.y = y;
	}
	increase() {
		if(this.next == null) {
			this.next = new Snake(this.x, this.y);
		}
		else {
			this.next.increase();
		}
	}
	rNext() {
		return this.next;
	}
	rX() {
		return this.x;
	}
}
// Food
class Food extends Obj
{
	constructor() {
		super();
		this.x = this.px();
		this.y = this.py();
	}
	px() {
		var n = (Math.floor(Math.random() * (canvas.width/size) )) * size;
		return n;
	}
	py() {
		var n = (Math.floor(Math.random() * (canvas.height/size) )) * size;
		return n;
	}
	set() {
		this.x = this.px();
		this.y = this.py();
	}
	draw(ctx) {
		ctx.fillStyle = '#00f';
		ctx.fillRect(this.x, this.y, this.size, this.size);
	}
}
// Objects instance
var snake = new Snake(canvas.width/2, canvas.height/2);
var food = new Food();
// Function movement to snake
function movement() {
	var nx = snake.x + xd,
		ny = snake.y + yd;
	snake.axes(nx, ny);
}
function control(event) {
	var key = event.keyCode;
	if(x) {
		if(key == 38) {
			yd = -size;
			xd = 0;
			x = false;
			y = true;
		}
		else if(key == 40) {
			yd = size;
			xd = 0;
			x = false;
			y = true;
		}
	}
	if(y) {
		if(key == 37) {
			yd = 0;
			xd = -size;
			x = true;
			y = false;
		}
		else if(key == 39) {
			yd = 0;
			xd = size;
			x = true;
			y = false;
		}
	}
}
function gameOver() {
	xd = 0;
	yd = 0;
	x = true;
	y = true;
	score = 0;
	snake = new Snake(canvas.width/2, canvas.height/2);
	food = new Food();
	document.getElementById('score').innerHTML = score_text + score;
}
function clashBody() {
	var temp = null;
	try {
		temp = snake.rNext().rNext();
	}
	catch(err) {
		temp = null;
	}
	while(temp != null) {
		if(snake.clash(temp)) {
			gameOver();
		}
		else {
			temp = temp.rNext();
		}
	}
}
function limited() {
	if(snake.x < 0 || snake.x > (canvas.width - size ) || snake.y < 0 || snake.y > (canvas.height - size)) {
		gameOver();
	}
}
// Draw function
function draw() {
	var canvas = document.getElementById('canvas');
	var ctx = canvas.getContext('2d');
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	for(var ax = 0; ax <= canvas.width; ax = ax + size) {
		ctx.moveTo(ax, 0);
		ctx.lineTo(ax, canvas.width);
	}
	for(var ay = 0; ay <= canvas.height; ay = ay + size) {
		ctx.moveTo(0, ay);
		ctx.lineTo(canvas.height, ay);
	}
	snake.draw(ctx);
	food.draw(ctx);
	ctx.strokeStyle = '#0f0';
	ctx.stroke();
}
// Main function
function main() {
	clashBody();
	limited();
	draw();
	movement();
	if(snake.clash(food)) {
		food.set();
		snake.increase();
		score += 5;
		document.getElementById('score').innerHTML = score_text + score;
		speed -= 5;
		console.log(speed);
	}
} 
// Run the program
setInterval("main()", speed);