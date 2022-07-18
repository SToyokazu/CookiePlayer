window.addEventListener('message', EventListenere);

function EventListener(e)
{
    //URLチェック
    if (event.origin !== "http://orteil.dashnet.org/cookieclicker/" ){
      return;
    }

    if (event.origin !== "http://natto0wtr.web.fc2.com/CookieClicker/" ){
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