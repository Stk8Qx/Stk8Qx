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
        
        spaceBetweenBasedTrackPoint: 25,//
        singleccelerationCurve: 1, // max change acceleration
        maxAccelerationCurve: 8, //max curve radius
        maxRadiusCurve: 45, // max maxAccelerationCurve multiply
        roadWidthAsphalt: 90,
        roadWidthBorder: 14,
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
            //this.posY-=4;
            /*if(this.posX>=0+20) this.posX = acceleration;
            if(this.posX<=ctx2.canvas.width-20) this.posX += 10;*/
        }
    }

    class Camera{
        constructor (posX, posY) {
            this.posX = posX;
            this.posY = posY;
        }

        update(deltaY){
            this.posY += deltaY;
        }
     }

    class Vector2 {
        constructor(posX, posY, acceleration){
            this.posX = posX;
            this.posY = posY;
            this.acceleration = acceleration;
        }
    }
    
    class BasedTrackPoint {
        constructor (index, posX, posY, acceleration) {
            this.index = index;
            this.vector2 = new Vector2(posX, posY, acceleration);
        }
    }

    /*class ExtendedTrackPoint{
        constructor (posX, posY, index) {
            this.index = index;
            
            this.posX = posX;
            this.posY = posY;
        }
    }*/

    class MeshTriangle{
        constructor (a, b, c) {
            this.a = a;
            this.b = b;
            this.c = c;
        }
    }
    
    class Mesh {
        basedTrackPointList = new Array; //center point of road
        extendedTrackPointList = new Array;// points border out and border in
        triangleList = new Array;

        constructor (basedTrackPointList, extendedTrackPointList) {
            this.basedTrackPointList = basedTrackPointList;
            this.extendedTrackPointList = extendedTrackPointList;
            
            this.buildNewStart();
        }
        
        buildNewStart(){
            for(let i=0; i<(this.extendedTrackPointList.length-4); i+=2){//(trackManager.basedTrackPointList.length-1)*2  swap with 10
                //road
                if (i>0&&i%4==2)this.triangleLeftFromtriangleList(i-1);
                if (i>0&&i%4==2)this.triangleRightFromtriangleList(i);
                
                //border
                this.triangleLeftFromtriangleList(i);
                this.triangleRightFromtriangleList(i+1);
            }
            
            
            console.log("triangle list");
            console.log(this.triangleList.length);
        }
        
        triangleLeftFromtriangleList(i){
            let a = new Vector2(this.extendedTrackPointList[i].vector2.posX,this.extendedTrackPointList[i].vector2.posY);
            let b = new Vector2(this.extendedTrackPointList[i+1].vector2.posX,this.extendedTrackPointList[i+1].vector2.posY);
            let c = new Vector2(this.extendedTrackPointList[i+4].vector2.posX,this.extendedTrackPointList[i+4].vector2.posY);
            this.newTriangle(a,b,c);
        }
        triangleRightFromtriangleList(i){
            let a = new Vector2(this.extendedTrackPointList[i].vector2.posX,this.extendedTrackPointList[i].vector2.posY);
            let b = new Vector2(this.extendedTrackPointList[i+3].vector2.posX,this.extendedTrackPointList[i+3].vector2.posY);
            let c = new Vector2(this.extendedTrackPointList[i+4].vector2.posX,this.extendedTrackPointList[i+4].vector2.posY);
            this.newTriangle(a,b,c);
        }

        newTriangle(a,b,c){this.triangleList.push(new MeshTriangle(a,b,c));}

        draw(){
            this.triangleList.forEach(this.drawTriangle);
        }

        drawTriangle(triangle,color){
            
            ctx2.beginPath();
            ctx2.moveTo(triangle.a.posX+camera.posX, triangle.a.posY+camera.posY);
            ctx2.lineTo(triangle.b.posX+camera.posX, triangle.b.posY+camera.posY);
            ctx2.lineTo(triangle.c.posX+camera.posX, triangle.c.posY+camera.posY);
            //ctx2.lineTo(triangle.a.posX, triangle.a.posY);
            ctx2.closePath();
            
            // the outline
            /*ctx2.lineWidth = 1;
            ctx2.strokeStyle = '#000';
            ctx2.stroke();*/

            // the fill color
            if(color%12==0||color%12==4) color = "#FFCC00";
            if(color%12==2||color%12==8) color = "#000";
            if(color%12==6||color%12==10) color = "#ff0000";
            ctx2.fillStyle = color;
            ctx2.fill();
        }
    }

    //track manager
    class TrackManager{ // extends Mesh
        basedTrackPointList = new Array; //center point of road
        extendedTrackPointList = new Array;// points border out and border in
        
        constructor () {
            this.spaceBetweenBasedTrackPoint = Config.spaceBetweenBasedTrackPoint;
            this.densityBasedTrackPoint = ctx2.canvas.height/this.spaceBetweenBasedTrackPoint;
            this.buildNewStart();
            
            
            this.meshBorder = new Mesh(this.basedTrackPointList, this.extendedTrackPointList);
            this.meshRoad = new Mesh(this.basedTrackPointList, this.extendedTrackPointList);
        }

        buildNewStart(){
            //initial BasedTrackPoint then initial ExtendedTrackPoint
            this.basedTrackPointList.push(new BasedTrackPoint(0, ctx2.canvas.width/2, ctx2.canvas.height, 0));
            this.newBasedTrackPoint();
            
            for(let i = 0; i <= this.densityBasedTrackPoint; i++){
                this.newBasedTrackPoint();
                this.newExtendedTrackPoint(i); 
            }
                
            console.log("base point");
            console.log(this.basedTrackPointList.length);
            console.log("extended point");
            console.log(this.extendedTrackPointList.length);
        }

        newBasedTrackPoint() {
                
            let prev = this.basedTrackPointList[this.basedTrackPointList.length-1];
            let rand = Math.round((Math.random() * 2 * Config.singleccelerationCurve) - 1)
            let acceleration = prev.vector2.acceleration + rand;

               
            //clamp acceleration between Config.maxAccelerationCurve
            if (acceleration > Config.maxAccelerationCurve) acceleration = Config.maxAccelerationCurve;
            else if (acceleration < -Config.maxAccelerationCurve) acceleration = -Config.maxAccelerationCurve;
            this.basedTrackPointList.push(new BasedTrackPoint(
                prev.index+1, //index
                (prev.vector2.posX + (acceleration * Config.maxRadiusCurve / this.spaceBetweenBasedTrackPoint)),//posX
                prev.vector2.posY - this.spaceBetweenBasedTrackPoint,//posY
                acceleration));
        };
        
        newExtendedTrackPoint(basedTrackPointIndex){
            let index = this.extendedTrackPointList.length
            let base = this.basedTrackPointList[basedTrackPointIndex].vector2;
            
            //left border out
            this.extendedTrackPointList.push(new BasedTrackPoint(
                basedTrackPointIndex.index,
                base.posX - Config.roadWidthBorder - Config.roadWidthAsphalt,
                base.posY,
                0));
            //left border in
            this.extendedTrackPointList.push(new BasedTrackPoint(
                basedTrackPointIndex.index+1,
                base.posX - Config.roadWidthAsphalt,
                base.posY,
                0));
            //right border in
            this.extendedTrackPointList.push(new BasedTrackPoint(
                basedTrackPointIndex.index+2,
                base.posX + Config.roadWidthAsphalt,
                base.posY,
                0));
            //right border out
            this.extendedTrackPointList.push(new BasedTrackPoint(
                basedTrackPointIndex.index+3,
                base.posX + Config.roadWidthBorder + Config.roadWidthAsphalt,
                base.posY,
                0));
        }

        /*createTrack(x,y, lastX, typeRoad){
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
        }*/

        /*draw() {
            this.trackList.forEach(e =>
                e.draw()                   
            ); 
        }*/
    
        /*physicUpdate(){
            this.trackList.forEach(e =>
                e.move()                   
            );
            this.checkNextTrackCondition();
        }*/
        
        /*checkNextTrackCondition(){
            if(this.trackList[this.trackList.length-1].posY > 0) {
                let lastX = this.trackList[this.trackList.length-1].lastX;
                if (this.trackList[this.trackList.length-1].type == "roadL")  lastX--;
                if (this.trackList[this.trackList.length-1].type == "roadR") lastX++;
                this.createTrack((ctx2.canvas.width/2-Config.size/2),-Config.size+3, lastX);
            }
        }*/

        /*checkCollision() {
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
        }*/

        //remove obj form array enemiesList and add score/level
        /*destroyTrack(){
            this.trackList.splice(0);
        }*/
        
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
        
        //trackManager.draw();
        trackManager.meshRoad.draw();
        player.draw();
        hud.draw();
    }

    function physicUpdate(){
        camera.update(2);
        player.moveUpdate();
        //trackManager.physicUpdate();
        //gameManager.gameoverstatment();
    }
    //instance single object class player bulletsManager enemiesManager hud
    const player = new Player (355, 370);
    const camera = new Camera (0, 0);
    const trackManager = new TrackManager ();
    const hud = new HUD ();
    const gameManager = new GameManager ();

    setInterval(physicUpdate, Config.frameUpdate); // update physics
    setInterval(draw, Config.physicUpdate); //draw frame
    setInterval(gameManager.scoreUp, 1000); //draw frame
});