window.addEventListener('message', EventListener);

function EventListener(e)
{
    //URLチェック
    if (event.origin !== "https://stoyokazu.github.io" ){
      return;
    }

    switch (e.data.message) {
        case "AutoCookieClick":
            AutoCookieClickFunction(e);
            break;
    }
}

function AutoCookieClickFunction(e)
{
    var id;

    if(e.statuse ===  true){
        console.log("Auto cookie click on: "+id);
        id = setInterval(Game.ClickCookie,4);
    }else{
        console.log("Auto cookie click off: "+id);
        clearInterval(id);
    }
    
}