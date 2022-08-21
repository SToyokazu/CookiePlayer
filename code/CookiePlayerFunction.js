//import {SimulateObjectsInitialize, SimulateUpgradesInitialize, SimulateGains} from './CookieClickerSimulate.js';

window.addEventListener('message', EventListener);

function EventListener(e)
{
    //URLチェック
    if (event.origin !== "https://stoyokazu.github.io" ){
      return;
    }

    var AutoCookieClick = AutoCookieClickFunction;
    var AutoGCClick = AutoGCClickFunction;

    switch (e.data.message) {
        case "AutoCookieClick":
            AutoCookieClick(e);
            break;
        case "AutoGCClick":
            AutoGCClick(e);
            break;
        case "AutoNewsClick":
            AutoNewsClick(e);
            break;
        case "AutoProductClick":
            AutoProductClick(e);
            break;
    }
}

function AutoCookieClickFunction(e)
{
    arguments.callee.autoCookieClickId = 0;

    if(e.data.status ===  true){
        this.autoCookieClickId = setInterval(Game.ClickCookie,4);
        console.log("Auto cookie click on: "+ this.autoCookieClickId);
    }else{
        console.log("Auto cookie click off: "+this.autoCookieClickId);
        clearInterval(this.autoCookieClickId);
    }
}

function AutoGCClickFunction(e)
{
    arguments.callee.autoGCClickId = 0;

    var AllGCPop = function()
    {
        for (var i in Game.shimmers) {
             Game.shimmers[i].pop(); 
        }
    }

    if(e.data.status ===  true){
        this.autoGCClickId = setInterval(AllGCPop,500);
        console.log("Auto GC click on: "+ this.autoGCClickId);
    }else{
        console.log("Auto GC click off: "+this.autoGCClickId);
        clearInterval(this.autoGCClickId);
    }
}

function AutoNewsClick(e)
{
    arguments.callee.autoNewsClickId = 0;

    var NewsClick = function()
    {
        if (Game.TickerEffect && Game.TickerEffect.type == 'fortune') {
            Game.tickerL.click();
        }
    }

    if(e.data.status ===  true){
        this.autoNewsClickId = setInterval(NewsClick,2500);
        console.log("Auto News click on: "+ this.autoNewsClickId);
    }else{
        console.log("Auto News click off: "+this.autoNewsClickId);
        clearInterval(this.autoNewsClickId);
    }
}

function AutoProductClick(e)
{
    arguments.callee.autoProductClickId = 0;

    var ProductClick = function()
    {
        let minThretholdTime;
        let minObjects;

        let cookies = Game.cookies;
        let cookiesPs = Game.cookiesPs;

        for (var i in Game.Objects) {
            if(Game.Objects[i].locked != 0){
                continue;
            }

            SimulateObjectsInitialize(Game.Objects[i].id, 1);
            SimulateUpgradesInitialize(-1);
            let deltaCps = SimulateGains();

            let thretholdTime;

            if (Game.cookies >= Game.Objects[i].getPrice()) {
                thretholdTime = Game.Objects[i].getPrice() / (cookiesPs + deltaCps);
            } else {
                thretholdTime = Game.Objects[i].getPrice() / cookiesPs - deltaCps * cookies / ((cookiesPs + deltaCps) * cookiesPs);
            }

            if(minThretholdTime == undefined) {
                minThretholdTime = thretholdTime;
                minObjects = Game.Objects[i];
            } else if (minThretholdTime > thretholdTime) {
                minThretholdTime = thretholdTime;
                minObjects = Game.Objects[i];
            }
        }

        if (minObjects != undefined) {

            var pastBuyMode = Game.buyMode;
            Game.buyMode = 1;
            if (Game.cookies >= minObjects.getPrice()) {
                minObjects.buy(1);
            }
            Game.buyMode = pastBuyMode;
        }

        /*
        for (let i = Game.ObjectsN - 1; i >= 0; i--) {

            if (Game.ObjectsById[i].locked != 0) {
                continue;
            }

            var pastBuyMode = Game.buyMode;

            Game.buyMode = 1;
            while (Game.cookies >= Game.ObjectsById[i].getPrice()){
                Game.ObjectsById[i].buy(10000);
            }
            Game.buyMode = pastBuyMode;
        }
        */
    }

    console.log("Auto Product click off: " + this.autoProductClickId);
    clearInterval(this.autoProductClickId);
    if(e.data.status ===  true){
        this.autoProductClickId = setInterval(ProductClick,e.data.value);
        console.log("Auto Product click on: "+ this.autoProductClickId);
    }
}