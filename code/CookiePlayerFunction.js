window.addEventListener('message', EventListener);

function EventListener(e)
{
    //URLチェック
    if (event.origin !== "https://stoyokazu.github.io" ){
      return;
    }

    var AutoCookieClick = new AutoCookieClickFunction;

    switch (e.data.message) {
        case "AutoCookieClick":
            AutoCookieClick(e);
            break;
    }
}

function AutoCookieClickFunction(e)
{

    if(e.data.status ===  true){
        console.log("Auto cookie click on: "+id);
        this.id = setInterval(Game.ClickCookie,4);
    }else{
        console.log("Auto cookie click off: "+id);
        clearInterval(this.id);
    }
    
}