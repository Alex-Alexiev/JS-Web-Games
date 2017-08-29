/*
FIX THIS:
all vectors go to zero when balls are inside eachother 
*/

var balls = [];
var active;
var unActive;
var mousePos = new Vector(0, 0);
var home = true;
var origin;
var ballRadius = 15;
var ballMass = 30;
var minVel = 0.1;
var velScale = 0.5;
var G = 0;
var groundFriction = 0.06;
var mousePressed = false;
var launchScaler = 15; //how much the launch vector is scaled down so that the ball does not have
//the same velocity of the line drawn by the mosue (because that line is really long and too fast)
var score = 0;
var mousePos2 = new Vector(0, 0);
var delayLaunch = false;
var showVectors = false;
var obstacleMass = 90;
var obstaceRadius = 20;
var numObstacles = 10;
var moves = 0;
var gameOver = false;
var obstacleColours = [
    '#2ef4ed',
    '#2e84f4',
    '#d6f42e',
    '#f49e2e',
    '#b942f5',
    '#ffffff',
]

var obstacles = [[ //this is an array of levels, each level has an array of 
    //obstacles
    new Vector(50, 100),
    new Vector(200, 100),
    new Vector(350, 100),
    new Vector(50, 200),
    new Vector(200, 200),
    new Vector(350, 200)
    ],
    [
    new Vector(200, 300),
    new Vector(165, 220),
    new Vector(235, 220),
    new Vector(200, 140),
    new Vector(130, 140),
    new Vector(270, 140),
    new Vector(100, 60),
    new Vector(170, 60),
    new Vector(239, 60),
    new Vector(300, 60),
    ]];
    //to add another level simply add another element to the array

var ping = new Audio('ping.mp3');

function init() {
    canvas = document.querySelectorAll("#myCanvas")[0];
    ctx = canvas.getContext("2d");
    document.addEventListener("keydown", keyDownHandler, false);
    document.addEventListener("keyup", keyUpHandler, false);
    document.addEventListener("mousemove", mouseHandler, false);
    document.addEventListener("mousedown", mouseDown, false);
    document.addEventListener("mouseup", mouseUp, false);
    active = document.getElementById("active");
    unActive = document.getElementById("unActive");
    origin = new Vector(canvas.width / 2, canvas.height - ballRadius);
    homeScreen();
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (home) {
        homeScreen();
    }
    itterateBalls();
    if (allStill() && !delayLaunch) {
        if (mousePressed /*&& mousePos.isOnScreen()*/ ) {
            drawMouseVector();
        }
    }
    showMoves();
    if (balls.length <= 0) {
        gameOver = true;
        home = true;
    }
    if (allStill() && !home) {
        showTempBall();
    }
    requestAnimationFrame(draw);
}

function homeScreen() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (mousePos.x > 100 && mousePos.x < 300 && mousePos.y < 330 && mousePos.y > 250) { //the mouse
        //is over the play now button
        ctx.drawImage(active, 0, 0);
    } else {
        ctx.drawImage(unActive, 0, 0);
    }
    if (gameOver) {
        ctx.beginPath();
        ctx.font = "20px Arial";
        ctx.fillStyle = "black";
        ctx.fillText("IT ONLY TOOK YOU " + moves + " MOVES!", 55, 400);
        ctx.fillText("PRESS 'R' TO PLAY AGAIN", 75, 430);
        ctx.closePath();
    }
    setInterval(homeScreen, 10);
}

function initObstacles() {
    var colour = Math.floor(Math.random() * obstacleColours.length);
    colour = obstacleColours[colour];
    console.log(colour);
    var i = Math.floor(Math.random() * obstacles.length);
    for (var o of obstacles[i]) {
        balls.push(new Ball(o.x, o.y, 0, 0, obstacleMass, obstaceRadius, true, colour));
    }
}

function showTempBall() {
    ctx.beginPath();
    ctx.arc(origin.x, origin.y, ballRadius, 0, 2 * Math.PI);
    ctx.fillStyle = '#df5757';
    ctx.fill();
    ctx.closePath();
}

function showMoves() {
    ctx.beginPath();
    ctx.font = "20px Arial";
    ctx.fillStyle = "white";
    ctx.fillText("MOVES: " + moves, 10, origin.y + 10);
    ctx.fillText("'R' TO RESTART", 240, origin.y + 10);
    ctx.closePath();
}

function keyDownHandler(e) {
    keyPressed = e.keyCode;
    if (keyPressed == 32) { //space bar
        balls.push(new Ball(mousePos.x, mousePos.y, 0, 10, 10, 20, true));
    }
    if (keyPressed == 70) { //f key
        if (allFrozen) {
            unFreezeAll();
            allFrozen = false;
        } else {
            freezeAll();
            allFrozen = true;
        }
    };
    if (keyPressed == 82) { //r key (reset the game)
        reset();
    }
}

function keyUpHandler(e) {

}

function reset() {
    balls.length = 0;
    moves = 0;
    home = true;
    gameOver = false;
}

function mouseDown() {
    if (home) {
        if (mousePos.x > 100 && mousePos.x < 300 && mousePos.y < 330 && mousePos.y > 250) { //
            //mouse is over the PLAY NOW button
            home = false;
            moves = 0;
            delayLaunch = true;
            initObstacles();
            draw();
        }
    } else {
        mousePressed = true;
        delayLaunch = false;
    }
}

function launchBall(x, y) {
    var mPos = new Vector(x, y);
    mPos = mPos.subtract(origin);
    var newVel = mPos.multiply(1 / launchScaler);
    balls.push(new Ball(origin.x, origin.y, newVel.x, newVel.y, ballMass, ballRadius, true, 'white'));
    moves++;
}

function mouseUp() { //when the mouse gets released launch a ball
    mousePressed = false;
    if (allStill() && !delayLaunch /* && mousePos.isOnScreen() */ && !home) {
        launchBall(mousePos2.x, mousePos2.y);
    }
}

function drawMouseVector() {
    mousePos2 = mousePos;
    ctx.beginPath();
    ctx.moveTo(origin.x, origin.y);
    ctx.lineTo(mousePos2.x, mousePos2.y);
    ctx.strokeStyle = 'white';
    ctx.lineWidth = 5;
    ctx.stroke();
    ctx.closePath();
}

function itterateBalls() {
    for (var b of balls) {
        if (!b.frozen) {
            b.updateAcceleration(b.calculateForce());
            b.updateVelocity();
            b.updatePosition();
        }
        b.draw();
        if (showVectors) {
            b.showVectors();
        }
    }
    collideAll();
}

function collideAll() {
    for (var b of balls) {
        b.checkCollisions();
    }
    for (var b of balls) {
        b.resetCollision();
    }
}

function allStill() {
    var still = true;
    for (var b of balls) {
        if (b.vel.getMag() > minVel) {
            return false;
        }
    }
    return still;
}

function mouseHandler(e) {
    mousePos.x = e.clientX - canvas.offsetLeft;
    mousePos.y = e.clientY - canvas.offsetTop;
}
