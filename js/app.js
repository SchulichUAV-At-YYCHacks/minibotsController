var modeSelector = document.getElementById("modeSelector");

var joystickController = document.getElementById("joystickController");
var buttonController = document.getElementById("buttonController");
var keyboardController = document.getElementById("keyboardController");
var settingsController = document.getElementById("settingsController");
var leftRightStopController = document.getElementById("leftRightStopController");

var homeScreen = document.getElementById("homeScreen");
var bottomGoBackButton = document.getElementById("bottomGoBackButton");

initializeRangeNumberSystemWithId("alignRangeId", "alignNumberId", "align");
initializeRangeNumberSystemWithId("stopLeftRangeId","stopLeftNumberId", "stopLeft");
initializeRangeNumberSystemWithId("stopRightRangeId","stopRightNumberId", "stopRight");

function initializeRangeNumberSystemWithId(rangeId, numberId, nameOf)
{
    var number = document.getElementById(numberId);
    var range = document.getElementById(rangeId);
    initializeRangeNumberSystem(range, number, nameOf)
}

if (!localStorage["mode"])
    localStorage["mode"] = "normal";
modeSelector.value = localStorage["mode"];

function loadLeftRightStopController()
{
    localStorage["mode"] = modeSelector.value;
    if (modeSelector.value == "experimental")
    {
        showElement(leftRightStopController);
    }
    else
    {
        hideElement(leftRightStopController);
    }
};

loadLeftRightStopController();
modeSelector.onchange = function()
{
    loadLeftRightStopController();
}

function initializeRangeNumberSystem(range, number, nameOf)
{
    if (!localStorage[nameOf])
        localStorage[nameOf] = 0;
    number.value = localStorage[nameOf]*1;
    range.value = localStorage[nameOf]*1 + 50;

    onRangeNumberChange(range, number, nameOf);
}

function onRangeNumberChange(range,number,nameOf)
{
    var valueOf;
    range.onchange = function()
    {
        valueOf = number.value = range.value - 50;
        localStorage[nameOf] = valueOf;
    };

    number.onchange = function()
    {
        valueOf = range.value = (number.value*1) + 50;
        localStorage[nameOf] = valueOf;
    };
}

function hideElement(theElement)
{
    theElement.style.display = "none";
}


function showElement(theElement)
{
    theElement.style.display = "block";
}

var canvas = document.getElementById("controllerJoystickCanvas");
var context = canvas.getContext("2d");

var count = 0;

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
canvas.onmousedown = function() {
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
    if (document.getElementById("joystickController").style.display != 'none')
    {
        functReset(-1,-1);
        moveRobot(0,0);
        clicked = false;
    }
}

function controllerMove(data)
{
    data.preventDefault();
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
    //  count++;

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
    moveRobot(100, -100);
};

document.getElementById("forwardButton").onclick = function(){
    moveRobot(100, 100);
};

document.getElementById("stopButton").onclick = function(){
    moveRobot(0, 0);
};

document.getElementById("leftButton").onclick = function(){
    moveRobot(-100, 100);
};

document.getElementById("reverseButton").onclick = function(){
    moveRobot(-100, -100);
};

document.getElementById("goBackButton").onclick = function(){
    hideElement(buttonController);
    showElement(homeScreen);
    hideElement(bottomGoBackButton);
};


document.getElementById("bottomGoBackButton").onclick = function(){
    hideElement(joystickController);
    hideElement(buttonController);
    hideElement(keyboardController);
    hideElement(settingsController);
    showElement(homeScreen);
    hideElement(bottomGoBackButton);
};

document.getElementById("goToButtons").onclick = function(){
    showElement(buttonController);
    hideElement(homeScreen);
    hideElement(bottomGoBackButton);
};

document.getElementById("goToJoystick").onclick = function(){
    showElement(joystickController);
    hideElement(homeScreen);
    showElement(bottomGoBackButton);
};

document.getElementById("goToKeyboard").onclick = function(){
    showElement(keyboardController);
    hideElement(homeScreen);
    showElement(bottomGoBackButton);
};

document.getElementById("goToSettings").onclick = function(){
    showElement(settingsController);
    hideElement(homeScreen);
    showElement(bottomGoBackButton);
};

function moveRobot(leftMotor, rightMotor)
{
    if ((localStorage["align"]*1) < 0)
        leftMotor = leftMotor * (1+(localStorage["align"]*1)/100.0)
    if ((localStorage["align"]*1) > 0)
        rightMotor = rightMotor * (1-(localStorage["align"]*1)/100.0)
    var mode = modeSelector.value;
    if (mode == "forwardOnly")
    {
        if (leftMotor < 0)
            leftMotor = 0;
        if (rightMotor < 0)
            rightMotor = 0;
    }
    else if (mode == "experimental")
    {
        leftMotor = (localStorage["stopLeft"]*1) + leftMotor;
        rightMotor = (localStorage["stopRight"]*1) + rightMotor;
    }
    var output = "left=" + leftMotor + "&right=" + rightMotor
    document.getElementById("bottomLastCommand").innerHTML = "(" + Math.round(leftMotor) + ", " + Math.round(rightMotor) + ")";
    getData("/command", output, function(input){
        console.log(input);
    });
    console.log(output);
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

function getData(path, output, callback)
{
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open("POST", path + "?" + output, true);
    xmlhttp.onload = function(){
        if (xmlhttp.status < 400 && xmlhttp.status >= 200){
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
