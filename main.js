//canvas
var ctx = $("#canvas")[0].getContext("2d");
ctx.canvas.width  = 800;
ctx.canvas.height = 600;

//bgn color
ctx.backgroundColor = 'red';

var color = 'green';
var speed = 3,
    corner = 50,
    rad = 20,
    moveY = speed;

var ball = { x: 400, y: 400 };

function drawMe() {
    //clear area
    ctx.clearRect(0, 0, 800, 600);
    
    //change dir move
    if (ball.y < 200 || ball.y > 600 - rad) moveY = -moveY;

    //ball.x += moveX;
    ball.y += moveY;
    
    //draw on canvas
    ctx.beginPath();
    ctx.fillStyle = color;
    ctx.arc(ball.x, ball.y, rad, 0, Math.PI * 2, false);
    ctx.fill();
    ctx.closePath();

}

function changeColor() {
    if (color == "green") color = "red";
    else color = "green";
    drawMe(color);
}

setInterval(changeColor, 1000);
setInterval(drawMe, 10);