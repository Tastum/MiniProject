var stage
var hero
var life
var level
var time
var co2Niveau


function init(){
    stage = new createjs.Stage("canvas");
    createjs.Ticker.setFPS(30);
    createjs.Ticker.addEventListener("tick", tock);
}



function tock(e){
    stage.update(e);
}