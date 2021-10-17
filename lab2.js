$( window ).on( "load", function() {
    //canvas
    var ctx2 = $("#canvas")[0].getContext("2d");
    ctx2.canvas.width  = 800;
    ctx2.canvas.height = 600;
    
    var Config = {
        moveLeft = 1,
        moveRight = 2,
        shoot = 3
    }
    
    //event listener
    document.addEventListener('keydown', function(event) {
        if(e.keyCode==Config.moveLeft){
        // move left
        }
        if(e.keyCode==Config.moveRight){
        // move right
        }
        if(e.keyCode==Config.shoot){
        // Enter pressed... do anything here...
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
    }

    //enemy
    class Enemy {
        constructor (posX, posY, radius) {
            this.posX = posX;
            this.posY = posY;
            this.radius = radius;
        }
    }

    class Bullet {
        constructor (posX, posY, radius) {
            this.posX = posX;
            this.posY = posY;
            this.radius = radius;
        }
    }

    function draw(){
        ctx2.clearRect(0, 0, 800, 600);
    }

    const player = new Player (390, 550, 20, 40);



    setInterval(draw(), 10);
    setInterval(player.draw(), 10);
}