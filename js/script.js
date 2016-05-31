var autoStart = true;
var stage
var hero
var life
var level = 1
var time
var co2Niveau = 0
var preloadText
var muteButton;

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
        "img/bigPic.jpg",
        {id:"levelJson",src:"json/levels.json"},
        {id:"bgsound", src:"sounds/bass.mp3"}
    ])

}

function queueProgress(e){
    preloadText.text="Loading... "+ Math.round(e.progress*100)+"%";
    stage.update(e);
}

function queueComplete(){
    createjs.Ticker.addEventListener("tick", tock);
    createjs.Ticker.setFPS(30);
    stage.removeChild(preloadText);
    bgSound();
    console.log('load complete')

}

function bgSound() {
    muteButton = new createjs.Shape();
    muteButton.graphics.beginFill("blue");
    muteButton.graphics.drawCircle(0, 0, 20);
    muteButton.x = 50;
    muteButton.y = 50;
    stage.addChild(muteButton);



}



function tock(e){
    stage.update(e);
    //console.log("tock is running")
}