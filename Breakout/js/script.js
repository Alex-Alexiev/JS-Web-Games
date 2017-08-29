    /*
    ctx.beginPath(); //start drawing
    ctx.rect(20,40,50,50); //rect(x,y,w,h);
    ctx.fillStyle = "FFFFF"; //fill color
    ctx.fill(); 
    ctx.closePath; //end drawing
    
    ctx.beginPath();
    ctx.rect(160, 10, 100, 40);
    ctx.strokeStyle = "rgba(0, 0, 255, 0.5)"; //edge colour
    ctx.stroke(); //color edge
    ctx.closePath();

    ctx.beginPath();
    ctx.arc(240, 160, 20, 0, Math.PI*2, false); //arc(x,y,(center), radius, start drawing, end drawing (in radians), direction (false = clockWise, true = counterClockWise))
    ctx.fillStyle = "green";
    ctx.fill();
    ctx.closePath();
    */

var ctx;
var canvas;
var paddleX = 0;
var paddleXPrev;

//coordinates of the ball
var x; 
var y;

var dx = 1;
var dy = -6;

var ballRadius = 10;

var paddleHeight = 15;
var paddleWidth = 200;

var rightPressed = false;
var leftPressed = false;

var brickRowCount = 5;
var brickColumnCount = 10;
var brickWidth;
var brickHeight = 20;
var brickPadding = 10;
var brickOffsetTop = 100;
var brickOffsetLeft = 30;

var bricks = [];

var paddleVelocity = 0;

var mouseX;

var ping = new Audio('ping.mp3');
var music = new Audio('song.mp3');

var score = 0;
var bricksDestroyed = 0;

for (c = 0; c < brickColumnCount; c++){
    bricks[c] = [];
    for (r = 0; r < brickRowCount; r++){
        bricks[c][r] = {x: 0, y: 0, status: 1};
    }
}

function init(){
    canvas = document.querySelectorAll("#myCanvas")[0]; //canvas variable - you can draw on teh canvas
    ctx = canvas.getContext("2d"); //gets an object that provides methods to draw and manipulate the canvas
    x = canvas.width/2; //initial ball positions
    y = canvas.height-30; //initial ball positions
    paddleX = mouseX; //start paddle in center
    /*
    document.addEventListener("keydown", keyDownHandler, false); //key listener for press
    document.addEventListener("keyup", keyUpHandler, false); //key listener for release
    */
    document.addEventListener('mousemove', tellPos, false);
    brickWidth = (canvas.width - brickOffsetLeft*2 - brickPadding*brickColumnCount)/brickColumnCount;
    setInterval(draw, 10); //call the function draw every 10 milliseconds
}

function draw(){
    paddleXPrev = paddleX;
    ctx.clearRect(0, 0, canvas.width, canvas.height); //clear the entire canvas
    drawBall();
    drawPaddle();
    drawBricks();
    collisionDetection();
    drawScore();
    if (x + dx + ballRadius > canvas.width || x + dx - ballRadius < 0){ //reverse dx if hits left right wall
        dx = -dx;
    }
    if (y + dy < ballRadius){ //reverse dy if bounce off ceiling
        dy = -dy;
    }
        if (y + dy > canvas.height - ballRadius){
            if (x > paddleX && x < paddleX+paddleWidth){ //if hits the paddle
                dy = -dy;
                dx += paddleVelocity/10;
            }
            else { //if touches ground
                document.location.reload(); //reload the page
            }
        }
    x += dx;
    y += dy;
    paddleX = mouseX;
    //paddleX = x - paddleWidth/2;
    paddleVelocity = paddleX-paddleXPrev;
    music.play();
}
    
function gameOver(){
    document.location.reload(); //reload the page
}

function drawBall(){   
    ctx.beginPath();
    ctx.arc(x, y, ballRadius, 0, Math.PI*2);
    ctx.fillStyle = "white";
    ctx.fill();
    ctx.closePath();
}

function drawPaddle(){
    ctx.beginPath();
    ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
    ctx.fillStyle = "white";
    ctx.fill();
    ctx.closePath();
}

function drawBricks(){
    for (c= 0; c < brickColumnCount; c++){
        for(r = 0; r < brickRowCount; r++){
            if (bricks[c][r].status == 1){
                var brickX = (c*(brickWidth+brickPadding))+brickOffsetLeft;
                var brickY = (r*(brickHeight+brickPadding))+brickOffsetTop;
                bricks[c][r].x = brickX;
                bricks[c][r].y = brickY;
                ctx.beginPath();
                ctx.rect(brickX, brickY, brickWidth, brickHeight);
                ctx.fillStyle = "#white";
                ctx.fill();
                ctx.closePath();
            }
        }
    }
}

function collisionDetection(){
    for (c = 0; c < brickColumnCount; c++){
        for (r = 0; r < brickRowCount; r++){
            var b = bricks[c][r];
            if (b.status == 1){
                if (x > b.x && x < b.x+brickWidth && y > b.y && y < b.y + brickHeight){
                    b.status = 0;
                    dy = -dy;
                    ping.play();
                    score++;
                    bricksDestroyed++;
                    if (bricksDestroyed == brickRowCount*brickColumnCount){ //beat the level
                        
                    }
                }
            }
        }
    }
}

function drawScore(){
    ctx.font = "24px Arial";
    ctx.fillStyle = "white";
    ctx.fill();
    ctx.fillText("Score: "+score, 100, 100);
}
/*
function keyDownHandler(e) { //called when a key is pressed
    if(e.keyCode == 39) { 
        rightPressed = true;
        paddleVelocity = 5;
    }
    else if(e.keyCode == 37) {
        leftPressed = true;
        paddleVelocity = -5;
    }
}

function keyUpHandler(e) { //called when a key is released
    if(e.keyCode == 39) {
        rightPressed = false;
    }
    else if(e.keyCode == 37) {
        leftPressed = false;
    }
    paddleVelocity = 0;
}
*/

function tellPos(e){
    mouseX = e.clientX - canvas.offsetLeft - paddleWidth/2;
}
