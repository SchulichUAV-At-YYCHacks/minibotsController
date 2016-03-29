$("#buttonController").toggle();
$("#joystickController").toggle();
var canvas = document.getElementById("controllerJoystickCanvas");
var context = canvas.getContext("2d");

var count = 0;

context.fillStyle = "#FF0000";
context.fillRect(0,0,1400,400);
functReset(-1,-1);

window.onresize = function(event)
{
	functReset(-1,-1);
};

function functReset(x,y)
{
	var smallestSize = Math.min(window.innerWidth, window.innerHeight);
	context.canvas.width = smallestSize/2;
	context.canvas.height = smallestSize/2;
	drawBackground();
	drawCenter(x,y);
}

//$("#homeScreen").toggle(); //Delete before release

function drawBackground()
{
	var smallest = Math.min(canvas.width, canvas.height);
	context.beginPath();
	context.arc(smallest/2, smallest/2, smallest/3, 0, 2*Math.PI);
	context.stroke();
}



function drawCenter(x,y)
{
	var smallest = Math.min(canvas.width, canvas.height);
	if (x == -1 && y == -1)
	{
		x = smallest/2;
		y = smallest/2;
	}
	context.beginPath();
	context.arc(x, y, smallest/8, 0, 2*Math.PI);
	context.stroke();
}

var clicked = false;
var mouse = true;
$("#controllerJoystickCanvas").mousedown(function(){
	if (!mouse) return;
	functReset(-1,-1);
	moveRobot(0,0);
	clicked = true;
});

$(window).mouseup(function(){
	if (!mouse) return;
	console.log(!$("joystickController").is(":visible"));
	if ($("joystickController").is(":visible")) return;
	{
		functReset(-1,-1);
		moveRobot(0,0);
		clicked = false;
	}
});



$("#controllerJoystickCanvas").mousemove(function(data){
	if (!mouse) return;
	if (!clicked) return;

	var location = mousePosition(canvas,data);
	moveController(location);
});

function moveController(location)
{
	var smallest = Math.min(canvas.width, canvas.height);
	functReset(location.x, location.y);

	var forwardNoSensor = -(location.y-smallest/2)/(smallest/3);
	var rightNoSensor = (location.x-smallest/2)/(smallest/3);
	var leftMotor = 100*rightNoSensor+100*forwardNoSensor
	var rightMotor = -100*rightNoSensor+100*forwardNoSensor
	if (leftMotor>100) leftMotor = 100;
	if (leftMotor<-100) leftMotor = -100;
	if (rightMotor>100) rightMotor = 100;
	if (rightMotor<-100) rightMotor = -100;
	if (count >= 10)
	{
		moveRobot(leftMotor,rightMotor);
		count = 0;
	}
	else
		count++;
	
}

function mousePosition(obj, location)
{
	var rect = obj.getBoundingClientRect();
	return {
		x: location.clientX - rect.left,
		y: location.clientY - rect.top
	}
}

$(document).ready(function(){
	$("#rightButton").click(function(){
		moveRobot(-100, 100);
	});

	$("#forwardButton").click(function(){
		moveRobot(100, 100);
	});

	$("#stopButton").click(function(){
		moveRobot(0, 0);
	});

	$("#leftButton").click(function(){
		moveRobot(100, -100);
	});

	$("#reverseButton").click(function(){
		moveRobot(-100, -100);
	});

	$("#goBackButton").click(function(){
		$("#buttonController").toggle();
		$("#homeScreen").toggle();
	});
});

$(document).ready(function(){
	$("#bottomGoBackButton").click(function(){
		$("#joystickController").toggle();
		$("#homeScreen").toggle();
	});

});

$(document).ready(function(){
	$("#goToButtons").click(function(){
		$("#buttonController").toggle();
		$("#homeScreen").toggle();
	});

	$("#goToJoystick").click(function(){
		$("#joystickController").toggle();
		$("#homeScreen").toggle();
	});
});

function moveRobot(leftMotor, rightMotor)
{
	var object = {left: leftMotor, right: rightMotor};
	var output = JSON.stringify(object);
	$.post("/command", output, function(input){
		console.log(input);
	});
	console.log(output);
};

//$.get("/test","test");
