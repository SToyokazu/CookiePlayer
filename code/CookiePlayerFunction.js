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
    }
}

function AutoCookieClickFunction(e)
{
    arguments.callee.id = 0;

    if(e.data.status ===  true){
        this.id = setInterval(Game.ClickCookie,4);
        console.log("Auto cookie click on: "+ this.id);
    }else{
        console.log("Auto cookie click off: "+this.id);
        clearInterval(this.id);
    }
    
}

function AutoGCClickFunction(e)
{
    arguments.callee.id = 0;

    var AllGCPop = function()
    {
        for (var i in Game.shimmers) {
             Game.shimmers[i].pop(); 
        }
    }

    if(e.data.status ===  true){
        this.id = setInterval(AllGCPop,500);
        console.log("Auto GC click on: "+ this.id);
    }else{
        console.log("Auto GC click off: "+this.id);
        clearInterval(this.id);
    }
    
}