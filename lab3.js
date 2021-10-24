$( window ).on( "load", function() {
    //canvas
    var ctx2 = $("#canvas")[0].getContext("2d");
    ctx2.canvas.width  = 800;
    ctx2.canvas.height = 600;
    
    var Config = {
        frameUpdate: 10,
        physicUpdate: 10,
        
        size: 100,
        speed: 2,
        
        moveLeft: 65,
        moveRight: 68,
        moveLeftAlt: 37,
        moveRightAlt: 39,
        
        bestScore: 0,
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
            ctx2.font = "24px Arial";
            ctx2.fillStyle = "white";   
            ctx2.fillText(" Score:   "+Config.score, 10, 25);
            //ctx2.fillText("Best Score:   "+Config.bestScore, 10, 50);
        }
    }
    
    //player
    class Player {
        car = new Image();
        carL = new Image();
        carR = new Image();
    
        isSteeringLeft = false;
        isSteeringRight = false;
    
        acceleration = 0;
    
        constructor (posX, posY, sizeX, sizeY) {
            this.car.src = "img\\car.png";
            this.carL.src = "img\\carL.png";
            this.carR.src = "img\\carR.png";
            this.posX = posX;
            this.posY = posY;
        }

        draw() {
            let carSize = Config.size/2;
            let carSizeLR = carSize*1.41;
            //left
            if(this.isSteeringLeft) ctx2.drawImage(this.carL,this.posX-10,this.posY-10,carSizeLR,carSizeLR);
            //right
            else if(this.isSteeringRight) ctx2.drawImage(this.carR,this.posX-20,this.posY-10,carSizeLR,carSizeLR);
            //forward
            else ctx2.drawImage(this.car,this.posX,this.posY,carSize,carSize);
            
            
        
            /*ctx2.beginPath();
            ctx2.fillStyle = "black";
            ctx2.rect(this.posX, this.posY, this.sizeX,this.sizeY); 
            ctx2.fill();
            ctx2.closePath();*/
        }
        
        move(dirMove){
            if (dirMove == "left"){
                this.isSteeringLeft = true;
            
            } else if (dirMove == "right") {
                this.isSteeringRight = true;
                
            } else if (dirMove == "up") {
                this.isSteeringLeft = false;
                this.isSteeringRight = false;
            }
            
        }
    
        moveUpdate(){
            if (this.isSteeringRight) this.acceleration += 1;
            if (this.isSteeringLeft) this.acceleration -= 1;
            
            let max = 1;
            if(this.acceleration>max) this.acceleration = max;
            if(this.acceleration<-max) this.acceleration = -max;
            
            let c =0.3;
            this.posX += this.acceleration;
            if(this.acceleration>c) this.acceleration -= c;
            else if(this.acceleration<-c) this.acceleration += c;
            else this.acceleration = 0;
            /*if(this.posX>=0+20) this.posX = acceleration;
            if(this.posX<=ctx2.canvas.width-20) this.posX += 10;*/
        }
    }

    //track
    class Track {
        track = new Image();
        type;
        lastX;

        constructor (posX, posY, type, lastX) {
            this.lastX = lastX;
            this.type = type;
            
            this.track.src = "img\\" + type + ".png";
            this.id = Math.random();
            this.posX = posX;
            this.posY = posY;
        }
        
        draw() {
                //left
            if (this.type == "roadL") ctx2.drawImage(this.track,this.posX+((this.lastX-1)*(Config.size)),this.posY,Config.size*2+20,Config.size);
                //right
            else if (this.type == "roadR") ctx2.drawImage(this.track,this.posX+(this.lastX*(Config.size)),this.posY,Config.size*2+20,Config.size);
                //forward
            else ctx2.drawImage(this.track,this.posX+(this.lastX*(Config.size)),this.posY,Config.size,Config.size);
            /*ctx2.beginPath();
            ctx2.fillStyle = "red";
            ctx2.arc(this.posX, this.posY, this.radius, 0, Math.PI * 2, false);
            ctx2.fill();
            ctx2.closePath();*/
        }
        
        move(){
            this.posY+=Config.speed;
        }
        
        checkCollision() {
            
            if (player.posX < this.posX+(this.lastX)*(Config.size) || (player.posX+20) > (this.posX+(this.lastX)*(Config.size)+100)){
                return true;
            }
            
            else return false;
        }
    }

    class BasedTrackPoint {
        constructor (posX, posY, index) {
            this.index = index;
            
            this.posX = posX;
            this.posY = posY;
        }
    }

    class MeshPoint{
        constructor (posX, posY, index) {
            this.index = index;
            
            this.posX = posX;
            this.posY = posY;
        }
    }

    class MeshTriangle{
        constructor (a, b, c) {
            this.a = a;
            this.b = b;
            this.c = c;
        }
    }
    
    class Mesh {
        triangleList = new Array;

        constructor () {
            
        }

        newTriangle(a,b,c){this.triangleList.push(new MeshTriangle(a,b,c));}
    }

    //track manager
    class TrackManager extends Mesh{
        basedTrackPointList = new Array;
        
        constructor () {
            this.buildNewStart();
        }

        buildNewStart(){
            for(let i = 600/Config.size; i >= 0; i--){
                this.createTrack((ctx2.canvas.width/2-Config.size/2),Config.size*i,0,"road");
            }
        }

        createTrack(x,y, lastX, typeRoad){
            let type = typeRoad;
            
            if (!type) {
                let r = Math.random();
                //prevent from track appear too much left or right
                if(lastX > ((600/Config.size))-4) r-=0.2;
                if(lastX < -((600/Config.size))+4)r+=0.2;
                    
                if (r < 0.2) type = "roadL";
                else if (r > 0.8) type = "roadR";
                else type = "road";
            }
            
            if(!lastX) lastX=0;
            this.newTrack(x,y,type,lastX);
        }
        
        newBasedTrackPoint(posX, posY) {this.basedTrackPointList.push(new Track(posX, posY))};
        
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
            if(this.trackList[this.trackList.length-1].posY > 0) {
                let lastX = this.trackList[this.trackList.length-1].lastX;
                if (this.trackList[this.trackList.length-1].type == "roadL")  lastX--;
                if (this.trackList[this.trackList.length-1].type == "roadR") lastX++;
                this.createTrack((ctx2.canvas.width/2-Config.size/2),-Config.size+3, lastX);
            }
        }

        checkCollision() {
            var isDetected = false;
            this.trackList.forEach(function(e){
                if (e.posY > 270 && e.posY < 470){ //player y = 370
                    if(e.checkCollision()){
                        isDetected = true;
                        return isDetected;
                    }
                }
            }); 
            return isDetected
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
        destroyTrack(){
            //console.log(enemy.id);
            //var index = this.trackList.findIndex((e => e === track));
            this.trackList.splice(0);
            /*delete bullet.speed;
            delete bullet.posX;
            delete bullet.posY;
            delete bullet.radius;
            console.log(bullet);*/
            /*if (this.trackList.length == 0) {
                gameManager.levelComplete();
            }*/
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
        
        scoreUp() {
            Config.score += 10;
        }
        
        levelUp() {
            Config.level++;
        }
        
        gameoverstatment(){
            if(trackManager.checkCollision()){
                player.posX = 355;
                trackManager.destroyTrack();
                trackManager.buildNewStart();
                Config.score = 0;
            }
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
        gameManager.gameoverstatment();
    }
    //instance single object class player bulletsManager enemiesManager hud
    const player = new Player (355, 370);
    const trackManager = new TrackManager ();
    const hud = new HUD ();
    const gameManager = new GameManager ();

    setInterval(physicUpdate, Config.frameUpdate); // update physics
    setInterval(draw, Config.physicUpdate); //draw frame
    setInterval(gameManager.scoreUp, 1000); //draw frame
});