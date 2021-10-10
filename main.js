//canvas
var ctx = $("#canvas")[0].getContext("2d");
ctx.canvas.width  = 800;
ctx.canvas.height = 600;

//bgn color
ctx.backgroundColor = 'red';

//color
var r = 0,
    g = 255,
    color = "rgb("+r+","+g+",0)";

//flags for colors
var isRedDown = false;
var isGreenDown = true;

//movement
var speed = 3,
    rad = 20,
    moveY = speed;

//clock
var intervaltime = 10,
    clock = 255/1000 * intervaltime;
    

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
    //change gradient dir
    if (r <= 0 || r >= 255) isRedDown = !isRedDown;
    if (g <= 0 || g >= 255) isGreenDown = !isGreenDown;
    
    //change color smooth (gradient)
    if (isRedDown) r+=clock;
    else r-=clock;
    
    if (isGreenDown) g+=clock;
    else g-=clock;
    
    color = "rgb("+r+","+g+",0)";
    //console.log(color);
}

setInterval(changeColor, 10);
setInterval(drawMe, 10);

//todo fixupdate