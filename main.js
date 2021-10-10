//canvas
var ctx = $("#canvas")[0].getContext("2d");
ctx.canvas.width  = 800;
ctx.canvas.height = 600;

//bgn color
ctx.backgroundColor = 'red';

//color
var r = 0,
    r1 = 0,
    g = 255,
    g1 = 255,
    color = "rgb("+r+","+g+",0)",
    color1 = "rgb("+r+","+g+",0)";

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
    

//todo array
var ball1 = { x: 200, y: 400 };
var ball2 = { x: 400, y: 400 };
var ball3 = { x: 600, y: 400 };

function drawMe() {
    //clear area
    ctx.clearRect(0, 0, 800, 600);
    
    //change dir move
    if (ball3.y < 200 || ball3.y > 600 - rad) moveY = -moveY

    //ball.x += moveX;
    ball3.y += moveY;
    
    //draw on canvas
    ctx.beginPath();
    ctx.fillStyle = color1;
    ctx.arc(ball1.x, ball1.y, rad, 0, Math.PI * 2, false); 
    ctx.fill();
    ctx.closePath();
    
    ctx.fillStyle = color;
    ctx.arc(ball2.x, ball2.y, rad, 0, Math.PI * 2, false);
    ctx.fill();
    ctx.closePath();
    
    ctx.fillStyle = color;
    ctx.arc(ball3.x, ball3.y, rad, 0, Math.PI * 2, false);
    ctx.fill();
    ctx.closePath();
    
    
    ctx.beginPath();
    ctx.fillStyle = color1;
    ctx.arc(ball1.x, ball1.y, rad, 0, Math.PI * 2, false); 
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
    console.log(color1);
}

function changeColor1() {
    //change color
    if (r1 == 255) r1 = 0;
    else r1 = 255;
    
    if (g1 == 255) g1 = 0;
    else g1 = 255;
    
    
    
    color1 = "rgb("+r1+","+g1+",0)";
    //console.log(color);
}

setInterval(changeColor, 10);
setInterval(changeColor1, 1000);
setInterval(drawMe, 10);

//todo fixupdate