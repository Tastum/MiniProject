var stage
var hero
var life
var level = 1
var time
var co2Niveau = 0


function init(){
    stage = new createjs.Stage("canvas");
    createjs.Ticker.setFPS(30);
    createjs.Ticker.addEventListener("tick", tock);

    hero = new createjs.Shape();
    hero.graphics.beginFill("blue");
    hero.graphics.drawCircle(0, 0, 40);
    hero.x = 50;
    hero.y = 50;


    stage.addChild(hero);

}



function tock(e){
    stage.update(e);
}