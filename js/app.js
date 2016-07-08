var align;

if (localStorage.align)
    align = localStorage.align*1
else
    align = 0;

var alignNumberId = document.getElementById("alignNumberId");
alignNumberId.value = align;
var alignRangeId = document.getElementById("alignRangeId");
alignRangeId.value = align + 50;



function hideElement(theElement)
{
    document.getElementById(theElement).style.display = "none";
}


function showElement(theElement)
{
    document.getElementById(theElement).style.display = "block";
}


hideElement("buttonController");
hideElement("joystickController");
hideElement("keyboardController");

var canvas = document.getElementById("controllerJoystickCanvas");
var context = canvas.getContext("2d");

var count = 0;

//context.fillStyle = "#FF0000";
//context.fillRect(0,0,1400,400);
functReset(-1,-1);

window.onresize = function(event)
{
	functReset(-1,-1);
};

function functReset(x,y)
{
	var smallestSize = Math.min(window.innerWidth, window.innerHeight);
	context.canvas.width = smallestSize*4/5;
	context.canvas.height = smallestSize*4/5;
	drawBackground();
	drawCenter(x,y);
}

function drawBackground()
{
	var smallest = Math.min(canvas.width, canvas.height);
	context.beginPath();
    context.lineWidth = 4;
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
    context.lineWidth = 3;
	context.arc(x, y, smallest/8, 0, 2*Math.PI);
	context.stroke();
}

var clicked = false;
var mouse = true;
canvas.onmousedown = function(){
	if (!mouse) return;
    controllerDown();
};

window.onmouseup = function(){
	if (!mouse) return;
    controllerUp();
};

canvas.onmousemove = function(data){
    mouse = true;
    if (!clicked) return;
    controllerMove(data);
};

canvas.addEventListener("touchstart", controllerDown, false);
canvas.addEventListener("touchend", controllerUp, false);
canvas.addEventListener("touchcancel", controllerUp, false);
canvas.addEventListener("touchmove", controllerMove, false);
canvas.addEventListener("touchmove", function(){
    mouse = false;
}, false);


function controllerDown()
{
    functReset(-1,-1);
	moveRobot(0,0);
	clicked = true;
}

function controllerUp()
{
	if (document.getElementById("joystickController").style.display != 'none');
	{
		functReset(-1,-1);
		moveRobot(0,0);
		clicked = false;
	}
}

function controllerMove(data)
{
	var location = mousePosition(canvas,data,mouse);
	moveController(location);
}

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
	
    //if (count >= 10)
	//{
    if (leftMotor==null || rightMotor == null) return;
		moveRobot(leftMotor,rightMotor);
		count = 0;
	//}
	//else
	//	count++;
	
}

function mousePosition(obj, location, ismouse)
{
    var rect = obj.getBoundingClientRect();
    if (ismouse)
    {
        return {
            x: location.clientX - rect.left,
            y: location.clientY - rect.top
        } 
    }
    else //is touch
    {
        var touch = location.targetTouches[0];
        console.log(rect.left);
        return {
            x: touch.pageX - rect.left,
            y: touch.pageY - rect.top
        }
    }

}

document.getElementById("rightButton").onclick = function(){
    moveRobot(-100, 100);
};

document.getElementById("forwardButton").onclick = function(){
    moveRobot(100, 100);
};

document.getElementById("stopButton").onclick = function(){
    moveRobot(0, 0);
};

document.getElementById("leftButton").onclick = function(){
    moveRobot(100, -100);
};

document.getElementById("reverseButton").onclick = function(){
    moveRobot(-100, -100);
};

document.getElementById("goBackButton").onclick = function(){
    hideElement("buttonController");
    showElement("homeScreen");
    hideElement("bottomGoBackButton");
};


document.getElementById("bottomGoBackButton").onclick = function(){
    hideElement("joystickController");
    hideElement("buttonController");
    hideElement("keyboardController");
    hideElement("settingsController");
    showElement("homeScreen");
    hideElement("bottomGoBackButton");
};

/*
var buttonsGoBack = document.getElementsByClassName("bottomGoBackButton");

for (var i = 0; i < buttonsGoBack.length; i++)
{
    buttonsGoBack[i].onclick = function(){
        hideElement("joystickController");
        hideElement("keyboardController");
        hideElement("settingsController");
        showElement("homeScreen");
    };
}
*/
document.getElementById("goToButtons").onclick = function(){
    showElement("buttonController");
    hideElement("homeScreen");
    hideElement("bottomGoBackButton");
};

document.getElementById("goToJoystick").onclick = function(){
    showElement("joystickController");
    hideElement("homeScreen");
    showElement("bottomGoBackButton");
};

document.getElementById("goToKeyboard").onclick = function(){
    showElement("keyboardController");
    hideElement("homeScreen");
    showElement("bottomGoBackButton");
};

document.getElementById("goToSettings").onclick = function(){
    showElement("settingsController");
    hideElement("homeScreen");
    showElement("bottomGoBackButton");
};

function moveRobot(leftMotor, rightMotor)
{
    if (align < 0)
        leftMotor = leftMotor * (1+align/100.0)
    if (align > 0)
        rightMotor = rightMotor * (1-align/100.0)
    var output = "left=" + leftMotor + "&right=" + rightMotor
    document.getElementById("bottomLastCommand").innerHTML = "(" + Math.round(leftMotor) + ", " + Math.round(rightMotor) + ")";
	postData("/command", output, function(input){
		console.log(input);
	});
	console.log(output);
};

alignRangeId.onchange = function()
{
    align = alignNumberId.value = alignRangeId.value - 50;
    localStorage.align = align;
};

alignNumberId.onchange = function()
{
    alignRangeId.value = (align = alignNumberId.value*1) + 50;
    localStorage.align = align;
};


function postData(path, output, callback)
{
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open("POST", path, true);
    xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xmlhttp.onreadystatechange = function(){
        if (xmlhttp.readyState ==  XMLHttpRequest.DONE && xmlhttp.status == 200){
            callback(xmlhttp.responseText);
        }
    };
    xmlhttp.send(output); 
}

window.onkeydown = function(data){
    //a 65
    //w 87
    //s 83
    //d 68
    //up 38
    //down 40
    //left 37
    //right 39
    //space 32
    
    if (document.getElementById('keyboardController').style.display != 'none')
    {
        //rightButton
        if (data.keyCode == 39 || data.keyCode == 68)
        {
            moveRobot(-100, 100);
        }

        //forwardButton
        if (data.keyCode == 38 || data.keyCode == 87)
        {
            moveRobot(100, 100);
        }

        //stopButton
        if (data.keyCode == 32)
        {
            moveRobot(0, 0);
        }
        //leftButton
        if (data.keyCode == 37 || data.keyCode == 65)
        {
            moveRobot(100, -100);
        }

        //reverseButton
        if (data.keyCode == 40 || data.keyCode == 83)
        {
            moveRobot(-100, -100);
        }
        
        document.getElementById('directionalStatus').innerHTML = data.keyCode;
    }
}