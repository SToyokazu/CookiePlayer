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
            let deltaCps = SimulateGains() - cookiesPs;

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

function AutoUpgradeClick(e)
{
    arguments.callee.autoUpgradeClickId = 0;

    var UpgradeClick = function()
    {
        let minThretholdTime;
        let minUpgrades;

        let cookies = Game.cookies;
        let cookiesPs = Game.cookiesPs;

        for (var i in Game.Upgrades) {
            //自動購入対象外はスルー
            if(Game.Upgrades[i].pool == "debug")    continue;
            if(Game.Upgrades[i].pool == "prestige") continue;
            if(Game.Upgrades[i].pool == "toggle") continue;
            if(Game.Upgrades[i].id == 69) continue;
            if(Game.Upgrades[i].id == 227) continue;

            if(Game.Upgrades[i].unlocked != 1) continue;

            //Cps以外に影響を及ぼす強化は優先的に購入
            if(Game.Upgrades[i].id >= 0 && Game.Upgrades[i].id <= 6 && Game.Upgrades[i].getPrice() <= cookies){
                minUpgrades = Game.Upgrades[i];
                break;
            }
            
            if(Game.Upgrades[i].id == 43 && Game.Upgrades[i].getPrice() <= cookies){
                minUpgrades = Game.Upgrades[i];
                break;
            }

            if(Game.Upgrades[i].id >= 52 && Game.Upgrades[i].id <= 53 && Game.Upgrades[i].getPrice() <= cookies){
                minUpgrades = Game.Upgrades[i];
                break;
            }

            if(Game.Upgrades[i].id == 69 && Game.Upgrades[i].getPrice() <= cookies){
                minUpgrades = Game.Upgrades[i];
                break;
            }

            if(Game.Upgrades[i].id >= 75 && Game.Upgrades[i].id <= 78 && Game.Upgrades[i].getPrice() <= cookies){
                minUpgrades = Game.Upgrades[i];
                break;
            }

            if(Game.Upgrades[i].id == 82 && Game.Upgrades[i].getPrice() <= cookies){
                minUpgrades = Game.Upgrades[i];
                break;
            }

            if(Game.Upgrades[i].id == 86 && Game.Upgrades[i].getPrice() <= cookies){
                minUpgrades = Game.Upgrades[i];
                break;
            }

            if(Game.Upgrades[i].id == 109 && Game.Upgrades[i].getPrice() <= cookies){
                minUpgrades = Game.Upgrades[i];
                break;
            }

            if(Game.Upgrades[i].id == 119 && Game.Upgrades[i].getPrice() <= cookies){
                minUpgrades = Game.Upgrades[i];
                break;
            }

            if(Game.Upgrades[i].id == 152 && Game.Upgrades[i].getPrice() <= cookies){
                minUpgrades = Game.Upgrades[i];
                break;
            }

            if(Game.Upgrades[i].id >= 157 && Game.Upgrades[i].id <= 164 && Game.Upgrades[i].getPrice() <= cookies){
                minUpgrades = Game.Upgrades[i];
                break;
            }

            if(Game.Upgrades[i].id == 168 && Game.Upgrades[i].getPrice() <= cookies){
                minUpgrades = Game.Upgrades[i];
                break;
            }

            if(Game.Upgrades[i].id == 188 && Game.Upgrades[i].getPrice() <= cookies){
                minUpgrades = Game.Upgrades[i];
                break;
            }

            if(Game.Upgrades[i].id >= 222 && Game.Upgrades[i].id <= 226 && Game.Upgrades[i].getPrice() <= cookies){
                minUpgrades = Game.Upgrades[i];
                break;
            }

            if(Game.Upgrades[i].id == 324 && Game.Upgrades[i].getPrice() <= cookies){
                minUpgrades = Game.Upgrades[i];
                break;
            }

            if(Game.Upgrades[i].id >= 366 && Game.Upgrades[i].id <= 367 && Game.Upgrades[i].getPrice() <= cookies){
                minUpgrades = Game.Upgrades[i];
                break;
            }

            if(Game.Upgrades[i].id == 427 && Game.Upgrades[i].getPrice() <= cookies){
                minUpgrades = Game.Upgrades[i];
                break;
            }

            if(Game.Upgrades[i].id >= 460 && Game.Upgrades[i].id <= 461 && Game.Upgrades[i].getPrice() <= cookies){
                minUpgrades = Game.Upgrades[i];
                break;
            }

            if(Game.Upgrades[i].id >= 473 && Game.Upgrades[i].id <= 475 && Game.Upgrades[i].getPrice() <= cookies){
                minUpgrades = Game.Upgrades[i];
                break;
            }

            if(Game.Upgrades[i].id >= 621 && Game.Upgrades[i].id <= 638 && Game.Upgrades[i].getPrice() <= cookies){
                minUpgrades = Game.Upgrades[i];
                break;
            }

            if(Game.Upgrades[i].id == 640 && Game.Upgrades[i].getPrice() <= cookies){
                minUpgrades = Game.Upgrades[i];
                break;
            }

            if(Game.Upgrades[i].id == 642 && Game.Upgrades[i].getPrice() <= cookies){
                minUpgrades = Game.Upgrades[i];
                break;
            }

            if(Game.Upgrades[i].id >= 649 && Game.Upgrades[i].id <= 651 && Game.Upgrades[i].getPrice() <= cookies){
                minUpgrades = Game.Upgrades[i];
                break;
            }

            if(Game.Upgrades[i].id >= 660 && Game.Upgrades[i].id <= 661 && Game.Upgrades[i].getPrice() <= cookies){
                minUpgrades = Game.Upgrades[i];
                break;
            }

            if(Game.Upgrades[i].id == 698 && Game.Upgrades[i].getPrice() <= cookies){
                minUpgrades = Game.Upgrades[i];
                break;
            }

            if(Game.Upgrades[i].id >= 763 && Game.Upgrades[i].id <= 765 && Game.Upgrades[i].getPrice() <= cookies){
                minUpgrades = Game.Upgrades[i];
                break;
            }

            //アップグレード購入によるCpsの計算

        }

    }

    console.log("Auto Upgrade click off: " + this.autoUpgradeClickId);
    clearInterval(this.autoUpgradeClickId);
    if(e.data.status ===  true){
        this.autoUpgradeClickId = setInterval(UpgradeClick,e.data.value);
        console.log("Auto Upgrade click on: "+ this.autoUpgradeClickId);
    }
}