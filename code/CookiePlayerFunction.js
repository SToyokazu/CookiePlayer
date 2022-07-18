window.addEventListener('message', EventListener);

function EventListener(e)
{
    //URLチェック
    if (event.origin !== "https://stoyokazu.github.io" ){
      return;
    }

    var AutoCookieClick = AutoCookieClickFunction;

    switch (e.data.message) {
        case "AutoCookieClick":
            AutoCookieClick(e);
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