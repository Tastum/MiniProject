var stage
var hero
var life
var level = 1
var time
var co2Niveau = 0


function init(){
    stage = new createjs.Stage("canvas");


    queue = new createjs.LoadQueue(true);
    preloadText = new createjs.Text("", "50px Courier New", "#000");
    queue.installPlugin(createjs.Sound);
    queue.on("progress", queueProgress);
    queue.on("complete", queueComplete);
    queue.loadManifest([
        //"img/sprites/tiles.png",
        //"img/hero.png",
        //"img/key.png",
        //{id:"tileSprites",src:"json/bgtiles.json"},
        //{id:"levelJson",src:"json/levels/levels.json"},
        {id:"bgsound", src:"sounds/bass.mp3"},

    ])

    hero = new createjs.Shape();
    hero.graphics.beginFill("blue");
    hero.graphics.drawCircle(0, 0, 40);
    hero.x = 50;
    hero.y = 50;


    stage.addChild(hero);

}

function queueProgress(e){
    preloadText.text= Math.round(e.progress*100)+"%"

}

function queueComplete(){
    createjs.Ticker.addEventListener("tick", tock);
    createjs.Ticker.setFPS(30);
}



function tock(e){
    stage.update(e);
}