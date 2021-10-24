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
        
        bestScore: 1,
        score: 0,
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
    
    //hud
    class HUD {
        constructor () {
            
        }
        
        draw() {
            /*ctx2.font = "24px Arial";
            ctx2.fillStyle = "black";
            ctx2.fillText("Level: "+Config.level, 10, 25);
            ctx2.fillText("Score: "+Config.score, 10, 50);*/
        }
    }
    
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
            if (dirMove == "left"){
                if(this.posX>=0+20) this.posX -= 10;
            
            } else if (dirMove == "right") {
                if(this.posX<=ctx2.canvas.width-20-this.sizeX) this.posX += 10;
            }
        }
    }

    //track
    class Track {
        constructor (posX, posY, radius) {
            this.id = Math.random();
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
            if (distanceBetween <= sumOfRadius){
                gameManager.scoreUp(1);
                enemiesManager.destroyEnemy(this);
                return true;
            }
            else return false;
        }
    }

    //track manager
    class TrackManager {
        enemiesList = new Array;
        
        constructor (rows,columns) {
            this.createEnemies(rows,columns);
        }

        createEnemies(rows,columns){
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
            var isDetected = false;
            this.enemiesList.forEach(function(e){
                if(e.checkCollisionCircle(bulletPosX, bulletPosY, bulletRadius)){
                    
                    isDetected = true;
                    return isDetected;
                }
            }); 
            return isDetected;
        }

        //remove obj form array enemiesList and add score/level
        destroyEnemy(enemy){
            //console.log(enemy.id);
            var index = this.enemiesList.findIndex((e => e === enemy));
            this.enemiesList.splice(index,1);
            /*delete bullet.speed;
            delete bullet.posX;
            delete bullet.posY;
            delete bullet.radius;
            console.log(bullet);*/
            if (this.enemiesList.length == 0) {
                gameManager.levelComplete();
            }
        }
        
    }
               
    class GameManager{
        
        constructor () {
            
        }
        
        levelComplete(){
            bulletsManager.destroyAllBullet();
            this.levelUp();
            this.scoreUp(10);
            
            if (Config.level % 2 == 1) {
                if(Config.enemyRow < Config.enemyRowMax) Config.enemyRow += 1;
            }
            else if (Config.level % 2 == 0) {
                if(Config.enemyColumn < Config.enemyColumnMax) Config.enemyColumn += 1;
            }
                
            
            enemiesManager.createEnemies(Config.enemyColumn, Config.enemyRow);
        }
        
        scoreUp(score) {
            Config.score += score;
        }
        
        levelUp() {
            Config.level++;
        }
    }
    
    function draw(){
        ctx2.clearRect(0, 0, 800, 600);
        
        player.draw();
        enemiesManager.draw();
        bulletsManager.draw();
        hud.draw();
    }

    function physicUpdate(){
        /*player.draw();
        enemy.draw();*/
        bulletsManager.physicUpdate();
    }
    //instance single object class player bulletsManager enemiesManager hud
    const player = new Player (390, 550, 20, 40);
    const bulletsManager = new BulletsManager ();
    const enemiesManager = new EnemiesManager (Config.enemyColumn, Config.enemyRow);
    const hud = new HUD ();
    const gameManager = new GameManager ();

    setInterval(physicUpdate, Config.frameUpdate); // update physics
    setInterval(draw, Config.physicUpdate); //draw frame
});