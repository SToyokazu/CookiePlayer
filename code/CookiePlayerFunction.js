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
        for (let i = Game.ObjectsN - 1; i >= 0; i--) {

            if (Game.ObjectsById[i].locked != 0) {
                continue;
            }

            while (Game.cookies >= Game.ObjectsById[i].getPrice()){
                Game.ClickProduct(i);
            }
        }
    }

    console.log("Auto Product click off: " + this.autoProductClickId);
    clearInterval(this.autoProductClickId);
    if(e.data.status ===  true){
        this.autoProductClickId = setInterval(ProductClick,e.data.value);
        console.log("Auto Product click on: "+ this.autoProductClickId);
    }
}