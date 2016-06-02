var autoStart = true;
var gameIsRunning = false;
var stage, stage2;
var hero;
var life = 3;
var level = 10;
var gameTime = 60;
var co2Niveau = 0;
var co2Increase = .1;
var preloadText, selectText, deadText;
var muteButton;
var levelData;
var tiles;
var currentLevel=-1;
var queue;
var blockSize = 50;
var spinner;
var heroSpriteSheet;
//var grid;
var hitTest;
var smug, statusNow, co2Container;
var smogCloudsRight = [], smogCloudsLeft = [];

var keys = {
    rkd:false,
    lkd:false,
    ukd:false,
    dkd:false,
};

function init(){
    stage = new createjs.Stage("canvas");
    stage2 = new createjs.Stage("canvasInfo");

    addSmogCloudsRight();
    addSmogCloudsLeft();

    preloadText = new createjs.Text("", "50px Arial", "#000");
    preloadText.textBaseline="middle";
    preloadText.textAlign="center";
    preloadText.x=stage.canvas.width/2;
    preloadText.y=stage.canvas.height/2;

    spinner = new createjs.Bitmap("img/spinning.png");
    spinner.x = 298;
    spinner.y = 310;
    spinner.regX=120;
    spinner.regY=120;

    stage.addChild(spinner, preloadText);

    preload()
}

function preload(){
    queue = new createjs.LoadQueue(autoStart);
    queue.installPlugin(createjs.Sound);
    queue.on("progress", queueProgress);
    queue.on("complete", queueComplete);
    queue.loadManifest([
        {id: "heroSsBoy", src:"spritesheets/animations/heroSsBoy.json"},
        {id: "heroSsGirl", src:"spritesheets/animations/heroSsGirl.json"},
        {id: "smug", src:"spritesheets/animations/smug.json"},
        "img/hero-boy-sheet.png",
        "img/hero-girl-sheet.png",
        "img/factory.png",
        "img/smug.png",
        {id:"levelJson",src:"json/levels.json"},
        {id:"bgSound", src:"sounds/bass.mp3"},
        {id:"tiles",src:"json/tiles.json"}
    ])
    console.log("Preload")
}

function queueProgress(e){
    preloadText.text="Loading... "+ Math.round(e.progress*100)+"%";
    stage.update(e);
}

function queueComplete(){
    createjs.Ticker.on("tick", tock);
    createjs.Ticker.setFPS(30);
    stage.removeChild(preloadText);

    console.log('load complete')
    levelData = queue.getResult("levelJson")
    tiles = new createjs.SpriteSheet(queue.getResult("tiles"));

    window.addEventListener('keydown', fingerDown);
    window.addEventListener('keyup', fingerUp);


    var splash = new createjs.Bitmap("img/start.png");
    splash.x=300;
    splash.y=100;
    splash.addEventListener('click',
        function(e){
            //createjs.Sound.play('bgSound', {loop:-1});
            stage.removeChild(e.target);
            stage.removeChild(introText);
            stage2.removeChild(title);
            selectHeroType();
        }
    );
    stage.addChild(splash);

    var introText = new createjs.Bitmap("img/introText.png");
    introText.x = 50;
    introText.y = 350;
    stage.addChild(introText);

    var title = new createjs.Bitmap("img/title.png");
    title.x = 200;
    title.y = -20;
    stage2.addChild(title);



}

function nextLevel() {
    co2Niveau = 0;
    co2Increase +=.2;
    setupLevel();
}

function setupLevel(){
    stage.removeAllChildren();
    var row, col;
    currentLevel++;
    var level = levelData.levels[currentLevel].tiles;
    //grid=[];
    blocks=[];
    for(row=0; row<level.length; row++){
       // grid.push([]);
        //console.log(level[row]);
        for(col=0; col<level[row].length; col++){
            var img;
            switch(level[row][col]){
                case 0:
                    img = "grass";
                    break;

                case 1:
                    img = "block";
                    break;
                case 2:
                    img = "gblock";
                    break;

                case 3:
                    img = "windmill";
                    break;
            }
            var t = new createjs.Sprite(tiles, img);
            t.x=col*blockSize;
            t.y=row*blockSize;
            t.width=blockSize;
            t.height=blockSize;
            t.type = level[row][col];
            if(t.type===1){
                blocks.push(t);
            }
         //   grid[row].push(t);
            stage.addChild(t);
        }
    }
}

function fingerUp(e){
    //if(e.keyCode===32){
    //    spacePress();
    //}
    if(e.keyCode===37){
        keys.lkd=false;
        hero.gotoAndStop('left');
        hero.currentAnimation = "undefined";
    }
    if(e.keyCode===38){
        keys.ukd=false;
        hero.gotoAndStop('up');
        hero.currentAnimation = "undefined";
    }
    if(e.keyCode===39){
        keys.rkd=false;
        hero.gotoAndStop('right');
        hero.currentAnimation = "undefined";
    }
    if(e.keyCode===40){
        keys.dkd=false;
        hero.gotoAndStop('down');
        hero.currentAnimation = "undefined";
    }
}

function fingerDown(e){
    //console.log(e.keyCode);

    if(e.keyCode===37){
        keys.lkd=true;
        if(hero.currentAnimation!='left') {
            hero.gotoAndPlay('left');
        }
    }
    if(e.keyCode===38){
        keys.ukd=true;
        if(hero.currentAnimation!='up') {
            hero.gotoAndPlay('up');
        }
    }
    if(e.keyCode===39){
        keys.rkd=true;
        if(hero.currentAnimation!='right') {
            hero.gotoAndPlay('right');
        }
    }
    if(e.keyCode===40){
        keys.dkd=true;
        if(hero.currentAnimation!='down') {
            hero.gotoAndPlay('down');
        }
    }
}

function hitTest(rect1,rect2) {
    if ( rect1.x >= rect2.x + rect2.width
        || rect1.x + rect1.width <= rect2.x
        || rect1.y >= rect2.y + rect2.height
        || rect1.y + rect1.height <= rect2.y )
    {
        return false;
    }
    return true;
}

function predictHit(character,rect2) {
    if ( character.nextX >= rect2.x + rect2.width
        || character.nextX + character.width <= rect2.x
        || character.nextY >= rect2.y + rect2.height
        || character.nextY + character.height <= rect2.y )
    {
        return false;
    }
    return true;
}

function selectHeroType(){

    var selectText = new createjs.Text("", "40px Arial", "#000");
    selectText.text = "Select your hero!";
    selectText.x = 20;
    selectText.y = 30;
    stage2.addChild(selectText);

    var boy = new createjs.Bitmap("img/boyHero.png");
    boy.x=100;
    boy.y=100;
    boy.addEventListener('click',
        function(e){
            stage.removeChild(e.target, girl);
            stage2.removeChild(selectText);
            addHero('boy');

        }
    );

    var girl = new createjs.Bitmap("img/girlHero.png");
    girl.x=440;
    girl.y=100;
    girl.addEventListener('click',
        function(e){
            stage.removeChild(e.target, boy);
            stage2.removeChild(selectText);
            addHero('girl');


            //stage.removeChild('Infotext');
        }
    );

    stage.addChild(boy, girl);

}

function addInfoBar() {
    var factory = new createjs.Bitmap("img/factory.png");
    factory.x=10;
    factory.y=0;
    

    var smugSheet = new createjs.SpriteSheet(queue.getResult('smug'));
    smug = new createjs.Sprite(smugSheet, 'run');
    smug.x = 40;
    smug.y = -10;

    co2Container = new createjs.Container();
    co2Container.x = 200;
    co2Container.y = 30;

    var statusBg = new createjs.Shape();
    statusBg.graphics.beginFill("green");
    statusBg.graphics.drawRect(0, 0, 400, 40);

    stage2.addChild(factory, smug, co2Container);
    co2Container.addChild(statusBg);

    statusNow = new createjs.Shape();
    statusNow.graphics.beginFill("red");

    statusNow = new createjs.Shape();
    statusNow.graphics.beginFill("red");
    co2Container.addChild(statusNow);

    var heart = new createjs.Bitmap("img/life.png");
    heart.x = 700;
    heart.y = 10;
    stage2.addChild(heart);

    var windScore = new createjs.Bitmap("img/wind.png");
    windScore.x = 680;
    windScore.y = 30;
    stage2.addChild(windScore);

    var sunScore = new createjs.Bitmap("img/sun.png");
    sunScore.x = 700;
    sunScore.y = 50;
    stage2.addChild(sunScore);


    statusBar();
}

function statusBar() {
    statusNow.graphics.drawRect(0, 0, co2Niveau, 40);

}

function minusCo2() {
    co2Niveau -=20;
}

function runGame() {
    gameIsRunning=true;
    setupLevel();
    addInfoBar();

    var pollutionText = new createjs.Text("", "20px Arial", "#000");
    pollutionText.text = "Pollution";
    pollutionText.x = 300;
    pollutionText.y = 40;
    stage2.addChild(pollutionText);

    gameTimeText = new createjs.Text("", "18px Arial", "#000");
    gameTimeText.text = "Time left: " + gameTime + " sek";
    gameTimeText.x = 450;
    gameTimeText.y = 75;
    stage2.addChild(gameTimeText);
}

function youWin() {
    var youWinText = new createjs.Text("", "60px Arial", "#000");
    youWinText.text = "Level up!";
    youWinText.x = 280;
    youWinText.y = 230;
    gameTime = 60;
    stage.addChild(youWinText);

    setTimeout(function() { nextLevel(); }, 2000);
}

function gameOver() {

    deadText = new createjs.Text("", "60px Arial", "#000");
    deadText.text = "You're Dead!";
    deadText.x = 230;
    deadText.y = 130;


    var splash = new createjs.Bitmap("img/replay.png");
    splash.x=250;
    splash.y=200;
    splash.addEventListener('click',
        function(e){
            location.reload();
        }
    );
    stage.addChild(deadText, splash);


}

function addHero(gender) {
    runGame();
    if (gender === 'boy'){
        heroSpriteSheet = new createjs.SpriteSheet(queue.getResult('spritesheets/animations/heroSsBoy.json'));
        hero = new createjs.Sprite(heroSpriteSheet, 'still');

    } else {
        heroSpriteSheet = new createjs.SpriteSheet(queue.getResult('spritesheets/animations/heroSsGirl.json'));
        hero = new createjs.Sprite(heroSpriteSheet, 'still');
    }
    hero.width = 50;
    hero.height = 50;
    hero.speed = 10;
    hero.nextX;
    hero.nextY;
    //hero.sun = 0;
    //hero.wind = 0;

    hero.x = (stage.canvas.width / 2) - (hero.width / 2);
    hero.y = stage.canvas.height - hero.height;
    stage.addChild(hero); //Her stod den oprindeligt!
}

function moveHero(){
    if(keys.rkd && hero.x < 800-hero.width){
        var collisionDetected = false;
        hero.nextY=hero.y;
        hero.nextX=hero.x+hero.speed;
        for(i=0; i<blocks.length; i++){
            if(predictHit(hero, blocks[i])){
                console.log("hit predicted");
                collisionDetected=true;
                break;
            }
        }
        if(!collisionDetected) {
            hero.x += hero.speed;
        }
    }
    if(keys.lkd && hero.x > 0){
        var collisionDetected = false;
        hero.nextY=hero.y;
        hero.nextX=hero.x-hero.speed;
        for(i=0; i<blocks.length; i++){
            if(predictHit(hero, blocks[i])){
                collisionDetected=true;
                break;
            }
        }
        if(!collisionDetected) {
            hero.x -= hero.speed;
        }
    }
    if(keys.ukd && hero.y >= 0){
        var collisionDetected = false;
        hero.nextY=hero.y-hero.speed;
        hero.nextX=hero.x;
        for(i=0; i<blocks.length; i++){
            if(predictHit(hero, blocks[i])){
                collisionDetected=true;
                break;
            }
        }
        if(!collisionDetected) {
            hero.y -= hero.speed;
        }
    }
    if(keys.dkd && hero.y < 600-hero.height){
        var collisionDetected = false;
        hero.nextY=hero.y+hero.speed;
        hero.nextX=hero.x;
        for(i=0; i<blocks.length; i++){
            if(predictHit(hero, blocks[i])){
                collisionDetected=true;
                break;
            }
        }
        if(!collisionDetected) {
            hero.y += hero.speed;
        }
    }
}

function addSmogCloudsRight() {
    var i;
    for(i=0; i<level; i=level) {
        var temp = new createjs.Bitmap("img/smogCloud.png");
        temp.width = 120;
        temp.height = 100;
        stage.addChild(temp);
        temp.y = Math.floor(Math.random() * 500);
        temp.x = 800+temp.width;
        smogCloudsRight.push(temp);
    }
}

function addSmogCloudsLeft() {
    var i;
    for(i=0; i<level; i=level) {
        var temp = new createjs.Bitmap("img/smogCloud.png");
        temp.width = 120;
        temp.height = 100;
        stage.addChild(temp);
        temp.y = Math.floor(Math.random() * 500);
        temp.x = 800+temp.width;
        smogCloudsLeft.push(temp);
    }
}

function moveSmogCloudsRight(){
    var i;
    var length = smogCloudsRight.length-1;
    for(i=length; i>=0; i--){
        smogCloudsRight[i].x+= level/2;
        smogCloudsRight[i].y+= 0.2;
        if(smogCloudsRight[i].x > 800 || smogCloudsRight[i].y < -120 || smogCloudsRight[i].y > 650){
            smogCloudsRight[i].x = - Math.random() * 500;
            smogCloudsRight[i].y = Math.floor(Math.random() * 500);
        }
    }
}

function moveSmogCloudsLeft(){
    var i;
    var length = smogCloudsLeft.length-1;
    for(i=length; i>=0; i--){
        smogCloudsLeft[i].x-= level/2;
        smogCloudsLeft[i].y+= 0.2;
        if(smogCloudsLeft[i].x < -50 || smogCloudsLeft[i].y <-120 || smogCloudsLeft[i].y > 650){
            smogCloudsLeft[i].x = 800 + Math.random() * 500;
            smogCloudsLeft[i].y = Math.floor(Math.random() * 500);
        }
    }
}


//Endnu ikke i brug
function muteButton() {
    muteButton = new createjs.Shape();
    muteButton.graphics.beginFill("blue");
    muteButton.graphics.drawCircle(0, 0, 20);
    muteButton.x = 50;
    muteButton.y = 50;

    muteButton.addEventListener('click',
        function (e) {
            //createjs.Sound.muted = true;
        }
    );


    stage.addChild(muteButton);

}
    function tock(e) {
        moveSmogCloudsRight();
        moveSmogCloudsLeft();

        if (co2Niveau > 400) {
            gameIsRunning = false;
            gameOver();
        }
        if (gameIsRunning === true)
            if (gameTime > 0) {
                gameTime -= .025;

            } else {
                youWin();
            }
        if (gameIsRunning === true) {
            moveHero();
            statusBar();
            moveSmogCloudsRight();
            moveSmogCloudsLeft();
            co2Niveau += co2Increase;
            gameTimeText.text = "Time left: " + +Math.round(gameTime) + " sec";
        }
        stage.update(e);
        stage2.update(e);
        //console.log("Tock is running");
        spinner.rotation += 1;
    }
