window.addEventListener('message', EventListener);

function EventListener(e)
{
    //URLチェック
    if (event.origin !== "https://stoyokazu.github.io" ){
      return;
    }

    var autoCookieClick = new AutoCookieClick;

    switch (e.data.message) {
        case "AutoCookieClick":
            autoCookieClick.execute(e);
            break;
    }
}

class AutoCookieClick
{
    execute(e) {
        if (e.data.status === true) {
            console.log("Auto cookie click on: " + this.id);
            this.id = setInterval(Game.ClickCookie, 4);
        } else {
            console.log("Auto cookie click off: " + this.id);
            clearInterval(this.id);
        }
    }
}