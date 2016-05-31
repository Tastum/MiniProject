var autoStart = true;
var stage
var hero
var life
var level = 1
var time
var co2Niveau = 0
var preloadText
var muteButton;
var levelData;
var tiles;
var currentLevel=-1;
var queue;
var blockSize = 50;

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
    queue = new createjs.LoadQueue(autoStart);
    queue.installPlugin(createjs.Sound);
    queue.on("progress", queueProgress);
    queue.on("complete", queueComplete);
    queue.loadManifest([
        "img/bigPic.jpg",
        {id:"levelJson",src:"json/levels.json"},
        {id:"tiles",src:"json/tiles.json"},
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
    levelData = queue.getResult("levelJson")
    tiles = new createjs.SpriteSheet(queue.getResult("tiles"));
    setupLevel();
}

function setupLevel(){
    var row, col;
    currentLevel++;
    var level = levelData.levels[currentLevel].tiles;
    //console.log(level);
    for(row=0; row<level.length; row++){
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
            stage.addChild(t);
        }
    }
    /*var t = new createjs.Sprite(tiles, "block");
    stage.addChild(t);*/
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