$( window ).on( "load", function() {
    //canvas
    var ctx2 = $("#canvas")[0].getContext("2d");
    ctx2.canvas.width  = 800;
    ctx2.canvas.height = 600;
    
    var Config = {
        moveLeft: 65,
        moveRight: 68,
        moveLeftAlt: 37,
        moveRightAlt: 39,
        shoot: 32,
        
        enemySize: 10,
    }
    
    //event listener
    document.addEventListener('keydown', function(e) {
        if(e.keyCode==Config.moveLeft || e.keyCode==Config.moveLeftAlt ){
            player.move("left");
        }
        if(e.keyCode==Config.moveRight  || e.keyCode==Config.moveRightAlt){
            player.move("right");
        }
        if(e.keyCode==Config.shoot){
            console.log('pew pew');
        }
        
    }, false);

    //player
    class Player {
        constructor (posX, posY, sizeX, sizeY) {
            this.posX = posX;
            this.posY = posY;
            this.sizeX = sizeX;
            this.sizeY = sizeY;
        }

        draw() {
            ctx2.beginPath();
            ctx2.fillStyle = "black";
            ctx2.rect(this.posX, this.posY, this.sizeX,this.sizeY); 
            ctx2.fill();
            ctx2.closePath();
        }
        
        move(dirMove){
            //prevent pleyer move too close to wall by padding 10px and his own width (sizeX)
            if (dirMove == "left"){
                if(this.posX>=0+20) this.posX -= 10;
            
            } else if (dirMove == "right") {
                if(this.posX<=ctx2.canvas.width-20-this.sizeX) this.posX += 10;
            }
        }
        
        
    }

    //enemy
    class Enemy {
        constructor (posX, posY, radius) {
            this.posX = posX;
            this.posY = posY;
            this.radius = radius;
        }
        
        draw() {
            ctx2.beginPath();
            ctx2.fillStyle = "red";
            ctx2.arc(this.posX, this.posY, this.radius, 0, Math.PI * 2, false);
            ctx2.fill();
            ctx2.closePath();
        }
    }

    //bullet
    class Bullet {
        constructor (posX, posY, radius) {
            this.posX = posX;
            this.posY = posY;
            this.radius = radius;
        }
        
        draw() {
            ctx2.beginPath();
            ctx2.fillStyle = "silver";
            ctx2.arc(this.posX, this.posY, this.radius, 0, Math.PI * 2, false);
            ctx2.fill();
            ctx2.closePath();
        }
    }

    function draw(){
        ctx2.clearRect(0, 0, 800, 600);
        
        player.draw();
        enemy.draw();
        //bullet.draw();
    }
    //instance player
    const player = new Player (390, 550, 20, 40);
    //instance enemy
    const enemy = new Enemy (400, 30, Config.enemySize);

    setInterval(draw, 10);
});