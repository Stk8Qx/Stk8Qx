$( window ).on( "load", function() {
    //canvas
    var ctx2 = $("#canvas")[0].getContext("2d");
    ctx2.canvas.width  = 800;
    ctx2.canvas.height = 600;
    
    var Config = {
        frameUpdate: 10,
        physicUpdate: 10,
        
        size: 200,
        speed: 2,
        
        moveLeft: 65,
        moveRight: 68,
        moveLeftAlt: 37,
        moveRightAlt: 39,
        
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
        
    }, false);
    
    document.addEventListener('keyup', function(e) {
        if(e.keyCode==Config.moveLeft || e.keyCode==Config.moveLeftAlt ){
            player.move("up");
        }
        if(e.keyCode==Config.moveRight  || e.keyCode==Config.moveRightAlt){
            player.move("up");
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
        car = new Image();
        carL = new Image();
        carR = new Image();
        isSteeringLeft = false;
        isSteeringRight = false;
    
        constructor (posX, posY, sizeX, sizeY) {
            this.car.src = "img\\car.png";
            this.carL.src = "img\\carL.png";
            this.carR.src = "img\\carR.png";
            this.posX = posX;
            this.posY = posY;
        }

        draw() {
            if(this.isSteeringLeft) ctx2.drawImage(this.carL,this.posX,this.posY,200,170);
            else if(this.isSteeringRight) ctx2.drawImage(this.carR,this.posX,this.posY,200,170);
            else ctx2.drawImage(this.car,this.posX,this.posY,200,170);
            
            
        
            /*ctx2.beginPath();
            ctx2.fillStyle = "black";
            ctx2.rect(this.posX, this.posY, this.sizeX,this.sizeY); 
            ctx2.fill();
            ctx2.closePath();*/
        }
        
        move(dirMove){
            console.log(dirMove);
            if (dirMove == "left"){
                if(this.posX>=0+20) this.posX -= 10;
                this.isSteeringLeft = true;
            
            } else if (dirMove == "right") {
                if(this.posX<=ctx2.canvas.width-20) this.posX += 10;
                this.isSteeringRight = true;
                
            } else if (dirMove == "up") {
                this.isSteeringLeft = false;
                this.isSteeringRight = false;
            }
        }
    
        moveUpdate(){
            
        }
    }

    //track
    class Track {
        track = new Image();
    
        constructor (posX, posY, type) {
            this.track.src = "img\\" + type + ".png";
            this.id = Math.random();
            this.posX = posX;
            this.posY = posY;
        }
        
        draw() {
            ctx2.drawImage(this.track,this.posX,this.posY,Config.size,Config.size);
            /*ctx2.beginPath();
            ctx2.fillStyle = "red";
            ctx2.arc(this.posX, this.posY, this.radius, 0, Math.PI * 2, false);
            ctx2.fill();
            ctx2.closePath();*/
        }
        
        move(){
            this.posY+=Config.speed;
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
        trackList = new Array;
        
        constructor () {
            this.createTrack((ctx2.canvas.width/2-Config.size/2),Config.size*2,"road");
            this.createTrack((ctx2.canvas.width/2-Config.size/2),Config.size*1,"road");
            this.createTrack((ctx2.canvas.width/2-Config.size/2),Config.size*0,"road");
        }

        createTrack(x,y,typeRoad){
            let type = typeRoad;
            if (!type) {
                let r = Math.random();
                if (r < 0.2) type = "roadL";
                else if (r > 0.8) type = "roadR";
                else type = "road";
            }
            this.newTrack(x,y,type);
        }
        
        newTrack(posX, posY, type) {this.trackList.push(new Track(posX, posY, type))};
        
        draw() {
            this.trackList.forEach(e =>
                e.draw()                   
            ); 
        }
    
        physicUpdate(){
            this.trackList.forEach(e =>
                e.move()                   
            );
            this.checkNextTrackCondition();
        }
        
        checkNextTrackCondition(){
            console.log(this.trackList[this.trackList.length-1].posY);
            if(this.trackList[this.trackList.length-1].posY > 0) {
                this.createTrack((ctx2.canvas.width/2-Config.size/2),-Config.size+3);
            }
        }

        checkCollisionCircle(bulletPosX, bulletPosY, bulletRadius) {
            /*var isDetected = false;
            this.trackList.forEach(function(e){
                if(e.checkCollisionCircle(bulletPosX, bulletPosY, bulletRadius)){
                    
                    isDetected = true;
                    return isDetected;
                }
            }); 
            return isDetected;*/
        }

        //remove obj form array enemiesList and add score/level
        destroyTrack(track){
            //console.log(enemy.id);
            var index = this.trackList.findIndex((e => e === track));
            this.trackList.splice(index,1);
            /*delete bullet.speed;
            delete bullet.posX;
            delete bullet.posY;
            delete bullet.radius;
            console.log(bullet);*/
            if (this.trackList.length == 0) {
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
        
        trackManager.draw();
        player.draw();
        hud.draw();
    }

    function physicUpdate(){
        player.moveUpdate();
        trackManager.physicUpdate();
        /*player.draw();
        enemy.draw();*/
        //bulletsManager.physicUpdate();
    }
    //instance single object class player bulletsManager enemiesManager hud
    const player = new Player (355, 370);
    const trackManager = new TrackManager ();
    const hud = new HUD ();
    const gameManager = new GameManager ();

    setInterval(physicUpdate, Config.frameUpdate); // update physics
    setInterval(draw, Config.physicUpdate); //draw frame
});