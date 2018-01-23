var uid = 0;
var getUID = function(){
	uid = uid+1;
	return uid;
}

function LissajouPattern(element){
	//canvas global vars
	this.canvas = document.getElementById(element);
	this.ctx = this.canvas.getContext("2d");
	this.canvas.width = document.body.clientWidth; 
    this.canvas.height = document.body.clientHeight;
	this.cw = this.canvas.width;
	this.ch = this.canvas.height;

	//background
	this.ctx.beginPath();
	this.ctx.fillStyle = "#ff8a65";
	this.ctx.fillRect(0, 0, this.cw, this.ch);	

	this.c1 = new Circle(200, 400, 50, document.body);
	this.c1.setState(0, 0.01);
	this.c2 = new Circle(400, 200, 50, document.body);
	this.c1.setState(0, 0.011);
	this.l1 = new Line(600, 400, 1, 100, document.body);
	this.l1.setState(1.15);

	this.animate = function(){
		this.ctx.fillStyle = "#000";

		//animate circles
		this.c1.animate();
		this.c2.animate();

		//animate line
		this.l1.animate();

		//animate inner circle
		var c1x = this.c1.getX();
		var c2y = this.c2.getY();
		var l1x = this.l1.getPos();

		this.ctx.beginPath();
		this.ctx.fillRect(c1x,c2y,1,1);

		//animate inner lines
		this.ctx.beginPath();
		this.ctx.fillRect(l1x, c2y, 1, 1);

		//recursion
		requestAnimationFrame(function(){this.animate();}.bind(this));
	}

	this.animate();
}

function Circle(x, y, r, parent){
	//Create canvas element and add it on top of original canvas
	this.circle = document.createElement('canvas');
	this.circle.height = 2*r+10;
	this.circle.width = 2*r+10;

	this.circle.style.position = "fixed";
	this.circle.style.left = x - (r/2 +5);
	this.circle.style.top = y - (r/2 +5);

	this.circle.id = "circle"+getUID();
	this.ctx = this.circle.getContext('2d');
	this.ctx.lineWidth = 0.1*r;
	this.ctx.lineCap="round";
	this.ctx.fillStyle = "#000";

	parent.append(this.circle);

	//state vairables
	this.states = {};
	this.states.angle = 0;
	this.states.speed = 0.01;

	//draw static circle
	this.show = function(){
		this.ctx.beginPath();
		this.ctx.lineWidth = 1;
		this.ctx.arc(this.circle.width/2,this.circle.height/2,r,0,2*Math.PI);
		this.ctx.stroke();
	}

	this.clear = function(){
		this.ctx.clearRect(0, 0, this.circle.width, this.circle.height);
	}

	this.animate = function(){
		//refresh circles.
		this.clear();
		this.show();
		this.ctx.lineWidth = 0.1*r;
		this.ctx.beginPath();
		this.ctx.arc(this.circle.width/2,this.circle.height/2,r,this.states.angle*Math.PI, (this.states.angle+0.01)*Math.PI);
		this.ctx.stroke();
		this.states.angle = (this.states.angle+this.states.speed)%2; //wrapping around 2PI
	}

	this.getPoint = function(){
    	return [x+Math.cos(this.states.angle*Math.PI)*r +(r/2),y+Math.sin(this.states.angle*Math.PI)*r +(r/2)];
	}

	this.getX = function(){
		return this.getPoint()[0];
	}

	this.getY = function(){
		return this.getPoint()[1];
	}

	this.setState = function(angle, speed){
		this.states.angle = angle;
		this.states.speed = speed;
	}
}

function Line(x, y, orient, dimension, parent){

	//Create canvas element and add it on top of original canvas
	this.line = document.createElement('canvas');
	this.line.height = 10;
	this.line.width = dimension+20;

	this.line.style.position = "fixed";
	this.line.style.left = x - (dimension/2 +10);
	this.line.style.top = y + 5;

	this.line.id = "line"+getUID();
	this.ctx = this.line.getContext('2d');
	this.ctx.lineWidth = 2;
	this.ctx.lineCap="round";
	this.ctx.fillStyle = "#000";

	parent.append(this.line);

	//State vaurables
	this.states = {};
	this.states.linespeed = 1;
	this.states.pos = 1;
	this.states.linedir = 1;

	this.show = function(){
		this.ctx.fillRect(10,5, dimension, 1);
	}

	this.clear = function(){
		this.ctx.clearRect(0, 0, this.line.width, this.line.height);
	}

	this.animate = function(){
		//TODO: handle orientation
		this.clear();
		this.show();
		this.ctx.beginPath();
		this.ctx.fillRect(this.states.linespeed*this.states.pos+10, 3, 5,5);
		this.ctx.stroke();

		this.states.pos = this.states.pos + this.states.linedir;
		if(this.states.pos * this.states.linespeed <= 0 ||	this.states.pos	* this.states.linespeed >= 100){
			this.states.linedir *= -1;
		}
	}

	this.getPos = function(){
		return x+this.states.pos-(dimension/2);
	}

	this.setState = function(linespeed){
		this.states.linespeed = linespeed;
	}
}