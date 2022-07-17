function AutoCookieClickFunction()
{

    var id;

    if(document.getElementById('AutoCookieClick').checked ===  true){
        console.log("Auto cookie click on");
        id = setInterval(Game.ClickCookie,4);
    }else{
        console.log("Auto cookie click off");
        clearInterval(id);
    }
    
}