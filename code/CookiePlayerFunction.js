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
    var id;

    if(e.status ===  true){
        console.log("Auto cookie click on: "+id);
        id = setInterval(Game.ClickCookie,4);
    }else{
        console.log("Auto cookie click off: "+id);
        clearInterval(id);
    }
    
}