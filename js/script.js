var autoStart = true;
var gameIsRunning = false;
var stage;
var hero;
var life
var level = 1;
var time
var co2Niveau = 0
var preloadText
var muteButton;
var levelData;
var tiles;
var currentLevel=-1;
var queue;
var blockSize = 50;
var spinner;
var grid;
var hitTest;

var keys = {
    rkd:false,
    lkd:false,
    ukd:false,
    dkd:false,
};

function init(){
    stage = new createjs.Stage("canvas");
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
        //"img/spinning.png",
        {id: "heroSS", src:"spritesheets/Animations/slime.json"},
        "spritesheets/Animations/slime-sheet.png",
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
    createjs.Ticker.addEventListener("tick", tock);
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
            selectHeroType();
        }
    );
    stage.addChild(splash);

}
function isPassable(r, c){
    switch(grid[r][c].type){
        case 0:
            return true;
            break;
        case 1:
            return false;
            break;
    }
}

function checkCollisions(){

}
function hitTest(rect1,rect2) {
    if ( rect1.x >= rect2.x + rect2.width
        || rect1.x + rect1.width <= rect2.x
        || rect1.y >= rect2.y + rect2.height
        || rect1.y + rect1.height <= rect2.y)
    {
        return false;
    }
    return true;
}

function setupLevel(){
    //stage.removeAllChildren();
    var row, col;
    currentLevel++;
    var level = levelData.levels[currentLevel].tiles;
    //console.log(level);
    grid=[];
    for(row=0; row<level.length; row++){
        grid.push([]);
        //console.log(level[row]);
        for(col=0; col<level[row].length; col++){
          console.log(level[row].length)
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
            t.row = row;
            t.col = col;
            t.type = level[row][col];
            grid[row].push(t);
            stage.addChild(t);
        }
    }
    /*var t = new createjs.Sprite(tiles, "block");
    stage.addChild(t);*/
}

function fingerUp(e){
    //if(e.keyCode===32){
    //    spacePress();
    //}
    if(e.keyCode===37){
        keys.lkd=false;
    }
    if(e.keyCode===38){
        keys.ukd=false;
    }
    if(e.keyCode===39){
        keys.rkd=false;
    }
    if(e.keyCode===40){
        keys.dkd=false;
    }
}

function fingerDown(e){
    //console.log(e.keyCode);

    if(e.keyCode===37){
        keys.lkd=true;
    }
    if(e.keyCode===38){
        keys.ukd=true;
    }
    if(e.keyCode===39){
        keys.rkd=true;
    }
    if(e.keyCode===40){
        keys.dkd=true;
    }
}

function selectHeroType(){

    var boy = new createjs.Bitmap("img/boyHero.png");
    boy.x=100;
    boy.y=100;
    boy.addEventListener('click',
        function(e){
            stage.removeChild(e.target, girl);
            gameIsRunning=true;
            setupLevel();
            addHero('boy');
        }
    );

    var girl = new createjs.Bitmap("img/girlHero.png");
    girl.x=300;
    girl.y=100;
    girl.addEventListener('click',
        function(e){
            stage.removeChild(e.target, boy);
            gameIsRunning=true;
            setupLevel();
            addHero('girl');
        }
    );

    stage.addChild(boy, girl);
}

function startGame(){

}

function resetGame(){

}

function addHero(gender) {
    if (gender === 'boy'){
        hero = new createjs.Bitmap("img/boyHero.png");

    } else {
        hero = new createjs.Bitmap("img/girlHero.png");
    }
    hero.width = 50;
    hero.height = 100;
    hero.speed = 12;
    /*if(isPassable(hero.width, hero.height)){
        hero.x=hero.width*blockSize;
        hero.y=hero.height*blockSize;
    }*/
    hero.x = (stage.canvas.width / 2) - (hero.width / 2);
    hero.y = stage.canvas.height - hero.height;
    stage.addChild(hero); //Her stod den oprindeligt!
}

function moveHero(){
    if(keys.rkd && hero.x < 800-hero.width){
        hero.x+=hero.speed;
    }
    if(keys.lkd && hero.x > 0){
        hero.x-=hero.speed;
    }
    if(keys.ukd && hero.y >= 0){
        hero.y-=hero.speed;
    }
    if(keys.dkd && hero.y < 600-hero.height){
        hero.y+=hero.speed;
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
        function(e){
            //createjs.Sound.muted = true;
        }
    );

    stage.addChild(muteButton);



}



function tock(e){
    if(gameIsRunning) {
        moveHero();
    }
    stage.update(e);
    //console.log("Tock is running");
    spinner.rotation +=1;
}