window.addEventListener('message', EventListener);

function EventListener(e)
{
    //URLチェック
    if (event.origin !== "https://stoyokazu.github.io" ){
      return;
    }

    var AutoCookieClick = new AutoCookieClickFunction(e);

    switch (e.data.message) {
        case "AutoCookieClick":
            AutoCookieClick;
            break;
    }
}

function AutoCookieClickFunction(e)
{

    if(e.data.status ===  true){
        console.log("Auto cookie click on: "+ this.id);
        this.id = setInterval(Game.ClickCookie,4);
    }else{
        console.log("Auto cookie click off: "+ this.id);
        clearInterval(this.id);
    }
    
}