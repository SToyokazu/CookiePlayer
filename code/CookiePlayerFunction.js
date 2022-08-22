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
        case "AutoUpgradeClick":
            AutoUpgradeClick(e);
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
            //購入済みはスルー
            if(Game.Upgrades[i].bought == 1) continue;

            //自動購入対象外はスルー
            if(Game.Upgrades[i].pool == "debug")    continue;
            if(Game.Upgrades[i].pool == "prestige") continue;
            if(Game.Upgrades[i].pool == "toggle") continue;
            if(Game.Upgrades[i].id == 69) continue;
            if(Game.Upgrades[i].id == 227) continue;

            if(Game.Upgrades[i].unlocked != 1) continue;

            //Cps以外に影響を及ぼす強化は優先的に購入
            let spacialUpgrades = [
                                0,1,2,3,4,5,6,43,52,53,69,75,76,77,78,82,86,109,119,152,
                                157,158,159,160,161,162,163,164,168,188,222,223,224,225,
                                226,324,366,367,427,460,461,473,474,475,621,622,623,624,
                                625,626,627,628,629,630,631,632,633,634,635,636,637,638,
                                640,642,649,650,651,660,661,698,763,764,765];

            for(var index=0;index<spacialUpgrades.length;index++){
                if(Game.Upgrades[i].id == spacialUpgrades[index] && Game.Upgrades[i].getPrice() <= cookies){
                    Game.Upgrades[i].buy();
                    return;
                }
            }

            //アップグレード購入によるCpsの計算
            SimulateObjectsInitialize(0, 0);
            SimulateUpgradesInitialize(Game.Upgrades[i].id);
            let deltaCps = SimulateGains() - cookiesPs;

            let thretholdTime;

            if (Game.cookies >= Game.Upgrades[i].getPrice()) {
                thretholdTime = Game.Upgrades[i].getPrice() / (cookiesPs + deltaCps);
            } else {
                thretholdTime = Game.Upgrades[i].getPrice() / cookiesPs - deltaCps * cookies / ((cookiesPs + deltaCps) * cookiesPs);
            }

            if(minThretholdTime == undefined) {
                minThretholdTime = thretholdTime;
                minUpgrades = Game.Upgrades[i];
            } else if (minThretholdTime > thretholdTime) {
                minThretholdTime = thretholdTime;
                minUpgrades = Game.Upgrades[i];
            }
        }

        if (minUpgrades != undefined) {
            if (Game.cookies >= minUpgrades.getPrice()) {
                minUpgrades.buy(1);
            }
        }

    }

    console.log("Auto Upgrade click off: " + this.autoUpgradeClickId);
    clearInterval(this.autoUpgradeClickId);
    if(e.data.status ===  true){
        this.autoUpgradeClickId = setInterval(UpgradeClick,e.data.value);
        console.log("Auto Upgrade click on: "+ this.autoUpgradeClickId);
    }
}

function AutoProductAndUpgradeClick(e)
{
    arguments.callee.autoProductAndUpgradeClickId = 0;

    var ProductAndUpgradeClick = function () {
        let minObjectsThretholdTime;
        let minObjects;

        let minUpgradesThretholdTime;
        let minUpgrades;

        let cookies = Game.cookies;
        let cookiesPs = Game.cookiesPs;

        //強化
        for (var i in Game.Upgrades) {
            //購入済みはスルー
            if (Game.Upgrades[i].bought == 1) continue;

            //自動購入対象外はスルー
            if (Game.Upgrades[i].pool == "debug") continue;
            if (Game.Upgrades[i].pool == "prestige") continue;
            if (Game.Upgrades[i].pool == "toggle") continue;
            if (Game.Upgrades[i].id == 69) continue;
            if (Game.Upgrades[i].id == 227) continue;

            if (Game.Upgrades[i].unlocked != 1) continue;

            //Cps以外に影響を及ぼす強化は優先的に購入
            let spacialUpgrades = [
                0, 1, 2, 3, 4, 5, 6, 43, 52, 53, 69, 75, 76, 77, 78, 82, 86, 109, 119, 152,
                157, 158, 159, 160, 161, 162, 163, 164, 168, 188, 222, 223, 224, 225,
                226, 324, 366, 367, 427, 460, 461, 473, 474, 475, 621, 622, 623, 624,
                625, 626, 627, 628, 629, 630, 631, 632, 633, 634, 635, 636, 637, 638,
                640, 642, 649, 650, 651, 660, 661, 698, 763, 764, 765];

            for (var index = 0; index < spacialUpgrades.length; index++) {
                if (Game.Upgrades[i].id == spacialUpgrades[index] && Game.Upgrades[i].getPrice() <= cookies) {
                    Game.Upgrades[i].buy(1);
                    return;
                }
            }

            //アップグレード購入によるCpsの計算
            SimulateObjectsInitialize(0, 0);
            SimulateUpgradesInitialize(Game.Upgrades[i].id);
            let deltaCps = SimulateGains() - cookiesPs;

            let thretholdTime;

            if (Game.cookies >= Game.Upgrades[i].getPrice()) {
                thretholdTime = Game.Upgrades[i].getPrice() / (cookiesPs + deltaCps);
            } else {
                thretholdTime = Game.Upgrades[i].getPrice() / cookiesPs - deltaCps * cookies / ((cookiesPs + deltaCps) * cookiesPs);
            }

            if (minThretholdTime == undefined) {
                minUpgradesThretholdTime = thretholdTime;
                minUpgrades = Game.Upgrades[i];
            } else if (minThretholdTime > thretholdTime) {
                minUpgradesThretholdTime = thretholdTime;
                minUpgrades = Game.Upgrades[i];
            }
        }

        //施設
        for (var i in Game.Objects) {
            if (Game.Objects[i].locked != 0) {
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

            if (minThretholdTime == undefined) {
                minObjectsThretholdTime = thretholdTime;
                minObjects = Game.Objects[i];
            } else if (minThretholdTime > thretholdTime) {
                minObjectsThretholdTime = thretholdTime;
                minObjects = Game.Objects[i];
            }
        }

        //施設のみ購入
        if(minUpgrades == undefined){
            if(minObjects != undefined){
                var pastBuyMode = Game.buyMode;
                Game.buyMode = 1;
                if (Game.cookies >= minObjects.getPrice()) {
                    minObjects.buy(1);
                }
                Game.buyMode = pastBuyMode;
                return;
            }
        }

        //強化のみ購入
        if(minObjects == undefined){
            if (minUpgrades != undefined) {
                if (Game.cookies >= minUpgrades.getPrice()) {
                    minUpgrades.buy(1);
                    return;
                }
            }
        }

        //両方を比較する
        if(minObjectsThretholdTime <= minUpgradesThretholdTime){
                var pastBuyMode = Game.buyMode;
                Game.buyMode = 1;
                if (Game.cookies >= minObjects.getPrice()) {
                    minObjects.buy(1);
                }
                Game.buyMode = pastBuyMode;
        }else{
                if (Game.cookies >= minUpgrades.getPrice()) {
                    minUpgrades.buy(1);
                }
        }
    }

    console.log("Auto Product And Upgrade click off: " + this.autoProductAndUpgradeClickId);
    clearInterval(this.autoProductAndUpgradeClickId);
    if (e.data.status === true) {
        this.autoProductAndUpgradeClickId = setInterval(ProductAndUpgradeClick, e.data.value);
        console.log("Auto ProductAndUpgrade click on: " + this.autoProductAndUpgradeClickId);
    }
}