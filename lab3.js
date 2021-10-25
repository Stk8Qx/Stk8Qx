$( window ).on( "load", function() {
    //canvas
    var ctx2 = $("#canvas")[0].getContext("2d");
    ctx2.canvas.width  = 800;
    ctx2.canvas.height = 600;
    
    var Config = {
        frameUpdate: 10,
        physicUpdate: 10,
        
        size: 100,
        
        moveLeft: 65,
        moveRight: 68,
        moveLeftAlt: 37,
        moveRightAlt: 39,
        
        bestScore: 0,
        score: 0,
        level: 1,
        
        spaceBetweenBasedTrackPoint: 25,//
        singleccelerationCurve: 1, // max change acceleration
        maxAccelerationCurve: 8, //max curve radius
        maxRadiusCurve: 45, // max maxAccelerationCurve multiply
        roadWidthAsphaltmin: 40,
        roadWidthAsphaltmax: 160,
        roadWidthAsphalt: 160,
        roadWidthBorder: 10,
        
        tick: 0,
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
            ctx2.fillText("Score:   "+Config.score, 10, 25);
            ctx2.fillText("Level:   "+Config.level, 10, 50);
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
            if (this.isSteeringRight) this.acceleration += 3;
            if (this.isSteeringLeft) this.acceleration -= 3;
            
            let max = 8;
            if(this.acceleration>max) this.acceleration = max;
            if(this.acceleration<-max) this.acceleration = -max;
            
            let c =1;
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
            //console.log(this.extendedTrackPointList.length);
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
            
        }

        buildNewStart(){
            
            //this.meshRoad = new Mesh(this.basedTrackPointList, this.extendedTrackPointList);
            //initial BasedTrackPoint then initial ExtendedTrackPoint
            this.basedTrackPointList.push(new BasedTrackPoint(0, ctx2.canvas.width/2, ctx2.canvas.height, 0));
            this.newBasedTrackPoint();
            Config.tick=0;
            for(let i = 0; i <= this.densityBasedTrackPoint*100; i++){
                this.newBasedTrackPoint();
                this.newExtendedTrackPoint(i); 
            }
            //mesh
            this.meshRoad = new Mesh(this.basedTrackPointList, this.extendedTrackPointList);
            
        }

        newBasedTrackPoint() {
                
            let prev = this.basedTrackPointList[this.basedTrackPointList.length-1];
            let rand = Math.round((Math.random() * 2 * Config.singleccelerationCurve) - 1)
            let acceleration = prev.vector2.acceleration + rand;

               
            //clamp acceleration between Config.maxAccelerationCurve
            if (acceleration > Config.maxAccelerationCurve) acceleration = Config.maxAccelerationCurve;
            else if (acceleration < -Config.maxAccelerationCurve) acceleration = -Config.maxAccelerationCurve;
            
            let calcX = (prev.vector2.posX + (acceleration * Config.maxRadiusCurve / this.spaceBetweenBasedTrackPoint));
            //dont let generate road on lefrt/right of render area
            if (calcX+Config.roadWidthAsphalt+Config.roadWidthBorder>ctx2.canvas.width) {calcX = prev.vector2.posX;acceleration=0}
            if (calcX-Config.roadWidthAsphalt-Config.roadWidthBorder<0) {calcX = prev.vector2.posX;acceleration=0}
            
            //first fe block acc = 0
            //console.log(this.basedTrackPointList.length);
            if(Config.tick<this.densityBasedTrackPoint*2) {
                //console.log(Config.tick);
                //calcX=390;
                //Config.tick++;
                //acceleration=0;
            }//calcX = 400;
            
            this.basedTrackPointList.push(new BasedTrackPoint(
                prev.index+1, //index
                calcX,//posX
                prev.vector2.posY - this.spaceBetweenBasedTrackPoint,//posY
                acceleration));
            //if(Config.tick == 1) player.posX = calcX;
        };
        
        newExtendedTrackPoint(basedTrackPointIndex){
            let index = this.extendedTrackPointList.length;
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

        destroyTrack(){
            this.basedTrackPointList.splice(0);
            this.extendedTrackPointList.splice(0);
        }

        
    }

    
    class GameManager{
        basedPoindEndIndex;
        constructor () {
            this.basedPoindEnd;
            this.selectBasedTrackPointEndStatment();
        }
        
        /*levelComplete(){
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
        }*/
        
        scoreUp() {
            Config.score += 10;
            if (Config.score % 10 == 0) {
                gameManager.levelUp();
            }
        }
        
        levelUp() {
            
            Config.roadWidthAsphalt -= 30;
            
            if(Config.roadWidthAsphalt < Config.roadWidthAsphaltminx) Config.roadWidthAsphalt = Config.roadWidthAsphaltminx;
            Config.tick=0;
            
            
            Config.level += 1;
            trackManager.destroyTrack();
            trackManager.buildNewStart();
            
        }
        
        selectBasedTrackPointEndStatment(){
            let maxDelta = 999999;
            for(var i=0;i<trackManager.densityBasedTrackPoint;i++) {
                let delta = Math.abs(trackManager.basedTrackPointList[i].vector2.posX - player.posX);
//                console.log("delta");
//            console.log(delta);
                if(maxDelta >= delta) this.basedPoindEndIndex = i;
                else break;
            }
            //TODO end statment
        }
        
        gameoverstatment(){
            let en = trackManager.basedTrackPointList[this.basedPoindEndIndex].vector2;
            let end = en.posX;
            let leftEndStatment = end - Config.roadWidthAsphalt - Config.roadWidthBorder;
            let rightEndStatment = end + Config.roadWidthAsphalt + Config.roadWidthBorder - 20;
            
            /*ctx2.beginPath();
            ctx2.rect(leftEndStatment, en.posY, 20, 20);
            ctx2.rect(rightEndStatment, en.posY, 20, 20);
            ctx2.closePath();
            ctx2.fillStyle = "orange";
            ctx2.fill();*/
            
            
            
//            console.log("sadsas");
//            console.log(leftEndStatment);
//            console.log(rightEndStatment);
//            console.log(en.posY);
            if(Config.tick<trackManager.densityBasedTrackPoint) {
                player.posX = en.posX;
                Config.tick++;
            }
            if(player.posX < leftEndStatment || player.posX > rightEndStatment){
                trackManager.destroyTrack();
                trackManager.buildNewStart();
                
                //player.posX = en.posX;
                Config.score = 0;
                Config.level = 1;
                
                Config.roadWidthAsphalt = Config.roadWidthAsphaltmax;
                Config.tick=0;
            }
//            console.log("asadffsasassfaasfad");
//            console.log(Math.abs(en.posY+camera.posY - player.posY));
//            console.log(Math.abs(trackManager.basedTrackPointList[this.basedPoindEndIndex+1].vector2.posY +camera.posY- player.posY));
            if(Math.abs(en.posY+camera.posY - player.posY) > Math.abs(trackManager.basedTrackPointList[this.basedPoindEndIndex+1].vector2.posY +camera.posY- player.posY))
            this.basedPoindEndIndex++;
            
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
        camera.update(8);
        player.moveUpdate();
        //trackManager.physicUpdate();
        gameManager.gameoverstatment();
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