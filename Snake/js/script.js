var numGrid = 18;
var cellWidth = 800 / numGrid;
var snakeLength = 1;
var xVel = 0;
var yVel = 0;
var keyPressed;
var headX = 0;
var headY = 0;
var snake = new Array();
snake[0] = {
    headX,
    headY
};
var obX = Math.floor(Math.random() * numGrid);
var obY = Math.floor(Math.random() * numGrid);
var speed = 100;

function init() {
    canvas = document.querySelectorAll("#myCanvas")[0];
    ctx = canvas.getContext("2d");
    document.addEventListener("keydown", keyDownHandler, false);
    setInterval(main, speed);
}

function main() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    updateSnake();
    checkCollision();
    drawOb();
    showScore();
    if (gameOver()) {
        restart();
    }
}

function restart() {
    snakeLength = 1;
    xVel = 0;
    yVel = 0;
    snake = [];
    headX = 0;
    headY = 0;
    snake[0] = {
        headX,
        headY
    };
}

function gameOver() {
    if (checkOverLap() || checkOutOfBounds()) {
        return true;
    } else {
        return false;
    }
}

function checkOutOfBounds() {
    if (headX > numGrid || headX < 0 || headY > numGrid || headY < 0) {
        return true;
    } else {
        return false;
    }
}

function checkOverLap() {
    if (snakeLength > 1) {
        for (var i = 1; i < snakeLength; i++) {
            if (snake[i][0] == headX && snake[i][1] == headY) {
                return true;
            }
        }
        return false;
    }
}

function checkCollision() {
    if (headX == obX && headY == obY) {
        addToSnake();
        obX = Math.floor(Math.random() * numGrid);
        obY = Math.floor(Math.random() * numGrid);
    }
}

function addToSnake() {
    snakeLength++;
    speed += 20;
    snake.push({
        headX,
        headY
    });
}

function shift() {
    for (var i = snakeLength - 1; i > 0; i--) {
        snake[i] = snake[i - 1];
    }
    headX = headX + xVel;
    headY = headY + yVel;
    snake[0] = [headX, headY];
}

function showScore() {
    ctx.font = "50px Arial";
    ctx.fillStyle = "white";
    ctx.fillText(snakeLength - 1, 700, 720);
}

function updateSnake() {
    shift();
    for (var i = 0; i < snakeLength; i++) {
        drawBox(snake[i][0], snake[i][1], "green");
    }
}

function drawBox(x, y, color) {
    x *= cellWidth;
    y *= cellWidth;
    ctx.beginPath();
    ctx.lineWidth = "6";
    ctx.strokeStyle = color;
    ctx.fillStyle = color;
    ctx.rect(x, y, cellWidth, cellWidth);
    ctx.fill();
    ctx.stroke();
}

function drawOb() {
    drawBox(obX, obY, "red");
}

function keyDownHandler(e) {
    keyPressed = e.keyCode;
    if (keyPressed == 38) { //upArrow
        yVel = -1;
        xVel = 0;
    }
    if (keyPressed == 40) { //downArrow
        yVel = 1;
        xVel = 0;
    }
    if (keyPressed == 37) { //leftArrow
        yVel = 0;
        xVel = -1;
    }
    if (keyPressed == 39) { //rightArrow
        yVel = 0;
        xVel = 1;
    }
}
