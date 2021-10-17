$( window ).on( "load", function() {
    //canvas
    var ctx2 = $("#canvas")[0].getContext("2d");
    ctx2.canvas.width  = 800;
    ctx2.canvas.height = 600;
    
    var Config = {
        frameUpdate: 10,
        physicUpdate: 10,
        
        moveLeft: 65,
        moveRight: 68,
        moveLeftAlt: 37,
        moveRightAlt: 39,
        shoot: 32,
        
        enemySize: 20,
        bulletSize: 4,
        bulletSpeed: 0.7,
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
            player.shoot();
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
        
        shoot(){
            //TODO: add limit shoots per sec
            bulletsManager.newBullet(this.posX + this.sizeX/2,this.posY,Config.bulletSize,Config.bulletSpeed);
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
        
        checkCollisionCircle(bulletPosX, bulletPosY, bulletRadius) {
            var distanceBetween = Math.sqrt(Math.pow((this.posX - bulletPosX),2) + Math.pow((this.posY - bulletPosY),2))
            var sumOfRadius = this.radius + bulletRadius;
            if (distanceBetween >= sumOfRadius){
                //collision detected
                //TODO destroy this obj
                return true;
            }
            else return false;
        }
    }

    //bullet
    class Bullet {
        constructor (posX, posY, radius, speed) {
            this.posX = posX;
            this.posY = posY;
            this.radius = radius;
            this.speed = speed;
        }
        
        draw() {
            ctx2.beginPath();
            ctx2.fillStyle = "white";
            ctx2.arc(this.posX, this.posY, this.radius, 0, Math.PI * 2, false);
            ctx2.fill();
            ctx2.closePath();
        }
        
        physicUpdate() {
            this.move();
            this.collisionDetectionCircle();
        }
        
        move() {
            var fixedSpeed = (this.speed/Config.physicUpdate) * (1000/Config.physicUpdate);
            this.posY -= fixedSpeed;
        }
        
        collisionDetectionCircle(){
            var isDetected = enemiesManager.checkCollisionCircle(this.posX, this.posY, this.radius);
            if (isDetected) bulletsManager.destroyBullet(this);
        }
    }
    
    //bullets manager
    class BulletsManager {
        bulletsList = new Array;
        
        constructor () {
        }
        
        newBullet(posX, posY, radius, speed) {this.bulletsList.push(new Bullet(posX, posY, radius, speed))};
        bulletsLists() {console.log(this.bulletsList)}; // TODO remove, only for debug
        
        draw() {
            this.bulletsList.forEach(e =>
                e.draw()                    
            ); 
        }
    
        physicUpdate(){
            this.bulletsList.forEach(e =>
                e.physicUpdate()                    
            ); 
        }
    
        destroyBullet(bullet){
            //TODO remove form bulletsList
            //delete bullet;
        }
    }

    //enemies manager
    class EnemiesManager {
        enemiesList = new Array;
        
        constructor (rows,columns) {
            for(var i=0;i<columns;i++){
                for(var j=0;j<rows;j++){
                    //TODO make postion for new enemies more flexible (fit) to screen
                    this.newEnemy(110+i*(Config.enemySize+85),
                                  100+j*(Config.enemySize+55),
                                  Config.enemySize);
                }
            }
                
        }
        
        newEnemy(posX, posY, radius) {this.enemiesList.push(new Enemy(posX, posY, radius))};
        enemiesLists() {console.log(this.enemiesList)}; // TODO remove, only for debug
        
        draw() {
            this.enemiesList.forEach(e =>
                e.draw()                   
            ); 
        }
    
        physicUpdate(){
        }
        
        checkCollisionCircle(bulletPosX, bulletPosY, bulletRadius) {
            this.enemiesList.forEach(e =>
                e.checkCollisionCircle(bulletPosX, bulletPosY, bulletRadius)                
            ); 
        }
        
    }
               
    function draw(){
        ctx2.clearRect(0, 0, 800, 600);
        
        player.draw();
        enemiesManager.draw();
        bulletsManager.draw();
    }

    function physicUpdate(){
        /*player.draw();
        enemy.draw();*/
        bulletsManager.physicUpdate();
    }
    //instance player
    const player = new Player (390, 550, 20, 40);
    //instance enemy
    //const enemy = new Enemy (400, 30, Config.enemySize);
    //instance bulletsManager
    const bulletsManager = new BulletsManager ();
    //instance enemiesManager
    const enemiesManager = new EnemiesManager (4, 6);

    setInterval(physicUpdate, Config.frameUpdate); // update physics
    setInterval(draw, Config.physicUpdate); //draw frame
});