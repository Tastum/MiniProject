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

var keys = {
    rkd:false,
    lkd:false,
    ukd:false,
    dkd:false,
};

function init(){
    stage = new createjs.Stage("canvas");
    preloadText = new createjs.Text("", "50px Arial", "#000");
    stage.addChild(preloadText);
    preloadText.textBaseline="middle";
    preloadText.textAlign="center";
    preloadText.x=stage.canvas.width/2;
    preloadText.y=stage.canvas.height/2;

    preload()
}

function preload(){
    var queue = new createjs.LoadQueue(autoStart);
    queue.installPlugin(createjs.Sound);
    queue.on("progress", queueProgress);
    queue.on("complete", queueComplete);
    queue.loadManifest([
        //"img/bigPic.jpg",
        {id:"levelJson",src:"json/levels.json"},
        {id:"bgSound", src:"sounds/bass.mp3"}
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

    window.addEventListener('keydown', fingerDown);
    window.addEventListener('keyup', fingerUp);

    console.log('Load complete')

    var splash = new createjs.Bitmap("img/start.png");
    splash.x=300;
    splash.y=100;
    splash.addEventListener('click',
        function(e){
            createjs.Sound.play('bgSound', {loop:-1});
            stage.removeChild(e.target);
            selectHeroType();
        }
    );
    stage.addChild(splash);
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
            addHero('boy');
            startGame();
        }
    );

    var girl = new createjs.Bitmap("img/girlHero.png");
    girl.x=300;
    girl.y=100;
    girl.addEventListener('click',
        function(e){
            stage.removeChild(e.target, boy);
            gameIsRunning=true;
            addHero('girl');
            startGame();
        }
    );

    stage.addChild(boy, girl);
}

function startGame(){
    muteButton();
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
    hero.x = (stage.canvas.width / 2) - (hero.width / 2);
    hero.y = stage.canvas.height - hero.height;
    stage.addChild(hero);
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




    //createjs.Sound.muted = true;
}

function tock(e){
    if(gameIsRunning) {
        moveHero();
    }
    stage.update(e);
    //console.log("Tock is running");
}